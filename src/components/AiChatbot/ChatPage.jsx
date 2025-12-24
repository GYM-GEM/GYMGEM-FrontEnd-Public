import React from 'react';
import ChatWindow from './ChatWindow';
import { useChat } from '../../hooks/useChat';
import { MessageSquare, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import AiNavBarChat from './AiNavBarChat';
import FooterDash from '../Dashboard/FooterDash';

const ChatPage = () => {
    const { 
        messages, 
        isLoading, 
        sendMessage, 
        clearChat, 
        sessions, 
        activeSessionId, 
        switchSession, 
        deleteSession, 
        startNewChat 
    } = useChat();

    // Grouping by date could be done here, but let's just list them for now
    
    return (
      <>
        <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full top-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      ></motion.div>
      <AiNavBarChat/>
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto h-[85vh] flex gap-6">
                
                {/* Left Sidebar (Desktop) */}
                <div className="hidden md:flex flex-col w-72 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                    <button 
                        onClick={startNewChat}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FF8211] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200 mb-6"
                    >
                        <Plus size={18} />
                        New Chat
                    </button>

                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">History</h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {sessions.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                                <p className="text-xs text-gray-400">No conversations yet</p>
                            </div>
                        ) : (
                            sessions.map(session => (
                                <div key={session.id} className="group relative">
                                    <button 
                                        onClick={() => switchSession(session.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 pr-10
                                        ${activeSessionId === session.id ? 'bg-orange-50 text-[#FF8211]' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <MessageSquare size={16} className={activeSessionId === session.id ? 'text-[#FF8211]' : 'text-gray-400'} />
                                        <span className="truncate">{session.title || 'New Conversation'}</span>
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                                        title="Delete chat"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col h-full relative">
                     <ChatWindow 
                        messages={messages}
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                        onClear={clearChat}
                        isFullPage={true}
                     />
                </div>
            </div>
        </div>
        <FooterDash />

        </>
    );
};

export default ChatPage;
