import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Plus,
  Flame,
  AlertCircle,
  Quote,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    tasks,
    toggleTask,
    addTask,
    cards,
    courses,
    profile,
    setCurrentTab,
    sendCoachQuestion,
    showToast,
  } = useApp();

  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCourseId, setTaskCourseId] = useState(courses[0]?.id || '');
  const [taskType, setTaskType] = useState<'revision' | 'devoir' | 'examen'>('revision');
  const [taskMinutes, setTaskMinutes] = useState(30);

  // Filter tasks due soon or today
  const pendingTasks = tasks.filter((t) => t.status === 'todo');
  const completedTasks = tasks.filter((t) => t.status === 'done');

  // Cards due for review
  const cardsDue = cards.filter((c) => {
    if (!c.nextReviewAt) return true;
    return new Date(c.nextReviewAt) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
  });

  const nextCard = cardsDue[0] || cards[0];
  const nextCourse = courses.find((c) => c.id === nextCard?.courseId);

  // Total study time planned
  const totalMinutesPlanned = pendingTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 25), 0);
  const isOverloaded = totalMinutesPlanned > profile.dailyMinutesGoal + 20;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      courseId: taskCourseId || undefined,
      title: taskTitle.trim(),
      taskType,
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'todo',
      priority: 'moyenne',
      estimatedMinutes: Number(taskMinutes),
    });

    setTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Aujourd’hui · Mercredi 21 octobre
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Bonjour ! Ton espace de révision est prêt.
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objectif quotidien : <span className="font-semibold text-slate-700 tabular-nums">{profile.dailyMinutesGoal} min</span> de pratique active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTask(true)}
            className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une tâche</span>
          </button>
          <button
            onClick={() => setCurrentTab('revision')}
            className="py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lancer la séance ({cardsDue.length} cartes)</span>
          </button>
        </div>
      </div>

      {/* Workload Advisor / Conflict warning */}
      {isOverloaded && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Alerte charge de travail :</span>{' '}
            <span>
              Tu as <span className="font-bold tabular-nums">{totalMinutesPlanned} min</span> prévues aujourd’hui pour un objectif de{' '}
              <span className="font-bold tabular-nums">{profile.dailyMinutesGoal} min</span>. Pense à répartir les tâches non urgentes dans l’onglet Planning.
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Priority Revision + Next Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Priority Active Recall Card & Coach Snippet */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Flashcard */}
          {nextCard ? (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: nextCourse?.color || '#6366F1' }}
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {nextCourse?.name || 'Matière'} · Rappel actif recommandé
                  </span>
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                  À revoir aujourd’hui
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  « {nextCard.prompt} »
                </p>
                <p className="text-xs text-slate-500 italic">
                  Essaie de formuler la réponse mentalement ou sur un brouillon avant de vérifier.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Révisée {nextCard.reviewCount} fois · Difficulté : {nextCard.difficulty || 'moyen'}
                </span>
                <button
                  onClick={() => setCurrentTab('revision')}
                  className="py-1.5 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>S’entraîner maintenant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                Toutes tes fiches du jour ont été révisées !
              </p>
              <p className="text-xs text-slate-500">
                Tu peux importer un nouveau cours pour générer des fiches ou te reposer.
              </p>
            </div>
          )}

          {/* Coach Insight Box */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Coach IA · Indice extrait de tes cours</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium">Assistant pédagogique</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              « Pour ton contrôle de <strong>Philosophie</strong> : n’oublie pas de bien distinguer le doute méthodique de Descartes (qui cherche la certitude) du doute sceptique (qui renonce à la vérité). »
            </p>

            <div className="p-2.5 rounded-xl bg-white/80 border border-indigo-100 text-[11px] text-slate-600 flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="font-semibold text-slate-800">Source :</span> Méditations Métaphysiques (p. 2 de tes notes)
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  sendCoachQuestion(
                    'Peux-tu m’expliquer la différence entre le doute méthodique cartésien et le scepticisme ?',
                    'crs_philo'
                  );
                  setCurrentTab('coach');
                }}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Poser une question au coach sur ce point</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Tasks & Weekly Progress */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tasks checklist */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Tâches & Échéances prioritaires
              </h2>
              <span className="text-xs text-slate-400 tabular-nums">
                {completedTasks.length}/{tasks.length} terminées
              </span>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  Aucune tâche enregistrée. Clique sur « Ajouter une tâche » pour planifier ton travail.
                </p>
              ) : (
                tasks.map((task) => {
                  const course = courses.find((c) => c.id === task.courseId);
                  const isDone = task.status === 'done';
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`group p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isDone
                          ? 'bg-slate-50/70 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors"
                        aria-label={isDone ? 'Marquer à faire' : 'Marquer terminé'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold leading-snug truncate ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          {course && (
                            <span
                              className="font-medium truncate"
                              style={{ color: course.color }}
                            >
                              {course.name}
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{task.estimatedMinutes} min</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{task.taskType}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une échéance</span>
            </button>
          </div>

          {/* Calming progress summary (No toxic streaks) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Pratique hebdomadaire</span>
              <span className="text-slate-500 tabular-nums">4 sessions réalisées</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              La régularité prime sur l’intensité : réviser 15 à 30 minutes chaque jour favorise la mémorisation à long terme sans fatigue cognitive.
            </p>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => {
                const active = idx < 3; // Mon, Tue, Wed active
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400">{day}</span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold ${
                        active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {active ? '✓' : '·'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Ajouter une échéance ou révision
            </h2>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de la tâche
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex : Réviser le chapitre 3 de maths..."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matière
                  </label>
                  <select
                    value={taskCourseId}
                    onChange={(e) => setTaskCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="revision">Révision</option>
                    <option value="devoir">Devoir maison</option>
                    <option value="examen">Contrôle / Examen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temps estimé ({taskMinutes} min)
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={taskMinutes}
                  onChange={(e) => setTaskMinutes(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="py-1.5 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
