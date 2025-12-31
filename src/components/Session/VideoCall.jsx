import { useEffect, useRef, useState } from "react";

/**
 * VideoCall.jsx - Updated with presence signals:
 * - sends JOIN_SESSION on WS open (already present)
 * - sends LEAVE_SESSION on beforeunload, cleanup, and End Call
 * - sends periodic PING keep-alive
 *
 * Minor UI: added End Call button (red) that will send LEAVE_SESSION then close WS.
 */

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall({ sessionId, isTrainer }) {
  // Refs
  const ws = useRef(null);
  const pc = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // ICE queue & negotiation id
  const pendingIce = useRef([]);
  const negotiationId = useRef(0);

  // reconnect guard + backoff
  const shouldReconnect = useRef(true);
  const reconnectAttempts = useRef(0);

  // ping interval ref
  const pingIntervalRef = useRef(null);

  // UI state
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);

  // Guards
  const wsInitialized = useRef(false);
  const wsReady = useRef(false);
  const mediaReady = useRef(false);
  const offerSent = useRef(false);

  // ---------- Helpers ----------
  const safeLog = (...args) => {
    // uncomment to debug
    // console.log(...args);
  };

  const send = payload => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(payload));
      } else {
        // silent fail if WS not open
      }
    } catch (err) {
      console.warn("WS send failed", err, payload);
    }
  };

  // Exponential backoff delay (ms)
  const getReconnectDelay = () => {
    const attempt = Math.min(reconnectAttempts.current, 6);
    return Math.min(1500 * Math.pow(2, attempt), 10000);
  };

  // ---------- Media ----------
  const startMedia = async () => {
    if (mediaReady.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      mediaReady.current = true;

      // if peer already exists, attach local tracks now
      if (pc.current) attachLocalTracks();

      safeLog("✅ local media ready");
    } catch (err) {
      console.error("Failed to getUserMedia", err);
    }
  };

  // Attach local tracks to pc if not already present
  const attachLocalTracks = () => {
    if (!pc.current || !localStreamRef.current) return;
    const senders = pc.current.getSenders();

    localStreamRef.current.getTracks().forEach(track => {
      const exists = senders.find(s => s.track && s.track.kind === track.kind);
      if (!exists) {
        try {
          pc.current.addTrack(track, localStreamRef.current);
        } catch (err) {
          console.warn("addTrack failed", err);
        }
      }
    });
  };

  // Replace video track (for screen share or camera switch)
  const replaceVideoTrack = async newTrack => {
    if (!pc.current) return false;
    const sender = pc.current.getSenders().find(s => s.track?.kind === "video");
    if (!sender) {
      // no sender yet — attach local tracks (this will add a sender)
      attachLocalTracks();
      // try again
      const s2 = pc.current.getSenders().find(s => s.track?.kind === "video");
      if (!s2) return false;
      try {
        await s2.replaceTrack(newTrack);
        return true;
      } catch (err) {
        console.warn("replaceTrack failed on retry", err);
        return false;
      }
    }
    try {
      await sender.replaceTrack(newTrack);
      return true;
    } catch (err) {
      console.warn("replaceTrack failed", err);
      return false;
    }
  };

  // ---------- Peer lifecycle ----------
  const resetPeer = () => {
    try {
      pc.current?.close();
    } catch (err) {
      /* ignore */
    }
    pc.current = null;
    offerSent.current = false;
    pendingIce.current = [];
    safeLog("Peer reset");
  };

  const createPeer = () => {
    if (pc.current) return;
    pc.current = new RTCPeerConnection(ICE_CONFIG);

    // Attach local tracks if available (safe)
    attachLocalTracks();

    pc.current.ontrack = e => {
      // show the first stream
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.current.onicecandidate = e => {
      if (e.candidate) {
        send({
          type: "ICE_CANDIDATE",
          candidate: e.candidate,
          nid: negotiationId.current,
        });
      }
    };

    // Disable automatic negotiation; we control renegotiation via signaling.
    pc.current.onnegotiationneeded = () => {
      safeLog("onnegotiationneeded ignored (manual renegotiation)");
    };

    pc.current.onconnectionstatechange = () => {
      const state = pc.current.connectionState;
      safeLog("🔗 Peer state:", state);
      // only reset on hard failure
      if (state === "failed") {
        resetPeer();
        // trainer should try to re-offer
        if (isTrainer) {
          // small delay to allow cleanup
          setTimeout(() => createOffer(true), 200);
        }
      }
    };
  };

  // Create offer (trainer only). force boolean bypasses offerSent guard.
  const createOffer = async (force = false) => {
    if (!isTrainer || !wsReady.current) return;
    if (offerSent.current && !force) return;

    createPeer();

    // must be stable to create a fresh offer
    if (pc.current.signalingState !== "stable") {
      safeLog("Skip creating offer: signalingState =", pc.current.signalingState);
      return;
    }

    negotiationId.current += 1;

    try {
      const offer = await pc.current.createOffer({ iceRestart: true });
      await pc.current.setLocalDescription(offer);
      send({
        type: "OFFER",
        sdp: offer,
        nid: negotiationId.current,
      });
      offerSent.current = true;
      safeLog("📤 OFFER sent", negotiationId.current);
    } catch (err) {
      console.error("createOffer error", err);
    }
  };

  // ---------- Controls ----------
  const toggleMic = async () => {
    if (!localStreamRef.current) {
      await startMedia();
    }
    localStreamRef.current?.getAudioTracks().forEach(t => {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    });
  };

  const toggleCamera = async () => {
    if (!localStreamRef.current) {
      await startMedia();
    }
    localStreamRef.current?.getVideoTracks().forEach(t => {
      t.enabled = !t.enabled;
      setCameraOn(t.enabled);
    });
    // no renegotiation required for enabling/disabling track (just pausing)
  };

  const shareScreen = async () => {
    // allow both sides to share; we'll request renegotiation after replaceTrack
    if (!localStreamRef.current) await startMedia();
    if (!pc.current) createPeer();

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];

      const replaced = await replaceVideoTrack(screenTrack);
      if (!replaced) {
        console.warn("Could not replace track for screen share");
        screenTrack.stop();
        return;
      }

      setSharingScreen(true);

      // Request renegotiation from the remote peer (trainer will handle/createOffer)
      send({ type: "REQUEST_RENEGOTIATION" });

      // when screen share stops, revert to camera
      screenTrack.onended = async () => {
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (camTrack) {
          await replaceVideoTrack(camTrack);
          // request renegotiation to inform remote peer
          send({ type: "REQUEST_RENEGOTIATION" });
        }
        setSharingScreen(false);
      };
    } catch (err) {
      console.warn("shareScreen canceled/failed", err);
    }
  };

  // ---------- Presence helpers (frontend) ----------
  // send explicit JOIN (server expects it) - called from ws onopen already
  const sendJoin = () => {
    send({ type: "JOIN_SESSION" });
  };

  // send explicit LEAVE (frontend should call this when user intentionally leaves)
  const sendLeave = () => {
    try {
      send({ type: "LEAVE_SESSION" });
    } catch (err) {
      // best-effort
    }
  };

  // send a ping keepalive
  const startKeepAlive = () => {
    stopKeepAlive();
    pingIntervalRef.current = setInterval(() => {
      try {
        send({ type: "PING" });
      } catch (err) {
        // ignore
      }
    }, 25000); // every 25s
  };

  const stopKeepAlive = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  // End call handler (intentional)
  const endCall = () => {
    // Prevent reconnect attempts
    shouldReconnect.current = false;

    // Notify server we are leaving
    sendLeave();

    // Close WS and clean
    try {
      ws.current?.close();
    } catch {}

    resetPeer();

    try {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
  };

  // ---------- WebSocket & Signaling ----------
  const connectWS = () => {
    const token = localStorage.getItem("access") || "";
    const url = `ws://192.168.1.5:8000/ws/interactive_sessions/${sessionId}/?token=${token}`;
    safeLog("🔌 Connecting WS...", url);
    try {
      ws.current = new WebSocket(url);
    } catch (err) {
      console.error("WebSocket init error", err);
      scheduleReconnect();
      return;
    }

    ws.current.onopen = () => {
      reconnectAttempts.current = 0;
      wsReady.current = true;
      safeLog("✅ WS Open");

      // send JOIN and RESYNC (JOIN necessary for presence)
      sendJoin();
      send({ type: "RESYNC" });

      // start keep-alive pings
      startKeepAlive();

      // If trainer, attempt to create offer if we have media
      if (isTrainer) createOffer();
    };

    ws.current.onmessage = async e => {
      let msg;
      try {
        msg = JSON.parse(e.data);
      } catch (err) {
        console.warn("Invalid WS msg", e.data);
        return;
      }

      safeLog("⬇ WS", msg.type, msg.nid || "");

      switch (msg.type) {
        case "OFFER": {
          if (isTrainer) {
            // trainer should not accept offers
            safeLog("Ignoring OFFER at trainer");
            break;
          }
          if (typeof msg.nid === "number" && msg.nid < negotiationId.current) {
            safeLog("Stale OFFER ignored", msg.nid, negotiationId.current);
            break;
          }
          negotiationId.current = msg.nid || negotiationId.current;

          // ensure a clean peer
          if (pc.current && pc.current.signalingState !== "stable") {
            resetPeer();
          }
          createPeer();
          attachLocalTracks();

          try {
            // safe setRemoteDescription
            await pc.current.setRemoteDescription(msg.sdp);
          } catch (err) {
            console.warn("setRemoteDescription (OFFER) failed", err);
            break;
          }

          // flush queued ICE candidates
          if (pendingIce.current.length) {
            for (const c of pendingIce.current) {
              try {
                await pc.current.addIceCandidate(new RTCIceCandidate(c));
              } catch (err) {
                console.warn("flush ICE (OFFER) failed", err);
              }
            }
            pendingIce.current = [];
          }

          try {
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            send({ type: "ANSWER", sdp: answer, nid: negotiationId.current });
            safeLog("📤 ANSWER sent");
          } catch (err) {
            console.error("createAnswer error", err);
          }
          break;
        }

        case "ANSWER": {
          if (!isTrainer) {
            safeLog("ANSWER received by non-trainer — ignore");
            break;
          }
          if (msg.nid !== negotiationId.current) {
            safeLog("ANSWER nid mismatch — ignore", msg.nid, negotiationId.current);
            break;
          }
          if (!pc.current) {
            safeLog("No PC on ANSWER — ignore");
            break;
          }
          // Only accept answer if we have a local offer
          if (pc.current.signalingState !== "have-local-offer") {
            safeLog("Ignoring ANSWER due to signalingState", pc.current.signalingState);
            break;
          }

          try {
            await pc.current.setRemoteDescription(msg.sdp);
          } catch (err) {
            console.warn("setRemoteDescription (ANSWER) failed", err);
            break;
          }

          // flush ICE queued candidates
          if (pendingIce.current.length) {
            for (const c of pendingIce.current) {
              try {
                await pc.current.addIceCandidate(new RTCIceCandidate(c));
              } catch (err) {
                console.warn("flush ICE (ANSWER) failed", err);
              }
            }
            pendingIce.current = [];
          }
          break;
        }

        case "ICE_CANDIDATE": {
          // require matching negotiation id
          if (msg.nid !== negotiationId.current) {
            safeLog("ICE candidate nid mismatch", msg.nid, negotiationId.current);
            break;
          }
          // add or queue
          try {
            if (pc.current?.remoteDescription && pc.current.remoteDescription.type) {
              await pc.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } else {
              pendingIce.current.push(msg.candidate);
            }
          } catch (err) {
            console.warn("addIceCandidate failed", err);
          }
          break;
        }

        case "REQUEST_RENEGOTIATION": {
          // remote side asks us to renegotiate (trainer should create new offer)
          if (isTrainer) {
            safeLog("REQUEST_RENEGOTIATION received — trainer will createOffer");
            offerSent.current = false;
            createOffer();
          } else {
            // if trainee receives it (rare), we can also reset offerSent to allow new flows
            offerSent.current = false;
          }
          break;
        }

        case "RESYNC": {
          // attempt to establish/refresh
          if (isTrainer) createOffer(true);
          break;
        }

        case "PONG": {
          // optional server pong: can be used to show connectivity
          break;
        }

        // session final states broadcast (listen and act accordingly)
        case "SESSION_COMPLETED":
        case "SESSION_ABORTED":
        case "SESSION_NO_SHOW":
        case "SESSION_FINISHED": {
          // frontend can react: show modal / redirect / update UI
          safeLog("Session final state:", msg.type);
          break;
        }

        default:
          safeLog("Unknown message", msg);
      }
    };

    ws.current.onclose = () => {
      wsReady.current = false;
      safeLog("WS Closed");
      stopKeepAlive();
      resetPeer();
      // If not intentionally ended, force end the call and clean up UI
      if (shouldReconnect.current) {
        endCall();
      }
      // Do not schedule reconnect; session is over
    };

    ws.current.onerror = err => {
      console.warn("WS error", err);
      // don't flood reconnect here; close handler will handle scheduling
    };
  };

  const scheduleReconnect = () => {
    if (!shouldReconnect.current) return;
    reconnectAttempts.current += 1;
    const delay = getReconnectDelay();
    safeLog("Reconnecting in", delay);
    setTimeout(() => {
      if (!shouldReconnect.current) return;
      connectWS();
    }, delay);
  };

  // ---------- lifecycle ----------
  useEffect(() => {
    if (wsInitialized.current) return;
    wsInitialized.current = true;

    // start local media asap
    startMedia();

    // connect signaling
    connectWS();

    // beforeunload handler: best-effort send LEAVE_SESSION (sync attempt)
    const handleBeforeUnload = e => {
      try {
        // attempt WS send if open
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "LEAVE_SESSION" }));
        }
      } catch {}
      // no need to prevent unload
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup
    return () => {
      // mark as intentional end to prevent reconnect loop
      shouldReconnect.current = false;

      // send LEAVE_SESSION (best-effort)
      try {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "LEAVE_SESSION" }));
        }
      } catch {}

      // close socket
      try {
        ws.current?.close();
      } catch {}

      stopKeepAlive();
      resetPeer();
      try {
        localStreamRef.current?.getTracks().forEach(t => t.stop());
      } catch {}

      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- UI ----------
  return (
    <div className="video-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", background: "black" }}
      />

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: 200,
          position: "absolute",
          top: 12,
          right: 12,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      />

      <div
        className="controls"
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
          background: "rgba(32,33,36,0.9)",
          padding: "10px 14px",
          borderRadius: 30,
          zIndex: 10,
        }}
      >
        <button
          className={`control-btn ${!micOn ? "off" : ""}`}
          onClick={toggleMic}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: micOn ? "#3c4043" : "#ea4335",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">{micOn ? "mic" : "mic_off"}</span>
        </button>

        <button
          className={`control-btn ${!cameraOn ? "off" : ""}`}
          onClick={toggleCamera}
          title={cameraOn ? "Turn off camera" : "Turn on camera"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: cameraOn ? "#3c4043" : "#ea4335",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">{cameraOn ? "videocam" : "videocam_off"}</span>
        </button>

        <button
          onClick={shareScreen}
          title={sharingScreen ? "Stop sharing" : "Share screen"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: sharingScreen ? "#1a73e8" : "#3c4043",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">{sharingScreen ? "stop_screen_share" : "screen_share"}</span>
        </button>

        {/* End Call button - intentional leave */}
        <button
          onClick={endCall}
          title="End Call"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: "#ea4335",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">call_end</span>
        </button>
      </div>
    </div>
  );
}
