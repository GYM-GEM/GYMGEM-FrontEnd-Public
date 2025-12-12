import React, { useState } from "react";
import { Plus, Megaphone } from "lucide-react";

/**
 * TrainerControls Component
 * Admin panel for trainers to manage the session.
 */
const TrainerControls = ({ onAddTask, onBroadcast }) => {
    const [taskText, setTaskText] = useState("");
    const [activeTab, setActiveTab] = useState("task"); // 'task' or 'announce'

    const handleAddTask = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(taskText);
            setTaskText("");
        }
    };

    return (
        <div className="flex flex-col w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[250px]">
            <div className="bg-[#ff8211]/10 px-6 py-4 border-b border-[#ff8211]/20">
                <h3 className="font-bebas text-xl tracking-wide text-[#ff8211] flex items-center gap-2">
                    Trainer Tools
                </h3>
            </div>

            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab("task")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'task' ? 'border-b-2 border-[#ff8211] text-[#ff8211] bg-muted/50' : 'text-muted-foreground hover:bg-muted'}`}
                >
                    Add Task
                </button>
                <button
                    onClick={() => setActiveTab("announce")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'announce' ? 'border-b-2 border-[#ff8211] text-[#ff8211] bg-muted/50' : 'text-muted-foreground hover:bg-muted'}`}
                >
                    Announce
                </button>
            </div>

            <div className="p-5 flex-1">
                {activeTab === "task" ? (
                    <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">New Task Description</label>
                            <textarea
                                value={taskText}
                                onChange={(e) => setTaskText(e.target.value)}
                                placeholder="Ex: Do 15 Pushups..."
                                rows={3}
                                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8211]/50 placeholder:text-muted-foreground resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!taskText.trim()}
                            className="flex items-center justify-center gap-2 w-full bg-[#ff8211] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#e06900] disabled:opacity-50 transition-all shadow-md active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Add Task
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4 text-center items-center justify-center h-full">
                        <Megaphone className="w-10 h-10 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">Broadcast features would go here. Allowing you to send a high-priority popup to all trainees.</p>
                        <button
                            onClick={() => onBroadcast && onBroadcast("Keep pushing! You're doing great!")}
                            className="w-full border border-[#ff8211] text-[#ff8211] py-2.5 rounded-xl text-sm font-bold hover:bg-[#ff8211]/5 transition-all"
                        >
                            Send "Keep Pushing!"
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerControls;
