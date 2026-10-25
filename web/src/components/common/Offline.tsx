import React from 'react';
import { WifiOff, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Offline: React.FC = () => {
  const handleRetry = () => window.location.reload();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-coral-500/20 rounded-full flex items-center justify-center mb-8"
      >
        <WifiOff size={48} className="text-coral-400" />
      </motion.div>

      <h1 className="text-2xl font-bold mb-4">No Internet Connection</h1>
      <p className="text-slate-400 mb-8 max-w-xs">
        Vulindlela needs a connection to find new opportunities. We'll show you your saved jobs once you're back online.
      </p>

      <button
        onClick={handleRetry}
        className="w-full max-w-xs py-4 bg-teal-500 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
      >
        <RefreshCw size={20} />
        Try Again
      </button>

      <div className="mt-12 flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
        <Smartphone size={16} />
        Vulindlela Shield Active
      </div>
    </div>
  );
};

export default Offline;
