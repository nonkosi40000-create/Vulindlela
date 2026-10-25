import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/otp/request', { mobile });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/otp/verify', { mobile, otp });
      onLoginSuccess(res.data.accessToken, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-coral-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-slate-400 mt-2">Sign in with your mobile number</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'mobile' ? (
            <motion.form
              key="mobile-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleRequestOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="tel"
                    placeholder="072 123 4567"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-lg"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-coral-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Enter 6-digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-center text-3xl tracking-[1em] font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-coral-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setStep('mobile')}
                className="w-full text-slate-400 text-sm hover:text-white transition-colors"
              >
                Change mobile number
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
