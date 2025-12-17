import React from 'react';

const ControlPanel = ({ isCameraActive, onStart, onStop, isLoading }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {!isCameraActive ? (
        <button
          onClick={onStart}
          disabled={isLoading}
          className="px-8 py-3 bg-[#ff8211] hover:bg-[#e6760f] text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Starting...' : 'Start Camera'}
        </button>
      ) : (
        <button
          onClick={onStop}
          className="px-8 py-3 bg-[#ff8211] hover:bg-[#e6760f] text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          Stop Camera
        </button>
      )}
    </div>
  );
};

export default ControlPanel;
