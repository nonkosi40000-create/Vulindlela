import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  MapPin,
  Clock,
  CircleDollarSign,
  Bus,
  Info,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Flag,
  Send
} from 'lucide-react';
import axios from 'axios';
import { useAccessibility } from '../../context/AccessibilityContext';

interface OpportunityDetailProps {
  oppId: string;
  onBack: () => void;
}

const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ oppId, onBack }) => {
  const { t, i18n } = useTranslation();
  const { isReading, setIsReading } = useAccessibility();
  const [opp, setOpp] = useState<any>(null);
  const [fitScore, setFitScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be separate calls or one join
        const [oppRes, scoreRes] = await Promise.all([
          axios.get(`/api/opportunities/${oppId}`),
          axios.post(`/api/opportunities/${oppId}/fit-score`)
        ]);
        setOpp(oppRes.data);
        setFitScore(scoreRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [oppId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await axios.post(`/api/opportunities/${oppId}/apply`);
      setApplied(true);
    } catch (err) {
      alert("Application failed. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleReadAloud = () => {
    const text = `
      Position: ${opp.title}.
      Location: ${opp.location}.
      Stipend: ${opp.stipend} Rand.
      Estimated taxi cost: ${opp.estimatedTaxi} Rand.
      Why this matches you: ${fitScore?.explanation}.
      Job Description: ${opp.description}
    `;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-32">
      <div className="relative h-64 bg-gradient-to-br from-teal-600 to-coral-600 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        <button
          onClick={onBack}
          className="absolute top-12 left-6 p-3 bg-slate-900/60 rounded-full text-white backdrop-blur-md z-10"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleReadAloud}
          className="absolute top-12 right-6 p-3 bg-teal-500 rounded-full text-white shadow-lg z-10 animate-bounce"
        >
          <Volume2 size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${
            opp.shield === 'GREEN' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            <Shield size={14} />
            {t(`opp.${opp.shield.toLowerCase()}`)}
          </div>
          <h1 className="text-3xl font-black leading-tight">{opp.title}</h1>
          <div className="flex items-center gap-2 text-slate-200 mt-2 text-sm font-medium">
            <MapPin size={16} className="text-teal-400" />
            {opp.location}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20 space-y-6">
        {/* Fit Score Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-800 border border-white/10 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">{t('opp.fit_score')}</h3>
            <div className="text-2xl font-black text-sunrise-gold">{fitScore?.score}%</div>
          </div>
          <p className="text-teal-100 text-lg italic leading-relaxed">
            "{fitScore?.explanation}"
          </p>
          {fitScore?.bridge && (
            <div className="mt-4 p-4 bg-coral-500/10 border border-coral-500/20 rounded-2xl flex items-start gap-3">
              <Info className="text-coral-400 shrink-0 mt-1" size={18} />
              <div>
                <div className="text-xs font-bold text-coral-400 uppercase">{t('opp.near_miss')}</div>
                <p className="text-sm text-slate-300">{fitScore.bridge}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
            <CircleDollarSign className="text-teal-400 mb-2" />
            <div className="text-xs text-slate-500 font-bold uppercase">{t('opp.stipend')}</div>
            <div className="text-xl font-bold">R{opp.stipend}</div>
            <div className="text-[10px] text-slate-500">per month</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
            <Bus className="text-coral-400 mb-2" />
            <div className="text-xs text-slate-500 font-bold uppercase">{t('opp.taxi_fare')}</div>
            <div className="text-xl font-bold">R{opp.estimatedTaxi}</div>
            <div className="text-[10px] text-slate-500">est. daily return</div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Job Description</h3>
          <p className="text-slate-300 leading-relaxed">
            {opp.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Requirements</h3>
          <ul className="grid gap-3">
            {opp.requirements.map((req: string, i: number) => (
              <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <CheckCircle2 className="text-teal-500" size={18} />
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Warning */}
        <div className="bg-coral-500/5 border border-coral-500/10 rounded-3xl p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-coral-500/20 rounded-full flex items-center justify-center text-coral-400">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-coral-400 uppercase text-xs tracking-widest">Vulindlela Shield Security</h4>
            <p className="text-xs text-slate-400">Never pay for a job application. Vulindlela is 100% free.</p>
          </div>
          <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
            <Flag size={14} />
            {t('opp.flag_suspicious')}
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex gap-4 z-40">
        <button
          onClick={handleApply}
          disabled={applied || applying}
          className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
            applied
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-teal-500 text-white hover:bg-teal-400'
          }`}
        >
          {applying ? 'Sending...' : applied ? t('opp.applied') : t('opp.apply')}
        </button>
      </div>
    </div>
  );
};

export default OpportunityDetail;
