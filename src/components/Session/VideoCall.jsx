import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp } from "lucide-react";

/**
 * VideoCall Component
 * Handles local camera feed, toggling, and Screen Sharing.
 * Default: Camera and Mic OFF on join.
 */
const VideoCall = ({ isTrainer, onScreenShareChange }) => {
    const localVideoRef = useRef(null);
    const [stream, setStream] = useState(null); // Webcam stream
    const [screenStream, setScreenStream] = useState(null); // Screen share stream

    // START WITH MIC AND CAMERA OFF
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Audio Activity State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);

    // 1. Initialize Webcam (But keep it disabled)
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                // IMMEDIATE DISABLE FOR STARTUP
                // We get the permission, but immediately mute/blackout tracks
                mediaStream.getAudioTracks().forEach(track => track.enabled = false);
                mediaStream.getVideoTracks().forEach(track => track.enabled = false);

                setStream(mediaStream);
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        startCamera();

        return () => {
            // Cleanup tracks on unmount
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (screenStream) screenStream.getTracks().forEach(track => track.stop());

            // Cleanup Audio Context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []); // Run only once

    // 2. Audio Activity Detection
    useEffect(() => {
        if (!stream || isMuted) {
            setIsSpeaking(false);
            return;
        }

        // Set up Audio Context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;

            // Threshold for "speaking"
            if (average > 10) {
                setIsSpeaking(true);
            } else {
                setIsSpeaking(false);
            }

            animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContext.state !== 'closed') audioContext.close();
        };
    }, [stream, isMuted]);

    // 3. Re-attach stream logic
    useEffect(() => {
        if (localVideoRef.current) {
            // Prioritize Screen Stream if sharing, otherwise Webcam Stream
            const activeStream = isScreenSharing ? screenStream : stream;

            // Only assign if we have a stream and it's not currently assigned
            if (activeStream) {
                localVideoRef.current.srcObject = activeStream;
            }
        }
    }, [stream, screenStream, isVideoOff, isScreenSharing]);

    const toggleMute = () => {
        if (stream) {
            // Toggle logic: If isMuted is true (currently muted), we want to Enable (true)
            stream.getAudioTracks().forEach(track => track.enabled = isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            // Toggle logic: If isVideoOff is true (currently off), we want to Enable (true)
            stream.getVideoTracks().forEach(track => track.enabled = isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // STOP Sharing
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
                setScreenStream(null);
            }
            setIsScreenSharing(false);
            if (onScreenShareChange) onScreenShareChange(false);
        } else {
            // START Sharing
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                setScreenStream(displayStream);
                setIsScreenSharing(true);
                if (onScreenShareChange) onScreenShareChange(true);

                // Handle "Stop sharing" from browser UI (the little floating bar)
                displayStream.getVideoTracks()[0].onended = () => {
                    setScreenStream(null);
                    setIsScreenSharing(false);
                    if (onScreenShareChange) onScreenShareChange(false);
                };
            } catch (err) {
                console.error("Error sharing screen:", err);
                // User likely cancelled the prompt
            }
        }
    };

    return (
        <div className={`grid gap-4 mb-2 transition-all duration-500 ease-in-out ${isScreenSharing ? 'grid-cols-1 h-[600px]' : 'grid-cols-1 md:grid-cols-2 h-[300px] md:h-[400px]'}`}>
            {/* Remote Video (Mock) - PIP when sharing */}
            <div className={`relative rounded-2xl overflow-hidden bg-black shadow-lg group transition-all duration-500
                ${isScreenSharing ? 'absolute top-4 right-4 z-20 w-48 h-36 shadow-2xl border-2 border-white/20' : 'relative w-full h-full'}`}>
                <img
                    src={isTrainer
                        ? "https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800"
                        : "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800"
                    }
                    alt="Remote User"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bebas text-lg tracking-wide shadow-black drop-shadow-md">
                        {isTrainer ? "Sarah (Trainee)" : "Coach Mike"}
                    </h4>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm animate-pulse">
                        LIVE
                    </span>
                </div>
            </div>

            {/* Local Video (Webcam) - WITH SPEAKING INDICATOR */}
            <div className={`relative rounded-2xl overflow-hidden bg-zinc-900 shadow-lg border transition-all duration-300 ${isSpeaking ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-white/10"}`}>

                {/* Visual Audio Waveform Animation (Optional extra flair) */}
                {isSpeaking && (
                    <div className="absolute top-4 right-4 flex items-end gap-1 h-4">
                        <span className="w-1 bg-green-500 animate-[bounce_1s_infinite] h-2 rounded-full"></span>
                        <span className="w-1 bg-green-500 animate-[bounce_1.2s_infinite] h-4 rounded-full"></span>
                        <span className="w-1 bg-green-500 animate-[bounce_0.8s_infinite] h-3 rounded-full"></span>
                    </div>
                )}

                {!isScreenSharing && isVideoOff ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                            <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Camera Off</p>
                        </div>
                    </div>
                ) : (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover ${!isScreenSharing ? "mirror-mode" : ""}`}
                        style={{ transform: !isScreenSharing ? "scaleX(-1)" : "none" }}
                    />
                )}

                {/* Controls Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl z-10 transition-all hover:bg-black/60">
                    <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full transition-all relative ${isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {/* Mini ring on mic button itself */}
                        {isSpeaking && !isMuted && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></span>
                        )}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-all ${isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={toggleScreenShare}
                        className={`p-3 rounded-full transition-all ${isScreenSharing ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                        <MonitorUp className="w-5 h-5" />
                    </button>
                </div>

                <div className="absolute top-4 left-4">
                    <span className={`backdrop-blur-sm text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${isSpeaking ? "bg-green-500/80 text-white font-bold" : "bg-black/50 text-white"}`}>
                        {isScreenSharing ? <MonitorUp className="w-3 h-3" /> : (isSpeaking ? <Mic className="w-3 h-3" /> : null)}
                        {isScreenSharing ? "Your Screen" : (isSpeaking ? "You (Speaking)" : "You")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
