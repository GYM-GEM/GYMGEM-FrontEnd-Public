import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff } from "lucide-react";

export const ControlsBar = ({
    isMuted,
    toggleMute,
    isVideoOff,
    toggleVideo,
    isScreenSharing,
    toggleScreenShare,
    onLeave,
    isTrainer,
    handleEndSession
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105">

            {/* Audio Toggle */}
            <button
                onClick={toggleMute}
                className={`p-4 rounded-xl transition-all duration-200 ${isMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Video Toggle */}
            <button
                onClick={toggleVideo}
                className={`p-4 rounded-xl transition-all duration-200 ${isVideoOff ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Screen Share (Trainer Only usually, but let's allow both for now or restrict) */}
            <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-xl transition-all duration-200 ${isScreenSharing ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" : "bg-white/5 text-white hover:bg-white/10"}`}
                title="Share Screen"
            >
                <MonitorUp className="w-6 h-6" />
            </button>

            {/* End/Leave Session */}
            {isTrainer ? (
                <button
                    onClick={handleEndSession} // Correct prop
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center gap-2"
                    title="End Session"
                >
                    End Session
                </button>
            ) : (
                <button
                    onClick={onLeave}
                    className="p-4 bg-zinc-800 hover:bg-red-900/50 text-white/50 hover:text-red-400 rounded-xl transition-all"
                    title="Leave Call"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};
