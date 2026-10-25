import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AIProfileBuilderProps {
  onComplete: () => void;
}

const AIProfileBuilder: React.FC<AIProfileBuilderProps> = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Sawubona! I'm Vula, your guide. I'm here to help you build your profile without a boring CV. To start, what's your full name?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/vula/profile-chat', {
        message: input,
        history: messages
      });

      const modelText = res.data.text;

      // Clean up the JSON block from display if present
      const displayText = modelText.split('{PROFILE_DATA}')[0].trim();

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: displayText }] }]);

      if (modelText.includes('"isComplete":true')) {
        setTimeout(onComplete, 3000);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm having a little trouble connecting. Can you try saying that again?" }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-sunrise-gold rounded-full flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold">Chat with Vula</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Building your profile...</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-teal-600' : 'bg-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-500 text-white rounded-tr-none'
                    : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <Loader2 size={16} className="animate-spin text-teal-400" />
                <span className="text-xs text-slate-400">Vula is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-slate-900 border-t border-white/10">
        <form onSubmit={handleSend} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center hover:bg-teal-400 disabled:bg-slate-700 transition-all"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          Vula is an AI and can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AIProfileBuilder;
