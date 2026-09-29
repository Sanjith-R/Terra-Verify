import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { StatusBadge } from '../common/StatusBadge';
import { CopyCheck, ArrowRight, CheckCircle2, Split, Merge, AlertTriangle } from 'lucide-react';

export const DuplicateRecordsPage: React.FC = () => {
  const { records, handleDuplicateResolution, navigateToRecordReview } = useLandRecord();

  const duplicateRecords = records.filter(r => r.duplicate.detected);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {duplicateRecords.filter(r => r.duplicate.status === 'Suspected').length} Pending Resolution
        </div>
      </div>

      {/* Duplicate Candidates List */}
      <div className="space-y-4">
        {duplicateRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Zero Cadastral Duplicates Found</h3>
            <p className="text-xs text-slate-500 mt-1">All land parcels have discrete non-overlapping cadastral identities.</p>
          </div>
        ) : (
          duplicateRecords.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-rose-200 shadow-2xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <CopyCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{rec.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        {rec.duplicate.similarityPercentage}% Similarity Collision
                      </span>
                      <StatusBadge type="duplicate" value={rec.duplicate.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Village: {rec.village} • Tehsil: {rec.tehsil} • Dist: {rec.district} • Survey: {rec.fields.surveyNumber.value}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateToRecordReview(rec.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
                >
                  <span>Review in Working Screen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Side by side comparison: Record A vs Record B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Record A */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-xs">Record A (Current Ingested File)</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">{rec.id}</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div><strong>Owner:</strong> <span className="text-slate-900 font-semibold">{rec.fields.ownerName.value}</span></div>
                    <div><strong>Survey No:</strong> <span className="font-mono font-semibold">{rec.fields.surveyNumber.value}</span></div>
                    <div><strong>Plot Area:</strong> {rec.fields.plotArea.value}</div>
                    <div><strong>Document Type:</strong> {rec.documentType}</div>
                  </div>
                </div>

                {/* Record B */}
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-200">
                    <span className="font-bold text-rose-950 text-xs">Record B (Existing Archival Record)</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-rose-200 text-rose-800 rounded">
                      {rec.duplicate.duplicateRecordId || 'DILR-RJ-2023-9081'}
                    </span>
                  </div>
                  <div className="space-y-1 text-rose-900">
                    <div><strong>Prior Registered Title:</strong> <span className="font-semibold">M/s Aravali Developers (Vendor)</span></div>
                    <div><strong>Overlapping Attributes:</strong> {rec.duplicate.matchingFields.join(', ')}</div>
                    <div><strong>Registered Registry Date:</strong> 2023-11-04 (Vol 812, Page 44)</div>
                    <div><strong>Status:</strong> Active in Cadastral GIS layer</div>
                  </div>
                </div>
              </div>

              {/* Duplicate Action Panel */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500">
                  Select resolution to sync database and update spatial GIS cadastre:
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicateResolution(rec.id, 'Merged')}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Merge className="w-3.5 h-3.5" />
                    <span>Merge Records</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateResolution(rec.id, 'Resolved (Separate)')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>Keep Separate</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateResolution(rec.id, 'False Positive')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>False Positive</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
