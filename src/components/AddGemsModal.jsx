import React, { useState, useEffect } from 'react';
import { X, Sparkles, DollarSign, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddGemsModal = ({ isOpen, onClose, onContinue }) => {
  const [activeTab, setActiveTab] = useState('packages');
  const [amount, setAmount] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const GEM_RATE = 10; // 1 USD = 100 GEMS

  const packages = [
    { id: 1, gems: 50, price: 5, label: 'Starter Pack', icon: '🌱' },
    { id: 2, gems: 100, price: 10, label: 'Standard Pack', icon: '🔥', popular: true },
    { id: 3, gems: 200, price: 20, label: 'Pro Pack', icon: '💎' },
  ];

  const calculatedGems = amount ? parseFloat(amount) * GEM_RATE : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-[#FF8211]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 poppins-bold">Add GEMS</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'packages'
                  ? 'bg-white text-[#FF8211] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => setActiveTab('money')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'money'
                  ? 'bg-white text-[#FF8211] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Amount
            </button>
          </div>

          <div className="min-h-[220px]">
            {activeTab === 'packages' ? (
              <div className="grid gap-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                      selectedPackage?.id === pkg.id
                        ? 'border-[#FF8211] bg-orange-50'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{pkg.icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-800 poppins-semibold">{pkg.gems} GEMS</p>
                        <p className="text-xs text-gray-500">{pkg.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">${pkg.price}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedPackage?.id === pkg.id ? 'border-[#FF8211] bg-[#FF8211]' : 'border-gray-300'
                      }`}>
                        {selectedPackage?.id === pkg.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FF8211] text-white text-[10px] font-bold rounded-full shadow-sm">
                        MOST POPULAR
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 flex flex-col items-center justify-center py-4">
                <div className="w-full max-w-[280px]">
                  <label className="block text-sm font-semibold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
                    Amount (USD)
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-orange-50 transition-colors">
                      <DollarSign className="w-5 h-5 text-gray-400 group-focus-within:text-[#FF8211]" />
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#FF8211] focus:bg-white outline-none transition-all text-xl font-bold text-gray-800 poppins-bold"
                    />
                  </div>
                </div>

                <div className="w-full p-6 bg-[#FF8211]/5 rounded-3xl border border-[#FF8211]/10 flex flex-col items-center gap-2">
                  <p className="text-sm font-semibold text-gray-500">You will receive</p>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-[#FF8211]" />
                    <span className="text-4xl font-extrabold text-gray-900 poppins-bold">
                      {Math.floor(calculatedGems).toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-gray-400">GEMS</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Rate: 1 USD = 10 GEMS</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center justify-center text-center mb-2">
          <p className="text-xs text-gray-500">GEMs are not refundable</p>
        </div>
          <button
            onClick={() => {
              const data = activeTab === 'packages' ? selectedPackage : { gems: Math.floor(calculatedGems), price: parseFloat(amount) };
              if (data && (data.gems > 0)) {
                onContinue(data);
              }
            }}
            disabled={activeTab === 'packages' ? !selectedPackage : (!amount || parseFloat(amount) <= 0)}
            className="w-full py-4 bg-[#FF8211] text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/20 hover:bg-[#ff9533] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            Pay Now
          </button>
          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
            <CreditCard className="w-3.5 h-3.5" />
            Secure checkout powered by GYMGEM
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AddGemsModal;
