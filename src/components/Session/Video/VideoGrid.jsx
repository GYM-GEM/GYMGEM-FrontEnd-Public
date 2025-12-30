import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const VideoGrid = ({ localStream, remoteStream, isScreenSharing }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group transition-all">

            {/* Remote Video (Full Screen) */}
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
                        <p className="text-zinc-700 font-black uppercase tracking-widest text-lg">Waiting for opponent</p>
                    </div>
                )}
            </div>

            {/* Local Video (Floating PIP) */}
            {localStream && (
                <div className="absolute top-6 right-6 w-32 md:w-48 aspect-[3/4] md:aspect-video bg-zinc-900 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 group-hover:border-white/30 transition-all hover:scale-105 cursor-pointer">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover ${!isScreenSharing ? "mirror-mode" : ""}`}
                        style={{ transform: !isScreenSharing ? "scaleX(-1)" : "none" }}
                    />
                    <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white/50 uppercase">You</div>
                </div>
            )}
        </div>
    );
};
