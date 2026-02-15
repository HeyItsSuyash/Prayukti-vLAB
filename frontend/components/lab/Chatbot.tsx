"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, MessageSquare, Bot, User, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

interface ChatbotProps {
  subject?: string; // e.g., "CN", "DBMS"
  labTitle?: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

// MOCK_KNOWLEDGE removed in favor of API integration

export function Chatbot({ subject = "General", labTitle }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: `Hi! I'm your ${subject} Lab Assistant. I can help you with "${labTitle || "this experiment"}". Ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initial popup effect delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Logic to show popup if needed, currently it renders immediately
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, subject }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.response || (data.details ? `${data.error}: ${JSON.stringify(data.details)}` : data.error) || "Sorry, I encountered an error.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Sorry, I'm having trouble connecting to the server.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 cursor-pointer group"
            onClick={() => { setIsOpen(true); setHasInteracted(true); }}
          >
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white px-4 py-3 rounded-2xl rounded-tr-none shadow-xl border-2 border-slate-100 max-w-[200px]"
            >
              <p className="text-sm font-bold text-black">Hi, how can I help you Today!</p>
            </motion.div>

            {/* Robot Icon */}
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-transform group-hover:scale-110 relative overflow-hidden">
              {/* Simple CSS Robot Face Placeholder since we don't have the image asset */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800"></div>
              <div className="relative z-10 flex flex-col items-center mt-1">
                <div className="flex gap-2 mb-1">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div className="w-6 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm">Lab Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">{subject} Module</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-slate-200 rounded-full">
                <X size={20} />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                      }`}
                  >
                    {msg.role === "bot" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-black underline decoration-blue-500/30 decoration-2 underline-offset-2">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="mb-0">{children}</li>,
                          h1: ({ children }) => <h1 className="text-base font-bold mb-2 border-b border-slate-100 pb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-black transition-colors font-medium text-sm"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 bottom-1 w-9 h-9 rounded-lg bg-black text-white hover:bg-slate-800"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send size={16} />
                </Button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Powered Assistant</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
