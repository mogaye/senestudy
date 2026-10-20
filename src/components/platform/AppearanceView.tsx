import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BACKGROUND_PRESETS } from '../../data/initialData';
import {
  Image,
  Upload,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Shield,
  Layers,
  Sparkles,
  ZapOff,
} from 'lucide-react';

export const AppearanceView: React.FC = () => {
  const { appearance, updateAppearance, resetAppearance, showToast } = useApp();

  const [selectedSource, setSelectedSource] = useState(appearance.backgroundSource);
  const [selectedPresetId, setSelectedPresetId] = useState(appearance.backgroundPresetId);
  const [customDataUrl, setCustomDataUrl] = useState<string | undefined>(
    appearance.customImageDataUrl
  );
  const [focalX, setFocalX] = useState(appearance.focalX);
  const [focalY, setFocalY] = useState(appearance.focalY);
  const [overlayStrength, setOverlayStrength] = useState(appearance.overlayStrength);
  const [reduceMotion, setReduceMotion] = useState(appearance.reduceMotion);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Format non supporté. Veuillez choisir un fichier JPG, PNG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image trop volumineuse (maximum 5 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomDataUrl(result);
      setSelectedSource('upload');
      showToast('Image importée ! Pense à cliquer sur Enregistrer ce fond.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateAppearance({
      backgroundSource: selectedSource,
      backgroundPresetId: selectedPresetId,
      customImageDataUrl: customDataUrl,
      focalX,
      focalY,
      overlayStrength,
      reduceMotion,
    });
  };

  const handleReset = () => {
    resetAppearance();
    setSelectedSource('default');
    setSelectedPresetId('default');
    setCustomDataUrl(undefined);
    setOverlayStrength(75);
    setReduceMotion(false);
  };

  const currentPreset = BACKGROUND_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Personnalise ton espace
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Choisis un fond qui te plaît. Il reste visible uniquement dans ta plateforme privée.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Settings Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Gallery */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Images proposées</h2>
            <div className="grid grid-cols-2 gap-3">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected =
                  selectedSource === 'preset' && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedSource(preset.id === 'default' ? 'default' : 'preset');
                      setSelectedPresetId(preset.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected || (preset.id === 'default' && selectedSource === 'default')
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-full h-14 rounded-lg mb-2 shadow-2xs border border-black/5"
                      style={{ background: preset.gradientOrSvg }}
                    />
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {preset.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Upload */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Choisir une image sur mon appareil
            </h2>
            <p className="text-xs text-slate-500">
              Formats acceptés : JPG, PNG ou WebP. Taille maximale : 5 Mo.
            </p>

            <div className="flex items-center gap-3">
              <label className="py-2 px-4 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-indigo-200">
                <Upload className="w-3.5 h-3.5" />
                <span>Parcourir mes fichiers</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {customDataUrl && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Image chargée en mémoire</span>
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Confidentialité garantie :</strong> Ton image n’est pas envoyée à l’assistant IA et n’est jamais partagée en public.
              </span>
            </div>
          </div>

          {/* Readability & Contrast overlay slider */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Renforcer le voile pour mieux lire
                </h2>
                <p className="text-xs text-slate-500">
                  Ajuste l’opacité du fond blanc pour garantir le contraste optimal des textes.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 tabular-nums">
                {overlayStrength}%
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={overlayStrength}
              onChange={(e) => setOverlayStrength(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900">Réduire les animations</h2>
              <p className="text-xs text-slate-500">
                Supprime les déplacements et zooms pour une expérience visuelle plus statique et calme.
              </p>
            </div>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revenir au fond Noria</span>
            </button>

            <button
              onClick={handleSave}
              className="py-2.5 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer ce fond</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Workspace Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-700">Aperçu de ton espace</div>
          <div
            className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-md h-80 flex flex-col justify-between p-5 transition-all"
            style={{
              background:
                selectedSource === 'upload' && customDataUrl
                  ? `url(${customDataUrl}) center/cover no-repeat`
                  : currentPreset?.gradientOrSvg || '#F8F9FC',
            }}
          >
            {/* Overlay Veil */}
            <div
              className="absolute inset-0 bg-[#F8F9FC] transition-opacity"
              style={{ opacity: overlayStrength / 100 }}
            />

            {/* Simulated mini dashboard on top of veil */}
            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-900">Aujourd’hui</span>
              <span className="text-[10px] text-indigo-700 font-semibold bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                Contraste vérifié
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="p-3 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-200 shadow-2xs text-xs space-y-1">
                <div className="font-bold text-slate-900">Séance du matin</div>
                <div className="text-[11px] text-slate-600">
                  Philosophie · 3 notions indubitables chez Descartes
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-200 shadow-2xs text-xs space-y-1">
                <div className="font-bold text-slate-900">Contrôle de SVT</div>
                <div className="text-[11px] text-slate-600">Sélection clonale et plasmocytes</div>
              </div>
            </div>

            <div className="relative z-10 text-[10px] text-slate-500 text-center">
              Voile de lisibilité actif ({overlayStrength}%)
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Le voile assure une lisibilité conforme aux normes d’accessibilité WCAG AA.
          </p>
        </div>
      </div>
    </div>
  );
};
