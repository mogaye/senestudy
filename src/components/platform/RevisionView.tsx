import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyCard } from '../../types';
import {
  BookOpen,
  HelpCircle,
  Eye,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Quote,
  Clock,
  Layers,
} from 'lucide-react';

export const RevisionView: React.FC = () => {
  const { cards, courses, materials, recordPracticeAttempt, setCurrentTab, showToast } = useApp();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Filter cards by course
  const activeDeck = cards.filter((c) => {
    if (selectedCourseFilter === 'all') return true;
    return c.courseId === selectedCourseFilter;
  });

  const currentCard: StudyCard | undefined = activeDeck[currentIndex];
  const cardCourse = courses.find((c) => c.id === currentCard?.courseId);
  const cardMaterial = materials.find((m) => m.id === currentCard?.materialId);

  const handleNextHint = () => {
    if (revealedHints < 2) {
      setRevealedHints(revealedHints + 1);
    }
  };

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleRate = (rating: 'revoir' | 'hesitant' | 'acquis') => {
    if (!currentCard) return;

    recordPracticeAttempt(currentCard.id, rating);
    setReviewedCount((prev) => prev + 1);

    if (currentIndex + 1 < activeDeck.length) {
      setCurrentIndex((prev) => prev + 1);
      setRevealedHints(0);
      setIsAnswerRevealed(false);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setRevealedHints(0);
    setIsAnswerRevealed(false);
    setSessionCompleted(false);
    setReviewedCount(0);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Séance de rappel actif
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formule ta réponse avant de vérifier. L’effort de rappel renforce la mémoire à long terme.
          </p>
        </div>

        {/* Filter by course */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filtrer :</label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => {
              setSelectedCourseFilter(e.target.value);
              handleRestartSession();
            }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Toutes les matières ({cards.length})</option>
            {courses.map((c) => {
              const count = cards.filter((card) => card.courseId === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {sessionCompleted ? (
        /* Session Completed Screen */
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Séance de rappel terminée !
            </h2>
            <p className="text-xs text-slate-500">
              Tu as révisé <span className="font-semibold text-slate-800 tabular-nums">{reviewedCount} fiches</span>. Tes dates de prochaine révision ont été réajustées selon tes retours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs text-slate-600 leading-relaxed">
            Pas de note chiffrée ni de score public : la régularité compte plus que la perfection immédiate.
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartSession}
              className="py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revoir la séance</span>
            </button>
            <button
              onClick={() => setCurrentTab('today')}
              className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Retour au tableau de bord</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : activeDeck.length === 0 ? (
        /* Empty Deck */
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">
            Aucune fiche de révision trouvée pour ce filtre
          </h3>
          <p className="text-xs text-slate-500">
            Importe un cours pour générer des fiches adaptées à tes besoins.
          </p>
          <button
            onClick={() => setCurrentTab('courses')}
            className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Aller dans Mes cours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Active Practice Card */
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cardCourse?.color || '#6366F1' }}
              />
              <span className="font-semibold text-slate-800">
                {cardCourse?.name}
              </span>
            </div>
            <span className="tabular-nums">
              Fiche {currentIndex + 1} sur {activeDeck.length}
            </span>
          </div>

          {/* Flashcard Canvas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Question à résoudre
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                « {currentCard?.prompt} »
              </h2>
            </div>

            {/* Progressive Hints */}
            <div className="space-y-2">
              {revealedHints >= 1 && currentCard?.hint1 && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Premier indice :</span>
                  </div>
                  <p className="leading-relaxed">{currentCard.hint1}</p>
                </div>
              )}

              {revealedHints >= 2 && currentCard?.hint2 && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Second indice :</span>
                  </div>
                  <p className="leading-relaxed">{currentCard.hint2}</p>
                </div>
              )}

              {!isAnswerRevealed && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {revealedHints < 2 && (currentCard?.hint1 || currentCard?.hint2) && (
                    <button
                      onClick={handleNextHint}
                      className="py-1.5 px-3 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        {revealedHints === 0 ? 'Demander un indice' : 'Demander un autre indice'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={handleRevealAnswer}
                    className="py-1.5 px-3.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Afficher la solution attendue</span>
                  </button>
                </div>
              )}
            </div>

            {/* Expected Answer & Source Citation (Revealed) */}
            {isAnswerRevealed && (
              <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
                  <div className="font-bold text-indigo-950 text-[11px]">
                    Réponse attendue & éléments clés :
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {currentCard?.expectedAnswer}
                  </p>
                  {currentCard?.explanation && (
                    <p className="text-slate-600 leading-relaxed pt-1">
                      {currentCard.explanation}
                    </p>
                  )}
                </div>

                {/* Source Citation */}
                {cardMaterial && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Extrait du cours :</span>{' '}
                      <span className="italic">{cardMaterial.displayName}</span>
                    </div>
                  </div>
                )}

                {/* Self Rating Bar */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Comment as-tu trouvé cette question ? (Auto-évaluation)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleRate('revoir')}
                      className="py-2.5 px-3 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer text-center"
                    >
                      À revoir
                      <span className="block text-[10px] font-normal text-rose-600">
                        (Dans les 24h)
                      </span>
                    </button>
                    <button
                      onClick={() => handleRate('hesitant')}
                      className="py-2.5 px-3 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Hésitant
                      <span className="block text-[10px] font-normal text-amber-600">
                        (Dans 2 jours)
                      </span>
                    </button>
                    <button
                      onClick={() => handleRate('acquis')}
                      className="py-2.5 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Acquis
                      <span className="block text-[10px] font-normal text-emerald-600">
                        (Dans 5 jours)
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
