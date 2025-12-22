import React, { useState, useEffect } from "react";
import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import {
    Video,
    Play,
    Calendar,
    Clock,
    User,
    FileText,
    DollarSign,
    Filter,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Circle
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
    const [sessionId, setSessionId] = useState("");

    // Status configuration
    const statusConfig = {
        requested: { label: "Requested", color: "bg-blue-100 text-blue-700", icon: Clock },
        scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-700", icon: Calendar },
        completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        canceled: { label: "Canceled", color: "bg-gray-100 text-gray-700", icon: XCircle },
        aborted: { label: "Aborted", color: "bg-red-100 text-red-700", icon: XCircle },
        refunded: { label: "Refunded", color: "bg-orange-100 text-orange-700", icon: DollarSign },
        rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
        live: { label: "Live", color: "bg-green-500 text-white animate-pulse", icon: Video },
        waiting: { label: "Waiting", color: "bg-yellow-100 text-yellow-700", icon: Clock },
        no_show: { label: "No Show", color: "bg-gray-100 text-gray-500", icon: AlertCircle }
    };

    // Fetch sessions from API
    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/interactive-sessions/list/');
            setSessions(response.data || []);
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

    const handleJoin = (e) => {
        e.preventDefault();
        if (sessionId.trim()) {
            navigate(`/session/${sessionId}`);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    const SessionCard = ({ session }) => {
        const { date, time } = formatDateTime(session.starting_time);
        const StatusIcon = statusConfig[session.status]?.icon || Circle;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const isTrainer = user.profile_type === "trainer";
        const otherPersonName = isTrainer ? session.trainee_name : session.trainer_name;

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
                                    {isTrainer ? "with" : "by"} {otherPersonName}
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
                                <DollarSign className="w-4 h-4" />
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

                {/* Action button for live sessions */}
                {session.status === 'live' && (
                    <button
                        onClick={() => navigate(`/session/${session.id}`)}
                        className="w-full mt-4 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 animate-pulse"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        JOIN LIVE SESSION
                    </button>
                )}
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
                        <p className="text-gray-600">Manage and track your training sessions</p>
                    </div>

                    {/* JOIN SECTION */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Video className="w-6 h-6 text-[#ff8211]" />
                            Join a Session
                        </h2>
                        <p className="text-gray-600 mb-4 text-sm">
                            Enter the Session ID to join a live session
                        </p>
                        <form onSubmit={handleJoin} className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Enter Session ID..."
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={!sessionId.trim()}
                                className="bg-[#ff8211] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e06900] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Join Now
                            </button>
                        </form>
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
                                        <p className="text-gray-400 text-sm mt-1">Book a session with a trainer to get started</p>
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
