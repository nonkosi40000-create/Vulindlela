import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface SASLPanelProps {
  videoUrl?: string; // URL to the specific SASL translation for the current content
}

const SASLPanel: React.FC<SASLPanelProps> = ({ videoUrl }) => {
  const { modes } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!modes.includes('deaf')) return null;

  return (
    <div className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ${isExpanded ? 'w-64 h-96' : 'w-32 h-48'}`}>
      <div className="relative w-full h-full bg-slate-800 border-2 border-teal-500 rounded-2xl overflow-hidden shadow-2xl">
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-teal-400 font-bold text-xs">SASL</span>
            </div>
            <p className="text-[10px] text-slate-400">Sign Language Interpreter Placeholder</p>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 p-1 bg-slate-900/60 rounded-lg text-white hover:bg-slate-900"
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default SASLPanel;
