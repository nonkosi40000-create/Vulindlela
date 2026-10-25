import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlusCircle, Briefcase, Users, ShieldCheck, BarChart3, Clock } from 'lucide-react';

const EmployerPortal: React.FC = () => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold">Employer Portal</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
              {isVerified ? 'CIPC Verified' : 'Verification Pending'}
            </span>
          </div>
        </div>
        <button className="bg-teal-500 p-2 rounded-xl text-white">
          <PlusCircle size={24} />
        </button>
      </header>

      <main className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <Users className="text-teal-400 mb-2" size={20} />
            <div className="text-2xl font-black">24</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Active Applications</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <BarChart3 className="text-sunrise-gold mb-2" size={20} />
            <div className="text-2xl font-black">1.2k</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Listing Views</div>
          </div>
        </div>

        {/* Premium Upgrade Teaser */}
        {!isVerified && (
          <div className="bg-gradient-to-r from-teal-500/20 to-sunrise-gold/20 border border-teal-500/30 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h3 className="font-bold text-teal-400 flex items-center gap-2">
                <ShieldCheck size={18} /> Get the Green Shield
              </h3>
              <p className="text-xs text-slate-300">Verify your company with CIPC to build trust with top candidates.</p>
              <button className="mt-2 text-xs font-bold bg-white text-slate-900 px-3 py-2 rounded-lg">
                Submit Documents
              </button>
            </div>
            <ShieldCheck size={80} className="absolute -right-4 -bottom-4 text-white/5" />
          </div>
        )}

        {/* Active Listings */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Listings</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-teal-400">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="font-bold">Retail Assistant</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> Posted 3 days ago
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-teal-400 font-bold">12 apps</div>
                  <div className="text-[10px] text-slate-500">8 new</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Tier Placeholder */}
        <section className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-4 opacity-60">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <PlusCircle className="text-slate-500" size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold">Advanced Hiring Suite</h4>
            <p className="text-xs text-slate-500">AI screening, bulk messaging, and performance analytics.</p>
          </div>
          <button className="text-xs font-bold text-teal-400 uppercase tracking-widest" disabled>
            Coming Soon
          </button>
        </section>
      </main>
    </div>
  );
};

export default EmployerPortal;
