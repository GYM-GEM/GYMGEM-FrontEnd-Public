import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Play, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "sonner"; // Assuming sonner is used

/**
 * VideoCall Component
 * Handles WebRTC connection, WebSocket signaling, and Session State.
 * Protocol aligned with Backend: 
 * - Events: SESSION_WAITING, SESSION_LIVE, SESSION_COMPLETED, SESSION_ABORTED
 * - Signals: OFFER (sdp), ANSWER (sdp), ICE_CANDIDATE (candidate)
 */
const VideoCall = ({ sessionId, isTrainer, onScreenShareChange }) => {
    // ================= State =================
    const [status, setStatus] = useState("loading"); // loading, scheduled, live, completed, aborted
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Media Controls
    const [isMuted, setIsMuted] = useState(false); // Default unmuted
    const [isVideoOff, setIsVideoOff] = useState(false); // Default video on

    // Audio Activity
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Refs for WebRTC & WS
    const ws = useRef(null);
    const peerConnection = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Config
    const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const WS_BASE_URL = VITE_API_URL.replace(/^http/, "ws"); // http -> ws, https -> wss

    const ICE_SERVERS = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Add TURN servers here for production
        ],
    };

    // ================= Effects =================

    // 1. Initial Setup: Fetch Status & Connect WS
    useEffect(() => {
        if (!sessionId) return;

        let connectTimer;

        const initializeSession = async () => {
            // Delay connection to prevent Strict Mode "flash" connections
            connectTimer = setTimeout(() => {
                connectWebSocket();
            }, 300);
        };

        initializeSession();

        // Safety: ensure we send leave if user closes tab
        const handleBeforeUnload = () => sendSignal({ type: "LEAVE_SESSION" });
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (connectTimer) clearTimeout(connectTimer);
            // Send leave on component unmount too (SPA navigation)
            sendSignal({ type: "LEAVE_SESSION" });
            cleanupSession();
        };
    }, [sessionId]);

    // 2. Setup Local Stream
    useEffect(() => {
        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);

                // Initialize controls state based on stream
                stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
                stream.getVideoTracks().forEach(t => t.enabled = !isVideoOff);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
                toast.error("Could not access camera/microphone");
            }
        };

        // Only start stream if we are in a potentially active state
        if (["scheduled", "live", "loading", "waiting"].includes(status) && !localStream) {
            startLocalStream();
        }

        return () => {
            // We only stop tracks on full unmount (cleanupSession)
        };
    }, [status]);


    // 3. Audio Level Detection (Reusing logic)
    useEffect(() => {
        if (!localStream || isMuted) {
            setIsSpeaking(false);
            return;
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        try {
            const source = audioContext.createMediaStreamSource(localStream);
            source.connect(analyser);
        } catch (e) {
            console.error("Audio context error", e);
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
            const average = sum / bufferLength;
            setIsSpeaking(average > 10);
            animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContext.state !== 'closed') audioContext.close();
        };
    }, [localStream, isMuted]);

    // ================= Logic =================

    const connectWebSocket = () => {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No access token found");
            return;
        }

        const wsUrl = `${WS_BASE_URL}/ws/interactive_sessions/${sessionId}/?token=${token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WS Connected via " + wsUrl);
            sendSignal({ type: "JOIN_SESSION" });
        };

        ws.current.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                handleSignalMessage(data);
            } catch (e) {
                console.error("Failed to parse WS message", e);
            }
        };

        ws.current.onclose = () => {
            console.log("WS Closed");
        };

        ws.current.onerror = (error) => {
            console.error("WS Error:", error);
        };
    };

    const sendSignal = (data) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    };

    const handleSignalMessage = async (data) => {
        console.log("Received Signal:", data.type, data);

        switch (data.type) {
            // --- Session State Events ---
            case "SESSION_WAITING":
                setStatus("scheduled"); // Map 'waiting' to internal 'scheduled' (Waiting Room UI)
                break;

            case "SESSION_LIVE":
                setStatus("live");
                break;

            case "SESSION_HALF_COMPLETED":
                toast.info("Session is halfway done!");
                break;

            case "SESSION_COMPLETED":
                setStatus("completed");
                break;

            case "SESSION_ABORTED":
                setStatus("aborted");
                console.warn("Session aborted:", data.reason);
                if (data.reason) toast.error(`Session Aborted: ${data.reason}`);
                cleanupSession();
                break;

            // --- WebRTC Signaling ---
            case "OFFER":
                await handleOffer(data.sdp); // Protocol: 'sdp' key
                break;

            case "ANSWER":
                await handleAnswer(data.sdp); // Protocol: 'sdp' key
                break;

            case "ICE_CANDIDATE":
                await handleIceCandidate(data.candidate); // Protocol: 'candidate' key
                break;

            case "USER_JOINED":
                console.log("User joined:", data.user);
                // "Trainer initiates offer" logic:
                // If I am trainer, and a user joined (likely trainee), I start the call logic.
                if (isTrainer) {
                    initiatePeerConnection();
                }
                break;

            case "USER_LEFT":
                console.log("User left");
                break;

            default:
                // Fallback / legacy status check
                if (data.type === "SESSION_STATUS" && data.status) {
                    setStatus(data.status.toLowerCase());
                }
                break;
        }
    };

    // --- WebRTC Core ---

    const initiatePeerConnection = async () => {
        if (peerConnection.current) return; // Already exists

        createPeerConnection();

        // Trainer creates offer
        if (isTrainer) {
            try {
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);
                sendSignal({ type: "OFFER", sdp: offer }); // Protocol: send 'sdp'
            } catch (err) {
                console.error("Error creating offer:", err);
            }
        }
    };

    const createPeerConnection = () => {
        if (peerConnection.current) return;

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnection.current = pc;

        // Add local tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal({ type: "ICE_CANDIDATE", candidate: event.candidate }); // Protocol: send 'candidate'
            }
        };

        // Handle Remote Stream
        pc.ontrack = (event) => {
            console.log("Received remote track");
            const [remoteStream] = event.streams;
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        };

        // Handle connection state
        pc.onconnectionstatechange = () => {
            console.log("Connection State:", pc.connectionState);
        };
    };

    const handleOffer = async (offerSdp) => {
        if (!peerConnection.current) createPeerConnection();

        const pc = peerConnection.current;
        await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendSignal({ type: "ANSWER", sdp: answer }); // Protocol: send 'sdp'
    };

    const handleAnswer = async (answerSdp) => {
        if (!peerConnection.current) return;
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answerSdp));
    };

    const handleIceCandidate = async (candidate) => {
        if (!peerConnection.current) return;
        try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error adding ice candidate:", e);
        }
    };

    // --- REST Actions ---

    const handleStartSession = async () => {
        try {
            await axiosInstance.post(`/interactive-sessions/start/${sessionId}/`);
            // Status update expected via WS event 'SESSION_LIVE'
        } catch (error) {
            console.error("Failed to start session:", error);
            toast.error("Failed to start session");
        }
    };

    const handleEndSession = async () => {
        if (!confirm("Are you sure you want to end this session? This action cannot be undone.")) return;
        try {
            await axiosInstance.post(`/interactive-sessions/complete/${sessionId}/`);
            // Status update expected via WS event 'SESSION_COMPLETED'
        } catch (error) {
            console.error("Failed to end session:", error);
        }
    };

    const cleanupSession = () => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
    };

    const handleLeave = () => {
        if (confirm("Are you sure you want to leave?")) {
            sendSignal({ type: "LEAVE_SESSION" });
            cleanupSession();
            // Redirect or update UI
            window.history.back();
        }
    };

    // --- Media Toggles ---

    const toggleMute = () => {
        if (localStream) {
            const enabled = isMuted; // Toggle
            localStream.getAudioTracks().forEach(t => t.enabled = enabled);
            setIsMuted(!enabled);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const enabled = isVideoOff; // Toggle
            localStream.getVideoTracks().forEach(t => t.enabled = enabled);
            setIsVideoOff(!enabled);
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop Sharing: Switch back to webcam
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                // Replace video track in PC
                const videoTrack = stream.getVideoTracks()[0];
                if (peerConnection.current) {
                    const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
                    if (sender) sender.replaceTrack(videoTrack);
                }

                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                setIsScreenSharing(false);
                if (onScreenShareChange) onScreenShareChange(false);
            } catch (e) {
                console.error("Failed to switch back to camera", e);
            }

        } else {
            // Start Sharing
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = displayStream.getVideoTracks()[0];

                // Replace video track in PC
                if (peerConnection.current) {
                    const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
                    if (sender) sender.replaceTrack(screenTrack);
                }

                setLocalStream(displayStream);

                screenTrack.onended = () => {
                    toggleScreenShare(); // Revert when user stops via browser UI
                };

                if (localVideoRef.current) localVideoRef.current.srcObject = displayStream;

                setIsScreenSharing(true);
                if (onScreenShareChange) onScreenShareChange(true);
            } catch (err) {
                console.error("Screen share cancelled", err);
            }
        }
    };

    // ================= Render =================

    if (status === "completed") {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] bg-zinc-900/50 rounded-2xl border border-white/10 p-8 text-center animate-in fade-in">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bebas text-white tracking-wide">Session Completed</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                    Great work! The session has been successfully recorded and completed.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    if (status === "aborted") {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] bg-red-900/20 rounded-2xl border border-red-500/30 p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-2xl font-bebas text-white tracking-wide">Session Aborted</h3>
                <p className="text-muted-foreground mt-2">
                    Something went wrong or the session was cancelled.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-full transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 mb-2 transition-all duration-500 ease-in-out grid-cols-1 md:grid-cols-2 h-[300px] md:h-[400px]">

            {/* Status Overlays */}
            {status !== "live" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                    {status === "loading" && <Loader2 className="w-10 h-10 text-primary animate-spin" />}

                    {status === "scheduled" && (
                        <div className="text-center p-6 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-w-sm">
                            <h3 className="text-xl font-bold text-white mb-2">Ready to Start?</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                {isTrainer
                                    ? "You can start the session when you are ready. The trainee will join automatically."
                                    : "Waiting for your trainer to start the session..."}
                            </p>

                            {isTrainer ? (
                                <button
                                    onClick={handleStartSession}
                                    className="flex items-center justify-center w-full gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                                >
                                    <Play className="w-5 h-5" fill="currentColor" />
                                    START LIVE SESSION
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-yellow-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Waiting for Host...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Remote Video */}
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg group">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <>
                        <img
                            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800"
                            alt="Placeholder"
                            className="w-full h-full object-cover opacity-50 grayscale"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/50 font-bebas text-lg">Waiting for connection...</p>
                        </div>
                    </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                    {status === "live" && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                        </span>
                    )}
                </div>
            </div>

            {/* Local Video */}
            <div className={`relative rounded-2xl overflow-hidden bg-zinc-900 shadow-lg border transition-all duration-300 ${isSpeaking ? "border-green-500" : "border-white/10"}`}>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!isScreenSharing ? "mirror-mode" : ""}`}
                    style={{ transform: !isScreenSharing ? "scaleX(-1)" : "none" }}
                />

                {/* Controls Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl z-50">
                    <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full transition-all ${isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-all ${isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                        title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={toggleScreenShare}
                        className={`p-3 rounded-full transition-all ${isScreenSharing ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                        title="Share Screen"
                    >
                        <MonitorUp className="w-5 h-5" />
                    </button>

                    <div className="w-px h-8 bg-white/20 mx-1"></div>

                    {isTrainer && status === "live" && (
                        <button
                            onClick={handleEndSession}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Use End
                        </button>
                    )}

                    <button
                        onClick={handleLeave}
                        className="bg-zinc-700 hover:bg-zinc-600 text-white p-3 rounded-full"
                        title="Leave Call"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
