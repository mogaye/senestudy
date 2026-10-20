import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyTask } from '../../types';
import {
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const PlanningView: React.FC = () => {
  const { tasks, addTask, toggleTask, removeTask, courses, profile, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [taskType, setTaskType] = useState<'revision' | 'devoir' | 'examen'>('revision');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Calculate daily workload
  const totalMinutes = tasks
    .filter((t) => t.status === 'todo')
    .reduce((sum, t) => sum + (t.estimatedMinutes || 25), 0);

  const isOverloaded = totalMinutes > profile.dailyMinutesGoal * 1.5;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dueDate = new Date(Date.now() + selectedDayOffset * 24 * 60 * 60 * 1000);
    addTask({
      courseId: courseId || undefined,
      title: title.trim(),
      taskType,
      dueAt: dueDate.toISOString(),
      status: 'todo',
      priority: 'moyenne',
      estimatedMinutes: Number(estimatedMinutes),
    });

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Planning & Répartition du travail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organise tes révisions en sessions courtes étalées dans le temps pour éviter le bachotage de dernière minute.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une échéance</span>
        </button>
      </div>

      {/* Workload Status Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              isOverloaded ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Charge totale planifiée :{' '}
              <span className="tabular-nums font-semibold">{totalMinutes} min</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Ton objectif quotidien est fixé à{' '}
              <span className="font-semibold text-slate-700 tabular-nums">{profile.dailyMinutesGoal} min</span> par jour.
            </div>
          </div>
        </div>

        {isOverloaded ? (
          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Volume supérieur à ton rythme conseillé. Répartis sur la semaine.</span>
          </div>
        ) : (
          <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Rythme équilibré et faisable sans surcharge
          </div>
        )}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const course = courses.find((c) => c.id === task.courseId);
          const isDone = task.status === 'done';
          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {course ? (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md truncate"
                      style={{
                        backgroundColor: `${course.color}15`,
                        color: course.color,
                      }}
                    >
                      {course.name}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Général
                    </span>
                  )}
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-0.5"
                    title="Supprimer la tâche"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p
                  className={`text-xs font-bold leading-snug ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </p>

                {task.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{task.estimatedMinutes} min</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{task.taskType}</span>
                </div>

                <button
                  onClick={() => toggleTask(task.id)}
                  className={`font-semibold cursor-pointer flex items-center gap-1 ${
                    isDone ? 'text-slate-400' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Terminé</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" />
                      <span>À faire</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Planifier une échéance ou session
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Intitulé
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Bac blanc de Philosophie, DS SVT..."
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
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
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
                    Échéance
                  </label>
                  <select
                    value={selectedDayOffset}
                    onChange={(e) => setSelectedDayOffset(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={0}>Aujourd’hui</option>
                    <option value={1}>Demain</option>
                    <option value={3}>Dans 3 jours</option>
                    <option value={7}>La semaine prochaine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="revision">Révision courte</option>
                    <option value="devoir">Devoir</option>
                    <option value="examen">Contrôle / Examen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durée estimée ({estimatedMinutes} min)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="15"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-1.5 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
