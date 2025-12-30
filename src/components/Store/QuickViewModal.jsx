import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { ShoppingBag, X, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { addToCart } = useContext(StoreContext);
    const [isAdded, setIsAdded] = useState(false);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        if (product.quantity > 0) {
            addToCart(product, 1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const handleViewDetails = () => {
        onClose();
        navigate(`/store/product/${product.id}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>

                        {/* Image Column */}
                        <div className="w-full md:w-1/2 bg-slate-100 relative h-64 md:h-auto">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Details Column */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
                            {/* Header */}
                            <div className="mb-4">
                                <span className="inline-block text-xs text-[#ff8211] font-bold uppercase tracking-wide bg-[#ff8211]/10 px-2 py-1 rounded mb-3">
                                    {product.category}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-[#ff8211]">{product.price} GEMs</span>
                                    {product.quantity > 0 ? (
                                        <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium text-sm bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-sm text-slate-500 mb-8">
                                <p>{product.description}</p>
                            </div>

                            {/* Actions Footer - Pushed to bottom */}
                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.quantity === 0}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${isAdded
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-600 ring-offset-2'
                                        : 'bg-slate-900 text-white hover:bg-[#ff8211] shadow-lg hover:shadow-[#ff8211]/30'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleViewDetails}
                                    className="w-full py-3.5 rounded-xl bg-slate-50 text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    View Full Details
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
