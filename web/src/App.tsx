import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

// Onboarding & Auth "Activities"
import Splash from './components/onboarding/Splash';
import LanguagePicker from './components/onboarding/LanguagePicker';
import PopiaScreen from './components/auth/PopiaScreen';
import Login from './components/auth/Login';
import GuardianConsent from './components/auth/GuardianConsent';
import AccessibilityPicker from './components/onboarding/AccessibilityPicker';
import AIProfileBuilder from './components/onboarding/AIProfileBuilder';

// Main App "Activities"
import Dashboard from './components/dashboard/Dashboard';
import OpportunityDetail from './components/opportunities/OpportunityDetail';
import PrivacyCenter from './components/profile/PrivacyCenter';
import Settings from './components/profile/Settings';
import Help from './components/support/Help';
import DocumentSimplifier from './components/ai/DocumentSimplifier';
import InterviewCoach from './components/ai/InterviewCoach';
import MentorMatch from './components/ai/MentorMatch';
import EmployerPortal from './components/employer/EmployerPortal';
import AdminReviewQueue from './components/admin/AdminReviewQueue';
import Offline from './components/common/Offline';

// Global Context & Overlays
import { AccessibilityProvider } from './context/AccessibilityContext';
import ReadingHighlighter from './components/accessibility/ReadingHighlighter';
import GestureController from './components/accessibility/GestureController';
import SASLPanel from './components/accessibility/SASLPanel';

type FlowStep =
  | 'splash' | 'language' | 'popia' | 'auth' | 'guardian'
  | 'accessibility' | 'profile-builder' | 'dashboard'
  | 'opp-detail' | 'settings' | 'help' | 'simplifier'
  | 'coach' | 'mentors' | 'employer' | 'admin' | 'offline';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [step, setStep] = useState<FlowStep>('splash');
  const [user, setUser] = useState<any>(null);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    setUser(userData);
    // Logic for Guardian Consent (POPIA)
    if (userData.age >= 15 && userData.age < 18 && !userData.guardianVerified) {
      setStep('guardian');
    } else {
      setStep('accessibility');
    }
  };

  if (!isOnline && step !== 'splash') return <Offline />;

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-slate-900 selection:bg-teal-500/30">
        <AnimatePresence mode="wait">
          {step === 'splash' && <Splash key="splash" onComplete={() => setStep('language')} />}
          {step === 'language' && <LanguagePicker key="lang" onSelect={() => setStep('popia')} />}
          {step === 'popia' && <PopiaScreen key="popia" onAccept={() => setStep('auth')} />}
          {step === 'auth' && <Login key="auth" onLoginSuccess={handleLoginSuccess} />}
          {step === 'guardian' && <GuardianConsent key="guard" onVerified={() => setStep('accessibility')} />}
          {step === 'accessibility' && <AccessibilityPicker key="access" onComplete={() => setStep('profile-builder')} />}
          {step === 'profile-builder' && <AIProfileBuilder key="ai-builder" onComplete={() => setStep('dashboard')} />}

          {step === 'dashboard' && (
            <Dashboard
              key="dash"
              user={user}
              onNavigate={(target: any) => setStep(target)}
              onViewOpp={(id) => {
                setSelectedOppId(id);
                setStep('opp-detail');
              }}
            />
          )}

          {step === 'opp-detail' && selectedOppId && (
            <OpportunityDetail key="detail" oppId={selectedOppId} onBack={() => setStep('dashboard')} />
          )}

          {step === 'settings' && <Settings key="settings" onBack={() => setStep('dashboard')} onNavigate={setStep} />}
          {step === 'help' && <Help key="help" onBack={() => setStep('dashboard')} />}
          {step === 'simplifier' && <DocumentSimplifier key="simple" onBack={() => setStep('dashboard')} />}
          {step === 'coach' && <InterviewCoach key="coach" />}
          {step === 'mentors' && <MentorMatch key="mentors" />}
          {step === 'employer' && <EmployerPortal key="employer" />}
          {step === 'admin' && <AdminReviewQueue key="admin" />}
        </AnimatePresence>

        {/* Persistent Accessibility Overlays */}
        <ReadingHighlighter />
        <GestureController />
        <SASLPanel />
      </div>
    </AccessibilityProvider>
  );
};

export default App;
