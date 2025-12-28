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

    // --- Loading / Lobby State ---
    if (["loading", "scheduled", "waiting"].includes(status)) {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in duration-700">
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 z-0"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center max-w-md text-center p-8">
                    {status === "loading" ? (
                        <>
                            <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-6" />
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Connecting to Arena</h2>
                            <p className="text-zinc-500 font-medium">Securing your connection...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/20 ring-4 ring-green-500/10 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                                <Play className="w-10 h-10 text-green-500 ml-1" fill="currentColor" />
                            </div>

                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                                {isTrainer ? "Session Ready" : "Waiting Room"}
                            </h2>

                            <p className="text-zinc-400 mb-8 font-medium leading-relaxed">
                                {isTrainer
                                    ? "The stage is set. Start the session when you are ready to lead."
                                    : "Your trainer is preparing the session. Get ready to sweat!"}
                            </p>

                            {isTrainer ? (
                                <button
                                    onClick={handleStartSession}
                                    className="group relative px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-black text-lg uppercase tracking-wider rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95"
                                >
                                    Start Live Session
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-full border border-white/5 mx-auto">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-yellow-500 tracking-wide uppercase">Standing By for Host</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Local Preview (Small) */}
                {localStream && (
                    <div className="absolute bottom-6 right-6 w-48 aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg opacity-50 hover:opacity-100 transition-opacity">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover mirror-mode"
                            style={{ transform: "scaleX(-1)" }}
                        />
                        <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white/50 uppercase">Preview</div>
                    </div>
                )}
            </div>
        );
    }

    // --- Ended State ---
    if (status === "completed") {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900 rounded-3xl border border-white/10 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Session Complete</h3>
                <p className="text-zinc-400 mt-2 max-w-md mb-8">
                    Great work! The session has been successfully recorded.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wide rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                    <button
                        onClick={() => window.location.reload()} // Mock restart
                        className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wide rounded-full hover:bg-white/5 transition-colors"
                    >
                        View Summary
                    </button>
                </div>
            </div>
        );
    }

    if (status === "aborted") {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-red-950/20 rounded-3xl border border-red-500/20 p-8 text-center animate-in fade-in">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Session Aborted</h3>
                <p className="text-red-200/60 mt-2 mb-8">Connection lost or session cancelled.</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 font-bold uppercase tracking-wide rounded-full transition-colors"
                >
                    Exit Arena
                </button>
            </div>
        );
    }

    // --- Live Arena State ---
    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group transition-all">

            {/* Main Remote Video (Opponent) */}
            <div className="absolute inset-0 z-0">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                        <Loader2 className="w-12 h-12 text-zinc-700 animate-spin mb-4" />
                        <p className="text-zinc-700 font-black uppercase tracking-widest text-lg">Waiting for connection</p>
                    </div>
                )}
            </div>

            {/* Local Video (Floating PiP) */}
            <div className="absolute top-6 right-6 w-48 md:w-64 aspect-[3/4] md:aspect-video bg-zinc-900 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 group-hover:border-white/30 transition-all">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!isScreenSharing ? "mirror-mode" : ""}`}
                    style={{ transform: !isScreenSharing ? "scaleX(-1)" : "none" }}
                />
                {/* Audio Indicator */}
                <div className={`absolute bottom-3 left-3 w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/20'} transition-all duration-200`}></div>
            </div>

            {/* LIVE Badge */}
            <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 text-white text-xs font-black uppercase tracking-wider rounded-md shadow-lg backdrop-blur-md">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Live Session
                </div>
            </div>

            {/* Controls Dock (Bottom Center) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105">

                {/* Audio/Video Toggles */}
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-xl transition-all duration-200 ${isMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-xl transition-all duration-200 ${isVideoOff ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                    title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>

                <div className="w-px h-8 bg-white/10 mx-2"></div>

                {/* Trainer Actions */}
                {isTrainer && (
                    <button
                        onClick={handleEndSession}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center gap-2"
                        title="End Session"
                    >
                        End Session
                    </button>
                )}

                {/* Leave Only */}
                {!isTrainer && (
                    <button
                        onClick={toggleScreenShare}
                        className={`p-4 rounded-xl transition-all duration-200 ${isScreenSharing ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                        title="Share Screen"
                    >
                        <MonitorUp className="w-6 h-6" />
                    </button>
                )}

                <button
                    onClick={handleLeave}
                    className="p-4 bg-zinc-800 hover:bg-red-900/50 text-white/50 hover:text-red-400 rounded-xl transition-all"
                    title="Leave Call"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
