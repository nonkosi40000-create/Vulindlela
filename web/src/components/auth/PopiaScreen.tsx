import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Volume2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PopiaScreenProps {
  onAccept: (consents: { processing: boolean; employerShare: boolean; alerts: boolean }) => void;
}

const PopiaScreen: React.FC<PopiaScreenProps> = ({ onAccept }) => {
  const { t, i18n } = useTranslation();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [consents, setConsents] = useState({
    processing: false,
    employerShare: false,
    alerts: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const speak = () => {
    const text = document.getElementById('popia-content')?.innerText || '';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language;
    window.speechSynthesis.speak(utterance);
  };

  const isComplete = consents.processing && hasScrolledToBottom;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-coral-900 text-white overflow-hidden flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="text-sunrise-gold w-8 h-8" />
          <h1 className="text-xl font-bold">{t('popia.title')}</h1>
        </div>
        <button
          onClick={speak}
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          aria-label={t('popia.read_aloud')}
        >
          <Volume2 size={24} />
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        id="popia-content"
        className="flex-1 overflow-y-auto p-6 space-y-8 pb-32"
      >
        <p className="text-lg leading-relaxed text-teal-100">{t('popia.intro')}</p>

        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <section key={num} className="space-y-2">
            <h2 className="text-sunrise-gold font-bold text-lg">
              {t(`popia.section_${num}_title`, { defaultValue: t(`popia.${getSectionKey(num)}.title`) })}
            </h2>
            <p className="text-slate-200 leading-relaxed">
              {t(`popia.section_${num}_content`, { defaultValue: t(`popia.${getSectionKey(num)}.content`) })}
            </p>
          </section>
        ))}

        {!hasScrolledToBottom && (
          <div className="flex items-center gap-2 p-4 bg-sunrise-gold/20 text-sunrise-gold rounded-lg border border-sunrise-gold/30">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">Please scroll to the bottom to continue.</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-md border-t border-white/10 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 w-6 h-6 rounded border-white/30 bg-white/5 text-teal-500 focus:ring-teal-500"
            checked={consents.processing}
            onChange={(e) => setConsents({ ...consents, processing: e.target.checked })}
          />
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
            {t('popia.consent_processing')}
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 w-6 h-6 rounded border-white/30 bg-white/5 text-teal-500 focus:ring-teal-500"
            checked={consents.employerShare}
            onChange={(e) => setConsents({ ...consents, employerShare: e.target.checked })}
          />
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
            {t('popia.consent_employer')}
          </span>
        </label>

        <button
          disabled={!isComplete}
          onClick={() => onAccept(consents)}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
            isComplete
              ? 'bg-teal-500 text-white hover:bg-teal-400'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {t('popia.accept_button')}
        </button>
      </div>
    </div>
  );
};

const getSectionKey = (num: number) => {
  const keys = ['who_we_are', 'what_we_collect', 'why_we_collect', 'who_sees_it', 'protection', 'rights', 'under_18', 'camera'];
  return keys[num - 1];
};

export default PopiaScreen;
