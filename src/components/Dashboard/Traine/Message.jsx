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
    Image as ImageIconIcon // Renaming to avoid conflict if I use Image constructor, though not needed really.
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import NavTraineeDash from "./NavTraineDash";
import axiosInstance from "../../../utils/axiosConfig";
import { getUser, getCurrentProfileId } from "../../../utils/auth";
import { useToast } from "../../../context/ToastContext"; // Assuming toast context exists based on TraineeDash

// --- Configuration ---
const USE_MOCK_DATA = true; // Toggle this to false when backend is ready

// --- Mock Data ---

const GET_MOCK_USER = () => {
    const user = getUser();
    return user ? {
        id: user.user_id || 999, // Fallback if user object structure differs
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
            const response = await axiosInstance.get('/conversations/');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
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
            const response = await axiosInstance.post(`/conversations/${conversationId}/messages/`, messageData);
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
            const response = await axiosInstance.post(`/conversations/start/`, { target_user_id: userId });
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

            const response = await axiosInstance.get(`/users/?${params.toString()}`);
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
            await axiosInstance.delete(`/conversations/${conversationId}/`);
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
            await axiosInstance.post(`/users/${userId}/block/`);
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
            await axiosInstance.post(`/users/${userId}/report/`, { reason });
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

const MessageList = ({ conversation, currentUser }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation?.messages]);

    if (!conversation) return null;

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            {conversation.messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed relative
                  ${isMe
                                        ? 'bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                    }`}
                            >
                                {msg.attachment && msg.attachmentType === 'image' && (
                                    <div className="mb-2 rounded-lg overflow-hidden max-w-[200px] border border-white/20">
                                        <img src={msg.attachment.url} alt="attachment" className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                {msg.text}
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
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                                <span className="text-[10px] text-gray-400 font-medium">{msg.timestamp}</span>
                                {isMe && (
                                    <span>
                                        {msg.status === 'sent' && <Check size={12} className="text-gray-400" />}
                                        {msg.status === 'delivered' && <CheckCheck size={12} className="text-gray-400" />}
                                        {msg.status === 'seen' && <CheckCheck size={12} className="text-[#ff8211]" />}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
            <div ref={scrollRef} />
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

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const otherParticipant = activeConversation?.participants[0];

    const handleConversationClick = (id) => {
        setActiveConversationId(id);
        setConversations(prev => prev.map(c =>
            c.id === id ? { ...c, unreadCount: 0 } : c
        ));
        if (window.innerWidth < 1024) {
            setShowProfilePanel(false);
        }
    };

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
            status: "sending" // Pending status
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
        const payloadAttachment = attachment;

        setMessageInput("");
        setAttachment(null);
        setShowEmojiPicker(false);

        // 2. API Call
        try {
            const sentMessage = await apiService.sendMessage(activeConversationId, {
                text: payloadText,
                senderId: currentUser.id, // API might infer this from token
                attachment: payloadAttachment
            });

            // 3. Update with real ID and status
            setConversations(prev => prev.map(c => {
                if (c.id === activeConversationId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === optimisticId ? { ...sentMessage, status: 'sent' } : m)
                    };
                }
                return c;
            }));

            // Simulate delivery/seen (UI only as backend would push these updates via socket usually)
            if (USE_MOCK_DATA) {
                setTimeout(() => {
                    updateMessageStatus(activeConversationId, sentMessage.id, 'delivered');
                }, 1500);
                setTimeout(() => {
                    updateMessageStatus(activeConversationId, sentMessage.id, 'seen');
                }, 3500);
            }

        } catch (error) {
            console.error("Failed to send message", error);
            // Revert or mark error
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
            <NavTraineeDash />
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8">
                <NewConversationModal
                    isOpen={isNewChatOpen}
                    onClose={() => setIsNewChatOpen(false)}
                    onStartChat={handleStartNewChat}
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
                                <button
                                    onClick={() => setIsNewChatOpen(true)}
                                    className="p-2.5 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] hover:shadow-lg text-white rounded-xl transition-all hover:scale-105"
                                >
                                    <UserPlus size={20} />
                                </button>
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

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
                            {filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
                                    <div className="p-4 bg-gray-100 rounded-full"><Search size={28} /></div>
                                    <p className="text-sm font-medium">No conversations found</p>
                                </div>
                            ) : (
                                filteredConversations.map(conv => {
                                    const participant = conv.participants[0];
                                    const isActive = activeConversationId === conv.id;

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationClick(conv.id)}
                                            className={`p-4 mx-2 my-1 flex items-center gap-4 cursor-pointer transition-all rounded-xl border border-transparent
                        ${isActive ? 'bg-white shadow-md border-gray-100' : 'hover:bg-white hover:shadow-sm'}
                      `}
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
                            <MessageList conversation={activeConversation} currentUser={currentUser} />

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
                                        onChange={(e) => setMessageInput(e.target.value)}
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
                            <button
                                onClick={() => setIsNewChatOpen(true)}
                                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] hover:shadow-lg text-white rounded-xl font-bold transition-all hover:scale-105"
                            >
                                Start New Conversation
                            </button>
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
