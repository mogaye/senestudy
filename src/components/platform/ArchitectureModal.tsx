import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Layers, Database, Shield, Workflow, CheckCircle, ExternalLink } from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const { showArchitectureModal, setShowArchitectureModal } = useApp();
  const [activeTab, setActiveTab] = useState<'flows' | 'database' | 'security' | 'compliance'>('flows');

  if (!showArchitectureModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Architecture & Schémas de cadrage Noria (20 octobre 2026)
            </h2>
          </div>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('flows')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'flows'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>Parcours & App Flows</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Schéma de données (ERD)</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Sécurité & Auth OWASP</span>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'compliance'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>RGPD & AI Act (Art. 50)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'flows' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  1. Parcours global : De la landing page à l’espace d’étude
                </h3>
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
                  <div>[Visiteur sur Landing Page (maquette.html)]</div>
                  <div className="text-indigo-400">├── CTA principal ──&gt; Plateforme démo immédiate (sans compte)</div>
                  <div className="text-emerald-400">└── Se connecter ──&gt; Authentification ──&gt; Parcours d’âge (Art. 45) ──&gt; Onboarding ──&gt; Dashboard</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  2. Boucle d’apprentissage fondée sur les cours de l’élève
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-semibold text-slate-900 mb-1">A. Importer & Découper</div>
                    <p className="text-slate-500">
                      L’élève téléverse son cours. Le système extrait les extraits (MaterialChunks) avec numéro de page et étiquette de section.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-semibold text-slate-900 mb-1">B. Générer & Éditer</div>
                    <p className="text-slate-500">
                      Fiches de rappel actif et quiz générés à la demande en brouillon. L’élève peut les modifier avant de les intégrer à son planning.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-semibold text-slate-900 mb-1">C. Réviser & Auto-évaluer</div>
                    <p className="text-slate-500">
                      Question masquée, indices progressifs, source citée. Auto-évaluation (« À revoir », « Hésitant », « Acquis ») pour espacer les rappels.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  3. Traitement des erreurs transversales
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Perte réseau :</strong> Préservation locale des saisies et réessai manuel.</li>
                  <li><strong>Fichier illisible :</strong> Refus explicite et indication de la prochaine étape sûre.</li>
                  <li><strong>Conflit d’échéance :</strong> Alerte si le temps prévu dépasse la disponibilité de l’élève.</li>
                  <li><strong>Absence de source :</strong> Le coach déclare son incertitude et sépare l’explication théorique générale.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Modèle logique des données (TRD § 1)
                </h3>
                <p className="text-slate-500 mb-3">
                  Architecture relationnelle stricte : chaque ressource porte un propriétaire (user_id) vérifié côté serveur. Aucune table d’école, parent ou partage public au MVP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-indigo-700">USER (Compte & État)</div>
                  <div className="text-slate-600 mt-1">
                    id : UUID PK<br />
                    email_normalized : UK<br />
                    email_verified_at : DateTime?<br />
                    account_status : active | restricted | deleted<br />
                    created_at, updated_at
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-indigo-700">STUDY_PROFILE (Profil d’étude)</div>
                  <div className="text-slate-600 mt-1">
                    user_id : FK unique<br />
                    education_stage : enum<br />
                    class_year : string<br />
                    age_band : under_15 | 15_to_17 | 18+<br />
                    subject_codes : list (max 6)<br />
                    daily_minutes_goal : int
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-teal-700">LEARNING_MATERIAL & CHUNKS</div>
                  <div className="text-slate-600 mt-1">
                    LearningMaterial(id, user_id, course_id, display_name, status)<br />
                    MaterialChunk(id, material_id, page_number, section_label, text_content, content_hash)<br />
                    <span className="text-slate-400">↳ Suppression en cascade des dérivés</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-teal-700">STUDY_CARD & ATTEMPTS</div>
                  <div className="text-slate-600 mt-1">
                    StudyCard(id, course_id, prompt, expected_answer, source_chunk_ids, next_review_at)<br />
                    PracticeAttempt(id, card_id, self_rating: revoir | hesitant | acquis, answered_at)<br />
                    <span className="text-slate-400">↳ Pas de notation scolaire automatisée</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Directives de sécurité OWASP & Protection des identités
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">1. Réponses neutres non-énumérantes</div>
                  <p className="text-slate-600 mt-0.5">
                    Les formulaires de connexion et de récupération affichent la même confirmation qu’une adresse existe ou non, empêchant la découverte de comptes d’élèves.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">2. Cookies et sessions sécurisées</div>
                  <p className="text-slate-600 mt-0.5">
                    Sessions gérées par cookies HttpOnly, Secure, SameSite avec protection CSRF et révocation immédiate à la déconnexion.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">3. Isolation stricte et absence de fuite</div>
                  <p className="text-slate-600 mt-0.5">
                    Le code client ne transmet aucun secret API. Toutes les requêtes vérifient la propriété de la ressource côté serveur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Conformité RGPD & Règlement européen sur l’IA (AI Act)
              </h3>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-indigo-950">
                <div className="font-semibold">Transparence AI Act — Article 50 (Applicable août 2026)</div>
                <p>
                  L’élève est systématiquement informé qu’il interagit avec un agent d’intelligence artificielle qui peut commettre des erreurs. Les réponses distinguent visuellement les citations de ses cours et les synthèses générales.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                <div className="font-semibold">Mineurs & Loi Informatique et Libertés — Article 45</div>
                <p>
                  En France, le consentement autonome est fixé à 15 ans pour les services numériques. Pour les élèves de 15 à 17 ans, Noria applique un langage accessible sans dark pattern. Pour les moins de 15 ans, un accord conjoint mineur + responsable légal est requis avant toute collecte de cours.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
                <div className="font-semibold text-slate-900">Minimisation des données & Portabilité</div>
                <p>
                  Ni nom complet, ni date de naissance exacte, ni relevés officiels de notes ne sont demandés. L’élève peut exporter l’intégralité de ses cours, fiches et tâches en un clic (JSON/texte) et supprimer définitivement son compte sans intervention du support.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Noria — Document de cadrage exploratoire & principes d’architecture
          </span>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
