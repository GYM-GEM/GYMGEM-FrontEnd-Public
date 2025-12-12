import React, { useState, useRef, useEffect } from "react";
import { Send, User, ShieldCheck, Paperclip, X, Image as ImageIcon, FileText } from "lucide-react";

/**
 * ChatBox Component
 * Handles live messaging display and input with file attachments.
 */
const ChatBox = ({ messages, currentUserId, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim() || attachment) {
            onSendMessage(newMessage, attachment);
            setNewMessage("");
            setAttachment(null);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAttachment({
                    name: file.name,
                    type: file.type.startsWith("image/") ? "image" : "file",
                    url: e.target.result // Base64 for preview/mock
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = null;
    };

    return (
        <div className="flex flex-col h-[600px] w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
                <h3 className="font-bebas text-xl tracking-wide text-foreground">Live Chat</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dots-pattern">
                {messages.map((msg) => {
                    const isMe = msg.userId === currentUserId;
                    const isSystem = msg.type === "system";

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <span className="bg-muted px-4 py-1 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
                                    {msg.text}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={msg.id}
                            className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex max-w-[80%] flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                                    {msg.role === "trainer" && <ShieldCheck className="w-3 h-3 text-[#ff8211]" />}
                                    <span className="font-semibold">{msg.sender}</span>
                                    <span>{msg.time}</span>
                                </div>
                                <div
                                    className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                            ? "bg-[#ff8211] text-white rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                        }`}
                                >
                                    {/* Image Attachment */}
                                    {msg.attachment && msg.attachment.type === "image" && (
                                        <div className="mb-2 rounded-lg overflow-hidden max-w-[200px] border border-white/20">
                                            <img src={msg.attachment.url} alt="attachment" className="w-full h-auto object-cover" />
                                        </div>
                                    )}

                                    {/* File Attachment */}
                                    {msg.attachment && msg.attachment.type !== "image" && (
                                        <div className="mb-2 flex items-center gap-2 bg-black/10 p-2 rounded-lg max-w-[200px]">
                                            <FileText className="w-4 h-4" />
                                            <span className="truncate text-xs underline cursor-pointer">{msg.attachment.name}</span>
                                        </div>
                                    )}

                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t border-border flex gap-3 items-end">
                {/* Attachment Preview (Mini) */}
                {attachment && (
                    <div className="absolute bottom-20 left-6 bg-background border border-border p-2 rounded-xl shadow-lg animate-in slide-in-from-bottom-2 fade-in z-10">
                        <button
                            onClick={() => setAttachment(null)}
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        {attachment.type === "image" ? (
                            <img src={attachment.url} alt="preview" className="h-16 w-16 object-cover rounded-lg" />
                        ) : (
                            <div className="h-16 w-16 flex flex-col items-center justify-center bg-muted rounded-lg text-xs p-1 text-center">
                                <FileText className="w-6 h-6 mb-1" />
                                <span className="truncate w-full">{attachment.name}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Hidden Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-1 p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-[#ff8211] transition-colors"
                    title="Attach file"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background border border-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8211]/50 placeholder:text-muted-foreground"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() && !attachment}
                    className="bg-[#ff8211] text-white p-2.5 rounded-xl hover:bg-[#e06900] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
