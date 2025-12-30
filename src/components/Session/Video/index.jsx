import { useEffect } from "react";
import { useWebRTC } from "./useWebRTC";
import { VideoGrid } from "./VideoGrid";
import { ControlsBar } from "./ControlsBar";
import { Lobby } from "./Lobby";
import { AlertTriangle, CheckCircle } from "lucide-react";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "sonner";

const VideoCall = ({ sessionId, isTrainer, onScreenShareChange, initialStatus = "loading" }) => {
    // Backend URL from env
    const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    // Core Logic Hook
    const {
        localStream,
        remoteStream,
        connectionState,
        isMuted,
        isVideoOff,
        isScreenSharing,
        toggleMute,
        toggleVideo,
        toggleScreenShare
    } = useWebRTC({
        sessionId,
        isTrainer,
        token: localStorage.getItem("access"),
        backendUrl: VITE_API_URL
    });

    // Handle Leave/End
    const handleLeave = () => {
        if (confirm("Are you sure you want to leave?")) {
            window.history.back();
        }
    };

    const handleEndSession = async () => {
        if (!confirm("End this session? Action cannot be undone.")) return;
        try {
            await axiosInstance.post(`/api/interactive-sessions/complete/${sessionId}/`);
            toast.success("Session completed");
            window.history.back();
        } catch (error) {
            console.error("Failed to end session:", error);
            toast.error("Failed to end session");
        }
    };

    // --- Render Logic ---

    // 1. Connection Failed / Aborted
    if (connectionState === "failed") {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-red-950/20 rounded-3xl border border-red-500/20 p-8 text-center animate-in fade-in">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Connection Lost</h3>
                <p className="text-red-200/60 mt-2 mb-8">Please check your internet or refresh the page.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 font-bold uppercase tracking-wide rounded-full transition-colors"
                >
                    Reconnect
                </button>
            </div>
        );
    }

    // 2. Connected (Live Session)
    if (connectionState === "connected" || (localStream && isTrainer) || (!isTrainer && connectionState !== "disconnected")) {
        return (
            <div className="relative w-full h-full group">
                {/* Main Video Grid */}
                <VideoGrid
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isScreenSharing={isScreenSharing}
                />

                {/* LIVE Badge */}
                <div className="absolute top-6 left-6 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 text-white text-xs font-black uppercase tracking-wider rounded-md shadow-lg backdrop-blur-md">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Live Session
                    </div>
                </div>

                {/* Controls */}
                <ControlsBar
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    isVideoOff={isVideoOff}
                    toggleVideo={toggleVideo}
                    isScreenSharing={isScreenSharing}
                    toggleScreenShare={toggleScreenShare}
                    onLeave={handleLeave}
                    isTrainer={isTrainer}
                    handleEndSession={handleEndSession}
                />
            </div>
        );
    }

    // 3. Lobby (Default Fallback)
    return <Lobby status={initialStatus} isTrainer={isTrainer} />;
};

export default VideoCall;
