import React, { useEffect, useState } from 'react';
import { Trash2, TrendingUp, Calendar, Clock, Trophy } from 'lucide-react';
import AiNavBar from './AiNavBar';

const WorkoutHistory = () => {
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('All');
    const [user, setUser] = useState('');

    useEffect(() => {
        const storedHistory = localStorage.getItem('ai_trainer_history');
        const storedUser = localStorage.getItem('user');

        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory).reverse());
            } catch (e) {
                console.error("Failed to parse history", e);
                setHistory([]);
            }
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.username) setUser(parsedUser.username);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear your workout history?")) {
            localStorage.removeItem('ai_trainer_history');
            setHistory([]);
        }
    };
    // Allow renaming for local personalization
    const handleUserRename = () => {
        const newName = prompt("Enter your name:", user || '');
        if (newName) {
            localStorage.setItem('ai_trainer_user', newName); // Save for persistence
            // Also update current view
            setUser(newName);
        }
    };

    const uniqueExercises = ['All', ...new Set(history.map(h => h.exercise))];
    const filteredHistory = filter === 'All' ? history : history.filter(h => h.exercise === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <AiNavBar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Workout <span className="text-[#ff8211]">History</span>
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Tracking progress for <span className="font-bold text-gray-700 cursor-pointer hover:text-[#ff8211] hover:underline transition-colors" onClick={handleUserRename} title="Click to rename">{user || 'Guest'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#ff8211] focus:border-[#ff8211] block p-2.5 px-4 shadow-sm"
                        >
                            {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                        </select>

                        <button
                            onClick={handleClear}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-200 bg-white shadow-sm"
                            title="Clear History"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-[#ff8211]" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No workouts yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Start the AI Trainer to begin tracking your fitness journey!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredHistory.map((session) => (
                            <div key={session.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#ff8211]">
                                        {session.type === 'hold' ? <Clock size={24} /> : <Trophy size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{session.exercise}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Result</div>
                                        <div className="font-black text-2xl text-gray-900">
                                            {session.type === 'hold'
                                                ? `${Math.floor(session.holdTime / 1000)}s`
                                                : `${session.reps} reps`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutHistory;
