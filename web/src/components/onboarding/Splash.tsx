import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-coral-900 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-sunrise-gold blur-3xl opacity-20 rounded-full animate-pulse" />
        <Shield size={120} className="text-sunrise-gold relative z-10" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <h1 className="text-5xl font-black tracking-tighter mb-2">VULINDLELA</h1>
        <p className="text-teal-200 text-lg font-medium tracking-widest uppercase opacity-80">
          Clear the Path
        </p>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              className="w-2 h-2 bg-sunrise-gold rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Splash;
