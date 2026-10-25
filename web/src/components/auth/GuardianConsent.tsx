import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, Send, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface GuardianConsentProps {
  onVerified: () => void;
}

const GuardianConsent: React.FC<GuardianConsentProps> = ({ onVerified }) => {
  const { t } = useTranslation();
  const [guardianMobile, setGuardianMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Endpoint to send OTP to parent/guardian
      await axios.post('/api/auth/otp/request', { mobile: guardianMobile, type: 'guardian' });
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send permission request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/otp/verify', { mobile: guardianMobile, otp, type: 'guardian' });
      onVerified();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
            <Users className="text-teal-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold">Guardian Consent Needed</h1>
          <p className="text-slate-400 text-sm">
            Because you are under 18, we need a parent or guardian to approve your account setup as per South African law (POPIA).
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Guardian's Mobile Number</label>
              <input
                type="tel"
                value={guardianMobile}
                onChange={(e) => setGuardianMobile(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-teal-500 transition-all"
                placeholder="071 234 5678"
                required
              />
            </div>
            {error && <p className="text-coral-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Send Permission Request <Send size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <div className="bg-sunrise-gold/10 p-4 rounded-xl border border-sunrise-gold/20">
              <p className="text-xs text-sunrise-gold">
                We've sent a code to {guardianMobile}. Ask your guardian to enter it here to give permission.
              </p>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-3xl font-mono tracking-[0.5em] focus:border-teal-500 outline-none"
              placeholder="000000"
              required
            />
            {error && <p className="text-coral-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify Permission'}
            </button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="text-slate-500 text-sm hover:text-white underline"
            >
              Change phone number
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default GuardianConsent;
