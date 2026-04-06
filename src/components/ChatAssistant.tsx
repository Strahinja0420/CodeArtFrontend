import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { experienceService } from '../api/experience.service';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatAssistantProps {
  experienceId: string;
  isOpen: boolean;
  onClose: () => void;
  experienceTitle: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ experienceId, isOpen, onClose, experienceTitle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI guide for ${experienceTitle}. Do you have any questions about this artifact?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await experienceService.sendChatMessage(experienceId, updatedMessages.filter(m => m.role !== 'system'));
      // The frontend uses an axios interceptor that automatically returns response.data
      if (response && response.data) {
        setMessages((prev) => [...prev, response.data]);
      } else {
        throw new Error('Invalid format');
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[400px] h-[500px] sm:h-[600px] max-h-[80vh] z-50 glass rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-fg/10"
        >
          {/* Header */}
          <div className="bg-accent/10 border-b border-fg/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Tour Guide</h3>
                <p className="text-xs text-fg/40 tracking-wider uppercase">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-fg/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-fg/5 text-fg rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-fg/5 text-fg rounded-2xl rounded-bl-sm p-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-accent" />
                  <span className="text-xs text-fg/60">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-fg/5 bg-background/50">
            <div className="flex items-center gap-2 bg-fg/5 rounded-full p-1 pl-4 pr-1">
              <input
                type="text"
                placeholder="Ask about the artifact..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white disabled:opacity-50 hover:bg-accent/90 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatAssistant;
