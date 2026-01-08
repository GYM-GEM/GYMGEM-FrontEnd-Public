import { useState, useEffect, useRef } from 'react';
import { aiChatService } from '../services/aiChatService';
import { aiContextBuilder } from '../services/aiContextBuilder';
import { getUserContext, formatUserContextForPrompt } from '../utils/userContext';



const STORAGE_KEY = 'gymgem_chat_sessions_v1';

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed.sessions || {});
        setActiveSessionId(parsed.activeSessionId || null);
      } catch (e) {
        console.error("Failed to parse chat sessions", e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (Object.keys(sessions).length > 0 || activeSessionId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, activeSessionId }));
    }
  }, [sessions, activeSessionId]);

  const currentMessages = activeSessionId && sessions[activeSessionId] 
    ? sessions[activeSessionId].messages 
    : [];

  const startNewChat = () => {
    const newId = Date.now().toString();
    const welcomeMsg = {
        id: 'init-' + newId,
        role: 'assistant',
        content: "Hello! I'm your GYMGEM AI Assistant. 💪\n\nHow can I help you achieve your goals today?",
        timestamp: new Date().toISOString()
    };

    setSessions(prev => ({
        ...prev,
        [newId]: {
            id: newId,
            title: 'New Conversation',
            messages: [welcomeMsg],
            lastUpdated: new Date().toISOString()
        }
    }));
    setActiveSessionId(newId);
    aiChatService.startChat([]); // Reset AI session
  };

  const deleteSession = (id) => {
    setSessions(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
    });
    if (activeSessionId === id) {
        setActiveSessionId(null);
    }
  };

  const switchSession = (id) => {
    setActiveSessionId(id);
    const sessionMessages = sessions[id]?.messages || [];
    aiChatService.startChat(sessionMessages);
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    let targetId = activeSessionId;
    
    // Create new session if none active
    if (!targetId) {
        targetId = Date.now().toString();
        const initMsg = {
            id: 'init-' + targetId,
            role: 'assistant',
            content: "Welcome! Let's get started.",
            timestamp: new Date().toISOString()
        };
        setSessions(prev => ({
            ...prev,
            [targetId]: {
                id: targetId,
                title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
                messages: [initMsg],
                lastUpdated: new Date().toISOString()
            }
        }));
        setActiveSessionId(targetId);
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    };

    // Update session title on first user message if it's still 'New Conversation'
    const isFirstUserMessage = sessions[targetId]?.messages.filter(m => m.role === 'user').length === 0;

    setSessions(prev => ({
        ...prev,
        [targetId]: {
            ...prev[targetId],
            title: isFirstUserMessage ? (content.substring(0, 30) + (content.length > 30 ? '...' : '')) : prev[targetId].title,
            messages: [...(prev[targetId]?.messages || []), userMsg],
            lastUpdated: new Date().toISOString()
        }
    }));

    setIsLoading(true);

    try {
      const userContext = getUserContext();
      const uiContextPrompt = formatUserContextForPrompt(userContext);
      
      // Fetch platform-wide data context
      const platformData = await aiContextBuilder.getFullContext();
      const platformPrompt = aiContextBuilder.formatForPrompt(platformData);

      const sessionHistory = sessions[targetId]?.messages || [];
      const historyForService = sessionHistory.map(m => ({
          role: m.role,
          content: m.content
      }));

      const responseText = await aiChatService.sendMessage(content, uiContextPrompt, platformPrompt, historyForService);


      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => ({
          ...prev,
          [targetId]: {
              ...prev[targetId],
              messages: [...(prev[targetId]?.messages || []), aiMsg],
              lastUpdated: new Date().toISOString()
          }
      }));
      
      if (!isOpen) {
        setHasNewMessage(true);
      }

    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ Connection error. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setSessions(prev => ({
          ...prev,
          [targetId]: {
              ...prev[targetId],
              messages: [...(prev[targetId]?.messages || []), errorMsg],
              lastUpdated: new Date().toISOString()
          }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
        setHasNewMessage(false);
    }
  };

  return {
    isOpen,
    toggleChat,
    messages: currentMessages,
    sessions: Object.values(sessions).sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)),
    activeSessionId,
    isLoading,
    sendMessage,
    hasNewMessage,
    startNewChat,
    deleteSession,
    switchSession,
    clearChat: () => deleteSession(activeSessionId)
  };
};
