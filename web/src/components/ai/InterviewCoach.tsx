import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Bot, User, Sparkles, MessageSquare, PlayCircle } from 'lucide-react';
import axios from 'axios';

const InterviewCoach: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startCoach = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/vula/profile-chat', {
        message: "Start a mock interview for a retail position.",
        history: []
      });
      setMessages([{ role: 'model', text: res.data.text }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) startCoach();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/vula/profile-chat', {
        message: text,
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });
      setMessages(prev => [...prev, { role: 'model', text: res.data.text }]);

      // Auto-read the feedback if in voice mode
      if (isRecording) {
        const utterance = new SpeechSynthesisUtterance(res.data.text);
        utterance.lang = i18n.language;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = i18n.language;
      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        handleSend(speechToText);
        setIsRecording(false);
      };
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Interview Coach</h2>
            <p className="text-xs text-slate-400">Practising for: Retail Assistant</p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Sparkles size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              msg.role === 'user'
                ? 'bg-teal-500 text-white rounded-tr-none'
                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && <div className="text-xs text-slate-500 animate-pulse">Vula is listening...</div>}
      </div>

      <div className="p-6 bg-slate-900 border-t border-white/10 space-y-4">
        <div className="flex gap-3">
          <button
            onClick={toggleVoice}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isRecording ? 'bg-coral-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-teal-500 outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              className="absolute right-2 top-2 w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
          {isRecording ? "Listening to you..." : "Tap the mic to speak your answer"}
        </p>
      </div>
    </div>
  );
};

export default InterviewCoach;
