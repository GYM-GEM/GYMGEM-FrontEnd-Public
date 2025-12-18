import React, { useState, useEffect } from "react";
import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { Video, Play, Calendar, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../../BuyNow/PaymentPage";

const MySessions = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState("");
    const [paymentSession, setPaymentSession] = useState(null);

    // MOCK DATA
    // Get user from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // MOCK DATA
    const upcomingSessions = () => {
        try {
            if (!user.id) return [];

            const traineeKey = `trainee_bookings_${user.id}`;
            const traineeEventsStr = localStorage.getItem(traineeKey);
            if (!traineeEventsStr) return [];

            // Master list from trainer (to check for deletions)
            const trainerKey = `wc_events_16`; // Primary key used in WeekCalendar
            const masterEventsStr = localStorage.getItem(trainerKey) || localStorage.getItem("wc_events_v1") || "[]";
            const masterEvents = JSON.parse(masterEventsStr);

            // Parse trainee events
            const events = JSON.parse(traineeEventsStr);

            // Check payments
            const orders = JSON.parse(localStorage.getItem('user_orders') || "[]");
            const myOrders = orders.filter(o => o.userId === user.id);

            return events
                .filter(ev => {
                    // Check if event still exists in master list
                    // If event has trainerId, it MUST exist in master list.
                    if (ev.trainerId) {
                        return masterEvents.some(m => m.id === ev.id);
                    }
                    return true;
                })
                .map(ev => {
                    const isPaid = myOrders.some(o => o.course.id === ev.id);
                    return { ...ev, isPaid };
                });
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        }
    };

    const handlePayNow = async (session) => {
        try {
            const token = localStorage.getItem("access");
            // Optimistically open modal or show loading? 
            // Better to fetch then open, or open with loading state. 
            // We'll fetch then open to ensure we have the URL if possible.

            const res = await fetch(`http://localhost:4040/api/payment/start/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: session.id,
                    payment_method: "credit_card",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPaymentSession({ ...session, iframeUrl: data.iframe_url });
                // Also track locally
                localStorage.setItem("pending_session_id", session.id);
            } else {
                // Fallback to form if API fails
                console.error("Payment init failed");
                setPaymentSession(session);
            }
        } catch (error) {
            console.error("Error starting payment:", error);
            setPaymentSession(session);
        }
    };

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
                        {upcomingSessions().map(session => (
                            <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-50 p-3 rounded-lg text-[#ff8211]">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{session.title}</h4>
                                        <p className="text-sm text-slate-500">with {session.trainer}</p>
                                        <div className="mt-2 text-xs font-semibold bg-slate-100 inline-block px-2 py-1 rounded">
                                            {new Date(session.start).toLocaleDateString('en-GB')}
                                            <span className="mx-2 text-slate-300">|</span>
                                            {new Date(session.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </div>
                                    </div>
                                </div>

                                {(() => {
                                    const start = new Date(session.start);
                                    const now = new Date();
                                    const diffMs = start - now;
                                    const diffHours = diffMs / (1000 * 60 * 60);

                                    // Conditions
                                    const showPay = !session.isPaid && diffHours <= 6;
                                    const isLive = diffMs <= 0;

                                    return (
                                        <div className="flex gap-3">
                                            {showPay && (
                                                <button
                                                    onClick={() => handlePayNow(session)}
                                                    className="bg-[#ff8211] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e06900] transition-colors shadow-sm flex items-center gap-2"
                                                >
                                                    <span className="text-lg">💳</span> Pay Now
                                                </button>
                                            )}

                                            {isLive ? (
                                                <button
                                                    onClick={() => navigate(`/session/${session.id}`, { state: { sessionName: session.title } })}
                                                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors animate-pulse"
                                                >
                                                    JOIN LIVE
                                                </button>
                                            ) : (
                                                !showPay && (
                                                    <button disabled className="bg-slate-100 text-slate-400 px-6 py-2 rounded-lg font-bold text-sm cursor-not-allowed">
                                                        Wait
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>

                </div>

                {/* PAYMENT MODAL */}
                {paymentSession && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">

                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 font-bebas">Complete Your Booking</h3>
                                    <p className="text-sm text-slate-500">Session: {paymentSession.title}</p>
                                </div>
                                <button
                                    onClick={() => setPaymentSession(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* Payment Form */}
                                <PaymentPage
                                    total={paymentSession.price}
                                    iframeUrl={paymentSession.iframeUrl}
                                    paymentId={paymentSession.id}
                                    course={paymentSession}
                                    user={user}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <FooterDash />
        </>
    );
};

export default MySessions;
