import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, LearningMaterial, StudyCard } from '../../types';
import {
  BookOpen,
  Plus,
  FileText,
  Trash2,
  Sparkles,
  Check,
  ChevronRight,
  Eye,
  Layers,
  ArrowRight,
  Upload,
  AlertCircle,
  Quote,
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const {
    courses,
    addCourse,
    removeCourse,
    materials,
    addMaterial,
    removeMaterial,
    cards,
    addCard,
    showToast,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // New Course Modal
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('#6366F1');

  // Import Document Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docPages, setDocPages] = useState(2);

  // Card Generator Wizard from Document
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generatingForMaterial, setGeneratingForMaterial] = useState<LearningMaterial | null>(null);
  const [draftCards, setDraftCards] = useState<
    { prompt: string; expectedAnswer: string; explanation: string; hint1: string; hint2: string }[]
  >([]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseMaterials = materials.filter((m) => m.courseId === selectedCourse?.id);
  const courseCards = cards.filter((c) => c.courseId === selectedCourse?.id);
  const activeMaterial = materials.find((m) => m.id === selectedMaterialId);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    addCourse({
      name: newCourseName.trim(),
      code: newCourseName.toLowerCase().replace(/\s+/g, '_'),
      color: newCourseColor,
    });
    setNewCourseName('');
    setShowAddCourseModal(false);
  };

  const handleImportDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim() || !selectedCourse) return;

    const newMat = addMaterial(selectedCourse.id, docTitle.trim(), docContent.trim(), docPages);
    setDocTitle('');
    setDocContent('');
    setShowImportModal(false);
    setSelectedMaterialId(newMat.id);
  };

  const startCardGeneration = (mat: LearningMaterial) => {
    setGeneratingForMaterial(mat);

    // Generate 2 sample smart cards grounded in the document chunks
    const c1 = mat.chunks[0];
    const c2 = mat.chunks[1] || mat.chunks[0];

    setDraftCards([
      {
        prompt: `Quelle est l'idée clé présentée dans l'extrait « ${c1?.sectionLabel || 'Section 1'} » ?`,
        expectedAnswer: c1?.textContent.slice(0, 180) + '...',
        explanation: `D'après la page ${c1?.pageNumber || 1} de ton document : « ${c1?.textContent.slice(0, 100)}... »`,
        hint1: 'Relis la première phrase du paragraphe.',
        hint2: 'Pense au principe fondamental qui y est énoncé.',
      },
      {
        prompt: `Explique le mécanisme ou l'argument détaillé dans « ${c2?.sectionLabel || 'Section 2'} ».`,
        expectedAnswer: c2?.textContent.slice(0, 180) + '...',
        explanation: `Formulé à la page ${c2?.pageNumber || 1} de ton cours.`,
        hint1: 'Identifie la cause et la conséquence énoncées par l’auteur.',
        hint2: 'Comment ce passage s’applique-t-il dans une dissertation ou un exercice ?',
      },
    ]);

    setShowGeneratorModal(true);
  };

  const saveDraftCards = () => {
    if (!selectedCourse || !generatingForMaterial) return;

    draftCards.forEach((draft, idx) => {
      const sourceChunk = generatingForMaterial.chunks[idx] || generatingForMaterial.chunks[0];
      addCard({
        courseId: selectedCourse.id,
        materialId: generatingForMaterial.id,
        sourceChunkIds: sourceChunk ? [sourceChunk.id] : [],
        prompt: draft.prompt,
        expectedAnswer: draft.expectedAnswer,
        explanation: draft.explanation,
        hint1: draft.hint1,
        hint2: draft.hint2,
        generationStatus: 'user_edited',
        difficulty: 'moyen',
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    });

    setShowGeneratorModal(false);
    showToast(`${draftCards.length} fiches ajoutées à ton programme de révision !`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Mes cours & Documents
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gère tes matières, importe tes notes de cours et génère du matériel de révision éditable.
          </p>
        </div>

        <button
          onClick={() => setShowAddCourseModal(true)}
          className="py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle matière</span>
        </button>
      </div>

      {/* Courses Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourse?.id;
          const matCount = materials.filter((m) => m.courseId === course.id).length;
          const cardCount = cards.filter((c) => c.courseId === course.id).length;
          return (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedMaterialId(null);
              }}
              className={`p-3 rounded-xl border text-left shrink-0 min-w-[170px] transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span className="text-xs font-bold text-slate-900 truncate">
                  {course.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="tabular-nums">{matCount}</span> support{matCount > 1 ? 's' : ''} ·{' '}
                <span className="tabular-nums">{cardCount}</span> fiche{cardCount > 1 ? 's' : ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Detail Split View */}
      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Documents / Materials List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Supports de cours importés
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Fichiers PDF et notes textuelles rattachés
                  </p>
                </div>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="py-1.5 px-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="space-y-2">
                {courseMaterials.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Aucun document pour le moment dans {selectedCourse.name}.
                    <div className="mt-2">
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        + Importer des notes de cours
                      </button>
                    </div>
                  </div>
                ) : (
                  courseMaterials.map((mat) => {
                    const isSelected = mat.id === selectedMaterialId;
                    return (
                      <div
                        key={mat.id}
                        className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          onClick={() => setSelectedMaterialId(mat.id)}
                          className="flex items-start justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                                {mat.displayName}
                              </p>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{mat.pageCount || 1} pages</span>
                                <span aria-hidden="true">·</span>
                                <span>{mat.chunks.length} extraits indexés</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions on this material */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                          <button
                            onClick={() => startCardGeneration(mat)}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Générer des fiches</span>
                          </button>
                          <button
                            onClick={() => removeMaterial(mat.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Supprimer ce document et ses extraits"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Course Settings / Delete */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Matière : {selectedCourse.name}</span>
              <button
                onClick={() => {
                  if (confirm(`Supprimer la matière « ${selectedCourse.name} » et toutes ses fiches associées ?`)) {
                    removeCourse(selectedCourse.id);
                  }
                }}
                className="text-slate-400 hover:text-rose-600 font-medium"
              >
                Supprimer la matière
              </button>
            </div>
          </div>

          {/* Right Column: Chunks Inspector & Associated Flashcards */}
          <div className="lg:col-span-7 space-y-4">
            {activeMaterial ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      Extraits indexés & citations
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {activeMaterial.displayName}
                    </h3>
                  </div>
                  <button
                    onClick={() => startCardGeneration(activeMaterial)}
                    className="py-1.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Générer cartes de révision</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeMaterial.chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-700 text-[11px]">
                        <span>{chunk.sectionLabel || `Passage #${chunk.chunkIndex + 1}`}</span>
                        {chunk.pageNumber && (
                          <span className="text-slate-400">Page {chunk.pageNumber}</span>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed italic">
                        « {chunk.textContent} »
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
                <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">
                  Sélectionne un document pour examiner ses extraits sourcés
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Chaque document importé est découpé en passages vérifiables avec références de page. L’assistant IA s’appuiera sur ces extraits pour te guider.
                </p>
              </div>
            )}

            {/* Existing Cards for this course */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Fiches de révision enregistrées ({courseCards.length})
                </h3>
              </div>

              {courseCards.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  Aucune fiche créée pour cette matière. Importe un cours pour en générer en quelques secondes.
                </p>
              ) : (
                <div className="space-y-2">
                  {courseCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2 font-semibold text-slate-900">
                        <span className="leading-snug">{card.prompt}</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
                          {card.lastRating ? `Statut : ${card.lastRating}` : 'Nouveau'}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2">
                        {card.expectedAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Ajouter une matière</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de la matière
                </label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Ex : Physique-Chimie, Droit civil..."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Couleur d’accent
                </label>
                <div className="flex items-center gap-2">
                  {['#6366F1', '#0D9488', '#2563EB', '#D97706', '#E11D48', '#8B5CF6'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCourseColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newCourseColor === col ? 'scale-110 border-slate-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="py-1.5 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Créer la matière
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import Document */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Importer des notes pour {selectedCourse?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Colle tes notes ou le résumé d’un chapitre. Le système découpe le texte en extraits sourcés.
              </p>
            </div>

            <form onSubmit={handleImportDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre du support
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ex : Chapitre 4 — La liberté chez Spinoza.pdf"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenu textuel du cours
                </label>
                <textarea
                  rows={6}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Colle ici le texte de tes notes ou du cours..."
                  required
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Traitement privé local · Données protégées</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="py-1.5 px-3 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                  >
                    Analyser et découper
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Card Generator & Editor */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Génération à la demande · Fiches éditables</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Relis et corrige les fiches générées depuis « {generatingForMaterial?.displayName} »
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conformément aux principes Noria : l’IA propose un brouillon, mais tu as le contrôle total pour modifier ou supprimer chaque question.
              </p>
            </div>

            <div className="space-y-4">
              {draftCards.map((draft, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700">Fiche #{idx + 1}</span>
                    <button
                      onClick={() => setDraftCards(draftCards.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 font-medium text-[11px]"
                    >
                      Retirer cette fiche
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Question / Intitulé de rappel :
                    </label>
                    <input
                      type="text"
                      value={draft.prompt}
                      onChange={(e) => {
                        const updated = [...draftCards];
                        updated[idx].prompt = e.target.value;
                        setDraftCards(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Réponse attendue :
                    </label>
                    <textarea
                      rows={2}
                      value={draft.expectedAnswer}
                      onChange={(e) => {
                        const updated = [...draftCards];
                        updated[idx].expectedAnswer = e.target.value;
                        setDraftCards(updated);
                      }}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Indice progressif 1 :
                      </label>
                      <input
                        type="text"
                        value={draft.hint1}
                        onChange={(e) => {
                          const updated = [...draftCards];
                          updated[idx].hint1 = e.target.value;
                          setDraftCards(updated);
                        }}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Indice progressif 2 :
                      </label>
                      <input
                        type="text"
                        value={draft.hint2}
                        onChange={(e) => {
                          const updated = [...draftCards];
                          updated[idx].hint2 = e.target.value;
                          setDraftCards(updated);
                        }}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="py-1.5 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={saveDraftCards}
                className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Valider et ajouter à mon planning ({draftCards.length} fiches)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
