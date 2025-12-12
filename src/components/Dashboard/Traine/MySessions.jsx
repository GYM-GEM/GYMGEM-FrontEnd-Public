import React, { useState } from "react";
import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { Video, Play, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MySessions = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState("");

    // MOCK DATA
    const upcomingSessions = [
        { id: 101, title: "Morning Yoga Flow", trainer: "Sarah Coach", time: "10:00 AM Today", status: "Live" },
        { id: 102, title: "HIIT Cardio Blast", trainer: "Mike Trainer", time: "2:00 PM Tomorrow", status: "Scheduled" },
    ];

    const handleJoin = (e) => {
        e.preventDefault();
        if (sessionId.trim()) {
            navigate(`/session/${sessionId}`);
        }
    };

    return (
        <>
            <NavTraineDash />
            <main className="min-h-screen bg-slate-50 py-12">
                <div className="max-w-4xl mx-auto px-4">

                    <h1 className="font-bebas text-4xl mb-8 text-slate-800">My Sessions</h1>

                    {/* JOIN SECTION */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Video className="w-6 h-6 text-[#ff8211]" />
                            Join a Session
                        </h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            Enter the Session ID provided by your trainer to join a live room.
                        </p>
                        <form onSubmit={handleJoin} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter Session ID..."
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff8211]"
                            />
                            <button
                                type="submit"
                                disabled={!sessionId.trim()}
                                className="bg-[#ff8211] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e06900] disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-current" /> Join Now
                            </button>
                        </form>
                    </div>

                    {/* UPCOMING LIST */}
                    <div className="space-y-4">
                        <h3 className="font-bebas text-2xl text-slate-700">Upcoming Sessions</h3>
                        {upcomingSessions.map(session => (
                            <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-50 p-3 rounded-lg text-[#ff8211]">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{session.title}</h4>
                                        <p className="text-sm text-slate-500">with {session.trainer}</p>
                                        <div className="mt-2 text-xs font-semibold bg-slate-100 inline-block px-2 py-1 rounded">
                                            {session.time}
                                        </div>
                                    </div>
                                </div>

                                {session.status === "Live" ? (
                                    <button
                                        onClick={() => navigate(`/session/${session.id}`, { state: { sessionName: session.title } })}
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors animate-pulse"
                                    >
                                        JOIN LIVE
                                    </button>
                                ) : (
                                    <button disabled className="bg-slate-100 text-slate-400 px-6 py-2 rounded-lg font-bold text-sm cursor-not-allowed">
                                        Wait
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </main>
            <FooterDash />
        </>
    );
};

export default MySessions;
