import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Database,
  Layers,
} from 'lucide-react';

export const PrivacyView: React.FC = () => {
  const {
    courses,
    materials,
    cards,
    tasks,
    profile,
    userEmail,
    isGuestDemo,
    exportUserData,
    wipeAllData,
    setShowArchitectureModal,
    showToast,
  } = useApp();

  const [confirmWipe, setConfirmWipe] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Données personnelles & Confidentialité
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tu as le contrôle total sur tes documents, tes fiches et tes données d’apprentissage.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400">Compte actuel</div>
          <div className="text-sm font-bold text-slate-900 truncate">{userEmail}</div>
          <div className="text-[11px] text-slate-500">
            {isGuestDemo ? 'Mode démonstration locale' : 'Compte actif sécurisé'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400">Données enregistrées</div>
          <div className="text-sm font-bold text-slate-900 tabular-nums">
            {courses.length} matières · {materials.length} cours · {cards.length} fiches
          </div>
          <div className="text-[11px] text-slate-500">
            Stockage strictement privé
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400">Régime juridique</div>
          <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>RGPD & AI Act Art. 50</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Mineurs protégés (Art. 45)
          </div>
        </div>
      </div>

      {/* Data Minimization Audit */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Audit de minimisation des données
          </h2>
          <button
            onClick={() => setShowArchitectureModal(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Consulter le schéma technique (ERD)</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Conformément aux préconisations de la CNIL et du RGPD, Noria applique le principe de <strong>minimisation stricte</strong> :
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aucun nom complet ni date de naissance exacte</span>
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aucun relevé officiel de notes scolaires</span>
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aucun profilage public ni classement d’élèves</span>
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aucun entraînement de modèle IA sur tes cours</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Export & Portability */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Exporter mes données d’étude (Portabilité)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Télécharge l’ensemble de tes matières, notes, fiches de révision et tâches au format JSON ouvert.
          </p>
        </div>

        <button
          onClick={exportUserData}
          className="py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Télécharger mon export</span>
        </button>
      </div>

      {/* Danger Zone: Erase Account & Data */}
      <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Zone sensible · Droit à l’effacement</span>
          </h2>
          <p className="text-xs text-rose-700/80">
            Supprime définitivement tes documents, extraits, fiches et préférences locales. Cette action est irréversible.
          </p>
        </div>

        {confirmWipe ? (
          <div className="p-4 rounded-xl bg-white border border-rose-300 space-y-3 text-xs">
            <p className="font-semibold text-rose-900">
              Es-tu sûr·e de vouloir supprimer l’intégralité de ton espace d’étude ?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmWipe(false)}
                className="py-1.5 px-3 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={wipeAllData}
                className="py-1.5 px-4 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Confirmer l’effacement irréversible
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmWipe(true)}
            className="py-2 px-4 text-xs font-semibold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Effacer toutes mes données locales</span>
          </button>
        )}
      </div>
    </div>
  );
};
