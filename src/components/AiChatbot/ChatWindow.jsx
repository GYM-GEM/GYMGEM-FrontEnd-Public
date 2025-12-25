import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simple Markdown-like Formatter (Bold, Links, Lists, Line Breaks)
// Helper to detect Arabic text for RTL
const isArabic = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
};

// Simple Markdown-like Formatter (Bold, Links, Lists, Line Breaks)
const FormatMessage = ({ content }) => {
    const lines = content.split('\n');
    const isRtl = isArabic(content);
    
    return (
        <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {lines.map((line, i) => {
                // Improved regex to handle optional leading whitespace for lists
                const bulletMatch = line.match(/^\s*(\*|-|\d+\.)\s/);
                
                if (bulletMatch) {
                    const listContent = line.substring(bulletMatch[0].length);
                    const bulletChar = bulletMatch[1];
                    
                    return (
                        <div key={i} className={`flex gap-2 ${isRtl ? 'pr-2 pl-0' : 'pl-2 pr-0'}`}>
                            <span className="text-[#FF8211] font-bold">{bulletChar}</span>
                            <div className="flex-1">{formatText(listContent)}</div>
                        </div>
                    );
                }

                return (
                    <p key={i} className="min-h-[1rem]">
                        {formatText(line)}
                    </p>
                );
            })}
        </div>
    );
};

const formatText = (text) => {
    if (!text) return null;

    // 1. Handle Bold **Text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        
        // Combined regex for Markdown Links [Text](/path) and Raw Internal Links /path
        // Refined for better detection: 
        // - Markdown: \[([^\]]+)\]\(([^)]+)\)
        // - Raw: (\s|^)(\/(?:courses|ai-trainer|ai-food|trainers|stores|trainee|trainer|food-history|workout-history|ai-chat|gyms|checkout|profile|dashboard)[-\w/]*)
        const combinedRegex = /\[([^\]]+)\]\(([^)]+)\)|(\s|^)(\/(?:courses|ai-trainer|ai-food|trainers|stores|trainee|trainer|food-history|workout-history|ai-chat|gyms|checkout|profile|dashboard)[-\w/]*)(\b|$)/g;
        
        let lastIndex = 0;
        const result = [];
        let match;
        
        while ((match = combinedRegex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                result.push(part.substring(lastIndex, match.index));
            }

            if (match[1]) {
                // Markdown Link
                const isExternal = match[2].startsWith('http');
                if (isExternal) {
                    result.push(
                        <a key={`${index}-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline hover:text-orange-700 font-semibold decoration-orange-300">
                            {match[1]}
                        </a>
                    );
                } else {
                    result.push(
                        <Link key={`${index}-${match.index}`} to={match[2]} className="text-orange-600 underline hover:text-orange-700 font-semibold decoration-orange-300 transition-colors">
                            {match[1]}
                        </Link>
                    );
                }
            } else if (match[4]) {
                // Raw Internal Link
                result.push(match[3]); // leading space
                result.push(
                    <Link key={`${index}-${match.index}`} to={match[4]} className="text-orange-600 underline hover:text-orange-700 font-semibold decoration-orange-300 transition-colors">
                        {match[4]}
                    </Link>
                );
            }

            lastIndex = combinedRegex.lastIndex;
        }

        if (lastIndex < part.length) {
            result.push(part.substring(lastIndex));
        }

        return <span key={index}>{result}</span>;
    });
};


const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
        const date = new Date(msg.timestamp);
        const day = date.toLocaleDateString();
        if (!groups[day]) groups[day] = [];
        groups[day].push(msg);
    });
    return groups;
};

const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
};

const ChatWindow = ({ messages, onSendMessage, isLoading, onClear, isFullPage = false }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={`flex flex-col h-full bg-white ${isFullPage ? 'rounded-3xl shadow-xl border border-gray-100' : ''}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${isFullPage ? 'bg-orange-50/10' : 'bg-gradient-to-r from-[#FF8211] to-orange-600'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isFullPage ? 'bg-[#FF8211]' : 'bg-white/20'}`}>
                <Bot className={`w-6 h-6 ${isFullPage ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
                <h3 className={`font-bold text-lg ${isFullPage ? 'text-gray-900' : 'text-white'}`}>
                    GYMGEM Assistant
                </h3>
                <p className={`text-xs ${isFullPage ? 'text-gray-500' : 'text-orange-100'}`}>
                    Active & Ready to help
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={onClear} 
                className={`p-2 rounded-full transition-colors ${isFullPage ? 'text-gray-400 hover:bg-gray-100 hover:text-red-500' : 'text-white/80 hover:bg-white/20'}`}
                title="Delete this chat"
            >
                <X size={20} />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-gray-50/30 custom-scrollbar">
        {Object.keys(groupedMessages).map(date => (
            <div key={date} className="space-y-6">
                {/* Date Divider */}
                <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-gray-200/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold rounded-full">
                        {getDateLabel(groupedMessages[date][0].timestamp)}
                    </span>
                </div>

                <AnimatePresence mode="popLayout">
                    {groupedMessages[date].map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm border border-white
                                ${msg.role === 'user' ? 'bg-gray-100' : 'bg-orange-600'}`}>
                                {msg.role === 'user' ? <User size={14} className="text-gray-500" /> : <Sparkles size={14} className="text-white" />}
                            </div>

                            {/* Bubble Container */}
                            <div className="flex flex-col gap-1">
                                <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative
                                    ${msg.role === 'user' 
                                        ? 'bg-[#FF8211] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}`}
                                >
                                    <FormatMessage content={msg.content} />
                                </div>
                                <div className={`text-[10px] px-2 opacity-50 ${isArabic(msg.content) ? 'text-left' : 'text-right'} ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
            >
                 <div className="flex gap-2 max-w-[75%]">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mt-1 border border-white">
                        <Sparkles size={14} className="text-[#FF8211]" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                 </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about exercises, diet, or gems..."
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#FF8211] focus:border-[#FF8211] block w-full p-3 outline-none transition-shadow focus:shadow-md"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-[#FF8211] text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-orange-200"
            >
                <Send size={20} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
