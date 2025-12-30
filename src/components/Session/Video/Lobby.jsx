import { Loader2, Play } from "lucide-react";

export const Lobby = ({ status, isTrainer }) => {
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
                                ? "Entering the arena... The session will go live automatically."
                                : "Your trainer is preparing the session. Get ready to sweat!"}
                        </p>

                        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-full border border-white/5 mx-auto">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                            </span>
                            <span className="text-sm font-bold text-yellow-500 tracking-wide uppercase">Standing By</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
