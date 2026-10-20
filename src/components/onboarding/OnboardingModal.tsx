import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationStage, LearnerType, DiscoverySource } from '../../types';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

const STAGES: { id: EducationStage; label: string; learnerType: LearnerType }[] = [
  { id: 'college', label: 'Collège', learnerType: 'school_pupil' },
  { id: 'lycee_general_tech', label: 'Lycée général ou technologique', learnerType: 'school_pupil' },
  { id: 'voie_pro', label: 'Lycée professionnel ou CAP', learnerType: 'school_pupil' },
  { id: 'superieur', label: 'Études supérieures (Université, CPGE, BTS, BUT)', learnerType: 'higher_education_student' },
  { id: 'apprentissage_formation', label: 'Apprentissage ou formation professionnelle', learnerType: 'apprentice_or_trainee' },
  { id: 'autre', label: 'Autre parcours / Je préfère ne pas répondre', learnerType: 'prefer_not_to_say' },
];

const CLASSES_BY_STAGE: Record<EducationStage, string[]> = {
  college: ['6e', '5e', '4e', '3e', 'Autre année collège', 'Je préfère ne pas répondre'],
  lycee_general_tech: ['Seconde', 'Première', 'Terminale', 'Autre année lycée', 'Je préfère ne pas répondre'],
  voie_pro: ['CAP 1re année', 'CAP 2e année', '2nde professionnelle', '1re professionnelle', 'Terminale professionnelle', 'Autre année'],
  superieur: ['Licence 1 (L1)', 'Licence 2 (L2)', 'Licence 3 (L3)', 'Master 1', 'Master 2', 'BTS 1', 'BTS 2', 'BUT 1/2/3', 'CPGE 1 (Sup)', 'CPGE 2 (Spé)', 'Doctorat', 'Autre cursus'],
  apprentissage_formation: ['1re année', '2e année', '3e année', 'Formation continue', 'Autre'],
  autre: [],
};

const SUBJECT_OPTIONS = [
  { code: 'philo', label: 'Philosophie' },
  { code: 'maths', label: 'Mathématiques' },
  { code: 'svt', label: 'SVT (Sciences de la Vie et de la Terre)' },
  { code: 'histoire', label: 'Histoire-Géographie' },
  { code: 'physique', label: 'Physique-Chimie' },
  { code: 'francais', label: 'Français / Lettres' },
  { code: 'langues', label: 'Langues vivantes (Anglais, Espagnol, Allemand)' },
  { code: 'ses', label: 'SES / Économie' },
  { code: 'info', label: 'Informatique / NSI' },
  { code: 'droit', label: 'Droit / Gestion' },
];

const DISCOVERY_OPTIONS: { id: DiscoverySource; label: string }[] = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'web_search', label: 'Recherche Google ou web' },
  { id: 'friend_or_family', label: 'Ami·e, camarade de classe ou famille' },
  { id: 'teacher_or_school', label: 'Enseignant ou documentaliste' },
  { id: 'other_social_network', label: 'Autre réseau social' },
  { id: 'advertising', label: 'Publicité' },
  { id: 'unknown', label: 'Je ne sais plus' },
  { id: 'prefer_not_to_say', label: 'Je préfère ne pas répondre' },
];

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, profile, updateProfile, showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [stage, setStage] = useState<EducationStage>(profile.educationStage || 'lycee_general_tech');
  const [classYear, setClassYear] = useState<string>(profile.classYear || 'Terminale');
  const [studyTrack, setStudyTrack] = useState<string>(profile.studyTrack || '');
  const [subjects, setSubjects] = useState<string[]>(profile.subjectCodes || ['philo', 'svt', 'maths']);
  const [primaryGoal, setPrimaryGoal] = useState<string>(profile.primaryStudyGoal || 'revise');

  // Step 2 state
  const [discovery, setDiscovery] = useState<DiscoverySource>('web_search');

  if (!showOnboardingModal) return null;

  const handleToggleSubject = (code: string) => {
    if (subjects.includes(code)) {
      setSubjects(subjects.filter((s) => s !== code));
    } else {
      if (subjects.length >= 6) {
        showToast('Maximum 6 matières pour garder un espace clair');
        return;
      }
      setSubjects([...subjects, code]);
    }
  };

  const handleSaveAndFinish = () => {
    const selectedStageObj = STAGES.find((s) => s.id === stage);
    updateProfile({
      educationStage: stage,
      learnerType: selectedStageObj?.learnerType || 'school_pupil',
      classYear,
      studyTrack,
      subjectCodes: subjects,
      primaryStudyGoal: primaryGoal,
      profileCompletedAt: new Date().toISOString(),
    });
    setShowOnboardingModal(false);
    showToast('Profil configuré ! Ton espace d’étude est prêt.');
  };

  const handleSkip = () => {
    setShowOnboardingModal(false);
    showToast('Tu pourras compléter ton profil plus tard dans les préférences.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900">Bienvenue sur Noria</span>
            <span className="text-xs text-slate-500">· Étape {step}/2</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            Passer pour l’instant
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Étape 1 — Tes études
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ces informations permettent d’adapter le vocabulaire, les exemples et les suggestions de révision. Elles ne servent pas à te noter.
                </p>
              </div>

              {/* Education Stage */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  1. Quel est ton parcours d’études actuel ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStage(s.id);
                        const available = CLASSES_BY_STAGE[s.id];
                        if (available.length > 0) {
                          setClassYear(available[0]);
                        } else {
                          setClassYear('');
                        }
                      }}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        stage === s.id
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Class Year */}
              {CLASSES_BY_STAGE[stage].length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    2. Dans quelle classe ou année es-tu ?
                  </label>
                  <select
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {CLASSES_BY_STAGE[stage].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Study track */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  3. Filière ou spécialités (facultatif)
                </label>
                <input
                  type="text"
                  value={studyTrack}
                  onChange={(e) => setStudyTrack(e.target.value)}
                  placeholder="Ex : Spécialités Maths & SVT, Filière STMG, Prépa MPSI, etc."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              {/* Subjects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-800">
                    4. Quelles matières souhaites-tu réviser ? (jusqu’à 6)
                  </label>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {subjects.length}/6 sélectionnées
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = subjects.includes(sub.code);
                    return (
                      <button
                        key={sub.code}
                        type="button"
                        onClick={() => handleToggleSubject(sub.code)}
                        className={`text-left px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  5. Qu’aimerais-tu faire en priorité ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'revise', label: 'Réviser régulièrement (rappel espacé)' },
                    { id: 'understand', label: 'Comprendre mes cours par étapes' },
                    { id: 'organize', label: 'M’organiser et planifier mes contrôles' },
                    { id: 'exam', label: 'Préparer un examen ou concours' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPrimaryGoal(g.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        primaryGoal === g.id
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Étape 2 — Comment as-tu découvert Noria ?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cette question est purement facultative. Elle nous aide à comprendre par quel canal les étudiants nous trouvent.
                </p>
              </div>

              <div className="space-y-2">
                {DISCOVERY_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDiscovery(d.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      discovery === d.id
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{d.label}</span>
                    {discovery === d.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Engagement de minimisation :</span>{' '}
                Aucune information nominative n’est collectée ici. Les statistiques sont agrégées et modifiables à tout moment depuis ton profil.
              </div>
            </>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Passer cette étape
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continuer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2 px-3 text-xs font-medium text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveAndFinish}
                  className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enregistrer mon espace</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
