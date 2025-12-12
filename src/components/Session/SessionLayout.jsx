import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getCurrentProfileType } from "../../utils/auth"; // Import auth util
import { useState } from "react";
import SessionHeader from "./SessionHeader";
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



    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 animate-fade-in">

            {/* Navigation & Dev Tools */}
            <div className="mx-auto max-w-7xl mb-6 flex justify-between items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>

            </div>

            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <SessionHeader
                    sessionId={id} // Pass ID
                    sessionName={session.name}
                    status={session.status}
                    startTime={session.startTime}
                    isTrainer={userRole === "trainer"}
                    onEndSession={() => setSession({ ...session, status: "Ended" })}
                />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

                    {/* Left Panel: Video & Chat (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {/* VIDEO CALL AREA */}
                        <div className="w-full">
                            <VideoCall isTrainer={userRole === "trainer"} />
                        </div>

                        {/* CHAT AREA */}
                        <div className="flex-1">
                            <ChatBox
                                messages={messages}
                                currentUserId={currentUserId}
                                onSendMessage={handleSendMessage}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Tasks & Tools (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pb-4 h-full">
                        {/* Tasks are visible to everyone */}
                        <TasksPanel
                            tasks={tasks}
                            onToggleTask={handleToggleTask}
                            isTrainer={userRole === "trainer"}
                        />

                        {/* Controls only for Trainer */}
                        {userRole === "trainer" ? (
                            <div className="animate-in slide-in-from-right-4 duration-300 delay-100">
                                <TrainerControls
                                    onAddTask={handleAddTask}
                                    onBroadcast={handleBroadcast}
                                />
                            </div>
                        ) : (
                            <div className="bg-muted/30 p-6 rounded-2xl border border-border text-center">
                                <h4 className="font-bebas text-lg text-foreground mb-2">Trainee View</h4>
                                <p className="text-sm text-muted-foreground">
                                    Follow the trainer's instructions and check off tasks as you complete them!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SessionLayout;
