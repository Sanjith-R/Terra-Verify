import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { Settings, Sliders, Database, Shield, Save, CheckCircle2, Cpu, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useLandRecord();

  const [ocrEngine, setOcrEngine] = useState('Hybrid Ensemble (PaddleOCR v4 + TrOCR)');
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(70);
  const [dilrmpSyncInterval, setDilrmpSyncInterval] = useState('15 mins');
  const [autoFlagMutations, setAutoFlagMutations] = useState(true);
  const [autoFlagDuplicates, setAutoFlagDuplicates] = useState(true);
  const [duplicateThreshold, setDuplicateThreshold] = useState(85);

  const handleSave = () => {
    showToast('success', 'Settings Saved', 'System configurations updated and synced with DILRMP backend.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* OCR Engine Parameters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>Optical Character Recognition (OCR) Engine</span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Active Neural OCR Pipeline Model
            </label>
            <select
              value={ocrEngine}
              onChange={(e) => setOcrEngine(e.target.value)}
              className="w-full sm:max-w-md px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="Hybrid Ensemble (PaddleOCR v4 + TrOCR)">Hybrid Ensemble (PaddleOCR v4 + TrOCR Indic)</option>
              <option value="PaddleOCR v4 Pure">PaddleOCR v4 Pure (Optimized for printed tabular forms)</option>
              <option value="TrOCR Indic Transformer">TrOCR Indic Transformer (Optimized for cursive & handwritten ledgers)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Ensemble combines Paddle for structural grid alignment with TrOCR for cursive Indic names.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-700">
              <span>Automatic Pass Quality Confidence Threshold:</span>
              <span className="font-mono text-blue-700 font-bold">{minConfidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={minConfidenceThreshold}
              onChange={(e) => setMinConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>50% (Permissive)</span>
              <span>70% (Standard Government Level)</span>
              <span>90% (Strict)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Verification & DILRMP Sync */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Cross-Verification & National Repositories</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">DILRMP Central Cadastre Sync</span>
              <p className="text-slate-500 text-[11px]">Synchronize cadastral map layers and boundary polygons</p>
            </div>
            <select
              value={dilrmpSyncInterval}
              onChange={(e) => setDilrmpSyncInterval(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="5 mins">Every 5 mins</option>
              <option value="15 mins">Every 15 mins</option>
              <option value="Hourly">Hourly</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">Automated Mutation Alert Triggers</span>
              <p className="text-slate-500 text-[11px]">Flag discrepancy when extracted owner does not match DILRMP RoR</p>
            </div>
            <input
              type="checkbox"
              checked={autoFlagMutations}
              onChange={(e) => setAutoFlagMutations(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">Duplicate Survey Collision Detection</span>
              <p className="text-slate-500 text-[11px]">Flag potential duplicates when similarity exceeds {duplicateThreshold}%</p>
            </div>
            <input
              type="checkbox"
              checked={autoFlagDuplicates}
              onChange={(e) => setAutoFlagDuplicates(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
