import React, { useState, useEffect } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { RecordReviewPage } from './RecordReviewPage';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  GitFork, 
  CopyCheck, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  SlidersHorizontal,
  Layers,
  FileText
} from 'lucide-react';

export const VerificationQueuePage: React.FC = () => {
  const { records, selectedRecordId, setSelectedRecordId } = useLandRecord();

  const [viewMode, setViewMode] = useState<'queue' | 'review'>(selectedRecordId ? 'review' : 'queue');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [confidenceRange, setConfidenceRange] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [mutationFilter, setMutationFilter] = useState('ALL');
  const [duplicateFilter, setDuplicateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // When selectedRecordId changes from outside, switch to review mode
  useEffect(() => {
    if (selectedRecordId) {
      setViewMode('review');
    }
  }, [selectedRecordId]);

  const activeRecord = records.find(r => r.id === selectedRecordId) || records[0];
  const pendingCount = records.filter(r => r.verificationStatus === 'Pending Verification').length;

  const handleOpenReview = (recordId: string) => {
    setSelectedRecordId(recordId);
    setViewMode('review');
  };

  const states = Array.from(new Set(records.map(r => r.state)));
  const districts = Array.from(new Set(records.map(r => r.district)));
  const villages = Array.from(new Set(records.map(r => r.village)));

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.fields.ownerName.value.toLowerCase().includes(search.toLowerCase()) ||
      r.fields.surveyNumber.value.toLowerCase().includes(search.toLowerCase()) ||
      r.village.toLowerCase().includes(search.toLowerCase());

    const matchesState = stateFilter === 'ALL' || r.state === stateFilter;
    const matchesDistrict = districtFilter === 'ALL' || r.district === districtFilter;
    const matchesVillage = villageFilter === 'ALL' || r.village === villageFilter;

    let matchesConfidence = true;
    if (confidenceRange === 'HIGH') matchesConfidence = r.overallConfidence >= 85;
    else if (confidenceRange === 'MED') matchesConfidence = r.overallConfidence >= 70 && r.overallConfidence < 85;
    else if (confidenceRange === 'LOW') matchesConfidence = r.overallConfidence < 70;

    const matchesMutation = 
      mutationFilter === 'ALL' || 
      (mutationFilter === 'DETECTED' && r.mutation.detected) ||
      (mutationFilter === 'NONE' && !r.mutation.detected);

    const matchesDuplicate = 
      duplicateFilter === 'ALL' || 
      (duplicateFilter === 'SUSPECTED' && r.duplicate.detected) ||
      (duplicateFilter === 'NONE' && !r.duplicate.detected);

    const matchesStatus = statusFilter === 'ALL' || r.verificationStatus === statusFilter;

    return (
      matchesSearch && 
      matchesState && 
      matchesDistrict && 
      matchesVillage && 
      matchesConfidence && 
      matchesMutation && 
      matchesDuplicate && 
      matchesStatus
    );
  });

  const resetAllFilters = () => {
    setSearch('');
    setStateFilter('ALL');
    setDistrictFilter('ALL');
    setVillageFilter('ALL');
    setConfidenceRange('ALL');
    setMutationFilter('ALL');
    setDuplicateFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div className="space-y-4">
      {/* Top Module Navigation Bar (Combines Queue Roster & Record Review Workspace) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl border border-slate-300 shadow-2xs self-start">
          <button
            onClick={() => setViewMode('queue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'queue'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Queue Roster</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              viewMode === 'queue' ? 'bg-blue-100 text-blue-800' : 'bg-slate-300 text-slate-700'
            }`}>
              {records.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('review')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'review'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Record Review</span>
            {activeRecord && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                viewMode === 'review' ? 'bg-blue-700 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {activeRecord.id}
              </span>
            )}
          </button>
        </div>

        {/* Status indicator on the right */}
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold self-start sm:self-auto">
          {pendingCount} Pending Adjudication
        </div>
      </div>

      {viewMode === 'review' ? (
        <RecordReviewPage onBackToQueue={() => setViewMode('queue')} />
      ) : (
        <>
          {/* Comprehensive Filter Panel */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Search & Multi-Dimensional Filters</span>
          </div>
          <button
            onClick={resetAllFilters}
            className="text-blue-600 hover:underline font-normal text-[11px]"
          >
            Clear Filters
          </button>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Owner, Survey No, Record ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* State */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* District */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Village */}
          <div>
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All Villages</option>
              {villages.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Confidence Range */}
          <div>
            <select
              value={confidenceRange}
              onChange={(e) => setConfidenceRange(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All Confidence Scores</option>
              <option value="HIGH">High Confidence (≥85%)</option>
              <option value="MED">Medium Confidence (70-84%)</option>
              <option value="LOW">Low Confidence (&lt;70%)</option>
            </select>
          </div>

          {/* Mutation Status */}
          <div>
            <select
              value={mutationFilter}
              onChange={(e) => setMutationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All Mutation Statuses</option>
              <option value="DETECTED">Mutation Detected Only</option>
              <option value="NONE">No Mutation (Clean)</option>
            </select>
          </div>

          {/* Duplicate Status */}
          <div>
            <select
              value={duplicateFilter}
              onChange={(e) => setDuplicateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
            >
              <option value="ALL">All Duplicate Flags</option>
              <option value="SUSPECTED">Duplicate Suspected</option>
              <option value="NONE">No Duplicate Matches</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900 font-medium"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Re-Verification Requested">Re-Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Survey Number</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Confidence Score</th>
                <th className="py-3 px-4">Mutation Status</th>
                <th className="py-3 px-4">Duplicate Status</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No land records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {rec.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{rec.fields.ownerName.value}</div>
                      {rec.fields.coOwners?.value && (
                        <div className="text-[11px] text-slate-400">Co: {rec.fields.coOwners.value}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {rec.fields.surveyNumber.value}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {rec.village}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {rec.district}
                    </td>
                    <td className="py-3.5 px-4">
                      <ConfidenceBadge score={rec.overallConfidence} size="sm" showLabel />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="mutation" value={rec.mutation.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="duplicate" value={rec.duplicate.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="verification" value={rec.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(rec.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Review & Adjudicate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}
</div>
);
};
