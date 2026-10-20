import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  Quote,
  FileText,
  Calendar,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    setShowAuthModal,
    setAuthModalMode,
    setShowArchitectureModal,
    setIsGuestDemo,
    setIsAuthenticated,
    showToast,
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleEnterPlatform = () => {
    setIsGuestDemo(true);
    setIsAuthenticated(false);
    setCurrentView('platform');
    showToast('Bienvenue dans la plateforme étudiante Noria (mode démonstration locale)');
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const FAQS = [
    {
      q: 'À qui s’adresse Noria en priorité ?',
      a: 'Noria est conçu pour les lycéens (dès 15 ans en autonomie) et les étudiants de l’enseignement supérieur (BTS, BUT, université, classes préparatoires) qui souhaitent s’organiser, ficher leurs cours et réviser activement sans s’éparpiller.',
    },
    {
      q: 'Que fait l’assistant IA et que refuse-t-il de faire ?',
      a: 'L’assistant Noria agit comme un coach socratique. Il génère des cartes de révision éditables, propose des indices progressifs et cite les extraits exacts de vos cours. Il refuse de rédiger un devoir prêt à rendre à votre place et n’attribue aucune note scolaire officielle.',
    },
    {
      q: 'Mes documents de cours restent-ils privés ?',
      a: 'Oui, absolument. Vos notes et fichiers sont strictement rattachés à votre compte personnel. Ils ne sont ni rendus publics, ni vendus, ni utilisés pour entraîner des modèles tiers sans votre consentement explicite.',
    },
    {
      q: 'L’IA peut-elle commettre des erreurs ?',
      a: 'Oui, toute IA peut faire des erreurs ou halluciner. C’est pourquoi Noria affiche toujours les extraits sources utilisés, permet d’éditer chaque fiche avant de la conserver, et met à disposition un bouton « Signaler une erreur » sur chaque réponse.',
    },
    {
      q: 'Puis-je exporter ou supprimer toutes mes données ?',
      a: 'À tout moment, en un clic depuis l’onglet « Données & Confidentialité », vous pouvez télécharger l’intégralité de vos cours et fiches au format JSON/texte, ou demander l’effacement irréversible et immédiat de vos données.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 flex flex-col">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              N
            </span>
            <span>Noria</span>
          </button>

          {/* Zone 2: 4-5 nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#comment" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Comment ça marche
            </a>
            <a href="#benefices" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Bénéfices
            </a>
            <a href="#confiance" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Confiance & IA
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Questions fréquentes
            </a>
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Schémas PRD</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + login link */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenLogin}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 px-2 py-1.5"
            >
              Se connecter
            </button>
            <button
              onClick={handleEnterPlatform}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Entrer dans la plateforme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-medium">
                <span>Proposition de compagnon d’étude</span>
                <span aria-hidden="true">·</span>
                <span>Cadrage 20 octobre 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Le compagnon d’étude guidé par tes cours, pas un robot qui fait tes devoirs.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Noria rassemble tes cours, tes échéances et tes fiches au même endroit. Un agent IA t’accompagne avec des indices progressifs et cite les passages précis de tes propres supports.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={handleEnterPlatform}
                  className="py-3 px-6 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Entrer dans la plateforme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#comment"
                  className="py-3 px-5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors text-center"
                >
                  Découvrir le fonctionnement
                </a>
              </div>

              {/* Trust markers */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Citations des sources vérifiables</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aucune publicité ciblée</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conforme AI Act Art. 50</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Reality Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-4">
                {/* Header mock */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                    <span className="text-xs font-bold text-slate-900">Aujourd’hui · Mercredi</span>
                  </div>
                  <span className="text-[11px] text-slate-400">2 contrôles à préparer</span>
                </div>

                {/* Card preview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
                    <span>Philosophie · Rappel actif</span>
                    <span className="text-slate-400">Séance du matin</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 leading-snug">
                    « Pourquoi Sartre affirme-t-il que l’inconscient freudien relève de la mauvaise foi ? »
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Indice disponible · 1 min</span>
                    <button
                      onClick={handleEnterPlatform}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      S’entraîner →
                    </button>
                  </div>
                </div>

                {/* Grounded Coach Message Preview */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Coach IA · Indice progressif</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    « Regarde bien la page 5 de ton cours : invoquer un inconscient qui décide à ta place revient à fuir ta responsabilité absolue d’être libre. »
                  </p>
                  <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1">
                    <Quote className="w-3 h-3 text-indigo-400" />
                    <span className="italic truncate">Source : Notes Chapitre 2 — Conscience.pdf (p. 5)</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={handleEnterPlatform}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Explorer l’espace de démonstration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMENT ÇA MARCHE */}
      <section id="comment" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Méthode d’apprentissage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Comment passer de tes cours à une révision efficace en 3 étapes
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Une démarche active inspirée des sciences cognitives : espacement, rappel et auto-évaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Apporte tes propres cours</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Colle tes notes ou téléverse tes PDF. Noria extrait le texte en passages numérotés et conserve les références de chaque page.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Génère des fiches éditables</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforme ton cours en fiches de rappel actif et quiz courts. Tu peux corriger, réécrire ou supprimer chaque élément avant de l’enregistrer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Pratique avec des indices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le coach ne te donne pas la réponse toute faite : il t’offre d’abord un indice, cite tes notes et te laisse trouver la clé par toi-même.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BÉNÉFICES CONCRETS */}
      <section id="benefices" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Bénéfices pour les étudiants
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Moins de dispersion, plus de maîtrise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Planification réaliste par échéance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fini les sessions de révision improvisées à la veille du contrôle. Noria étale des sessions courtes et t’avertit en cas de surcharge.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Ancrage rigoureux dans tes cours</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque indice et réponse du coach indique exactement le paragraphe et la page du document dont il est tiré. Aucune invention non vérifiable.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Environnement calme et sans pression</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pas de classement entre élèves, pas de séries punitives, pas de surveillance parentale ou professorale intrusive. Tu révises pour toi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONFIANCE, TRANSPARENCE & CONFORMITÉ */}
      <section id="confiance" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-indigo-900 text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-indigo-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Conformité réglementaire européenne</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-2xl text-balance">
              L’intelligence artificielle expliquée, responsable et maîtrisée par l’étudiant.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="font-semibold text-sm text-indigo-200">Transparence AI Act (Article 50)</div>
                <p className="text-xs text-indigo-100/80 leading-relaxed">
                  L’élève est toujours informé lorsqu’il échange avec une IA. Si le document ne suffit pas pour répondre, le modèle indique son incertitude plutôt que de feindre la certitude.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-indigo-200 text-sm">Protection des mineurs (RGPD & Art. 45)</div>
                <p className="text-xs text-indigo-100/80 leading-relaxed">
                  Parcours adapté aux 15-17 ans sans interfaces manipulatrices ni collecte superflue. Aucune note officielle, géolocalisation ou nom d’établissement n’est requis.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowArchitectureModal(true)}
                className="py-2.5 px-4 text-xs font-semibold text-indigo-950 bg-white hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
              >
                Consulter les schémas d’architecture
              </button>
              <button
                onClick={handleEnterPlatform}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-indigo-800 hover:bg-indigo-700 border border-white/20 rounded-xl transition-colors cursor-pointer"
              >
                Tester le prototype interactif
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CTA DE SORTIE & PIED DE PAGE */}
      <section className="py-16 bg-white border-t border-slate-200 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Prêt à organiser tes révisions sereinement ?
          </h2>
          <p className="text-xs text-slate-500">
            Découvre l’espace étudiant sans engagement. Toutes les interactions sont locales et réversibles.
          </p>
          <div className="pt-2">
            <button
              onClick={handleEnterPlatform}
              className="py-3 px-6 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Ouvrir la plateforme Noria</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">Noria</span> · Nom de travail provisoire · Cadrage exploratoire 2026
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Schémas & Données
            </button>
            <button
              onClick={handleEnterPlatform}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Plateforme démo
            </button>
            <button
              onClick={handleOpenLogin}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Connexion
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
