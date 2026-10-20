import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  HelpCircle,
  AlertTriangle,
  Quote,
  Trash2,
  BookOpen,
  Info,
  Flag,
  CheckCircle,
} from 'lucide-react';

export const CoachView: React.FC = () => {
  const {
    coachMessages,
    sendCoachQuestion,
    requestNextHint,
    reportCoachMessage,
    clearCoachChat,
    courses,
    showToast,
  } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inexactitude factuelle');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    sendCoachQuestion(inputQuestion.trim(), selectedCourseId || undefined);
    setInputQuestion('');
  };

  const handleConfirmReport = () => {
    if (reportingMessageId) {
      reportCoachMessage(reportingMessageId, reportReason);
      setReportingMessageId(null);
    }
  };

  const SUGGESTED_QUESTIONS = [
    { text: 'Explique-moi la distinction entre Ça, Moi et Surmoi', courseId: 'crs_philo' },
    { text: 'Comment les plasmocytes neutralisent-ils les antigènes ?', courseId: 'crs_svt' },
    { text: 'Comment reconnaître un point d’inflexion sur une courbe ?', courseId: 'crs_maths' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header & Compliance Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Assistant IA & Coach Socratique
            </h1>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              Il peut se tromper · Citations obligatoires
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Le coach t’aide à comprendre tes cours par étapes et indices. Il ne fait pas les devoirs à ta place.
          </p>
        </div>

        <button
          onClick={clearCoachChat}
          className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Effacer la conversation</span>
        </button>
      </div>

      {/* Suggested Questions Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none text-xs">
        <span className="text-slate-400 text-[11px] font-medium shrink-0">Idées de question :</span>
        {SUGGESTED_QUESTIONS.map((sq, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              sendCoachQuestion(sq.text, sq.courseId);
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs text-[11px]"
          >
            {sq.text}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {coachMessages.map((msg) => {
          const isUser = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Text header */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coach Noria</span>
                    </div>
                    {msg.isGeneralExplanation ? (
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                        Explication générale (hors cours)
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                        Fondé sur tes notes
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Progressive Hints Section */}
                {!isUser && msg.hints && msg.hints.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-indigo-900 block">
                      Étapes d’apprentissage :
                    </span>

                    {msg.hints
                      .slice(0, (msg.activeHintIndex ?? 0) + 1)
                      .map((hint, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1"
                        >
                          <div className="font-semibold text-slate-900">
                            {hIdx === 0 && 'Étape 1 — Premier indice'}
                            {hIdx === 1 && 'Étape 2 — Deuxième indice'}
                            {hIdx === 2 && 'Synthèse & Explication complète'}
                          </div>
                          <p>{hint}</p>
                        </div>
                      ))}

                    {/* Button for next hint */}
                    {(msg.activeHintIndex ?? 0) < msg.hints.length - 1 && (
                      <button
                        onClick={() => requestNextHint(msg.id)}
                        className="py-1.5 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer mt-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Débloquer l’étape suivante</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Citations and exact quotes from student course */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Quote className="w-3 h-3 text-indigo-500" />
                      <span>Extrait source vérifié :</span>
                    </span>
                    {msg.sources.map((s, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700 space-y-0.5 italic"
                      >
                        <div className="font-semibold not-italic text-slate-900">
                          {s.courseName} · {s.materialName} {s.pageNumber ? `(p. ${s.pageNumber})` : ''}
                        </div>
                        <p>« {s.quote} »</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer of message */}
                <div
                  className={`flex items-center justify-between text-[10px] pt-1 ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-3">
                      {msg.reported ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Signalé</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setReportingMessageId(msg.id)}
                          className="hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Signaler une erreur</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form with Course selector */}
      <div className="shrink-0 pt-2 border-t border-slate-200/70">
        <form onSubmit={handleSend} className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Cibler la matière :</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Toutes les matières confondues</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Pose une question sur une notion ou un exercice (ex : Pourquoi Descartes doute-t-il ?)..."
              className="w-full pl-4 pr-24 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim()}
              className="absolute right-2 py-1.5 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <span>Envoyer</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* Report Modal */}
      {reportingMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Signaler une réponse de l’assistant
            </h2>
            <p className="text-xs text-slate-500">
              Tes signalements nous aident à corriger les inexactitudes et à améliorer la rigueur des citations.
            </p>

            <div className="space-y-2">
              {[
                'Inexactitude factuelle ou fausse information',
                'Citation inexacte ou non trouvée dans le cours',
                'Explication pas assez claire ou confuse',
                'Autre remarque',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="text-indigo-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportingMessageId(null)}
                className="py-1.5 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReport}
                className="py-1.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Envoyer le signalement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
