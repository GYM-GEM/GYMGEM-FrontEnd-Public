import React from 'react';

const StatusOverlay = ({ stats, feedback, status, countdown, exerciseType }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'correct': return 'text-green-700 border-green-200 bg-green-100 shadow-green-100/50';
      case 'incorrect': return 'text-red-700 border-red-200 bg-red-100 shadow-red-100/50';
      default: return 'text-blue-700 border-blue-200 bg-blue-100 shadow-blue-100/50';
    }
  };

  // formatting timer (ms) to MM:SS or S.s
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  // Countdown Overlay
  if (countdown !== null && countdown > 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 pointer-events-none">
        <div className="text-9xl font-black text-[#ff8211] animate-pulse drop-shadow-2xl">
          {countdown}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none gap-2">
      {/* Stats Counter (Reps or Time) */}
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-3 sm:p-4 shadow-lg text-center min-w-[80px] sm:min-w-[100px]">
        <div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
          {exerciseType === 'hold' ? 'Time' : 'Reps'}
        </div>
        <div className="text-2xl sm:text-4xl font-black text-gray-900">
          {exerciseType === 'hold' ? formatTime(stats.holdTime) : stats.reps}
        </div>
      </div>

      {/* Feedback Badge */}
      <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold border backdrop-blur-md shadow-lg transition-colors duration-300 max-w-[60%] sm:max-w-xs text-center text-sm sm:text-base ${getStatusColor()}`}>
        {feedback}
      </div>
    </div>
  );
};

export default StatusOverlay;
