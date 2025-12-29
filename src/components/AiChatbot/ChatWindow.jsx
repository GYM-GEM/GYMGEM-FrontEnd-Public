import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, X, Sparkles, AlertCircle, Mic, MicOff, Volume2, VolumeX, Play, Square, Globe } from 'lucide-react';
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
        // - Raw: (\s|^)(\/(?:home|courses|trainers|trainees|about|profile|contact|privacy|terms|community|settings|ai-trainer|ai-food|food-history|workout-history|ai-chat|checkout|stores|cart|login|signup|role|trainee|trainer|gym|store)[-\w/]*)(\b|$)
        const combinedRegex = /\[([^\]]+)\]\(([^)]+)\)|(\s|^)(\/(?:home|courses|trainers|trainees|about|profile|contact|privacy|terms|community|settings|ai-trainer|ai-food|food-history|workout-history|ai-chat|checkout|stores|cart|login|signup|role|trainee|trainer|gym|store)[-\w/]*)(\b|$)/g;
        
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
  const [isListening, setIsListening] = useState(false);
  // Voice Mode State: If true, AI auto-speaks responses
  const [isVoiceMode, setIsVoiceMode] = useState(false); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingMsgId, setCurrentSpeakingMsgId] = useState(null);
  const [recognitionLang, setRecognitionLang] = useState('en-US'); // 'en-US' or 'ar-EG'

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice Input Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after one sentence
        recognitionRef.current.interimResults = true; // Show results while talking
        // Language is set dynamically in toggleListening
        
        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            // If final, append. Note: dealing with interim inputs needs care to avoid duplication if we just append
            // Simplified: Just set input to transcript for now
             if (event.results[0].isFinal) {
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
                // Optional: Auto-send if in voice mode for better flow
                // if (isVoiceMode) handleSend(transcript); 
             } 
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
  }, []);

  // Update recognition language on toggle
  const toggleLanguage = () => {
      setRecognitionLang(prev => prev === 'en-US' ? 'ar-EG' : 'en-US');
  };

  // Auto-Speak Logic: When a new AI message arrives and Voice Mode is ON
  useEffect(() => {
    if (isVoiceMode && !isLoading && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'model' || lastMsg.role === 'assistant') {
            speakMessage(lastMsg.content, lastMsg.id);
        }
    }
  }, [messages, isLoading, isVoiceMode]);

  const toggleListening = () => {
      if (!recognitionRef.current) {
          alert("Voice input is not supported in this browser.");
          return;
      }

      // Update lang before starting
      recognitionRef.current.lang = recognitionLang;

      if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  };

  const speakMessage = (text, msgId) => {
      if (!synthRef.current) return;

      // Stop any current speech
      synthRef.current.cancel();

      if (currentSpeakingMsgId === msgId && isSpeaking) {
          // If clicking the same button, stop
          setIsSpeaking(false);
          setCurrentSpeakingMsgId(null);
          return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
          setIsSpeaking(true);
          setCurrentSpeakingMsgId(msgId);
      };
      utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentSpeakingMsgId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentSpeakingMsgId(null);
      };

      // Smart Voice Selection
      const voices = synthRef.current.getVoices();
      const isTextArabic = isArabic(text);
      
      let selectedVoice = null;

      if (isTextArabic) {
          // Priority: Arabic voice
          selectedVoice = voices.find(v => v.lang.includes('ar'));
      } else {
          // Priority: English voice (Google US -> Microsoft Zira -> any English)
          selectedVoice = voices.find(v => v.name.includes('Google US English')) || 
                          voices.find(v => v.name.includes('Zira')) ||
                          voices.find(v => v.lang.includes('en'));
      }

      if (selectedVoice) {
          utterance.voice = selectedVoice;
      }

      // Adjust rate/pitch for better experience
      utterance.rate = 1; 
      utterance.pitch = 1;

      synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
      if (synthRef.current) {
          synthRef.current.cancel();
          setIsSpeaking(false);
          setCurrentSpeakingMsgId(null);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={`flex flex-col h-full bg-white overflow-hidden ${isFullPage ? 'rounded-3xl shadow-2xl border border-gray-100' : ''}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10 
            ${isFullPage ? 'bg-white/80 backdrop-blur-md' : 'bg-gradient-to-r from-[#FF8211] to-orange-600 text-white'}`}>
        <div className="flex items-center gap-4">
            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-md 
                ${isFullPage ? 'bg-gradient-to-br from-[#FF8211] to-orange-500' : 'bg-white/20 backdrop-blur-sm'}`}>
                {isSpeaking ? (
                     <div className="flex gap-0.5 items-end h-4 mb-0.5">
                        <span className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></span>
                        <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-4"></span>
                        <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-3"></span>
                     </div>
                ) : (
                    <Bot className="w-6 h-6 text-white" />
                )}
                
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
                <h3 className={`font-bold text-lg leading-tight ${isFullPage ? 'text-gray-900' : 'text-white'}`}>
                    GYMGEM AI
                </h3>
                <div className="flex items-center gap-2">
                    <p className={`text-xs font-medium ${isFullPage ? 'text-orange-500' : 'text-orange-100'}`}>
                        {isSpeaking ? 'Speaking...' : 'Personal Fitness Assistant'}
                    </p>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Voice Mode Toggle */}
            <button 
                 onClick={() => {
                     setIsVoiceMode(!isVoiceMode);
                     if (isSpeaking) stopSpeaking();
                 }}
                 className={`p-2 rounded-full transition-all duration-300 ${
                     isVoiceMode 
                        ? 'bg-white text-[#FF8211] shadow-md scale-110 ring-2 ring-orange-200' 
                        : isFullPage ? 'text-gray-400 hover:bg-gray-100' : 'text-white/80 hover:bg-white/20'
                 }`}
                 title={isVoiceMode ? "Voice Mode ON (Auto-read responses)" : "Voice Mode OFF"}
            >
                {isVoiceMode ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <div className={`h-6 w-px ${isFullPage ? 'bg-gray-200' : 'bg-white/20'}`} />

            <button 
                onClick={onClear} 
                className={`p-2 rounded-full transition-colors duration-200 
                    ${isFullPage ? 'text-gray-400 hover:bg-red-50 hover:text-red-500' : 'text-white/80 hover:bg-white/20'}`}
                title="Clear Chat History"
            >
                <RefreshCw size={18} />
            </button>
            {!isFullPage && (
                <button className="text-white/80 hover:bg-white/20 p-2 rounded-full">
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-gray-50/50 custom-scrollbar scroll-smooth">
        {Object.keys(groupedMessages).map(date => (
            <div key={date} className="space-y-6">
                {/* Date Divider */}
                <div className="flex justify-center my-6 group">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[11px] uppercase tracking-widest font-bold rounded-full border border-gray-200 shadow-sm group-hover:bg-gray-200 transition-colors">
                        {getDateLabel(groupedMessages[date][0].timestamp)}
                    </span>
                </div>

                <AnimatePresence mode="popLayout">
                    {groupedMessages[date].map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm border-2
                                ${msg.role === 'user' ? 'bg-gray-100 border-white' : 'bg-gradient-to-br from-[#FF8211] to-orange-600 border-orange-100'}`}>
                                {msg.role === 'user' ? <User size={16} className="text-gray-500" /> : <Sparkles size={16} className="text-white" />}
                            </div>

                            {/* Bubble Container */}
                            <div className="flex flex-col gap-1.5 group/msg">
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed relative
                                    ${msg.role === 'user' 
                                        ? 'bg-[#FF8211] text-white rounded-tr-none shadow-orange-200' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-gray-100'
                                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                                >
                                    <FormatMessage content={msg.content} />
                                    
                                    {/* Speak Button (Visible on Hover or if Active) */}
                                    {msg.role !== 'user' && (
                                        <button
                                            onClick={() => speakMessage(msg.content, msg.id)}
                                            className={`absolute -bottom-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border transition-all duration-200
                                                ${currentSpeakingMsgId === msg.id 
                                                    ? 'bg-[#FF8211] text-white border-orange-200 scale-100 opacity-100' 
                                                    : 'bg-white text-gray-400 border-gray-100 opacity-0 group-hover/msg:opacity-100 hover:text-[#FF8211] hover:border-orange-200'}`}
                                            title="Read Aloud"
                                        >
                                            {currentSpeakingMsgId === msg.id ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                                        </button>
                                    )}
                                </div>
                                <div className={`text-[10px] px-2 font-medium opacity-60 ${isArabic(msg.content) ? 'text-left' : 'text-right'} ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
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
                className="flex justify-start pl-2"
            >
                 <div className="flex gap-3 max-w-[75%]">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mt-1 border border-orange-100">
                        <Sparkles size={16} className="text-[#FF8211] animate-pulse" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                 </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 relative z-20">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
            
            {/* Listening Indicator Overlay */}
            <AnimatePresence>
                {isListening && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -top-14 left-0 right-0 flex justify-center items-center pointer-events-none z-30"
                    >
                        <div className="bg-gradient-to-r from-[#FF8211] to-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full flex items-center gap-3 shadow-xl shadow-orange-200/50">
                            <span className="flex gap-1 h-3 items-center">
                                <span className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></span>
                                <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></span>
                                <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-1.5"></span>
                            </span>
                            <span className="tracking-wide">Listening ({recognitionLang === 'en-US' ? 'English' : 'Arabic'})</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 relative group">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder={isListening ? (recognitionLang === 'en-US' ? "Listening..." : "جاري الاستماع...") : "Ask me anything..."}
                    className={`w-full bg-gray-50 border-2 text-gray-900 text-sm rounded-2xl focus:ring-0 block p-3 pr-24 outline-none resize-none shadow-inner transition-all duration-300
                        ${isListening 
                            ? 'border-orange-300 focus:border-[#FF8211] bg-orange-50/30 placeholder-orange-400' 
                            : 'border-gray-100 focus:border-[#FF8211] placeholder-gray-400 focus:bg-white focus:shadow-lg focus:shadow-orange-100/50'}`}
                    disabled={isLoading}
                    rows="1"
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                    dir={isArabic(input) ? 'rtl' : 'ltr'}
                />
                
                {/* Voice & Language Controls inside input */}
                <div className="absolute right-2 bottom-2 top-2 flex gap-1.5 items-center my-auto h-fit">
                    
                    {/* Language Switcher - Premium Toggle */}
                     <div className={`flex bg-gray-200/80 p-0.5 rounded-lg transition-all duration-300 ${isListening ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <button
                            type="button"
                        onClick={toggleLanguage}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                recognitionLang === 'en-US' 
                                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        title="Switch Language (English / Arabic)"
                    >
                        {recognitionLang === 'en-US' ? 'EN' : 'عربي'}
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-0.5"></div>

                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-2 rounded-xl transition-all duration-300 relative group/mic
                            ${isListening 
                                ? 'bg-[#FF8211] text-white shadow-lg shadow-orange-300 scale-105' 
                                : 'text-gray-400 hover:bg-orange-50 hover:text-[#FF8211]'}`}
                        title={isListening ? "Stop Listening" : "Start Voice Input"}
                    >
                        {isListening && (
                             <span className="absolute inset-0 rounded-xl bg-[#FF8211] animate-ping opacity-30"></span>
                        )}
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3.5 bg-gradient-to-r from-[#FF8211] to-orange-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-orange-200 flex-shrink-0"
            >
                <Send size={20} />
            </button>
        </form>
        <div className="text-center mt-2 flex justify-center items-center gap-1.5 opacity-60">
             <Sparkles size={10} className="text-[#FF8211]" />
            <p className="text-[10px] text-gray-400 font-medium">
                AI Assistant powered by GYMGEM
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
