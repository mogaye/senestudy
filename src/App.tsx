import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { PlatformLayout } from './components/platform/PlatformLayout';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ArchitectureModal } from './components/platform/ArchitectureModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'landing' ? <LandingPage /> : <PlatformLayout />}
      <AuthModal />
      <OnboardingModal />
      <ArchitectureModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
