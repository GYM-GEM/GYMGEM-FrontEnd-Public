import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

const GemsBadge = ({ balance = 0, onAddClick, isLoading = false }) => {
  // Get user from local storage to check profile type
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentProfileId = user.current_profile;
  const currentProfile = user.profiles?.find(p => p.id === currentProfileId);
  const isTrainee = currentProfile?.type?.toLowerCase() === 'trainee';

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm animate-pulse w-24 h-[34px]">
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded-md w-12" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100 shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-[#FF8211] animate-pulse" />
        <span className="text-sm font-bold text-gray-800 poppins-semibold">
          {balance !== null ? balance.toLocaleString() : '0'}
        </span>
      </div>
      {isTrainee && (
        <button
          onClick={onAddClick}
          className="ml-1 p-0.5 bg-[#FF8211] text-white rounded-full hover:bg-[#ff9533] transition-colors active:scale-95 shadow-sm"
          aria-label="Add GEMS"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default GemsBadge;
