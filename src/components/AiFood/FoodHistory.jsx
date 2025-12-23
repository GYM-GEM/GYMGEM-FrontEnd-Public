import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Flame, Beef, Wheat, Droplet, Trash2, ChevronRight, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AiNavBarFood from './AiNavBarFood';
import { foodHistory } from '../../utils/foodHistory';
import FooterDash from '../../components/Dashboard/FooterDash';


const FoodHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    setHistory(foodHistory.getHistory());
  }, []);

  const handleDelete = (id) => {
    const updated = foodHistory.deleteMeal(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      foodHistory.clearHistory();
      setHistory([]);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/ai-food?id=${id}`);
  };

  return (
    <>
      <AiNavBarFood />
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white pb-20">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Food History</h1>
              <p className="text-gray-500">Track your past meal analyses and nutritional intake</p>
            </motion.div>
            
            {history.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-100 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
                Clear All
              </motion.button>
            )}
          </div>

          {/* Stats Summary (Optional/Premium Feel) */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <StatSummary label="Meals Scanned" value={history.length} />
              <StatSummary label="Avg Calories" value={`${Math.round(history.reduce((acc, curr) => acc + curr.calories, 0) / history.length)} kcal`} />
              <StatSummary label="Top Goal" value="Muscle Gain" />
              <StatSummary label="Last Activity" value={history[0].date} />
            </motion.div>
          )}

          {/* History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    onDelete={() => handleDelete(item.id)}
                    onView={() => handleViewDetails(item.id)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils size={32} className="text-[#FF8211]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No past analyses found</h3>
                  <p className="text-gray-500">Your scanned meals will appear here as you analyze them.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
          <FooterDash />

    </>
  );
};

const StatSummary = ({ label, value }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const HistoryCard = ({ item, index, onDelete, onView }) => {
  const dateObj = new Date(item.timestamp);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group"
    >
      <div className="flex h-full flex-col sm:flex-row">
        {/* Image Part */}
        <div className="relative w-full sm:w-40 h-48 sm:h-auto overflow-hidden">
          {item.imagePreview ? (
            <img 
              src={item.imagePreview} 
              alt={item.dishName} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Utensils className="text-gray-300" size={40} />
            </div>
          )}
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-gray-700 shadow-sm flex items-center gap-1">
            <Calendar size={10} /> {formattedDate}
          </div>
        </div>

        {/* Content Part */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{item.dishName}</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><Clock size={14} /> {formattedTime}</span>
              <span className="flex items-center gap-1 font-bold text-[#FF8211]"><Flame size={14} /> {item.calories} kcal</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MiniNutrient label="Protein" value={item.protein} unit="g" color="blue" />
              <MiniNutrient label="Carbs" value={item.carbs} unit="g" color="amber" />
              <MiniNutrient label="Fats" value={item.fats} unit="g" color="green" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button 
              onClick={onView}
              className="text-sm font-bold text-[#FF8211] hover:underline flex items-center gap-1"
            >
              View Details <ChevronRight size={14} />
            </button>
            <div className="text-[10px] font-bold text-gray-300 uppercase">
              {item.confidence}% Confidence
            </div>
          </div>
        </div>
      </div>
    </motion.div>

  );
};

const MiniNutrient = ({ label, value, unit, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-green-50 text-green-600 border-green-100"
  };
  
  return (
    <div className={`p-2 rounded-xl border ${colors[color]} text-center`}>
      <p className="text-[10px] font-bold uppercase opacity-70 mb-0.5">{label}</p>
      <p className="text-sm font-bold">{value}{unit}</p>
    </div>
  );
};

export default FoodHistory;
