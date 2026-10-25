import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  User,
  Eye,
  EyeOff,
  Ear,
  Hand,
  Brain,
  Settings2,
  Check
} from 'lucide-react';

export type AccessibilityMode = 'standard' | 'blind' | 'deaf' | 'low-vision' | 'motor' | 'cognitive';

interface AccessibilityPickerProps {
  onComplete: (modes: AccessibilityMode[]) => void;
}

const modes = [
  { id: 'standard', icon: User, label: 'Standard (no disability)', color: 'bg-blue-500' },
  { id: 'blind', icon: EyeOff, label: 'I am blind / very low vision', color: 'bg-purple-500' },
  { id: 'deaf', icon: Ear, label: 'I am deaf / hard of hearing', color: 'bg-orange-500' },
  { id: 'low-vision', icon: Eye, label: 'I have low vision', color: 'bg-yellow-500' },
  { id: 'motor', icon: Hand, label: 'I have a motor disability', color: 'bg-green-500' },
  { id: 'cognitive', icon: Brain, label: 'I have a cognitive disability', color: 'bg-pink-500' },
];

const AccessibilityPicker: React.FC<AccessibilityPickerProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [selectedModes, setSelectedModes] = useState<AccessibilityMode[]>(['standard']);

  const toggleMode = (id: AccessibilityMode) => {
    if (id === 'standard') {
      setSelectedModes(['standard']);
      return;
    }

    setSelectedModes(prev => {
      const filtered = prev.filter(m => m !== 'standard');
      if (filtered.includes(id)) {
        const next = filtered.filter(m => m !== id);
        return next.length === 0 ? ['standard'] : next;
      }
      return [...filtered, id];
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings2 className="text-sunrise-gold" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Personalize your experience</h1>
          <p className="text-slate-400">Do you need the app to work differently for you?</p>
        </motion.div>

        <div className="space-y-3">
          {modes.map((mode, index) => {
            const isSelected = selectedModes.includes(mode.id as AccessibilityMode);
            const Icon = mode.icon;

            return (
              <motion.button
                key={mode.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleMode(mode.id as AccessibilityMode)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-white/10 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                    : 'bg-white/5 border-white/10 grayscale opacity-70 hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mode.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="flex-1 text-left font-medium">{mode.label}</span>
                {isSelected && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => onComplete(selectedModes)}
          className="mt-10 w-full py-4 bg-teal-500 hover:bg-teal-400 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default AccessibilityPicker;
