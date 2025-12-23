import React from 'react';
import { motion } from 'framer-motion';

const NutritionCard = ({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  index,
  isEditable = false,
  onEdit 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      {/* Glassmorphism card with border glow */}
      <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 
                      hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
        
        {/* Gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-red-500/0 
                        group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-red-500/10 
                        transition-all duration-300 rounded-2xl" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full 
                          bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4
                          group-hover:from-orange-500/30 group-hover:to-red-500/30 
                          transition-all duration-300">
            <Icon className="w-6 h-6 text-orange-400" strokeWidth={2.5} />
          </div>

          {/* Label */}
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>

          {/* Value - Editable or Display */}
          {isEditable && isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-gray-800/50 text-white text-2xl font-bold rounded px-2 py-1 w-20
                         border border-orange-500/50 focus:outline-none focus:border-orange-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setEditValue(value);
                  setIsEditing(false);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <div 
              className={`flex items-baseline gap-1 ${isEditable ? 'cursor-pointer' : ''}`}
              onClick={() => isEditable && setIsEditing(true)}
            >
              <span className="text-3xl font-bold text-white">{value}</span>
              <span className="text-lg text-gray-400">{unit}</span>
              {isEditable && (
                <span className="text-xs text-orange-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  (click to edit)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Subtle border glow animation */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none"
             style={{
              boxShadow: '0 0 20px rgba(255, 130, 17, 0.3), inset 0 0 20px rgba(255, 130, 17, 0.1)'
             }} />
      </div>
    </motion.div>
  );
};

export default NutritionCard;
