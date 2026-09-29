import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Sparkles,
  FileCheck,
  ChevronRight,
  Database
} from 'lucide-react';

const WORKFLOW_STAGES = [
  { index: 0, title: 'Document Uploaded', desc: 'File ingested, hash validated & virus scanned', icon: FileText },
  { index: 1, title: 'OCR Extraction', desc: 'PaddleOCR v4 / TrOCR Indic character extraction', icon: Cpu },
  { index: 2, title: 'Data Structuring', desc: 'Entity extraction, survey & khasra mapping', icon: Layers },
  { index: 3, title: 'Confidence Evaluation', desc: 'Field-level Bayesian probability calculation', icon: Sparkles },
  { index: 4, title: 'Cross Verification', desc: 'DILRMP & LRMS cadastral database lookup', icon: Database },
  { index: 5, title: 'Verification Queue', desc: 'Ready for Data Verification Officer sign-off', icon: ShieldCheck },
];

export const ProcessingStatusPage: React.FC = () => {
  const { records, selectedRecordId, setSelectedRecordId, reprocessRecord, navigateToRecordReview } = useLandRecord();

  const currentRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const getStageState = (stageIndex: number) => {
    if (!currentRecord) return 'upcoming';
    if (currentRecord.processingStatus === 'Failed' && stageIndex === currentRecord.processingStageIndex) {
      return 'failed';
    }
    if (currentRecord.processingStatus === 'Completed' || stageIndex < currentRecord.processingStageIndex) {
      return 'completed';
    }
    if (stageIndex === currentRecord.processingStageIndex) {
      return 'active';
    }
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Record Selector */}
      <div className="flex items-center justify-end gap-2.5">
        <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
          Selected Record:
        </label>
        <select
          value={currentRecord?.id}
          onChange={(e) => setSelectedRecordId(e.target.value)}
          className="text-xs font-mono font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-2xs"
        >
          {records.map(r => (
            <option key={r.id} value={r.id}>
              {r.id} — {r.fields.ownerName.value} ({r.processingStatus})
            </option>
          ))}
        </select>
      </div>

      {currentRecord && (
        <>
          {/* Active Record Quick Overview Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-blue-300">{currentRecord.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentRecord.documentType}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {currentRecord.documentName} • {currentRecord.district}, {currentRecord.village}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">Status</div>
                <div className="mt-0.5">
                  <StatusBadge type="processing" value={currentRecord.processingStatus} />
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">Confidence</div>
                <div className="mt-0.5">
                  {currentRecord.overallConfidence > 0 ? (
                    <ConfidenceBadge score={currentRecord.overallConfidence} size="sm" showLabel />
                  ) : (
                    <span className="text-slate-500 text-xs">Computing...</span>
                  )}
                </div>
              </div>

              {currentRecord.processingStatus === 'Failed' && (
                <button
                  onClick={() => reprocessRecord(currentRecord.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Re-submit Failed Record
                </button>
              )}

              {currentRecord.processingStatus === 'Completed' && (
                <button
                  onClick={() => navigateToRecordReview(currentRecord.id)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Review in Admin View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Tracker (Horizontal / Stepper) */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
              Six-Stage Digitization Workflow
            </h3>

            {/* Stepper Bar */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const state = getStageState(stage.index);
                const Icon = stage.icon;

                return (
                  <div 
                    key={stage.title} 
                    className={`relative p-3.5 rounded-xl border transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : state === 'active'
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : state === 'failed'
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        state === 'completed' 
                          ? 'bg-emerald-200 text-emerald-900' 
                          : state === 'active'
                          ? 'bg-blue-600 text-white'
                          : state === 'failed'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        Stage {idx + 1}
                      </span>

                      {state === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {state === 'active' && <RotateCw className="w-4 h-4 text-blue-600 animate-spin" />}
                      {state === 'failed' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      {state === 'upcoming' && <Clock className="w-4 h-4 text-slate-400" />}
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      {stage.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {stage.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vertical Flow Diagram Representation */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Architecture Pipeline Sequence
              </h4>
              
              <div className="max-w-2xl mx-auto flex flex-col items-center space-y-2 text-xs">
                <div className="w-full max-w-md p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-center font-medium text-slate-800">
                  Physical Document Scanned (PDF / JPG / TIFF)
                </div>
                <div className="text-slate-400">↓</div>

                <div className="w-full max-w-md p-2.5 rounded-lg bg-blue-50 border border-blue-300 text-center font-semibold text-blue-900 flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-700" />
                  PaddleOCR v4 + TrOCR Indic Neural Extraction
                </div>
                <div className="text-slate-400">↓</div>

                <div className="w-full max-w-md p-2.5 rounded-lg bg-indigo-50 border border-indigo-300 text-center font-semibold text-indigo-900 flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  Structured Entity Extraction (Owner, Survey, Area, Khata)
                </div>
                <div className="text-slate-400">↓</div>

                <div className="w-full max-w-md p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-center font-semibold text-amber-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Confidence Score & Quality Gate Check
                </div>
                <div className="text-slate-400">↓</div>

                <div className="w-full max-w-md p-2.5 rounded-lg bg-teal-50 border border-teal-300 text-center font-semibold text-teal-900 flex items-center justify-center gap-2">
                  <Database className="w-4 h-4 text-teal-700" />
                  Cross Verification against DILRMP & LRMS Data
                </div>
                <div className="text-slate-400">↓</div>

                <div className="w-full max-w-md p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-center font-semibold text-emerald-900 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Handover to Verification Queue for Administrator Review
                </div>
              </div>
            </div>
          </div>

          {/* Deep Inspection Panel for Selected Record */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OCR Pipeline Engine Specs */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                OCR Engine Diagnostics
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Active OCR Engine:</span>
                  <span className="font-semibold text-slate-900">{currentRecord.ocrEngine}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Detected Script / Language:</span>
                  <span className="font-semibold text-slate-900">{currentRecord.detectedLanguage}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Execution Latency:</span>
                  <span className="font-mono font-semibold text-slate-900">{currentRecord.processingTimeSeconds || 14.2}s</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Bounding Boxes Detected:</span>
                  <span className="font-mono font-semibold text-slate-900">{currentRecord.boundingBoxes.length} text regions</span>
                </div>

                {currentRecord.failureReason && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800">
                    <div className="font-bold flex items-center gap-1.5 text-xs text-rose-900 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Failure Diagnosis:
                    </div>
                    {currentRecord.failureReason}
                  </div>
                )}
              </div>
            </div>

            {/* Cross-Verification Gate Snapshot */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Cross-Verification Database Signals
              </h3>

              <div className="space-y-2.5">
                {currentRecord.crossVerifications.map((chk, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{chk.item}</div>
                      <div className="text-[11px] text-slate-500">
                        Source: {chk.source} • Extracted: "{chk.extractedValue}"
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'Matched'
                          ? 'bg-emerald-100 text-emerald-800'
                          : chk.status === 'Discrepancy'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {chk.status} ({chk.matchScore}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
