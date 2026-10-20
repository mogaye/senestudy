import React from 'react';
import { useApp, PlatformTab } from '../../context/AppContext';
import { BACKGROUND_PRESETS } from '../../data/initialData';
import { TodayView } from './TodayView';
import { CoursesView } from './CoursesView';
import { RevisionView } from './RevisionView';
import { PlanningView } from './PlanningView';
import { CoachView } from './CoachView';
import { AppearanceView } from './AppearanceView';
import { PrivacyView } from './PrivacyView';
import {
  Calendar,
  BookOpen,
  RotateCw,
  Clock,
  Sparkles,
  Palette,
  ShieldCheck,
  ArrowLeft,
  Layers,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const PlatformLayout: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setCurrentView,
    appearance,
    profile,
    isGuestDemo,
    userEmail,
    setShowOnboardingModal,
    setShowArchitectureModal,
    setShowAuthModal,
    toastMessage,
  } = useApp();

  const NAV_ITEMS: { id: PlatformTab; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Aujourd’hui', icon: <Calendar className="w-4 h-4" /> },
    { id: 'courses', label: 'Mes cours', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'revision', label: 'Révisions', icon: <RotateCw className="w-4 h-4" /> },
    { id: 'planning', label: 'Planning', icon: <Clock className="w-4 h-4" /> },
    { id: 'coach', label: 'Assistant IA', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'appearance', label: 'Apparence', icon: <Palette className="w-4 h-4" /> },
    { id: 'privacy', label: 'Confidentialité', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  // Resolve background style
  const currentPreset = BACKGROUND_PRESETS.find(
    (p) => p.id === appearance.backgroundPresetId
  );

  let backgroundStyle: React.CSSProperties = {
    backgroundColor: '#F8F9FC',
  };

  if (appearance.backgroundSource === 'upload' && appearance.customImageDataUrl) {
    backgroundStyle = {
      backgroundImage: `url(${appearance.customImageDataUrl})`,
      backgroundPosition: `${appearance.focalX}% ${appearance.focalY}%`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    };
  } else if (appearance.backgroundSource === 'preset' && currentPreset) {
    backgroundStyle = {
      background: currentPreset.gradientOrSvg,
      backgroundAttachment: 'fixed',
    };
  }

  return (
    <div
      className={`min-h-screen relative flex flex-col text-slate-900 ${
        appearance.reduceMotion ? 'reduced-motion' : ''
      }`}
      style={backgroundStyle}
    >
      {/* Background Contrast Overlay Veil */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: '#F8F9FC',
          opacity: appearance.overlayStrength / 100,
        }}
      />

      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
          {/* Brand & Back link */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              title="Retourner à la page d’accueil publique (maquette.html)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil public</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                N
              </span>
              <span className="font-bold text-slate-900 text-base tracking-tight">Noria</span>
              <span className="text-[11px] text-slate-400 hidden md:inline">· Espace étudiant</span>
            </div>
          </div>

          {/* Right Status Badges & Quick actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Schémas PRD</span>
            </button>

            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Modifier le profil d’étude"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="max-w-[120px] truncate">{profile.classYear || 'Profil'}</span>
            </button>

            {isGuestDemo ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="py-1.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Créer un compte
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium hidden md:inline">
                Connecté ({userEmail})
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER WITH SIDEBAR */}
      <div className="relative z-10 flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        {/* Desktop Sidebar (240px) */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-22 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-100 px-3 py-2 space-y-1 text-[11px] text-slate-400">
              <div>Version démo v0.1</div>
              <div className="text-emerald-700 font-medium">Données locales privées</div>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {currentTab === 'today' && <TodayView />}
          {currentTab === 'courses' && <CoursesView />}
          {currentTab === 'revision' && <RevisionView />}
          {currentTab === 'planning' && <PlanningView />}
          {currentTab === 'coach' && <CoachView />}
          {currentTab === 'appearance' && <AppearanceView />}
          {currentTab === 'privacy' && <PrivacyView />}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Max 5 primary icons + more) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                isActive ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setCurrentTab('appearance')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
            currentTab === 'appearance' || currentTab === 'privacy'
              ? 'text-indigo-600'
              : 'text-slate-500'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Réglages</span>
        </button>
      </nav>

      {/* Accessible Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
