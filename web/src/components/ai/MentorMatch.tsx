import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, MessageCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

const MentorMatch: React.FC = () => {
  const { t } = useTranslation();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const findMentor = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/vula/mentor-match');
      setMatch(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Find a Mentor</h2>
        <p className="text-slate-400">Connect with experienced professionals who can guide your career path.</p>
      </div>

      {!match && !loading && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-teal-500/10 to-coral-500/10 border border-white/10 rounded-3xl p-8 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Users className="text-teal-400" size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Ready to meet your match?</h3>
            <p className="text-sm text-slate-400">Our AI will analyze your skills and goals to find the perfect mentor for you.</p>
          </div>
          <button
            onClick={findMentor}
            className="w-full py-4 bg-teal-500 rounded-2xl font-bold text-lg shadow-lg hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} /> Match Me with a Mentor
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
          <p className="text-slate-400 animate-pulse">Vula is finding the best mentor for you...</p>
        </div>
      )}

      <AnimatePresence>
        {match && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-coral-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {match.mentorName?.[0] || 'M'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{match.mentorName || "Senior Professional"}</h3>
                  <div className="flex items-center gap-1 text-sunrise-gold text-sm font-bold">
                    <Star size={14} fill="currentColor" />
                    98% Compatibility
                  </div>
                </div>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Why this match?</h4>
                <p className="text-sm text-teal-100 italic">"{match.reason}"</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400">Suggested Icebreaker:</h4>
                <div className="bg-slate-800 p-4 rounded-2xl border border-white/5 text-sm leading-relaxed">
                  {match.icebreaker}
                </div>
              </div>

              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                <MessageCircle size={20} /> Start Conversation
              </button>
            </div>

            <button
              onClick={() => setMatch(null)}
              className="w-full py-3 text-slate-500 text-sm font-medium hover:text-white transition-colors"
            >
              Show more mentors
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorMatch;
