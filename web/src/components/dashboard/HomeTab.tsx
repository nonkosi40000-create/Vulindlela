import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Filter,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import OpportunityCard from '../opportunities/OpportunityCard';
import axios from 'axios';

interface HomeTabProps {
  user: any;
  onSeeAll: () => void;
  onViewOpp: (id: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ user, onSeeAll, onViewOpp }) => {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Mock recommendations for home screen
    setRecommendations([
      {
        id: '1',
        title: "Retail Learnership",
        location: "Mall of Africa, Midrand",
        stipend: 4500,
        estimatedTaxi: 450,
        shield: 'GREEN',
        type: 'LEARNERSHIP'
      },
      {
        id: '2',
        title: "Community Garden Help",
        location: "Thohoyandou, LP",
        stipend: 250,
        estimatedTaxi: 40,
        shield: 'YELLOW',
        type: 'MICRO_INTERNSHIP'
      }
    ]);
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Top Bar */}
      <header className="px-6 pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sunrise-gold">
            VULINDLELA
          </h1>
          <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
            Clear the Path
          </p>
        </div>
        <button className="p-2 bg-white/5 rounded-full relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-coral-500 rounded-full border-2 border-slate-900" />
        </button>
      </header>

      {/* Hero Greeting */}
      <section className="px-6 space-y-1">
        <h2 className="text-3xl font-bold">Sawubona, {user?.mobile || 'Leader'}!</h2>
        <p className="text-slate-400">Your profile matches 12 new opportunities.</p>
      </section>

      {/* Quick Search */}
      <div className="px-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder={t('dashboard.search_placeholder')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-teal-500 transition-all"
          />
        </div>
        <button className="p-3 bg-white/5 border border-white/10 rounded-2xl">
          <Filter size={24} />
        </button>
      </div>

      {/* Stats / Trending */}
      <section className="px-6">
        <div className="bg-gradient-to-br from-teal-500/10 to-teal-900/10 border border-teal-500/20 rounded-3xl p-5 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <div className="text-xl font-bold">R12,500</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Potential Earnings</div>
            </div>
          </div>
          <ArrowRight className="text-slate-600" />
        </div>
      </section>

      {/* Recommendations */}
      <section className="px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-sunrise-gold" />
            {t('dashboard.recommended')}
          </h3>
          <button onClick={onSeeAll} className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {t('dashboard.see_all')}
          </button>
        </div>

        <div className="grid gap-4">
          {recommendations.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              fitScore={{
                score: 85,
                explanation: "Matches your retail interest and location.",
                bridge: null
              }}
              onClick={() => onViewOpp(opp.id)}
            />
          ))}
        </div>
      </section>

      {/* Bridge Card */}
      <section className="px-6">
        <div className="bg-coral-500/10 border border-coral-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h3 className="text-lg font-bold text-coral-400 italic">Close the gap</h3>
            <p className="text-sm text-slate-300">You're a "near-miss" for a Logistics role. Take this 1-day course to qualify.</p>
            <button className="bg-coral-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-coral-500/20 flex items-center gap-2">
              Start Now <ArrowRight size={16} />
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Briefcase size={120} className="text-coral-400" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeTab;
