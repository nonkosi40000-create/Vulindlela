import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, MapPin, ArrowRight, X } from 'lucide-react';

interface WelcomeTourProps {
  onComplete: () => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Vulindlela",
      desc: "Clear the path to your future. We turn what you CAN do into a credible profile.",
      icon: Sparkles,
      color: "text-teal-400"
    },
    {
      title: "The Vulindlela Shield",
      desc: "Stay safe from scams. We verify employers so you can apply with confidence.",
      icon: Shield,
      color: "text-coral-400"
    },
    {
      title: "Know the Cost",
      desc: "We estimate taxi fares for every job. Never spend more on travel than you earn.",
      icon: MapPin,
      color: "text-sunrise-gold"
    }
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8">
      <button
        onClick={onComplete}
        className="absolute top-12 right-6 p-2 text-slate-500 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="max-w-md w-full text-center space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="space-y-8"
          >
            <div className={`w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto ${steps[currentStep].color}`}>
              <StepIcon size={48} />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black italic">{steps[currentStep].title}</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                {steps[currentStep].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentStep ? 'w-8 bg-teal-500' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            {currentStep === steps.length - 1 ? "Let's Start" : "Next"} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour;
