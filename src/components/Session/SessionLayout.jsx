import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getCurrentProfileType } from "../../utils/auth"; // Import auth util
import { useState } from "react";
import ChatBox from "./ChatBox";
import TasksPanel from "./TasksPanel";
import TrainerControls from "./TrainerControls";
import VideoCall from "./VideoCall";
import { ArrowLeft } from "lucide-react";
/**
 * SessionLayout Component (Static Version + Video & Attachments)
 * 
 * Top-level container for the Session UI.
 * Now includes Video Call layout and Attachment handling.
 */
const SessionLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // Get ID from URL
    const passedSessionName = location.state?.sessionName;

    // ==========================
    // MOCK STATE
    // ==========================

    // Role: Detect from Auth Profile (fallback to trainer)
    const profileType = getCurrentProfileType();
    const initialRole = profileType?.toLowerCase() === 'trainer' ? 'trainer' : 'trainee';

    // Allow toggle but start with real role
    const [userRole, setUserRole] = useState(initialRole || "trainer");
    const currentUserId = "user_1";

    const [session, setSession] = useState({
        name: passedSessionName || "HIIT Cardio Blast (Demo)",
        status: "Live", // Live, Ended
        startTime: new Date(Date.now() - 1000 * 60 * 5), // Started 5 mins ago
    });

    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const [messages, setMessages] = useState([
        { id: 1, userId: "system", sender: "System", text: "Session started", type: "system", time: "10:00 AM" },
        { id: 2, userId: "user_2", sender: "Sarah (Trainee)", role: "trainee", text: "Ready to sweat! 😅", time: "10:01 AM" },
        { id: 3, userId: "user_1", sender: "You", role: "trainer", text: "Let's do this! Warmup first.", time: "10:02 AM" },
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, text: "5 min Warmup (Jumping Jacks)", completed: true, timestamp: "10:00 AM" },
        { id: 2, text: "3 Sets of Burpees", completed: false, timestamp: "10:05 AM" },
    ]);

    // ==========================
    // HANDLERS
    // ==========================

    const handleSendMessage = (text, attachment = null) => {
        const newMsg = {
            id: messages.length + 1,
            userId: currentUserId,
            sender: "You",
            role: userRole,
            text: text,
            attachment: attachment, // Pass attachment data {name, type, url}
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMsg]);
    };

    const handleAddTask = (text) => {
        const newTask = {
            id: tasks.length + 1,
            text,
            completed: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTasks([...tasks, newTask]);

        // Auto-announce task
        setMessages(prev => [...prev, {
            id: Date.now(),
            userId: "system",
            sender: "System",
            text: `New Task Added: ${text}`,
            type: "system",
        }]);
    };

    const handleToggleTask = (taskId) => {
        // Only trainees verify tasks in this mock, but we'll allow toggling
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleBroadcast = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            userId: "system",
            sender: "System",
            text: `📢 ANNOUNCEMENT: ${text}`,
            type: "system",
        }]);
    };



    // ================= Siderbar Toggle =================
    const [sidebarTab, setSidebarTab] = useState("chat"); // 'chat' or 'tasks'

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 font-sans selection:bg-green-500/30">

            {/* Navbar / Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold uppercase tracking-wider text-sm">Dashboard</span>
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                        {session.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {session.status}
                    </div>
                </div>

                <div className="w-24"></div> {/* Spacer for center alignment */}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)]">

                {/* Left Stage (Video) */}
                <div className={`transition-all duration-500 ease-in-out ${isScreenSharing ? 'lg:w-3/4' : 'lg:w-2/3'} w-full flex flex-col`}>
                    <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900">
                        <VideoCall
                            sessionId={id}
                            isTrainer={userRole === "trainer"}
                            onScreenShareChange={setIsScreenSharing}
                        />
                    </div>
                </div>

                {/* Right Panel (Tools) */}
                <div className="flex-1 flex flex-col bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">

                    {/* Tabs */}
                    <div className="flex border-b border-white/5 p-2 gap-2">
                        <button
                            onClick={() => setSidebarTab("chat")}
                            className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${sidebarTab === "chat" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            Live Chat
                        </button>
                        <button
                            onClick={() => setSidebarTab("tasks")}
                            className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${sidebarTab === "tasks" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            Session Tasks
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-hidden relative p-4">
                        {sidebarTab === "chat" && (
                            <div className="h-full flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
                                <ChatBox
                                    messages={messages}
                                    currentUserId={currentUserId}
                                    onSendMessage={handleSendMessage}
                                />
                            </div>
                        )}

                        {sidebarTab === "tasks" && (
                            <div className="h-full overflow-y-auto animate-in slide-in-from-right-4 fade-in duration-300">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionLayout;
