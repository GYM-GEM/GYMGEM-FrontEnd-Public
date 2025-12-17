import React from 'react';
import { Calendar, Clock, Trophy, ChevronRight, Activity } from 'lucide-react';
import { EXERCISES } from '../../config/exercises';

const RightSidebar = ({ 
  activeExerciseId, 
  onSelectExercise, 
  isCameraActive, 
  stats, 
  feedback, 
  status,
  history 
}) => {
  
  const activeExercise = EXERCISES[activeExerciseId];
  
  // Format time for hold exercises
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  // Get status color for feedback
  const getFeedbackColor = () => {
    switch (status) {
      case 'correct': return 'bg-green-100 text-green-700 border-green-200';
      case 'incorrect': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 1. Exercise Selector & Header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
          Current Exercise
        </label>
        <div className="relative">
             <select
                value={activeExerciseId}
                onChange={(e) => onSelectExercise(e.target.value)}
                disabled={isCameraActive}
                className="w-full text-lg font-bold text-gray-900 bg-transparent border-2 border-gray-500 rounded-full pl-4 focus:ring-0 p-0 cursor-pointer disabled:cursor-not-allowed"
             >
                {Object.values(EXERCISES).map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
             </select>
             <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20}/>
        </div>
        <p className="text-sm text-gray-500 mt-1">{activeExercise?.type === 'reps' ? 'Repetition Based' : 'Duration Based'}</p>
      </div>

      {/* 2. Big Stat Card (Counter) */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center py-12">
        <span className="text-gray-400 font-medium text-sm uppercase tracking-widest mb-2">
            {activeExercise?.type === 'reps' ? 'Reps Count' : 'Duration'}
        </span>
        <div className="text-7xl font-bold text-gray-800 tracking-tighter">
            {activeExercise?.type === 'reps' ? String(stats.reps).padStart(2, '0') : formatTime(stats.holdTime)}
        </div>
      </div>

      {/* 3. Feedback Card */}
      <div className={`rounded-2xl p-5 border-2 transition-all duration-300 ${getFeedbackColor()} flex flex-col gap-2 shadow-sm`}>
         <div className="flex items-center justify-between opacity-75">
             <span className="text-xs font-bold uppercase tracking-wider">AI Feedback</span>
             <Activity size={18} className="animate-pulse"/>
         </div>
         <div className="font-black text-xl tracking-tight leading-tight">
            {feedback || "Get in position..."}
         </div>
      </div>

      {/* 4. Mini History (Last 3 Sessions) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Recent History</h4>
            <span className="text-xs text-[#ff8211] font-medium cursor-pointer">See All</span>
        </div>
        
        {history.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">
                No sessions yet today
            </div>
        ) : (
            <div className="space-y-3">
                {history.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff8211]">
                                {session.type === 'hold' ? <Clock size={14}/> : <Trophy size={14}/>}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{session.exercise}</p>
                                <p className="text-xs text-gray-500 text-left">{new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-700">
                             {session.type === 'hold' ? Math.floor(session.holdTime/1000) + 's' : session.reps}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
