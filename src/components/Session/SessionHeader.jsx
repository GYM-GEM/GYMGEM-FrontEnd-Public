import React, { useState, useEffect } from "react";
import { Clock, Radio, MoreVertical, Share2, Copy } from "lucide-react";

/**
 * SessionHeader Component
 * Displays the current session information, status, and a live timer.
 */
const SessionHeader = ({ sessionId, sessionName, status, startTime, onEndSession, isTrainer }) => {
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [copied, setCopied] = useState(false);

    // Timer logic
    useEffect(() => {
        if (status !== "Live") return;

        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(startTime);
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const fmt = (n) => (n < 10 ? `0${n}` : n);
            setElapsedTime(`${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [status, startTime]);

    const handleCopyInvite = () => {
        if (!sessionId) return;
        // Copy just the ID for now as that's what the dashboard takes
        navigator.clipboard.writeText(sessionId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-6 py-4 shadow-sm backdrop-blur-md">
            {/* Left: Info */}
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8211]/10 text-[#ff8211]">
                    <Radio className={`h-6 w-6 ${status === "Live" ? "animate-pulse" : ""}`} />
                </div>
                <div>
                    <h2 className="font-bebas text-2xl tracking-wide text-foreground">{sessionName}</h2>
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <span className={`inline-flex h-2 w-2 rounded-full ${status === "Live" ? "bg-green-500" : "bg-red-500"}`} />
                            {status}
                        </span>
                        {sessionId && (
                            <span className="hidden sm:inline-block px-2 py-0.5 bg-muted rounded text-xs font-mono">
                                ID: {sessionId}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Center: Timer (Hidden on small screens) */}
            <div className="hidden items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-lg font-bold font-mono text-foreground shadow-inner sm:flex border border-border">
                <Clock className="h-5 w-5 text-[#ff8211]" />
                {elapsedTime}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* SHARE BUTTON (Visible to both but primarily for Trainer) */}
                {sessionId && (
                    <button
                        onClick={handleCopyInvite}
                        className="flex items-center gap-2 rounded-xl bg-[#ff8211]/10 px-3 py-2 text-sm font-bold text-[#ff8211] hover:bg-[#ff8211] hover:text-white transition-all"
                        title="Copy Session ID"
                    >
                        {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                        {copied ? "Copied ID!" : "Share ID"}
                    </button>
                )}

                {isTrainer && status === "Live" && (
                    <button
                        onClick={onEndSession}
                        className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        End Session
                    </button>
                )}
                <button className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors">
                    <MoreVertical className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default SessionHeader;
