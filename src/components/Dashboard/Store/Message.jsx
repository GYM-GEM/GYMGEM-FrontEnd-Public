import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Info,
    X,
    Check,
    CheckCheck,
    Smile,
    Image as ImageIcon,
    FileText,
    Trash2,
    BellOff,
    UserPlus,
    ArrowLeft,
    Pencil,
    AlertTriangle,
    Image as ImageIconIcon,
    MessageSquare
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Navbar from "../../Navbar.jsx";
import axiosInstance from "../../../utils/axiosConfig";
import { getUser, getCurrentProfileId } from "../../../utils/auth";
import { useToast } from "../../../context/ToastContext"; // Assuming toast context exists based on TraineeDash

// --- Configuration ---
const USE_MOCK_DATA = false; // Toggle this to false when backend is ready

// --- Mock Data ---

const GET_MOCK_USER = () => {
    const user = getUser();
    return user ? {
        id: user.current_profile, // Fallback if user object structure differs
        name: user.username || user.first_name || "You",
        avatar: user.profile_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
        role: "Trainee"
    } : {
        id: 999,
        name: "You",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
        role: "Trainee"
    };
};

const INITIAL_CONVERSATIONS = [
    {
        id: 1,
        participants: [
            { id: 101, name: "Sarah Coach", role: "Trainer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", status: "online" }
        ],
        lastMessage: "Great progress on the deadlifts today! Keep it up. 💪",
        timestamp: "10:30 AM",
        unreadCount: 2,
        messages: [
            { id: 1, senderId: 101, text: "Hey! How are you feeling after yesterday's session?", timestamp: "10:25 AM", status: "seen" },
            { id: 2, senderId: 999, text: "A bit sore but good! The form correction really helped.", timestamp: "10:28 AM", status: "seen" },
            { id: 3, senderId: 101, text: "That's normal. Make sure to stretch.", timestamp: "10:29 AM", status: "delivered" },
            { id: 4, senderId: 101, text: "Great progress on the deadlifts today! Keep it up. 💪", timestamp: "10:30 AM", status: "delivered" }
        ]
    },
    {
        id: 2,
        participants: [
            { id: 102, name: "Power Gym Store", role: "Store", avatar: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200&h=200&fit=crop", status: "offline" }
        ],
        lastMessage: "Your order #12345 has been shipped.",
        timestamp: "Yesterday",
        unreadCount: 0,
        messages: [
            { id: 1, senderId: 102, text: "Hi, just confirming your order for the protein powder.", timestamp: "Yesterday 2:00 PM", status: "seen" },
            { id: 2, senderId: 999, text: "Yes, that's correct.", timestamp: "Yesterday 2:05 PM", status: "seen" },
            { id: 3, senderId: 102, text: "Great! Your order #12345 has been shipped.", timestamp: "Yesterday 4:00 PM", status: "seen" }
        ]
    },
    {
        id: 3,
        participants: [
            { id: 103, name: "Mike Trainee", role: "Trainee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", status: "online" }
        ],
        lastMessage: "Are you going to the group class tomorrow?",
        timestamp: "Mon",
        unreadCount: 0,
        messages: [
            { id: 1, senderId: 103, text: "Are you going to the group class tomorrow?", timestamp: "Mon 9:00 AM", status: "seen" }
        ]
    }
];

// --- API Service Placeholders ---

const apiService = {
    fetchConversations: async () => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(INITIAL_CONVERSATIONS), 500));
        }
        try {
            const response = await axiosInstance.get('/api/chat/conversations/', { skipGlobalLoader: true });

            // Map the API response to the component structure
            const conversations = response.data.results.map(conv => {
                let lastMsgText = "No messages yet";
                let msgTimestamp = conv.created_at; // Default to created_at

                if (conv.last_message) {
                    if (typeof conv.last_message === 'object') {
                        // Extract content from message object, fallback to Attachment text if content is empty but attachment exists
                        lastMsgText = conv.last_message.content || (conv.last_message.attachment ? "Attachment" : "Message");
                        msgTimestamp = conv.last_message.timestamp;
                    } else {
                        lastMsgText = conv.last_message;
                    }
                }

                // Use explicit last_message_timestamp if available (preferred for sorting)
                if (conv.last_message_timestamp) {
                    msgTimestamp = conv.last_message_timestamp;
                }

                return {
                    id: conv.id,
                    participants: [{
                        id: conv.other_participant_id,
                        name: conv.other_participant_name,
                        role: conv.other_participant_role, // Role from API
                        avatar: conv.other_participant_profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.other_participant_name)}&background=random`,
                        status: 'offline' // Status is not returned by the API
                    }],
                    lastMessage: lastMsgText,
                    timestamp: new Date(msgTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    rawTimestamp: new Date(msgTimestamp), // Store for sorting
                    unreadCount: conv.unread_count,
                    messages: [] // Messages will be loaded separately
                };
            });

            // Sort by rawTimestamp descending
            return conversations.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            throw error;
        }
    },

    fetchMessages: async (conversationId, page = 1) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve({ messages: [], next: null }), 500));
        }
        try {
            const response = await axiosInstance.get(`/api/chat/conversations/${conversationId}/messages/`, {
                params: { page },
                skipGlobalLoader: true
            });
            const messagesData = response.data.results.data || [];
            const ownerId = response.data.results.owner;

            const messages = messagesData.map(msg => ({
                id: msg.id,
                senderId: msg.sender,
                senderName: msg.sender_name,
                text: msg.content,
                attachment: msg.attachment ? { url: msg.attachment, type: 'file' } : null,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: msg.is_read ? 'seen' : 'delivered',
                isRead: msg.is_read,
                isDeleted: msg.is_deleted,
                editedAt: msg.edited_at,
                isMe: msg.sender === ownerId
            }));

            return {
                messages,
                next: response.data.next
            };
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            throw error;
        }
    },

    sendMessage: async (conversationId, messageData) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve({
                id: Date.now(),
                ...messageData,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent'
            }), 300));
        }
        try {
            // Adjust endpoint as needed
            const response = await axiosInstance.post(`/api/chat/conversations/${conversationId}/messages/`, messageData, { skipGlobalLoader: true });
            return response.data;
        } catch (error) {
            console.error("Failed to send message:", error);
            throw error;
        }
    },

    startNewConversation: async (userId) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve({
                id: Date.now(),
                participants: [{ id: userId, name: "New User", role: "Trainer", avatar: "", status: 'offline' }], // Simplified for mock
                lastMessage: "Started a new conversation",
                timestamp: "Just now",
                unreadCount: 0,
                messages: []
            }), 500));
        }
        try {
            const response = await axiosInstance.post(`/api/chat/conversations/start/`, { target_user_id: userId });
            return response.data;
        } catch (error) {
            console.error("Failed to start conversation:", error);
            throw error;
        }
    },

    searchUsers: async (role, query) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                const MOCK_DB = [
                    { id: 201, name: "John Trainer", role: "Trainer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop" },
                    { id: 202, name: "Alice Yoga", role: "Trainer", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
                    { id: 203, name: "Muscle Store", role: "Store", avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop" },
                    { id: 204, name: "Fit Gear", role: "Store", avatar: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=200&h=200&fit=crop" },
                    { id: 205, name: "Tom Trainee", role: "Trainee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
                ];
                setTimeout(() => {
                    const results = MOCK_DB.filter(u =>
                        (!role || u.role.toLowerCase() === role.toLowerCase()) &&
                        (!query || u.name.toLowerCase().includes(query.toLowerCase()))
                    );
                    resolve(results);
                }, 400);
            });
        }
        try {
            // Adjust to your actual search endpoint
            // Example: /users/?role=trainer&search=john
            const params = new URLSearchParams();
            if (role) params.append("role", role);
            if (query) params.append("search", query);

            const response = await axiosInstance.get(`/api/users/?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Failed to search users:", error);
            return [];
        }
    },

    deleteConversation: async (conversationId) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        try {
            await axiosInstance.delete(`/api/chat/conversations/${conversationId}/`);
            return true;
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            throw error;
        }
    },

    blockUser: async (userId) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        try {
            await axiosInstance.post(`/api/users/${userId}/block/`);
            return true;
        } catch (error) {
            console.error("Failed to block user:", error);
            throw error;
        }
    },

    reportUser: async (userId, reason) => {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        try {
            await axiosInstance.post(`/api/users/${userId}/report/`, { reason });
            return true;
        } catch (error) {
            console.error("Failed to report user:", error);
            throw error;
        }
    }
};

