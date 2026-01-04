import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, Flag } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import { useToast } from '../context/ToastContext';

const ReportModal = ({ isOpen, onClose, targetId, targetName }) => {
    const { showToast } = useToast();
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setDetails('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!details.trim()) {
            showToast('Please provide details for the report.', { type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                target_complaint: parseInt(targetId),
                details: details.trim()
            };

            await axiosInstance.post('/api/complaints/', payload);

            showToast('Complaint sent successfully.', { type: 'success' });
            onClose();
        } catch (error) {
            console.error('Error submitting complaint:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to submit complaint.';
            showToast(errorMessage, { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                    <h3 className="font-bebas text-2xl text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        Report User
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 hover:bg-red-100 p-2 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        You are reporting <span className="font-bold text-gray-900">{targetName || 'this user'}</span>.
                        Please describe the issue in detail.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complaint Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Please describe why you are reporting this user..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !details.trim()}
                                className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Flag className="w-4 h-4" />
                                )}
                                Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportModal;
