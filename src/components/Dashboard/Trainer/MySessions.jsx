import React, { useState, useEffect } from "react";
import NavBarDash from "./NavBarDash";
import FooterDash from "../FooterDash";
import {
    Calendar,
    Clock,
    User,
    FileText,
    Filter,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Circle,
    Sparkles,
    MessageCircle,
    Check,
    X,
    Ban,
    Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import { useToast } from "../../../context/ToastContext";

const MySessions = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [userRole, setUserRole] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    // Status configuration
    const statusConfig = {
        requested: { label: "Requested", color: "bg-blue-100 text-blue-700", icon: Clock },
        scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-700", icon: Calendar },
        completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        canceled: { label: "Canceled", color: "bg-gray-100 text-gray-700", icon: XCircle },
        aborted: { label: "Aborted", color: "bg-red-100 text-red-700", icon: XCircle },
        refunded: { label: "Refunded", color: "bg-orange-100 text-orange-700", icon: Sparkles },
        rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
        live: { label: "Live", color: "bg-green-500 text-white animate-pulse", icon: Play },
        waiting: { label: "Waiting", color: "bg-yellow-100 text-yellow-700", icon: Clock },
        no_show: { label: "No Show", color: "bg-gray-100 text-gray-500", icon: AlertCircle }
    };

    // Fetch sessions from API
    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/interactive-sessions/list/');
            setSessions(response.data.data || []);
            setUserRole(response.data.role);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            showToast('Failed to load sessions', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // Handle session actions
    const handleAccept = async (sessionId) => {
        setActionLoading({ ...actionLoading, [sessionId]: 'accept' });
        try {
            await axiosInstance.post(`/api/interactive-sessions/accept/${sessionId}/`);
            showToast('Session accepted successfully', { type: 'success' });
            await fetchSessions();
        } catch (error) {
            console.error('Error accepting session:', error);
            showToast('Failed to accept session', { type: 'error' });
        } finally {
            setActionLoading({ ...actionLoading, [sessionId]: null });
        }
    };

    const handleReject = async (sessionId) => {
        setActionLoading({ ...actionLoading, [sessionId]: 'reject' });
        try {
            await axiosInstance.post(`/api/interactive-sessions/reject/${sessionId}/`);
            showToast('Session rejected', { type: 'success' });
            await fetchSessions();
        } catch (error) {
            console.error('Error rejecting session:', error);
            showToast('Failed to reject session', { type: 'error' });
        } finally {
            setActionLoading({ ...actionLoading, [sessionId]: null });
        }
    };

    const handleAbort = async (sessionId) => {
        setActionLoading({ ...actionLoading, [sessionId]: 'abort' });
        try {
            await axiosInstance.post(`/api/interactive-sessions/abort/${sessionId}/`);
            showToast('Session aborted', { type: 'success' });
            await fetchSessions();
        } catch (error) {
            console.error('Error aborting session:', error);
            showToast('Failed to abort session', { type: 'error' });
        } finally {
            setActionLoading({ ...actionLoading, [sessionId]: null });
        }
    };

    const handleCancel = async (sessionId) => {
        setActionLoading({ ...actionLoading, [sessionId]: 'cancel' });
        try {
            await axiosInstance.post(`/api/interactive-sessions/cancel/${sessionId}/`);
            showToast('Session canceled', { type: 'success' });
            await fetchSessions();
        } catch (error) {
            console.error('Error canceling session:', error);
            showToast('Failed to cancel session', { type: 'error' });
        } finally {
            setActionLoading({ ...actionLoading, [sessionId]: null });
        }
    };

    const handleSendMessage = (session) => {
        // Navigate to messages with the other person's ID
        const otherPersonId = userRole === 'trainer' ? session.trainee : session.trainer;
        navigate(`/messages/${otherPersonId}`);
    };

    // Categorize sessions
    const upcomingStatuses = ['requested', 'scheduled', 'live', 'waiting'];
    const historyStatuses = ['completed', 'canceled', 'aborted', 'refunded', 'rejected', 'no_show'];

    const upcomingSessions = sessions.filter(s => upcomingStatuses.includes(s.status));
    const historySessions = sessions.filter(s => historyStatuses.includes(s.status));

    // Apply status filter
    const filterSessions = (sessionList) => {
        if (statusFilter === "all") return sessionList;
        return sessionList.filter(s => s.status === statusFilter);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    // Check if session can be joined (5 minutes before to session time, and status is scheduled)
    const canJoinSession = (session) => {
        if (session.status !== 'scheduled') return false;

        const sessionTime = new Date(session.starting_time);
        const now = new Date();
        const diffMinutes = (sessionTime - now) / (1000 * 60);

        // Can join if within 5 minutes before or if time has passed
        return diffMinutes <= 5;
    };

    const SessionCard = ({ session }) => {
        const { date, time } = formatDateTime(session.starting_time);
        const StatusIcon = statusConfig[session.status]?.icon || Circle;
        const otherPersonName = userRole === 'trainer' ? session.trainee_name : session.trainer_name;
        const isLoading = actionLoading[session.id];

        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                            <div className="bg-orange-50 p-2.5 rounded-lg text-[#ff8211]">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{session.session_title}</h4>
                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {userRole === 'trainer' ? "with" : "by"} {otherPersonName}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#ff8211] bg-orange-50 px-3 py-1.5 rounded-lg">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-bold">{session.fees} GEMs</span>
                            </div>
                        </div>

                        {session.description && (
                            <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="line-clamp-2">{session.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="ml-4">
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs ${statusConfig[session.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[session.status]?.label || session.status}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {/* Join button for scheduled sessions when time is near */}
                    {canJoinSession(session) && (
                        <button
                            onClick={() => navigate(`/session/${session.id}`)}
                            className="flex-1 min-w-[140px] bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Join Now
                        </button>
                    )}

                    {/* Trainer-specific buttons */}
                    {userRole === 'trainer' && session.status === 'requested' && (
                        <>
                            <button
                                onClick={() => handleAccept(session.id)}
                                disabled={!!isLoading}
                                className="flex-1 min-w-[100px] bg-teal-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading === 'accept' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Accept
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleReject(session.id)}
                                disabled={!!isLoading}
                                className="flex-1 min-w-[100px] bg-rose-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading === 'reject' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        Reject
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {userRole === 'trainer' && session.status === 'scheduled' && !canJoinSession(session) && (
                        <button
                            onClick={() => handleAbort(session.id)}
                            disabled={!!isLoading}
                            className="flex-1 min-w-[120px] bg-rose-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading === 'abort' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Ban className="w-4 h-4" />
                                    Abort
                                </>
                            )}
                        </button>
                    )}

                    {/* Trainee-specific buttons */}
                    {userRole === 'trainee' && (session.status === 'requested' || session.status === 'scheduled') && !canJoinSession(session) && (
                        <button
                            onClick={() => handleCancel(session.id)}
                            disabled={!!isLoading}
                            className="flex-1 min-w-[120px] bg-slate-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading === 'cancel' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                </>
                            )}
                        </button>
                    )}

                    {/* Message button - always available */}
                    <button
                        onClick={() => handleSendMessage(session)}
                        className="bg-sky-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Message
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <NavTraineDash />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-bebas text-4xl text-gray-900 mb-2">My Sessions</h1>
                        <p className="text-gray-600">
                            {userRole === 'trainer' ? 'Manage your training sessions with clients' : 'Track your training sessions'}
                        </p>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mr-2">
                                <Filter className="w-4 h-4" />
                                Filter:
                            </span>
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${statusFilter === "all"
                                    ? "bg-[#ff8211] text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                All Sessions
                            </button>
                            {Object.entries(statusConfig).map(([status, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${statusFilter === status
                                            ? config.color + " shadow-md"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#ff8211] animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* UPCOMING SESSIONS */}
                            <div className="mb-12">
                                <h3 className="font-bebas text-2xl text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-[#ff8211]" />
                                    Upcoming Sessions ({filterSessions(upcomingSessions).length})
                                </h3>
                                {filterSessions(upcomingSessions).length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filterSessions(upcomingSessions).map(session => (
                                            <SessionCard key={session.id} session={session} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No upcoming sessions</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {userRole === 'trainer'
                                                ? 'Accepted sessions will appear here'
                                                : 'Book a session with a trainer to get started'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* HISTORY SESSIONS */}
                            <div>
                                <h3 className="font-bebas text-2xl text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-gray-600" />
                                    Session History ({filterSessions(historySessions).length})
                                </h3>
                                {filterSessions(historySessions).length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filterSessions(historySessions).map(session => (
                                            <SessionCard key={session.id} session={session} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No session history</p>
                                        <p className="text-gray-400 text-sm mt-1">Your completed sessions will appear here</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <FooterDash />
        </>
    );
};

export default MySessions;
