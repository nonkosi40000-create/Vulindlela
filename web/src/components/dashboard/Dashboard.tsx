import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home as HomeIcon,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  Bell
} from 'lucide-react';

// Sub-screens
import HomeTab from './HomeTab';
import OpportunitiesList from '../opportunities/OpportunitiesList';
import AIProfileBuilder from '../onboarding/AIProfileBuilder'; // Reusing the builder as a guide
import ScamChecker from '../shield/ScamChecker';
import Profile from '../profile/Profile';

interface DashboardProps {
  user: any;
  onNavigate: (step: any) => void;
  onViewOpp: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onViewOpp }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab user={user} onSeeAll={() => setActiveTab('jobs')} onViewOpp={onViewOpp} />;
      case 'jobs': return <OpportunitiesList onBack={() => setActiveTab('home')} onViewOpp={onViewOpp} />;
      case 'guide': return <AIProfileBuilder onComplete={() => setActiveTab('home')} />;
      case 'shield': return <ScamChecker />;
      case 'profile': return <Profile user={user} onNavigate={onNavigate} />;
      default: return <HomeTab user={user} onSeeAll={() => setActiveTab('jobs')} onViewOpp={onViewOpp} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white pb-24">
      {/* Dynamic Tab Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 z-30">
        <ul className="flex justify-between items-center max-w-lg mx-auto">
          <NavItem
            icon={HomeIcon}
            label={t('nav.home')}
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem
            icon={Briefcase}
            label={t('nav.jobs')}
            isActive={activeTab === 'jobs'}
            onClick={() => setActiveTab('jobs')}
          />
          <NavItem
            icon={MessageSquare}
            label={t('nav.guide')}
            isActive={activeTab === 'guide'}
            onClick={() => setActiveTab('guide')}
          />
          <NavItem
            icon={ShieldCheck}
            label={t('nav.shield')}
            isActive={activeTab === 'shield'}
            onClick={() => setActiveTab('shield')}
          />
          <NavItem
            icon={UserIcon}
            label={t('nav.profile')}
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </ul>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: any; label: string; isActive: boolean; onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-teal-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <Icon size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  </li>
);

export default Dashboard;
