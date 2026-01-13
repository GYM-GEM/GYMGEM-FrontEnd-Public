import React, { useEffect, useRef, useState } from "react";

// VideoCall_cleaned.jsx
// Final cleaned version of your VideoCall component with:
// - Proper media gating (don't create offer until local media ready)
// - Robust ICE / candidate queuing
// - Forced renegotiation triggers after track attach / replace
// - Remote video play() call to avoid black screen in some browsers
// - Explicit JOIN / LEAVE presence signals and keep-alive
const VITE_API_WEBSOCKET = import.meta.env.VITE_API_WEBSOCKET || "ws://192.168.1.235:8000";
const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall({ sessionId, isTrainer }) {
  const ws = useRef(null);
  const pc = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // negotiation and ICE bookkeeping
  const pendingIce = useRef([]);
  const negotiationId = useRef(0);
  const offerSent = useRef(false);

  // reconnect / lifecycle flags
  const shouldReconnect = useRef(true);
  const reconnectAttempts = useRef(0);

  // state flags
  const wsInitialized = useRef(false);
  const wsReady = useRef(false);
  const mediaReady = useRef(false);

  // ping keepalive
  const pingIntervalRef = useRef(null);

  // UI state
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);

  // helpers
  const safeLog = (...args) => {
    // console.log(...args);
  };

  const send = payload => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(payload));
    } catch (err) {
      console.warn("WS send failed", err, payload);
    }
  };

  const getReconnectDelay = () => {
    const attempt = Math.min(reconnectAttempts.current, 6);
    return Math.min(1500 * Math.pow(2, attempt), 10000);
  };

  // ---------------- Media ----------------
  const startMedia = async () => {
    if (mediaReady.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      mediaReady.current = true;
      safeLog("✅ local media ready");

      // attach tracks to existing pc if present
      if (pc.current) attachLocalTracks();

      // If we're trainer and WS already open, ensure we create offer now
      if (isTrainer && wsReady.current) {
        // allow re-offer if previously attempted
        offerSent.current = false;
        createOffer(true);
      }
    } catch (err) {
      console.error("Failed to getUserMedia", err);
    }
  };

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

    // after adding tracks, trainer should renegotiate
    if (isTrainer && wsReady.current) {
      offerSent.current = false;
      createOffer();
    }
  };

  const replaceVideoTrack = async newTrack => {
    if (!pc.current) return false;
    const sender = pc.current.getSenders().find(s => s.track?.kind === "video");
    if (!sender) {
      attachLocalTracks();
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

  // ---------------- Peer lifecycle ----------------
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

    attachLocalTracks();

    pc.current.ontrack = e => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        // call play to avoid black screen in some browsers
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    pc.current.onicecandidate = e => {
      if (e.candidate) {
        send({ type: "ICE_CANDIDATE", candidate: e.candidate, nid: negotiationId.current });
      }
    };

    pc.current.onnegotiationneeded = () => {
      // We control negotiation manually
      safeLog("onnegotiationneeded (ignored)");
    };

    pc.current.onconnectionstatechange = () => {
      const state = pc.current.connectionState;
      safeLog("🔗 Peer state:", state);
      if (state === "failed") {
        resetPeer();
        if (isTrainer) setTimeout(() => createOffer(true), 200);
      }
    };

    pc.current.oniceconnectionstatechange = () => {
      safeLog("ICE state:", pc.current.iceConnectionState);
    };
  };

  const createOffer = async (force = false) => {
    if (!isTrainer || !wsReady.current) return;
    if (offerSent.current && !force) return;

    createPeer();

    if (pc.current.signalingState !== "stable") {
      safeLog("Skip createOffer: signalingState =", pc.current.signalingState);
      return;
    }

    // don't create offer until local media is ready
    if (!mediaReady.current) {
      safeLog("Delaying offer until mediaReady");
      return;
    }

    negotiationId.current += 1;

    try {
      const offer = await pc.current.createOffer({ iceRestart: true });
      await pc.current.setLocalDescription(offer);
      send({ type: "OFFER", sdp: offer, nid: negotiationId.current });
      offerSent.current = true;
      safeLog("📤 OFFER sent", negotiationId.current);
    } catch (err) {
      console.error("createOffer error", err);
    }
  };

  // ---------------- Controls ----------------
  const toggleMic = async () => {
    if (!localStreamRef.current) await startMedia();
    localStreamRef.current?.getAudioTracks().forEach(t => {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    });
  };

  const toggleCamera = async () => {
    if (!localStreamRef.current) await startMedia();
    localStreamRef.current?.getVideoTracks().forEach(t => {
      t.enabled = !t.enabled;
      setCameraOn(t.enabled);
    });
  };

  const shareScreen = async () => {
    if (!localStreamRef.current) await startMedia();
    if (!pc.current) createPeer();

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      const replaced = await replaceVideoTrack(screenTrack);
      if (!replaced) {
        screenTrack.stop();
        return;
      }

      setSharingScreen(true);
      // request renegotiation
      send({ type: "REQUEST_RENEGOTIATION" });

      screenTrack.onended = async () => {
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (camTrack) {
          await replaceVideoTrack(camTrack);
          send({ type: "REQUEST_RENEGOTIATION" });
        }
        setSharingScreen(false);
      };
    } catch (err) {
      console.warn("shareScreen canceled/failed", err);
    }
  };

  // ---------------- Presence & Keepalive ----------------
  const sendJoin = () => send({ type: "JOIN_SESSION" });
  const sendLeave = () => send({ type: "LEAVE_SESSION" });

  const startKeepAlive = () => {
    stopKeepAlive();
    pingIntervalRef.current = setInterval(() => {
      try {
        send({ type: "PING" });
      } catch {}
    }, 25000);
  };

  const stopKeepAlive = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  const endCall = () => {
    shouldReconnect.current = false;
    sendLeave();
    try {
      ws.current?.close();
    } catch {}
    resetPeer();
    try {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
  };

  // ---------------- WebSocket & Signaling ----------------
  const connectWS = () => {
    const token = localStorage.getItem("access") || "";
    const url = `${VITE_API_WEBSOCKET}/ws/interactive_sessions/${sessionId}/?token=${token}`;
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

      sendJoin();
      send({ type: "RESYNC" });
      startKeepAlive();

      // Only create offer if media already ready
      if (isTrainer && mediaReady.current) createOffer(true);
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
          if (isTrainer) break; // trainer should not accept offers
          if (typeof msg.nid === "number" && msg.nid < negotiationId.current) break;
          negotiationId.current = msg.nid || negotiationId.current;

          if (pc.current && pc.current.signalingState !== "stable") resetPeer();

          createPeer();
          attachLocalTracks();

          try {
            await pc.current.setRemoteDescription(msg.sdp);
          } catch (err) {
            console.warn("setRemoteDescription (OFFER) failed", err);
            break;
          }

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
          if (!isTrainer) break;
          if (msg.nid !== negotiationId.current) break;
          if (!pc.current) break;
          if (pc.current.signalingState !== "have-local-offer") break;

          try {
            await pc.current.setRemoteDescription(msg.sdp);
          } catch (err) {
            console.warn("setRemoteDescription (ANSWER) failed", err);
            break;
          }

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
          if (!pc.current) {
            createPeer();
          }

          if (typeof msg.nid === "number" && msg.nid < negotiationId.current) break;

          try {
            if (pc.current?.remoteDescription && pc.current.remoteDescription.type) {
              await pc.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } else {
              pendingIce.current.push(msg.candidate);
              if (pendingIce.current.length > 200) pendingIce.current.shift();
            }
          } catch (err) {
            console.warn("addIceCandidate failed", err);
          }
          break;
        }

        case "REQUEST_RENEGOTIATION": {
          if (isTrainer) {
            offerSent.current = false;
            createOffer();
          } else offerSent.current = false;
          break;
        }

        case "RESYNC": {
          if (isTrainer) createOffer(true);
          break;
        }

        case "PONG":
          break;

        case "SESSION_COMPLETED":
        case "SESSION_ABORTED":
        case "SESSION_NO_SHOW":
        case "SESSION_FINISHED": {
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
      if (shouldReconnect.current) scheduleReconnect();
    };

    ws.current.onerror = err => {
      console.warn("WS error", err);
      if (shouldReconnect.current) {
        setTimeout(() => {
          if (ws.current?.readyState !== WebSocket.OPEN && shouldReconnect.current) scheduleReconnect();
        }, 500);
      }
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

  // ---------------- lifecycle ----------------
  useEffect(() => {
    if (wsInitialized.current) return;
    wsInitialized.current = true;

    startMedia();
    connectWS();

    const handleBeforeUnload = e => {
      try {
        if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify({ type: "LEAVE_SESSION" }));
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      shouldReconnect.current = false;
      try {
        if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify({ type: "LEAVE_SESSION" }));
      } catch {}

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

  // ---------------- UI ----------------
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
        <button onClick={toggleMic} title={micOn ? "Mute" : "Unmute"} style={controlBtnStyle(micOn)}>
          <span className="material-icons">{micOn ? "mic" : "mic_off"}</span>
        </button>

        <button onClick={toggleCamera} title={cameraOn ? "Turn off camera" : "Turn on camera"} style={controlBtnStyle(cameraOn)}>
          <span className="material-icons">{cameraOn ? "videocam" : "videocam_off"}</span>
        </button>

        <button onClick={shareScreen} title={sharingScreen ? "Stop sharing" : "Share screen"} style={controlBtnStyle(true)}>
          <span className="material-icons">{sharingScreen ? "stop_screen_share" : "screen_share"}</span>
        </button>

        {/* <button onClick={endCall} title="End Call" style={endCallBtnStyle()}>
          <span className="material-icons">call_end</span>
        </button> */}
      </div>
    </div>
  );
}

// small style helpers to keep JSX tidy
function controlBtnStyle(active) {
  return {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: active ? "#3c4043" : "#ea4335",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
}

// function endCallBtnStyle() {
//   return {
//     width: 44,
//     height: 44,
//     borderRadius: "50%",
//     border: "none",
//     background: "#ea4335",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   };
// }
