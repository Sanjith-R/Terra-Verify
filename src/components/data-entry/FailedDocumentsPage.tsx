import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  AlertOctagon, 
  RotateCcw, 
  Eye, 
  FileWarning, 
  CheckCircle2, 
  Sliders, 
  Info,
  Layers
} from 'lucide-react';

export const FailedDocumentsPage: React.FC = () => {
  const { records, reprocessRecord, navigateToProcessingStatus } = useLandRecord();

  const failedRecords = records.filter(r => r.processingStatus === 'Failed' || r.overallConfidence < 70);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 text-right">
          <span className="text-[11px] text-rose-700 font-semibold uppercase">Pending: </span>
          <span className="text-xs font-bold text-rose-900">{failedRecords.length} Document(s)</span>
        </div>
      </div>

      {/* Guidelines Banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Automated Re-OCR Resolution:</span> When you click "Re-submit Record", the digitization engine applies an adaptive binarization filter (Otsu + Sauvola thresholding) and re-evaluates the scan with the fine-tuned TrOCR Indic handwritten transformer model.
        </div>
      </div>

      {/* Failed Records List */}
      <div className="space-y-4">
        {failedRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">All Clear! No Failed Records</h3>
            <p className="text-xs text-slate-500 mt-1">All uploaded land records have cleared automated OCR structuring.</p>
          </div>
        ) : (
          failedRecords.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-rose-200 shadow-2xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <FileWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{rec.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {rec.documentType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {rec.documentName} • {rec.district}, {rec.village} • Uploaded on {rec.uploadDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">OCR Score</div>
                    <ConfidenceBadge score={rec.overallConfidence} showLabel />
                  </div>
                  <button
                    onClick={() => reprocessRecord(rec.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Re-submit with Contrast Enhancer</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    Diagnostic Failure Report:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {rec.failureReason || 'Low optical confidence in handwritten Hindi/Urdu character classification. Key cadastral entities failed Bayesian validation threshold.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-500" />
                    System Recommended Action:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Apply Morphological Opening + Sauvola Contrast Normalization. Re-feed to TrOCR (Indic) checkpoint. If still unreadable, request manual transcription.
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
