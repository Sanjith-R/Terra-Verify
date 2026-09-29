import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { StatusBadge } from '../common/StatusBadge';
import { GitFork, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldAlert, FileText, Check } from 'lucide-react';

export const MutationAlertsPage: React.FC = () => {
  const { records, handleMutationDecision, navigateToRecordReview } = useLandRecord();
  const [filter, setFilter] = useState<'ALL' | 'DETECTED' | 'APPROVED' | 'REJECTED' | 'INVESTIGATION'>('ALL');

  const mutationRecords = records.filter(r => r.mutation.detected);

  const filtered = mutationRecords.filter(r => {
    if (filter === 'DETECTED') return r.mutation.status === 'Detected';
    if (filter === 'APPROVED') return r.mutation.status === 'Approved';
    if (filter === 'REJECTED') return r.mutation.status === 'Rejected';
    if (filter === 'INVESTIGATION') return r.mutation.status === 'Under Investigation';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          {mutationRecords.filter(r => r.mutation.status === 'Detected').length} Pending Adjudication
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          All Mutation Alerts ({mutationRecords.length})
        </button>
        <button
          onClick={() => setFilter('DETECTED')}
          className={`px-3 py-1.5 rounded-lg transition ${filter === 'DETECTED' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Pending Review ({mutationRecords.filter(r => r.mutation.status === 'Detected').length})
        </button>
        <button
          onClick={() => setFilter('APPROVED')}
          className={`px-3 py-1.5 rounded-lg transition ${filter === 'APPROVED' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Approved Mutations
        </button>
        <button
          onClick={() => setFilter('INVESTIGATION')}
          className={`px-3 py-1.5 rounded-lg transition ${filter === 'INVESTIGATION' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Inquiry Pending
        </button>
      </div>

      {/* Mutation List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No Mutation Alerts Under This Filter</h3>
            <p className="text-xs text-slate-500 mt-1">All records are current and clear.</p>
          </div>
        ) : (
          filtered.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-amber-200/80 shadow-2xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <GitFork className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{rec.mutation.mutationId || rec.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        Type: {rec.mutation.mutationType}
                      </span>
                      <StatusBadge type="mutation" value={rec.mutation.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Village: {rec.village} • Tehsil: {rec.tehsil} • Dist: {rec.district} • Survey: {rec.fields.surveyNumber.value}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateToRecordReview(rec.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto transition"
                >
                  <span>Open Full Record Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Titleholder Chain Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Previous Owner (Vendor / Deceased):</span>
                  <div className="font-bold text-slate-900 text-sm">{rec.mutation.previousOwner}</div>
                  <div className="text-[11px] text-slate-500">Listed on legacy 7/12 Jamabandi ledger</div>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Current Titleholder (Purchaser / Heir):</span>
                  <div className="font-bold text-emerald-950 text-sm">{rec.mutation.currentOwner}</div>
                  <div className="text-[11px] text-emerald-800">Date of Instrument: {rec.mutation.mutationDate}</div>
                </div>
              </div>

              {/* Supporting Instruments */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">Verified Supporting Evidences: </span>
                <span>{rec.mutation.supportingDocuments.join(' • ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500 italic">
                  Statutory provision: Section 129(A) Land Revenue Code Adjudication
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMutationDecision(rec.id, 'Under Investigation', 'Referred to Circle Inspector for field verification.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    Needs Investigation
                  </button>
                  <button
                    onClick={() => handleMutationDecision(rec.id, 'Rejected', 'Rejected due to title dispute or defective deed.')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition"
                  >
                    Reject Mutation
                  </button>
                  <button
                    onClick={() => handleMutationDecision(rec.id, 'Approved', 'Mutation approved and title mutated into RoR.')}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Approve Mutation
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
