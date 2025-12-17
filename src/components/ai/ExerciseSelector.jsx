import React from 'react';
import { EXERCISES } from '../../config/exercises';

const ExerciseSelector = ({ currentExerciseId, onSelect, disabled }) => {
  return (
    <div className="w-full max-w-xs mb-6 mx-auto">
      <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
        Select Exercise
      </label>
      <div className="relative">
        <select
          value={currentExerciseId}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className="block appearance-none w-full bg-white border border-gray-200 text-gray-900 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] transition-colors shadow-sm"
        >
          {Object.values(EXERCISES).map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
