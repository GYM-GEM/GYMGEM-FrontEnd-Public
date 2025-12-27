import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';

const QuickMessageModal = ({ isOpen, onClose, session, currentUserRole, targetUser }) => {
    const { showToast } = useToast();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [otherPerson, setOtherPerson] = useState(null);

    // Determine the other person's details
    useEffect(() => {
        if (targetUser) {
            setOtherPerson(targetUser);
        } else if (session && currentUserRole) {
            if (currentUserRole === 'trainer') {
                setOtherPerson({
                    id: session.trainee,
                    name: session.trainee_name
                });
            } else {
                setOtherPerson({
                    id: session.trainer,
                    name: session.trainer_name
                });
            }
        }
    }, [session, currentUserRole, targetUser]);

    // Initialize conversation as soon as modal opens and we have the user ID
    useEffect(() => {
        if (isOpen && otherPerson?.id && !conversationId) {
            const initConversation = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosInstance.post('/api/chat/conversations/start/', {
                        user2: otherPerson.id
                    });
                    setConversationId(response.data.id);
                } catch (error) {
                    console.error('Error starting conversation:', error);
                    showToast('Failed to initialize conversation', { type: 'error' });
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            };
            initConversation();
        }
    }, [isOpen, otherPerson, conversationId, onClose, showToast]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setMessage('');
            setConversationId(null);
            setIsLoading(false);
            setIsSending(false);
        }
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!message.trim() || !conversationId) return;

        setIsSending(true);
        try {
            await axiosInstance.post(`/api/chat/conversations/${conversationId}/send_message/`, {
                content: message
            });
            showToast('Message sent successfully', { type: 'success' });
            onClose();
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Failed to send message', { type: 'error' });
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bebas text-2xl text-gray-800 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-[#ff8211]" />
                        Message {otherPerson?.name?.split(' ')[0]}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-[#ff8211] mb-2" />
                            <p className="text-sm">Initializing chat...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSend}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Type a message to ${otherPerson?.name}...`}
                                    className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8211] focus:border-transparent resize-none transition-all outline-none"
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
                                    disabled={isSending || !message.trim()}
                                    className="bg-[#ff8211] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#e0720f] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                                >
                                    {isSending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuickMessageModal;
