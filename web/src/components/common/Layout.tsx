import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { reducedMotion, highContrast } = useAccessibility();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      highContrast ? 'bg-black text-white' : 'bg-slate-900 text-white'
    }`}>
      {/* Mesmerizing Background Gradient */}
      {!highContrast && !reducedMotion && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-coral-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Main Content Activity */}
      <motion.main
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative z-10 flex-1 flex flex-col"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
