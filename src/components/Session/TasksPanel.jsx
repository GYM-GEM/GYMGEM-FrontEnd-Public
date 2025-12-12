import React from "react";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

/**
 * TasksPanel Component
 * Displays list of tasks. Trainees can toggle completion.
 */
const TasksPanel = ({ tasks, onToggleTask, isTrainer }) => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="flex flex-col w-full h-full max-h-[400px] rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
                <h3 className="font-bebas text-xl tracking-wide text-foreground flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-[#ff8211]" />
                    Session Tasks
                </h3>
                <span className="text-xs font-bold bg-[#ff8211]/10 text-[#ff8211] px-2 py-1 rounded-md">
                    {completedCount}/{tasks.length} Done
                </span>
            </div>

            {/* Progress Bar */}
            {tasks.length > 0 && (
                <div className="h-1.5 w-full bg-muted">
                    <div
                        className="h-full bg-[#ff8211] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No tasks assigned yet.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => !isTrainer && onToggleTask(task.id)}
                            className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${task.completed
                                    ? "bg-green-500/5 border-green-500/20"
                                    : "bg-background border-border hover:border-[#ff8211]/30 hover:bg-muted/20"
                                } ${isTrainer ? "cursor-default" : ""}`}
                        >
                            <div className={`mt-0.5 ${task.completed ? "text-green-500" : "text-muted-foreground group-hover:text-[#ff8211]"}`}>
                                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium transition-all ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                    {task.text}
                                </p>
                                {task.timestamp && (
                                    <span className="text-[10px] text-muted-foreground block mt-1">
                                        Added at {task.timestamp}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksPanel;
