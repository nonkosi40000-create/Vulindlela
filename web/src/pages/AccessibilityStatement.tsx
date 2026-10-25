import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Accessibility, CheckCircle2, ShieldCheck } from 'lucide-react';

const AccessibilityStatement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <header className="p-6 border-b border-white/10 flex items-center gap-4 sticky top-0 bg-slate-900/80 backdrop-blur-lg z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('accessibility.title')}</h1>
      </header>

      <div className="p-6 space-y-8">
        <section className="space-y-4">
          <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
            <Accessibility size={32} />
          </div>
          <h2 className="text-2xl font-bold">Our Commitment</h2>
          <p className="text-slate-400 leading-relaxed">
            Vulindlela is built to be inclusive. We target **WCAG 2.2 Level AA** to ensure that all young South Africans, regardless of ability, can clear their path to employment.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Features</h3>
          <div className="grid gap-3">
            {[
              { title: "Screen Reader First", desc: "Full ARIA support for TalkBack and VoiceOver." },
              { title: "Gesture Navigation", desc: "Hands-free control using MediaPipe AI." },
              { title: "Reading Band", desc: "Focused high-contrast band for low vision." },
              { title: "Sign Language", desc: "SASL video panels for deaf users." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="text-teal-500 shrink-0" size={20} />
                <div>
                  <div className="font-bold text-sm">{feature.title}</div>
                  <div className="text-xs text-slate-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 bg-teal-500/10 border border-teal-500/20 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck size={20} />
            <span className="font-bold text-sm">Feedback</span>
          </div>
          <p className="text-xs text-slate-300">
            If you encounter any accessibility barriers, please contact our Information Officer at **access@vulindlela.org.za**.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
