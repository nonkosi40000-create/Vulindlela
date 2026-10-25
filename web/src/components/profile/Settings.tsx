import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Type,
  Moon,
  Languages,
  Zap,
  Bell,
  Shield,
  Accessibility,
  ChevronRight
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface SettingsProps {
  onBack: () => void;
  onNavigate: (step: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const {
    textSize, setTextSize,
    highContrast, setHighContrast,
    lowDataMode, setLowDataMode,
    reducedMotion, setReducedMotion
  } = useAccessibility();

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <header className="p-6 border-b border-white/10 flex items-center gap-4 sticky top-0 bg-slate-900/80 backdrop-blur-lg z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Appearance Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Appearance</h3>
          <div className="space-y-2">
            <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type className="text-teal-400" size={20} />
                  <span className="font-medium">Text Size</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTextSize(Math.max(12, textSize - 2))} className="w-8 h-8 bg-white/10 rounded-lg">-</button>
                  <span className="font-bold">{textSize}px</span>
                  <button onClick={() => setTextSize(Math.min(24, textSize + 2))} className="w-8 h-8 bg-white/10 rounded-lg">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="text-purple-400" size={20} />
                  <span className="font-medium">High Contrast Theme</span>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-teal-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${highContrast ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Data & Performance */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data & Performance</h3>
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-sunrise-gold" size={20} />
                <div className="text-left">
                  <div className="font-medium">Low Data Mode</div>
                  <div className="text-[10px] text-slate-500">Compresses images and stops video</div>
                </div>
              </div>
              <button
                onClick={() => setLowDataMode(!lowDataMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${lowDataMode ? 'bg-teal-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${lowDataMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* System Navigation */}
        <section className="grid gap-2">
          <button
            onClick={() => onNavigate('accessibility')}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10"
          >
            <div className="flex items-center gap-3 text-sm">
              <Accessibility size={18} className="text-teal-400" />
              Change Accessibility Mode
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </button>

          <button
            onClick={() => onNavigate('language')}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10"
          >
            <div className="flex items-center gap-3 text-sm">
              <Languages size={18} className="text-slate-400" />
              Change Language ({i18n.language.toUpperCase()})
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
