import { useEffect, useRef } from "react";

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall({ sessionId, isTrainer }) {
  // ================= Refs =================
  const ws = useRef(null);
  const pc = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);

  // Guards
  const wsInitialized = useRef(false);
  const wsReady = useRef(false);
  const mediaReady = useRef(false);
  const peerReady = useRef(false);
  const remoteReady = useRef(false);
  const offerSent = useRef(false);

  // ================= WS SAFE SEND =================
  const send = payload => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
  };

  // ================= MEDIA (Trainer only) =================
  const startMedia = async () => {
    if (!isTrainer || mediaReady.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
    mediaReady.current = true;

    console.log("✅ Trainer media ready");
    maybeCreateOffer();
  };

  // ================= PEER =================
  const createPeer = () => {
    if (pc.current) return;

    pc.current = new RTCPeerConnection(ICE_CONFIG);

    // Trainer sends tracks
    if (isTrainer && localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.current.addTrack(track, localStreamRef.current);
      });
    }

    pc.current.ontrack = e => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.current.onicecandidate = e => {
      if (e.candidate) {
        send({ type: "ICE_CANDIDATE", candidate: e.candidate });
      }
    };

    pc.current.onconnectionstatechange = () => {
      console.log("🔗 Peer state:", pc.current.connectionState);
    };

    peerReady.current = true;
  };

  // ================= OFFER (Trainer only) =================
  const maybeCreateOffer = async () => {
    if (
      !isTrainer ||
      !wsReady.current ||
      !mediaReady.current ||
      !remoteReady.current ||
      offerSent.current
    ) {
      return;
    }

    createPeer();

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    send({ type: "OFFER", sdp: offer });
    offerSent.current = true;

    console.log("📤 OFFER sent");
  };

  // ================= WS =================
  const connectWS = () => {
    const token = localStorage.getItem("access");
    ws.current = new WebSocket(
      `ws://192.168.1.5:8000/ws/interactive_sessions/${sessionId}/?token=${token}`
    );

    ws.current.onopen = () => {
      wsReady.current = true;
      console.log("✅ WS connected");
      send({ type: "JOIN_SESSION" });

      // Trainee immediately declares readiness
      if (!isTrainer) {
        send({ type: "READY" });
      }
    };

    ws.current.onmessage = async e => {
      const msg = JSON.parse(e.data);
      console.log("⬇ WS", msg.type);

      switch (msg.type) {
        case "READY":
          if (isTrainer) {
            remoteReady.current = true;
            maybeCreateOffer();
          }
          break;

        case "OFFER":
          if (!isTrainer) {
            createPeer();
            await pc.current.setRemoteDescription(msg.sdp);

            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);

            send({ type: "ANSWER", sdp: answer });
          }
          break;

        case "ANSWER":
          if (isTrainer) {
            await pc.current.setRemoteDescription(msg.sdp);
          }
          break;

        case "ICE_CANDIDATE":
          if (pc.current) {
            await pc.current.addIceCandidate(msg.candidate);
          }
          break;

        case "USER_JOINED":
          if (isTrainer && msg.role === "trainee") {
            remoteReady.current = true;
            maybeCreateOffer();
          }
          break;

        default:
          break;
      }
    };

    ws.current.onerror = e => console.error("WS error", e);
  };

  // ================= EFFECT =================
  useEffect(() => {
    if (wsInitialized.current) return;
    wsInitialized.current = true;

    connectWS();
    startMedia();

    return () => {
      ws.current?.close();
      pc.current?.close();

      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ================= UI =================
  return (
    <>
      {isTrainer && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 200 }}
        />
      )}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%" }}
      />
    </>
  );
}
