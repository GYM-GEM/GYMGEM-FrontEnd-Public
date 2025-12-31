import React from 'react';

const SessionSummary = ({ stats, exerciseName, onRestart }) => {
  // stats: { reps, holdTime (ms) }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-20 z-10 flex items-center justify-center pointer-events-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xl w-full max-w-md text-center pointer-events-auto mx-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Workout Complete!</h2>
        <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">Great job on those {exerciseName}s</p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Total Reps</div>
            <div className="text-3xl sm:text-4xl font-black text-[#ff8211]">{stats.reps}</div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Time</div>
            <div className="text-3xl sm:text-4xl font-black text-gray-800">{formatTime(stats.holdTime)}</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-[#ff8211] hover:bg-[#e6760f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
