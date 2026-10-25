import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Settings,
  Award,
  Briefcase,
  ChevronRight,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Camera
} from 'lucide-react';

interface ProfileProps {
  user: any;
  onNavigate: (step: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-32">
      {/* Header / Cover */}
      <div className="h-48 bg-gradient-to-r from-teal-600 to-coral-600 relative">
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center overflow-hidden">
              <UserIcon size={48} className="text-slate-600" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-teal-500 rounded-xl border-2 border-slate-900">
              <Camera size={16} />
            </button>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold">{user?.mobile}</h2>
            <p className="text-teal-400 text-sm font-medium">Job Seeker • Level 2</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-16 space-y-8">
        {/* Profile Completeness */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-bold">Profile Completeness</span>
            <span className="text-teal-400">85%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              className="h-full bg-teal-500"
            />
          </div>
          <p className="text-xs text-slate-500">Add a profile photo to reach 100% and get the "Verified" badge.</p>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('dashboard')} // In a real app, this shows the 'Applications' tab
            className="bg-white/5 border border-white/10 rounded-3xl p-5 text-left space-y-2 hover:bg-white/10"
          >
            <Briefcase className="text-coral-400" size={24} />
            <div className="font-bold">My Applications</div>
            <div className="text-xs text-slate-500">12 Active</div>
          </button>
          <button className="bg-white/5 border border-white/10 rounded-3xl p-5 text-left space-y-2 hover:bg-white/10">
            <Award className="text-sunrise-gold" size={24} />
            <div className="font-bold">My Badges</div>
            <div className="text-xs text-slate-500">4 Earned</div>
          </button>
        </div>

        {/* Menu List */}
        <nav className="space-y-2">
          <button
            onClick={() => onNavigate('privacy')}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-teal-400" />
              <div className="text-left">
                <div className="font-bold">Privacy Center</div>
                <div className="text-xs text-slate-500">POPIA settings & Data export</div>
              </div>
            </div>
            <ChevronRight className="text-slate-600" />
          </button>

          <button
            onClick={() => onNavigate('accessibility')}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <Settings className="text-slate-400" />
              <div className="text-left">
                <div className="font-bold">Accessibility Options</div>
                <div className="text-xs text-slate-500">Gesture control & High contrast</div>
              </div>
            </div>
            <ChevronRight className="text-slate-600" />
          </button>

          <button className="w-full flex items-center gap-4 p-5 text-coral-400 font-bold hover:bg-coral-500/10 rounded-3xl transition-all">
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Profile;
