import { useNavigate, useParams } from "react-router-dom";
import { getCurrentProfileId } from "../../utils/auth";
import { useState, useEffect } from "react";
import TasksPanel from "./TasksPanel";
import TrainerControls from "./TrainerControls";
import VideoCall from "./VideoCall";
import { ArrowLeft, Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";

/**
 * SessionLayout Component
 * 
 * Fetches session details and handles the main layout.
 * removed: ChatBox
 */
const SessionLayout = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL

    // Session State
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Role: Determine from session ownership (NOT profile type)
    const [userRole, setUserRole] = useState(null);

    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Tasks State (Mock for now, or could be part of session detail)
    const [tasks, setTasks] = useState([
        { id: 1, text: "Wait for connection", completed: false, timestamp: "00:00" },
    ]);

    // Fetch Session Details
    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/interactive-sessions/detail/${id}`);
                const sessionData = response.data;

                console.log("📦 Full Session API Response:", sessionData);

                setSession(sessionData);

                // Determine role: Check if current profile is the trainer
                const currentProfileId = getCurrentProfileId();
                const isSessionTrainer = sessionData.trainer === currentProfileId;

                const role = isSessionTrainer ? 'trainer' : 'trainee';
                setUserRole(role);

                console.log("🔍 Role Determination:", {
                    currentProfileId,
                    sessionTrainerId: sessionData.trainer,
                    sessionTraineeId: sessionData.trainee,
                    calculatedRole: role
                });
            } catch (error) {
                console.error("Failed to fetch session details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSessionDetails();
    }, [id]);

    // ==========================
    // HANDLERS
    // ==========================

    const handleAddTask = (text) => {
        const newTask = {
            id: tasks.length + 1,
            text,
            completed: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTasks([...tasks, newTask]);
    };

    const handleToggleTask = (taskId) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleBroadcast = (text) => {
        // Broadcast logic could go here via WS if needed
        console.log("Broadcast:", text);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            </div>
        );
    }

    if (loading || !session || !userRole) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold">Session Not Found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-green-500 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="h-screen bg-zinc-950 text-zinc-100 p-0 lg:p-4 font-sans selection:bg-green-500/30 flex flex-col">

            {/* Navbar / Header */}
            <div className="flex items-center justify-between py-2 px-4 lg:mb-4 bg-zinc-950 lg:bg-transparent shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <div className="p-1.5 sm:p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-bold uppercase tracking-wider text-xs sm:text-sm hidden sm:inline">Dashboard</span>
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 text-center line-clamp-1">
                        {session.session_title || "Interactive Session"}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-500">
                        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${session.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                        {session.status}
                    </div>
                </div>

                <div className="w-8 sm:w-24"></div> {/* Spacer for center alignment */}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 flex-1 lg:h-[calc(100vh-100px)] overflow-hidden">

                {/* Left Stage (Video) */}
                <div className={`transition-all duration-500 ease-in-out ${isScreenSharing ? 'lg:w-3/4' : 'lg:w-2/3'} w-full flex flex-col flex-1 min-h-0`}>
                    <div className="flex-1 rounded-none lg:rounded-3xl overflow-hidden shadow-2xl border-none lg:border lg:border-white/5 bg-zinc-900">
                        <VideoCall
                            sessionId={id}
                            isTrainer={userRole === "trainer"}
                            onScreenShareChange={setIsScreenSharing}
                            initialStatus={session.status} // Pass initial status from fetch
                        />
                    </div>
                </div>

                {/* Right Panel (Tasks Only) */}
                {/* <div className="flex-1 flex flex-col bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-black uppercase tracking-wider text-sm text-zinc-400">Session Plan</h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{session.description}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 animate-in slide-in-from-right-4 fade-in duration-300">
                        <TasksPanel
                            tasks={tasks}
                            onToggleTask={handleToggleTask}
                            isTrainer={userRole === "trainer"}
                        />
                        {userRole === "trainer" && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <TrainerControls
                                    onAddTask={handleAddTask}
                                    onBroadcast={handleBroadcast}
                                />
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default SessionLayout;
