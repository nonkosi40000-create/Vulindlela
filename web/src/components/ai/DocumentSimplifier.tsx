import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ArrowLeft, Loader2, Info } from 'lucide-react';
import axios from 'axios';

const DocumentSimplifier: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { i18n } = useTranslation();
  const [text, setText] = useState('');
  const [simplified, setSimplified] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimplify = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/vula/simplify', {
        text,
        language: i18n.language
      });
      setSimplified(res.data.simplifiedText);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-32">
      <header className="p-6 border-b border-white/10 flex items-center gap-4 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Document Simplifier</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="bg-teal-500/10 border border-teal-500/20 p-5 rounded-3xl flex items-start gap-4">
          <Info className="text-teal-400 shrink-0" size={24} />
          <p className="text-xs text-teal-100 leading-relaxed">
            Paste parts of your contract, offer letter, or learnership terms below. Vula will explain them in simple words you can trust.
          </p>
        </div>

        {!simplified ? (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the difficult text here..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-teal-500 outline-none transition-all text-sm"
            />
            <button
              onClick={handleSimplify}
              disabled={!text || loading}
              className="w-full py-4 bg-teal-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} /> Simplify Now</>}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Vula's Explanation</h3>
              <p className="text-lg leading-relaxed text-slate-200">{simplified}</p>
            </div>
            <button
              onClick={() => setSimplified('')}
              className="w-full py-4 bg-white/10 rounded-2xl font-bold text-sm"
            >
              Simplify another document
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DocumentSimplifier;
