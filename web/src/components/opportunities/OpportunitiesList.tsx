import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, Briefcase, MapPin, Star } from 'lucide-react';
import OpportunityCard from './OpportunityCard';
import axios from 'axios';

interface OpportunitiesListProps {
  onBack: () => void;
  onViewOpp: (id: string) => void;
}

const OpportunitiesList: React.FC<OpportunitiesListProps> = ({ onBack, onViewOpp }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/opportunities', {
          params: { type: filter !== 'ALL' ? filter : undefined }
        });
        setOpportunities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, [filter]);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-20 space-y-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{t('nav.jobs')}</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder={t('dashboard.search_placeholder')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-teal-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'LEARNERSHIP', 'MICRO_INTERNSHIP', 'INFORMAL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === type
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="p-6 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {opportunities
              .filter(o => o.title.toLowerCase().includes(search.toLowerCase()))
              .map((opp, idx) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <OpportunityCard
                    opportunity={opp}
                    fitScore={{ score: 85, explanation: "Matches your profile.", bridge: null }}
                    onClick={() => onViewOpp(opp.id)}
                  />
                </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesList;
