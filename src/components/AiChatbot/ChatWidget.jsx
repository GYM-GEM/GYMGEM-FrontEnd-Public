import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const { isOpen, toggleChat, messages, isLoading, sendMessage, hasNewMessage, clearChat } = useChat();
  const widgetRef = useRef(null);

  // AUTH CHECK: Hide widget if user is not logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return null;

  // Close when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (widgetRef.current && !widgetRef.current.contains(event.target)) {
//         // if (isOpen) toggleChat(); // Optional: Close on click outside
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, toggleChat]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={widgetRef}>
      
      {/* Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/5"
          >
            <ChatWindow 
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
                onClear={clearChat}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Toggle Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300 
         ${isOpen ? 'bg-white text-gray-800 rotate-90' : 'bg-gradient-to-r from-[#FF8211] to-orange-600 text-white'}`}
      >
        {isOpen ? (
            <X size={28} />
        ) : (
            <>
                <MessageSquare size={28} fill="currentColor" className="text-white" />
                {/* Notification Badge */}
                {hasNewMessage && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
