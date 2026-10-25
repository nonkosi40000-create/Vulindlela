import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Shield,
  Download,
  Trash2,
  ChevronRight,
  Info,
  Lock,
  Eye,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const PrivacyCenter: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);

  const handleDownloadData = async () => {
    setExportLoading(true);
    try {
      const res = await axios.get('/api/popia/my-data');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vulindlela-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete('/api/popia/delete-account');
      window.location.reload(); // Redirect to splash/auth
    } catch (err) {
      alert('Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="text-teal-400" />
          Privacy Center
        </h2>
        <p className="text-slate-400">Manage your data and privacy settings according to POPIA.</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Your Data Controls</h3>

        <div className="grid gap-3">
          <button
            onClick={handleDownloadData}
            disabled={exportLoading}
            className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-left"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
                {exportLoading ? <Loader2 className="animate-spin" /> : <Download size={24} />}
              </div>
              <div>
                <div className="font-bold">Download My Data</div>
                <div className="text-xs text-slate-500">Get a copy of everything we have on file.</div>
              </div>
            </div>
            <ChevronRight className="text-slate-600" />
          </button>

          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-sunrise-gold/20 rounded-2xl flex items-center justify-center text-sunrise-gold">
                <Lock size={24} />
              </div>
              <div>
                <div className="font-bold">Consent History</div>
                <div className="text-xs text-slate-500">View and update your processing permissions.</div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span>Account Processing</span>
                <span className="text-green-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Employer Sharing</span>
                <button className="text-teal-400 hover:underline">Change</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Legal & Rights</h3>
        <div className="grid gap-2">
          {[
            { icon: FileText, label: 'Full Privacy Policy' },
            { icon: Eye, label: 'Data Subject Rights' },
            { icon: Info, label: 'Information Officer Contact' }
          ].map((item, i) => (
            <button key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 text-sm">
                <item.icon size={18} className="text-slate-400" />
                {item.label}
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          ))}
        </div>
      </section>

      <section className="pt-8 border-t border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-coral-500 uppercase tracking-widest">Danger Zone</h3>
        {deleteStep === 0 ? (
          <button
            onClick={() => setDeleteStep(1)}
            className="w-full flex items-center gap-3 p-5 bg-coral-500/10 border border-coral-500/20 text-coral-400 rounded-3xl font-bold hover:bg-coral-500/20 transition-all"
          >
            <Trash2 size={20} />
            Delete My Profile Permanently
          </button>
        ) : (
          <div className="bg-coral-500/10 border border-coral-500/30 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-coral-400">
              <AlertCircle size={24} />
              <div className="font-black text-lg uppercase tracking-tighter">Are you absolutely sure?</div>
            </div>
            <p className="text-sm text-slate-300">
              This will permanently erase your profile, skills, applications, and verified work history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 py-3 bg-coral-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-coral-500/30"
              >
                {loading ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
              <button
                onClick={() => setDeleteStep(0)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PrivacyCenter;
