import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccessibilityMode = 'standard' | 'blind' | 'deaf' | 'low-vision' | 'motor' | 'cognitive';

interface AccessibilityContextType {
  modes: AccessibilityMode[];
  setModes: (modes: AccessibilityMode[]) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;
  isReading: boolean;
  setIsReading: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modes, setModes] = useState<AccessibilityMode[]>(['standard']);
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    // Apply text size to root
    document.documentElement.style.fontSize = `${textSize}px`;

    // Apply themes
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (modes.includes('low-vision')) {
      document.documentElement.classList.add('mode-low-vision');
    } else {
      document.documentElement.classList.remove('mode-low-vision');
    }
  }, [textSize, highContrast, modes]);

  return (
    <AccessibilityContext.Provider value={{
      modes, setModes, textSize, setTextSize,
      highContrast, setHighContrast,
      reducedMotion, setReducedMotion,
      lowDataMode, setLowDataMode,
      isReading, setIsReading
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
