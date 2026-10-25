import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'zu', name: 'isiZulu', native: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', native: 'isiXhosa' },
  { code: 've', name: 'Tshivenda', native: 'Tshivenda' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
];

interface LanguagePickerProps {
  onSelect: () => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ onSelect }) => {
  const { i18n, t } = useTranslation();

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onSelect();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Languages className="text-teal-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Choose your language</h1>
          <p className="text-slate-400">Khetha ulimi lwakho / Khetha luambo lwanu</p>
        </motion.div>

        <div className="grid gap-4">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(lang.code)}
              className="group relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-teal-500/50 transition-all text-left"
            >
              <div>
                <div className="text-lg font-bold group-hover:text-teal-400 transition-colors">
                  {lang.native}
                </div>
                <div className="text-sm text-slate-500">{lang.name}</div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white/20 group-hover:border-teal-500 flex items-center justify-center transition-all">
                {i18n.language === lang.code && (
                  <div className="w-4 h-4 bg-teal-500 rounded-full" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagePicker;
