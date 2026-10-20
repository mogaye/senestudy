import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, UserCheck, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    setIsAuthenticated,
    setIsGuestDemo,
    setUserEmail,
    setCurrentView,
    setShowOnboardingModal,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [ageConsent, setAgeConsent] = useState<'18+' | '15_17' | 'under_15'>('15_17');
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleClose = () => {
    setShowAuthModal(false);
    setErrorMessage(null);
    setSubmittedStatus(null);
  };

  const handleGuestDemo = () => {
    setIsGuestDemo(true);
    setIsAuthenticated(false);
    setUserEmail('etudiant.invite@noria.app');
    handleClose();
    setCurrentView('platform');
    showToast('Bienvenue dans la démonstration Noria sans compte !');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (authModalMode === 'forgot') {
      // Non-enumerating OWASP response
      setSubmittedStatus(
        'Si cette adresse correspond à un compte, un lien de réinitialisation sécurisé à usage unique y a été envoyé.'
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (authModalMode === 'register') {
      if (!agreedTerms) {
        setErrorMessage('Veuillez accepter les conditions d’utilisation.');
        return;
      }
      if (ageConsent === 'under_15') {
        setErrorMessage(
          'Conformément à l’art. 45 de la loi Informatique & Libertés, les moins de 15 ans requièrent l’accord conjoint d’un représentant légal. Le parcours autonome est réservé aux 15 ans et plus.'
        );
        return;
      }

      setUserEmail(email);
      setIsAuthenticated(true);
      setIsGuestDemo(false);
      handleClose();
      setCurrentView('platform');
      setShowOnboardingModal(true);
      showToast('Compte créé ! Définissons ton profil d’études.');
    } else {
      // Login
      setUserEmail(email);
      setIsAuthenticated(true);
      setIsGuestDemo(false);
      handleClose();
      setCurrentView('platform');
      showToast(`Ravi de te revoir, ${email.split('@')[0]} !`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900">Noria</span>
            <span className="text-xs text-slate-500">· Espace sécurisé</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick tab switcher */}
          <div className="flex items-center p-1 mb-6 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage(null);
                setSubmittedStatus(null);
              }}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                authModalMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setErrorMessage(null);
                setSubmittedStatus(null);
              }}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                authModalMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Créer un espace
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {authModalMode === 'login' && 'Content de te revoir'}
              {authModalMode === 'register' && 'Rejoins ton compagnon d’étude'}
              {authModalMode === 'forgot' && 'Réinitialiser mon mot de passe'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {authModalMode === 'login' && 'Accède à tes cours, fiches et séances de révision.'}
              {authModalMode === 'register' &&
                'Données privées par défaut. Aucun partage public, aucune publicité ciblée.'}
              {authModalMode === 'forgot' &&
                'Saisis ton e-mail pour recevoir un lien sécurisé à usage unique.'}
            </p>
          </div>

          {submittedStatus ? (
            <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
              {submittedStatus}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSubmittedStatus(null);
                    setAuthModalMode('login');
                  }}
                  className="font-semibold text-emerald-900 underline hover:no-underline"
                >
                  Revenir à la connexion
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camille@exemple.fr"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Mot de passe
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('forgot')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {authModalMode === 'register' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tranche d’âge
                    </label>
                    <select
                      value={ageConsent}
                      onChange={(e) => setAgeConsent(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="15_17">15 à 17 ans (Lycéen / Mineur)</option>
                      <option value="18+">18 ans et plus (Majeur / Étudiant)</option>
                      <option value="under_15">Moins de 15 ans (Accord conjoint requis)</option>
                    </select>
                    {ageConsent === '15_17' && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Notice mineur : tes cours restent strictement confidentiels et ne sont partagés ni avec des tiers ni avec les régies publicitaires.
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span>
                      J’accepte les{' '}
                      <span className="font-semibold text-slate-800">conditions d’utilisation</span>{' '}
                      et j’ai pris connaissance de la{' '}
                      <span className="font-semibold text-slate-800">
                        notice de confidentialité
                      </span>.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {authModalMode === 'login' && 'Se connecter'}
                {authModalMode === 'register' && 'Créer mon compte'}
                {authModalMode === 'forgot' && 'Envoyer le lien de réinitialisation'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Divider & Guest Demo access */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={handleGuestDemo}
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Accéder à la démonstration locale sans compte</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Conforme à la maquette : explore toutes les fonctionnalités avec des données d’exemple.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