// --- Utility Components ---

const Avatar = ({ src, alt, size = "md", status }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-14 h-14",
        xl: "w-24 h-24" // Profile panel
    };

    const statusColor = status === "online" ? "bg-green-500" : "bg-gray-400";

    return (
        <div className="relative">
            <img
                src={src || "https://via.placeholder.com/150"}
                alt={alt}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white ring-2 ring-gray-100/50 shadow-sm`}
            />
            {status && size !== 'xl' && (
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor} border-2 border-white rounded-full`}></span>
            )}
        </div>
    );
};

const RoleBadge = ({ role }) => {
    const colors = {
        Trainer: "bg-blue-100 text-blue-600 border-blue-200",
        Store: "bg-purple-100 text-purple-600 border-purple-200",
        Trainee: "bg-green-100 text-green-600 border-green-200"
    };

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${colors[role] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {role}
        </span>
    );
};

// --- Main Components ---

const MessageList = ({ conversation, currentUser, onRetry, onEdit, onDelete, onLoadMore, loadingMore }) => {
    const scrollRef = useRef(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    // Initial scroll to bottom
    useEffect(() => {
        if (scrollRef.current && !loadingMore && conversation?.messages?.length > 0 && prevScrollHeight === 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation?.id]);

    // Maintain scroll position after loading more
    useEffect(() => {
        if (scrollRef.current && prevScrollHeight > 0) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            const diff = newScrollHeight - prevScrollHeight;
            if (diff > 0) {
                scrollRef.current.scrollTop = diff;
            }
            setPrevScrollHeight(0);
        }
    }, [conversation?.messages?.length, prevScrollHeight]);

    // Auto-scroll to bottom for new messages if already near bottom
    useEffect(() => {
        if (scrollRef.current && !loadingMore && prevScrollHeight === 0) {
            // Simple check: if we are not loading more history, typically we want to scroll to bottom for new incoming messages
            // Ideally check if user is at bottom before forcing, but for now simple behavior:
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            if (isNearBottom) {
                scrollRef.current.scrollTop = scrollHeight;
            }
        }
    }, [conversation?.messages]);


    const handleScroll = (e) => {
        const { scrollTop, scrollHeight } = e.target;
        if (scrollTop === 0 && conversation?.next && !loadingMore) {
            setPrevScrollHeight(scrollHeight);
            onLoadMore();
        }
    };

    if (!conversation) return null;

    return (
        <div
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50"
            ref={scrollRef}
            onScroll={handleScroll}
        >
            {loadingMore && (
                <div className="flex justify-center p-2">
                    <div className="w-6 h-6 border-2 border-[#ff8211] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {conversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No messages here yet. Say hi! 👋
                </div>
            ) : (
                conversation.messages.map((msg, index) => {
                    const isMe = msg.isMe !== undefined ? msg.isMe : (msg.senderId === currentUser.id);

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed relative group
                  ${isMe
                                            ? 'bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}
                                >
                                    {isMe && !msg.isDeleted && (
                                        <div className="absolute top-1 right-full mr-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/80 rounded-lg p-0.5 shadow-sm backdrop-blur-sm z-10">
                                            <button onClick={() => onEdit(msg)} className="p-1 text-gray-500 hover:text-blue-600"><Pencil size={12} /></button>
                                            <button onClick={() => onDelete(msg)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={12} /></button>
                                        </div>
                                    )}

                                    {msg.isDeleted ? (
                                        <span className="text-gray-400 italic flex items-center gap-2">
                                            <BellOff size={14} /> This message was deleted
                                        </span>
                                    ) : (
                                        <>
                                            {msg.attachment && msg.attachmentType === 'image' && (
                                                <div className="mb-2 rounded-lg overflow-hidden max-w-[200px] border border-white/20">
                                                    <img src={msg.attachment.url} alt="attachment" className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                            {msg.text}
                                            {msg.editedAt && <span className="text-[10px] text-gray-400 ml-1">(edited)</span>}
                                            {msg.attachment && msg.attachmentType === 'file' && (
                                                <a
                                                    href={msg.attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={msg.attachment.name}
                                                    className={`mt-2 text-xs italic opacity-90 flex items-center gap-2 p-2 rounded-lg transition-colors
                                              ${isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                                >
                                                    <Paperclip size={14} />
                                                    <span className="truncate max-w-[150px] underline decoration-dotted">{msg.attachment.name}</span>
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mt-1 px-1">
                                    <span className="text-[10px] text-gray-400 font-medium">{msg.timestamp}</span>
                                    {isMe && (
                                        <span>
                                            {msg.status === 'sent' && <Check size={12} className="text-gray-400" />}
                                            {msg.status === 'delivered' && <CheckCheck size={12} className="text-gray-400" />}
                                            {msg.status === 'seen' && <CheckCheck size={12} className="text-[#ff8211]" />}
                                            {msg.status === 'error' && (
                                                <div className="flex items-center gap-1">
                                                    <Info size={12} className="text-red-500" />
                                                    <button
                                                        onClick={() => onRetry(conversation.id, msg)}
                                                        className="text-[10px] text-red-500 hover:underline font-bold"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                }))}
        </div>
    );
};

// --- New Conversation Modal ---

const NewConversationModal = ({ isOpen, onClose, onStartChat }) => {
    const [step, setStep] = useState(1); // 1: Select Type, 2: Select User
    const [selectedType, setSelectedType] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && step === 2 && selectedType) {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const results = await apiService.searchUsers(selectedType, searchQuery);
                    setUsers(results);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            const debounce = setTimeout(fetchUsers, 300);
            return () => clearTimeout(debounce);
        }
    }, [isOpen, step, selectedType, searchQuery]);

    if (!isOpen) return null;



    const handleUserSelect = (user) => {
        onStartChat(user);
        onClose();
        setStep(1);
        setSelectedType(null);
        setSearchQuery("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border border-gray-100 w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">New Message</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
                </div>

                <div className="p-4 min-h-[300px]">
                    {step === 1 ? (
                        <div className="space-y-3">
                            <p className="text-gray-500 text-sm mb-4 font-medium">Select who you want to message:</p>
                            {['Trainer', 'Store', 'Trainee'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { setSelectedType(type); setStep(2); }}
                                    className="w-full p-4 flex items-center justify-between bg-white border border-gray-200 hover:border-[#ff8211]/50 hover:bg-orange-50/30 rounded-xl transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${type === 'Trainer' ? 'bg-blue-100 text-blue-600' :
                                                type === 'Store' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}
                    `}>
                                            {type === 'Trainer' ? <UserPlus size={20} /> :
                                                type === 'Store' ? <MoreVertical size={20} /> : <Smile size={20} />}
                                        </div>
                                        <span className="font-semibold text-gray-800">{type}</span>
                                    </div>
                                    <Check size={16} className="text-gray-300 group-hover:text-[#ff8211] transition-colors opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <button
                                onClick={() => setStep(1)}
                                className="text-xs text-[#ff8211] hover:text-[#e0720f] mb-3 flex items-center gap-1 self-start font-medium"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={`Search ${selectedType}s...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#ff8211] focus:ring-1 focus:ring-[#ff8211] transition-all"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar max-h-[250px]">
                                {loading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8211]"></div>
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                        <Search size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm">No users found.</p>
                                    </div>
                                ) : (
                                    users.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleUserSelect(user)}
                                            className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100"
                                        >
                                            <Avatar src={user.avatar} size="sm" />
                                            <div>
                                                <p className="text-gray-900 font-semibold text-sm">{user.name}</p>
                                                <RoleBadge role={user.role} />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- Modals & Skeletons ---

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
            >
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Message?</h3>
                    <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const EditModal = ({ isOpen, onClose, onConfirm, initialText }) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        setText(initialText);
    }, [initialText, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Edit Message</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
                </div>
                <div className="p-5">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8211]/20 focus:border-[#ff8211] resize-none text-sm"
                        placeholder="Edit your message..."
                    />
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-200/50 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (text.trim() && text !== initialText) {
                                onConfirm(text);
                            } else {
                                onClose();
                            }
                        }}
                        disabled={!text.trim() || text === initialText}
                        className="px-6 py-2 rounded-xl bg-[#ff8211] text-white font-medium hover:bg-[#e0720f] transition-colors shadow-md shadow-orange-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ConversationSkeleton = () => (
    <div className="space-y-2 p-2">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

const MessageListSkeleton = () => (
    <div className="flex-1 p-4 space-y-6 overflow-hidden">
        {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
                <div className="flex justify-start">
                    <div className="flex flex-col items-start max-w-[70%] space-y-1">
                        <div className="h-10 w-48 bg-gray-200 rounded-2xl rounded-bl-none animate-pulse" />
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="flex flex-col items-end max-w-[70%] space-y-1">
                        <div className="h-16 w-64 bg-gray-200 rounded-2xl rounded-br-none animate-pulse" />
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </React.Fragment>
        ))}
    </div>
);

const Message = () => {
    const location = useLocation();
    const { showToast } = useToast(); // Uncomment when ToastContext is ready
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = GET_MOCK_USER();
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [filter, setFilter] = useState("all");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null });
    const [editModal, setEditModal] = useState({ isOpen: false, messageId: null, initialText: "" });
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch conversations on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await apiService.fetchConversations();
                setConversations(data);
            } catch (error) {
                if (showToast) showToast("Failed to load messages", { type: "error" });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-open chat with trainer if coming from PublicTrainerProfile
    useEffect(() => {
        if (location.state?.trainerId && location.state?.trainerName && conversations.length > 0) {
            const { trainerId, trainerName, trainerAvatar } = location.state;

            // Try to find existing conversation with this trainer
            const existingConv = conversations.find(conv =>
                conv.participants.some(p => p.id === trainerId)
            );

            if (existingConv) {
                // Open existing conversation
                handleConversationClick(existingConv.id);
            } else {
                // Create new conversation
                const newConv = {
                    id: Date.now(),
                    participants: [{
                        id: trainerId,
                        name: trainerName,
                        role: "Trainer",
                        avatar: trainerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(trainerName)}&background=FF8211&color=fff`,
                        status: 'online'
                    }],
                    lastMessage: "Start chatting with your trainer!",
                    timestamp: "Just now",
                    unreadCount: 0,
                    messages: []
                };
                setConversations(prev => [newConv, ...prev]);
                setActiveConversationId(newConv.id);
            }

            // Clear the location state to prevent re-opening on re-render
            window.history.replaceState({}, document.title);
        }
    }, [location.state, conversations, loading]);

    // Dynamic Emoji & Attachment State
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [attachment, setAttachment] = useState(null); // { type: 'image' | 'file', url: string, name: string }
    const fileInputRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false); // Other user typing status
    const typingTimeoutRef = useRef(null);


    // WebSocket Reference
    const socketRef = useRef(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const otherParticipant = activeConversation?.participants[0];

    const handleConversationClick = async (id) => {
        if (id === activeConversationId) return;

        setActiveConversationId(id);
        setMessagesLoading(true);

        // Optimistically clear unread
        setConversations(prev => prev.map(c =>
            c.id === id ? { ...c, unreadCount: 0 } : c
        ));

        if (window.innerWidth < 1024) {
            setShowProfilePanel(false);
        }

        // Fetch messages for this conversation
        try {
            const { messages, next } = await apiService.fetchMessages(id, 1);

            // Sort by ID ascending
            messages.sort((a, b) => a.id - b.id);

            setConversations(prev => prev.map(c =>
                c.id === id ? { ...c, messages: messages, next: next } : c
            ));

            // Send Read Receipt
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !lastMessage.isMe) {
                sendReadReceipt(lastMessage.id);
            }
        } catch (error) {
            console.error("Failed to load conversation history", error);
            if (showToast) showToast("Failed to load history", { type: "error" });
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleLoadMoreMessages = async () => {
        if (!activeConversation || !activeConversation.next || loadingMore) return;

        setLoadingMore(true);
        try {
            // Extract page number or simply use the next URL logic if fetchMessages supported it directly. 
            // For now, let's extract 'page' param from the URL
            let page = null;
            try {
                const url = new URL(activeConversation.next);
                page = url.searchParams.get("page");
            } catch (e) {
                console.error("Invalid next URL", activeConversation.next);
                return;
            }

            if (!page) {
                setLoadingMore(false);
                return;
            }

            // Artificial buffer for better UX (optional, but requested "a little buffering")
            await new Promise(resolve => setTimeout(resolve, 500));

            // We are loading more, so don't set global messagesLoading to true to avoid full skeleton
            const { messages: newMessages, next: newNext } = await apiService.fetchMessages(activeConversationId, page);

            setConversations(prev => prev.map(c => {
                if (c.id === activeConversationId) {
                    const mergedMessages = [...newMessages, ...c.messages];
                    // Remove duplicates based on ID (just in case) and sort
                    const uniqueMessages = Array.from(new Map(mergedMessages.map(item => [item.id, item])).values());
                    uniqueMessages.sort((a, b) => a.id - b.id);

                    return {
                        ...c,
                        messages: uniqueMessages,
                        next: newNext
                    };
                }
                return c;
            }));

        } catch (error) {
            console.error("Failed to load more messages", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const sendReadReceipt = (messageId, attempt = 1) => {
        if (attempt > 10) return; // Prevention for infinite recursion

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "read", message_id: messageId }));
        } else {
            // Retry if socket is connecting or not ready yet
            setTimeout(() => sendReadReceipt(messageId, attempt + 1), 500);
        }
    };

    // WebSocket Management
    useEffect(() => {
        // Disconnect previous socket if any
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        if (activeConversationId) {
            const token = localStorage.getItem('access');
            if (token) {
                const wsUrl = `ws://localhost:8000/ws/chat/${activeConversationId}/?token=${token}`;
                const socket = new WebSocket(wsUrl);
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log("WebSocket connected for conversation:", activeConversationId);
                };

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        const msgType = data.type || "message";

                        if (msgType === "typing") {
                            setIsTyping(data.is_typing);
                            return;
                        }

                        if (msgType === "read" || msgType === "read_receipt" || data.reader_id !== undefined) {
                            // Handle read receipt - has reader_id and message_id instead of senderId and text
                            setConversations(prev => prev.map(c => {
                                if (c.id === activeConversationId) {
                                    return {
                                        ...c,
                                        messages: c.messages.map(m => m.id === data.message_id ? { ...m, status: 'seen', isRead: true } : m)
                                    };
                                }
                                return c;
                            }));
                            return;
                        }

                        if (msgType === "delete") {
                            setConversations(prev => prev.map(c => {
                                if (c.id === activeConversationId) {
                                    return {
                                        ...c,
                                        messages: c.messages.map(m => m.id === data.message_id ? { ...m, isDeleted: true, text: "" } : m)
                                    };
                                }
                                return c;
                            }));
                            return;
                        }

                        if (msgType === "edit") {
                            setConversations(prev => prev.map(c => {
                                if (c.id === activeConversationId) {
                                    return {
                                        ...c,
                                        messages: c.messages.map(m => m.id === data.message_id ? { ...m, text: data.content, editedAt: new Date() } : m)
                                    };
                                }
                                return c;
                            }));
                            return;
                        }

                        // Handle standard chat message
                        // Handle new format: message_id, sender_id, content
                        const msgId = data.message_id || data.id || Date.now();
                        const senderId = data.sender_id;
                        const content = data.content || data.message;

                        // Skip if this doesn't look like a valid chat message (missing required fields)
                        if (senderId === undefined || content === undefined) {
                            console.log("Skipping non-message WebSocket data:", data);
                            return;
                        }
                        const timestamp = data.timestamp || Date.now();
                        const senderName = data.sender_name || "User";

                        const incomingMessage = {
                            id: msgId,
                            senderId: senderId,
                            senderName: senderName,
                            text: content,
                            attachment: data.attachment ? { url: data.attachment, type: 'file' } : null,
                            timestamp: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: 'delivered', // Assume delivered if received via socket
                            isRead: false,
                            isMe: senderId === currentUser.id
                        };

                        // Send Read Receipt if it's not me and socket is open
                        if (!incomingMessage.isMe && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify({ type: "read", message_id: msgId }));
                        }

                        console.log("Incoming message:", incomingMessage);
                        console.log("current user:", currentUser);
                        setConversations(prev => prev.map(c => {
                            if (c.id === activeConversationId) {
                                // 1. Check if we already have this exact ID
                                if (c.messages.some(m => m.id === incomingMessage.id)) {
                                    return c; // Duplicate based on ID
                                }

                                // 2. Check for optimistic duplicate (same text, sent by me, recently)
                                if (incomingMessage.isMe) {
                                    const optimisticMatchIndex = c.messages.findIndex(m =>
                                        m.isMe &&
                                        (m.status === 'sending' || m.status === 'sent') &&
                                        m.text === incomingMessage.text
                                        // Could add timestamp check if needed, but text+status is usually enough for quick chat
                                    );

                                    if (optimisticMatchIndex !== -1) {
                                        // Replace the optimistic message with the real one
                                        const newMessages = [...c.messages];
                                        newMessages[optimisticMatchIndex] = { ...incomingMessage, status: 'sent' };
                                        newMessages.sort((a, b) => a.id - b.id); // Ensure order
                                        return {
                                            ...c,
                                            messages: newMessages
                                        };
                                    }

                                    // ...
                                    return c;
                                }

                                const updatedMessages = [...c.messages, incomingMessage];
                                updatedMessages.sort((a, b) => a.id - b.id);

                                return {
                                    ...c,
                                    messages: updatedMessages,
                                    lastMessage: incomingMessage.text,
                                    timestamp: "Just now"
                                };
                            }
                            return c;
                        }));

                    } catch (err) {
                        console.error("Error parsing WS message:", err);
                    }
                };

                socket.onclose = () => {
                    console.log("WebSocket disconnected");
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [activeConversationId, currentUser.id]);

    const handleStartNewChat = (user) => {
        const existing = conversations.find(c => c.participants[0].id === user.id);
        if (existing) {
            handleConversationClick(existing.id);
        } else {
            const startChat = async () => {
                try {
                    const newConv = {
                        id: Date.now(),
                        participants: [{ ...user, status: 'offline' }],
                        lastMessage: "Started a new conversation",
                        timestamp: "Just now",
                        unreadCount: 0,
                        messages: []
                    };
                    setConversations(prev => [newConv, ...prev]);
                    setActiveConversationId(newConv.id);
                } catch (e) {
                    console.error(e);
                }
            };
            startChat();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({
                    type: isImage ? 'image' : 'file',
                    url: reader.result,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emojiData) => {
        setMessageInput((prev) => prev + emojiData.emoji);
    };

    const handleTypingInput = (e) => {
        setMessageInput(e.target.value);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const payload = {
                type: "typing",
                is_typing: true
            };
            socketRef.current.send(JSON.stringify(payload));

            // Debounce the "stop typing" (optional, or rely on blur/timeout)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: "typing", is_typing: false }));
                }
            }, 2000);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!messageInput.trim() && !attachment) || !activeConversationId) return;

        // 1. Optimistic Update
        const optimisticId = Date.now();
        const optimisticMessage = {
            id: optimisticId,
            senderId: currentUser.id,
            text: messageInput,
            attachment: attachment ? { url: attachment.url, name: attachment.name } : null,
            attachmentType: attachment?.type || null,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sending", // Pending status
            isMe: true
        };

        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                return {
                    ...c,
                    messages: [...c.messages, optimisticMessage],
                    lastMessage: attachment ? (attachment.type === 'image' ? '📷 Image' : '📎 File') : messageInput,
                    timestamp: "Just now"
                };
            }
            return c;
        }));

        const payloadText = messageInput;
        // const payloadAttachment = attachment; // WS attachment handling might differ

        setMessageInput("");
        setAttachment(null);
        setShowEmojiPicker(false);

        // 2. Send via WebSocket
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                // Determine payload format. Assuming basic structure:
                const payload = {
                    type: "message",
                    content: payloadText,
                    // attachment: ... if supported
                };
                socketRef.current.send(JSON.stringify(payload));

                // Update status to 'sent' (or wait for echo)
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: c.messages.map(m => m.id === optimisticId ? { ...m, status: 'sent' } : m)
                        };
                    }
                    return c;
                }));

            } catch (error) {
                console.error("Failed to send message via WS", error);
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: c.messages.map(m => m.id === optimisticId ? { ...m, status: 'error' } : m)
                        };
                    }
                    return c;
                }));
            }
        } else {
            console.warn("WebSocket not connected. Fallback to API?");
            // Fallback to API if desired, or show error
            setConversations(prev => prev.map(c => {
                if (c.id === activeConversationId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === optimisticId ? { ...m, status: 'error' } : m)
                    };
                }
                return c;
            }));
            if (showToast) showToast("WebSocket not connected. Message not sent.", { type: "error" });
        }
    };

    const handleRetryMessage = async (conversationId, message) => {
        // Set back to sending
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                return {
                    ...c,
                    messages: c.messages.map(m => m.id === message.id ? { ...m, status: 'sending' } : m)
                };
            }
            return c;
        }));

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                const payload = {
                    type: "message",
                    content: message.text,
                };
                socketRef.current.send(JSON.stringify(payload));

                // Update status to 'sent'
                setConversations(prev => prev.map(c => {
                    if (c.id === conversationId) {
                        return {
                            ...c,
                            messages: c.messages.map(m => m.id === message.id ? { ...m, status: 'sent' } : m)
                        };
                    }
                    return c;
                }));
            } catch (error) {
                // Return to error state
                setConversations(prev => prev.map(c => {
                    if (c.id === conversationId) {
                        return {
                            ...c,
                            messages: c.messages.map(m => m.id === message.id ? { ...m, status: 'error' } : m)
                        };
                    }
                    return c;
                }));
            }
        } else {
            // Still invalid
            setConversations(prev => prev.map(c => {
                if (c.id === conversationId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === message.id ? { ...m, status: 'error' } : m)
                    };
                }
                return c;
            }));
            if (showToast) showToast("Check connection and try again", { type: "error" });
        }
    };

    const updateMessageStatus = (convId, msgId, status) => {
        setConversations(prev => prev.map(c => {
            if (c.id === convId) {
                return {
                    ...c,
                    messages: c.messages.map(m => m.id === msgId ? { ...m, status } : m)
                };
            }
            return c;
        }));
    };

    const handleDeleteConversation = async () => {
        if (window.confirm("Are you sure you want to delete this conversation?")) {
            try {
                await apiService.deleteConversation(activeConversationId);
                setConversations(prev => prev.filter(c => c.id !== activeConversationId));
                setActiveConversationId(null);
                setShowProfilePanel(false);
                if (showToast) showToast("Conversation deleted", { type: "success" });
            } catch (error) {
                if (showToast) showToast("Failed to delete conversation", { type: "error" });
            }
        }
    };

    const handleBlockUser = async () => {
        if (!activeConversation) return;
        const participant = activeConversation.participants[0];
        if (window.confirm(`Are you sure you want to block ${participant.name}?`)) {
            try {
                await apiService.blockUser(participant.id);
                if (showToast) showToast(`${participant.name} blocked`, { type: "success" });
                // Optionally remove conversation or update status
            } catch (error) {
                if (showToast) showToast("Failed to block user", { type: "error" });
            }
        }
    };

    const handleReportUser = async () => {
        if (!activeConversation) return;
        const participant = activeConversation.participants[0];
        const reason = window.prompt("Reason for reporting:");
        if (reason) {
            try {
                await apiService.reportUser(participant.id, reason);
                if (showToast) showToast("Report submitted", { type: "success" });
            } catch (error) {
                if (showToast) showToast("Failed to report user", { type: "error" });
            }
        }
    };



    const filteredConversations = conversations.filter(c => {
        const matchesSearch = c.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = filter === 'unread' ? c.unreadCount > 0 : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8">
                <NewConversationModal
                    isOpen={isNewChatOpen}
                    onClose={() => setIsNewChatOpen(false)}
                    onStartChat={handleStartNewChat}
                />

                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
                    onConfirm={() => {
                        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify({ type: "delete", message_id: deleteModal.messageId }));
                        }
                        setDeleteModal({ isOpen: false, messageId: null });
                    }}
                />

                <EditModal
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal({ isOpen: false, messageId: null, initialText: "" })}
                    initialText={editModal.initialText}
                    onConfirm={(newText) => {
                        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify({ type: "edit", message_id: editModal.messageId, content: newText }));
                        }
                        setEditModal({ isOpen: false, messageId: null, initialText: "" });
                    }}
                />

                <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex relative">

                    {/* --- LEFT SIDEBAR --- */}
                    <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 bg-white
            ${activeConversationId ? 'hidden md:flex' : 'flex'}
          `}>
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-poppins">Messages</h2>
                            
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#ff8211] focus:ring-1 focus:ring-[#ff8211] transition-all text-sm placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter("unread")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === 'unread' ? 'bg-[#ff8211]/10 text-[#ff8211] border border-[#ff8211]/20' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Unread
                                </button>
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                            {loading ? (
                                <ConversationSkeleton />
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <MessageSquare size={32} className="mb-2 opacity-50" />
                                    <p>No conversations found.</p>
                                </div>
                            ) : (
                                filteredConversations.map(conv => {
                                    const participant = conv.participants.find(p => p.id !== currentUser.id);
                                    if (!participant) return null; // Should not happen in 1:1 chat
                                    const isActive = activeConversationId === conv.id;

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationClick(conv.id)}
                                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all mb-2
                                                ${isActive ? 'bg-orange-50 border border-[#ff8211]/20 shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`}
                                        >
                                            <Avatar src={participant.avatar} alt={participant.name} status={participant.status} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={`font-bold text-sm truncate ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>
                                                        {participant.name}
                                                    </h3>
                                                    <span className={`text-[10px] font-semibold ${conv.unreadCount > 0 ? 'text-[#ff8211]' : 'text-gray-400'}`}>
                                                        {conv.timestamp}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <RoleBadge role={participant.role} />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-xs truncate max-w-[140px] leading-relaxed ${conv.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500 font-medium'}`}>
                                                        {conv.lastMessage}
                                                    </p>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-[#ff8211] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* --- CENTER: Chat Window --- */}
                    {activeConversation ? (
                        <div className={`flex-1 flex flex-col bg-slate-50 relative ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
                            {/* Chat Header */}
                            <div className="h-20 px-4 md:px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button
                                        className="md:hidden text-gray-500 hover:text-gray-900 mr-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        onClick={() => setActiveConversationId(null)}
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="md" status={otherParticipant.status} />
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                            {otherParticipant.name}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                            {otherParticipant.status === 'online' ? (
                                                <span className="flex items-center gap-1 text-green-600"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</span>
                                            ) : 'Offline'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 md:gap-2 text-gray-500">

                                    <button
                                        onClick={() => setShowProfilePanel(!showProfilePanel)}
                                        className={`p-2.5 rounded-full transition-colors ${showProfilePanel ? 'bg-[#ff8211]/10 text-[#ff8211]' : 'hover:bg-gray-100 text-gray-600'}`}
                                    >
                                        {showProfilePanel ? <Info size={20} /> : <MoreVertical size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Messages List determined above */}
                            {messagesLoading ? (
                                <MessageListSkeleton />
                            ) : (
                                <MessageList
                                    conversation={activeConversation}
                                    currentUser={currentUser}
                                    onRetry={handleRetryMessage}
                                    onEdit={(msg) => setEditModal({ isOpen: true, messageId: msg.id, initialText: msg.text })}
                                    onDelete={(msg) => setDeleteModal({ isOpen: true, messageId: msg.id })}
                                    onLoadMore={handleLoadMoreMessages}
                                    loadingMore={loadingMore}
                                />
                            )}
                            {isTyping && (
                                <div className="px-6 py-2 text-xs text-gray-500 italic animate-pulse">
                                    {otherParticipant?.name || "User"} is typing...
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-4 md:p-5 bg-white border-t border-gray-200 relative">
                                {showEmojiPicker && (
                                    <div className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-2xl border border-gray-200">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
                                    </div>
                                )}

                                {attachment && (
                                    <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between w-fit max-w-full">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {attachment.type === 'image' ? (
                                                <img src={attachment.url} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                    <Paperclip size={20} />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">{attachment.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{attachment.type}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAttachment(null)}
                                            className="ml-4 p-1 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-[#ff8211]/50 focus-within:ring-2 focus-within:ring-[#ff8211]/10 transition-all shadow-sm">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200/50"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`p-2.5 transition-colors rounded-full hover:bg-gray-200/50 hidden sm:block ${showEmojiPicker ? 'text-[#ff8211] bg-orange-50' : 'text-gray-400 hover:text-yellow-500'}`}
                                    >
                                        <Smile size={20} />
                                    </button>

                                    <textarea
                                        value={messageInput}
                                        onChange={handleTypingInput}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 resize-none max-h-32 min-h-[46px] py-3 focus:outline-none custom-scrollbar text-sm font-medium"
                                        rows={1}
                                    />

                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className={`p-3 rounded-xl transition-all duration-200 shadow-sm
                      ${messageInput.trim()
                                                ? 'bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white shadow-orange-200 hover:scale-105 active:scale-95'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send size={18} className={messageInput.trim() ? 'ml-0.5' : ''} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gray-50/50 text-center p-8">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#ff8211]">
                                    <Send size={32} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">Your Messages</h3>
                            <p className="text-gray-500 max-w-sm font-medium">
                                Select a conversation from the sidebar to start chatting or send a new message to a trainer.
                            </p>
                        
                        </div>
                    )}

                    {/* --- RIGHT PANEL: Profile Info --- */}
                    <AnimatePresence>
                        {activeConversation && showProfilePanel && (
                            <motion.div
                                initial={{ x: "100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute md:relative z-20 top-0 right-0 h-full w-full md:w-80 bg-white border-l border-gray-100 overflow-y-auto shadow-2xl md:shadow-none"
                            >
                                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/30">
                                    <h3 className="font-bold text-gray-900 text-lg">Contact Info</h3>
                                    <button onClick={() => setShowProfilePanel(false)} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-8 flex flex-col items-center border-b border-gray-100">
                                    <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="xl" status={otherParticipant.status} />
                                    <h2 className="mt-4 text-xl font-bold text-gray-900 text-center font-poppins">{otherParticipant.name}</h2>
                                    <div className="mt-2 text-center scale-110">
                                        <RoleBadge role={otherParticipant.role} />
                                    </div>
                                </div>

                                <div className="p-6 space-y-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shared Media</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200">
                                                    <ImageIcon size={20} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Privacy & Support</h4>
                                        <div className="space-y-2">
                                            <button
                                                // onClick={handleMuteNotifications}
                                                onClick={() => showToast && showToast("Mute feature coming soon", { type: "info" })}
                                                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left text-gray-700 font-medium"
                                            >
                                                <BellOff size={20} className="text-gray-400" />
                                                Mute Notifications
                                            </button>
                                            <button
                                                onClick={handleBlockUser}
                                                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left text-gray-700 font-medium"
                                            >
                                                <div className="text-gray-400"><MoreVertical size={20} /></div> {/* Using MoreVertical as placeholder icon or replace with Block icon */}
                                                Block User
                                            </button>
                                            <button
                                                onClick={handleReportUser}
                                                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left text-gray-700 font-medium"
                                            >
                                                <div className="text-gray-400"><Info size={20} /></div>
                                                Report Issue
                                            </button>
                                            <button
                                                onClick={handleDeleteConversation}
                                                className="w-full p-4 flex items-center gap-3 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600 font-medium"
                                            >
                                                <Trash2 size={20} />
                                                Delete Conversation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default Message;
