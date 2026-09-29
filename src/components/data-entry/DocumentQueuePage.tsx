import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ProcessingStatus, DocumentType } from '../../types';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  Layers, 
  ArrowUpDown, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const DocumentQueuePage: React.FC = () => {
  const { records, navigateToProcessingStatus, reprocessRecord, setSelectedRecordId, setActiveNav, role } = useLandRecord();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');

  const districts = Array.from(new Set(records.map(r => r.district)));
  const types = Array.from(new Set(records.map(r => r.documentType)));

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.documentName.toLowerCase().includes(search.toLowerCase()) ||
      r.fields.ownerName.value.toLowerCase().includes(search.toLowerCase()) ||
      r.village.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.processingStatus === statusFilter;
    const matchesType = typeFilter === 'ALL' || r.documentType === typeFilter;
    const matchesDistrict = districtFilter === 'ALL' || r.district === districtFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDistrict;
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setActiveNav('upload')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          + Upload Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, name, village, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">All Processing Statuses</option>
              <option value="Uploaded">Uploaded</option>
              <option value="Processing">Processing</option>
              <option value="OCR Running">OCR Running</option>
              <option value="Validation Running">Validation Running</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Document Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">All Document Types</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick count strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of {records.length} documents
          </div>
          {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || districtFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setDistrictFilter('ALL');
                setSearch('');
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Processing Status</th>
                <th className="py-3 px-4">Confidence Score</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    No land records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {rec.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 max-w-[180px] truncate" title={rec.documentName}>
                        {rec.documentName}
                      </div>
                      <div className="text-[11px] text-slate-400">{rec.fileType} • {rec.fileSize}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {rec.documentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium">{rec.district}</div>
                      <div className="text-[11px] text-slate-400">{rec.village}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.uploadDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge type="processing" value={rec.processingStatus} />
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.overallConfidence > 0 ? (
                        <ConfidenceBadge score={rec.overallConfidence} size="sm" showLabel />
                      ) : (
                        <span className="text-slate-400 text-xs italic">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="text-[11px] text-slate-600 block truncate" title={rec.currentStage}>
                        {rec.currentStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToProcessingStatus(rec.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View processing workflow stages"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Status</span>
                        </button>

                        {rec.processingStatus === 'Failed' && (
                          <button
                            onClick={() => reprocessRecord(rec.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                            title="Re-run TrOCR on this record"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-run</span>
                          </button>
                        )}

                        {rec.processingStatus === 'Completed' && (
                          <button
                            onClick={() => {
                              setSelectedRecordId(rec.id);
                              setActiveNav('record-review');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                            title="Inspect structured review"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
