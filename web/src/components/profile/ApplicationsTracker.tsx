import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle2, XCircle, ChevronRight, MessageCircle } from 'lucide-react';
import axios from 'axios';

const ApplicationsTracker: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('/api/popia/my-data');
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'REJECTED': return 'text-coral-400 bg-coral-400/10 border-coral-400/20';
      case 'PENDING': return 'text-sunrise-gold bg-sunrise-gold/10 border-sunrise-gold/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your applications...</div>;

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-sm text-slate-400">Track your progress and talk to employers.</p>
      </div>

      {applications.length === 0 ? (
        <div className="py-20 text-center space-y-4 opacity-50">
          <Briefcase size={48} className="mx-auto text-slate-600" />
          <p>You haven't applied for anything yet.</p>
          <button className="text-teal-400 font-bold hover:underline">Find opportunities</button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-teal-400">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">{app.opportunity.title}</h3>
                    <p className="text-xs text-slate-500">{app.opportunity.location}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  View Listing <ChevronRight size={14} />
                </button>
                <button className="flex-1 py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> Contact
                </button>
              </div>

              {app.status === 'REJECTED' && (
                <div className="p-3 bg-coral-500/10 border border-coral-500/20 rounded-xl">
                  <p className="text-[10px] text-coral-400 font-bold uppercase mb-1">Vulindlela Bridge Suggestion</p>
                  <p className="text-xs text-slate-300">Don't give up! This employer liked your bio but needs a Driver's License. Check our subsidized driving courses.</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsTracker;
