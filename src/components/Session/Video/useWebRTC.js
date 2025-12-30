import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const ICE_CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = ({ sessionId, isTrainer, token, backendUrl }) => {
    // ================= State =================
    const [connectionState, setConnectionState] = useState("disconnected");
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ================= Refs (The "Source of Truth") =================
    const ws = useRef(null);
    const pc = useRef(null);
    const localStreamRef = useRef(null);

    // Guards (Gatekeeper Flags)
    const wsReady = useRef(false);
    const mediaReady = useRef(false);
    const remoteReady = useRef(false); // Does the other person know we are here?
    const offerSent = useRef(false);

    const WS_URL = backendUrl.replace(/^http/, "ws");

    // ================= Helper: Send Signal =================
    const send = useCallback((payload) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(payload));
        }
    }, []);

    // ================= 1. Media Management =================
    const startMedia = useCallback(async () => {
        // Only trainer needs initial media to start. Trainee is view-only initially.
        // However, if we want two-way later, we can adapt. For now, strict roles.
        if (!isTrainer) {
            mediaReady.current = true; // Trainee is "ready" without media
            return;
        }

        if (mediaReady.current) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStreamRef.current = stream;
            setLocalStream(stream); // For UI preview
            mediaReady.current = true;
            console.log("✅ Trainer media ready");

            // Check if we can start call now
            maybeCreateOffer();
        } catch (err) {
            console.error("Failed to get media", err);
            toast.error("Could not access camera/microphone");
        }
    }, [isTrainer]);

    // ================= 2. Peer Connection Logic =================
    const createPeer = useCallback(() => {
        if (pc.current) return;

        pc.current = new RTCPeerConnection(ICE_CONFIG);

        // Add Tracks (Trainer only)
        if (isTrainer && localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.current.addTrack(track, localStreamRef.current);
            });
        }

        // Handle ICE
        pc.current.onicecandidate = (e) => {
            if (e.candidate) {
                send({ type: "ICE_CANDIDATE", candidate: e.candidate });
            }
        };

        // Handle Remote Stream
        pc.current.ontrack = (e) => {
            console.log("🎥 Received remote track");
            setRemoteStream(e.streams[0]);
        };

        // State Changes
        pc.current.onconnectionstatechange = () => {
            console.log("🔗 Peer state:", pc.current.connectionState);
            setConnectionState(pc.current.connectionState);

            if (pc.current.connectionState === 'connected') {
                toast.success("Connected to peer");
            } else if (pc.current.connectionState === 'failed') {
                toast.error("Connection failed, retrying...");
                // Potential retry logic here
            }
        };
    }, [isTrainer, send]);

    // ================= 3. The Gatekeeper (Offer Creation) =================
    const maybeCreateOffer = useCallback(async () => {
        // STRICT CONDITIONS:
        // 1. Must be Trainer
        // 2. WS must be open
        // 3. Media must be ready
        // 4. Remote peer must be ready (via READY signal or USER_JOINED)
        // 5. Offer must not have been sent yet
        if (
            !isTrainer ||
            !wsReady.current ||
            !mediaReady.current ||
            !remoteReady.current ||
            offerSent.current
        ) {
            console.log("⏳ Waiting conditions:", {
                isTrainer,
                wsReady: wsReady.current,
                mediaReady: mediaReady.current,
                remoteReady: remoteReady.current,
                offerSent: offerSent.current
            });
            return;
        }

        console.log("🚀 All systems go - Creating Offer");
        createPeer();

        try {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            send({ type: "OFFER", sdp: offer });
            offerSent.current = true;
            console.log("📤 OFFER sent");
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    }, [isTrainer, send, createPeer]);

    // ================= 4. Signal Handling =================
    const handleSignal = useCallback(async (msg) => {
        console.log("⬇ WS Msg:", msg.type);

        switch (msg.type) {
            case "READY":
                // Trainee says they are listening
                if (isTrainer) {
                    remoteReady.current = true;
                    maybeCreateOffer();
                }
                break;

            case "OFFER":
                // Trainee receives offer
                if (!isTrainer) {
                    console.log("📥 Received OFFER");
                    createPeer();
                    await pc.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));

                    const answer = await pc.current.createAnswer();
                    await pc.current.setLocalDescription(answer);

                    send({ type: "ANSWER", sdp: answer });
                    console.log("📤 Sent ANSWER");
                }
                break;

            case "ANSWER":
                // Trainer receives answer
                if (isTrainer && pc.current) {
                    // Avoid duplicate answer error
                    if (pc.current.signalingState === "stable") {
                        console.warn("⚠️ Already stable, ignoring duplicate answer");
                        return;
                    }
                    console.log("📥 Received ANSWER");
                    await pc.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                }
                break;

            case "ICE_CANDIDATE":
                if (pc.current) {
                    try {
                        await pc.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
                    } catch (e) {
                        console.warn("Error adding ICE:", e);
                    }
                }
                break;

            case "USER_JOINED":
                console.log("User joined:", msg.role);
                // If trainee joins, trainer knows they are ready
                if (isTrainer && msg.role === "trainee") {
                    remoteReady.current = true;
                    maybeCreateOffer();
                }
                break;
        }
    }, [isTrainer, send, createPeer, maybeCreateOffer]);

    // ================= 5. WebSocket Connection =================
    useEffect(() => {
        // Prevent double connect
        if (ws.current) return;

        const wsUrl = `${WS_URL}/ws/interactive_sessions/${sessionId}/?token=${token}`;
        console.log("🔌 Connecting WS...", wsUrl);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("✅ WS Open");
            wsReady.current = true;
            send({ type: "JOIN_SESSION" });

            // Trainee announces readiness immediately
            if (!isTrainer) {
                send({ type: "READY" });
            } else {
                // Trainer might be reconnecting, check if can offer
                maybeCreateOffer();
            }
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleSignal(data);
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        ws.current.onerror = (e) => console.error("WS Error", e);
        ws.current.onclose = () => {
            console.log("WS Closed");
            wsReady.current = false;
        };

        // Start media concurrently
        startMedia();

        return () => {
            if (ws.current) ws.current.close();
            if (pc.current) pc.current.close();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, [sessionId, token, WS_URL, isTrainer, startMedia, send, handleSignal, maybeCreateOffer]);


    // ================= 6. Features (Mute/Share) =================
    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
            setIsMuted(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !t.enabled);
            setIsVideoOff(prev => !prev);
        }
    };

    const toggleScreenShare = async () => {
        // TODO: Implement advanced screen share logic (replaceTrack)
        // For now, simple toggle placeholder or log
        console.log("Screen share toggle requested");
        // Reuse logic from old file: getDisplayMedia -> replaceTrack
    };

    return {
        localStream,
        remoteStream,
        connectionState,
        isMuted,
        isVideoOff,
        isScreenSharing,
        toggleMute,
        toggleVideo,
        toggleScreenShare
    };
};
