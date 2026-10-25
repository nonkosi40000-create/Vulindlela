import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';

interface HelpProps {
  onBack: () => void;
}

const Help: React.FC<HelpProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const faqs = [
    { q: "Is Vulindlela really free?", a: "Yes, it is 100% free for job seekers. We never ask for money." },
    { q: "How does the Fit Score work?", a: "It uses AI to compare your skills and location with the job requirements and taxi costs." },
    { q: "What is the Green Shield?", a: "It means the employer has been verified through CIPC and SETA checks." },
    { q: "What if I see a scam?", a: "Use the 'Flag as Suspicious' button on any listing immediately." }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <header className="p-6 border-b border-white/10 flex items-center gap-4 sticky top-0 bg-slate-900/80 backdrop-blur-lg z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Help & Support</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Contact Options */}
        <section className="grid grid-cols-2 gap-4">
          <button className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center space-y-2 hover:bg-white/10 transition-all">
            <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto text-teal-400">
              <MessageCircle size={20} />
            </div>
            <div className="font-bold text-sm">WhatsApp</div>
          </button>
          <button className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center space-y-2 hover:bg-white/10 transition-all">
            <div className="w-10 h-10 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto text-coral-400">
              <Phone size={20} />
            </div>
            <div className="font-bold text-sm">Call Center</div>
          </button>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronRight size={16} className="text-slate-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Support Email */}
        <section className="bg-teal-500/10 border border-teal-500/20 rounded-3xl p-6 flex items-center gap-4">
          <Mail className="text-teal-400" size={24} />
          <div>
            <div className="text-sm font-bold">Still need help?</div>
            <div className="text-xs text-slate-400">support@vulindlela.org.za</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
