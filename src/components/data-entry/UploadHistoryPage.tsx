import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { History, Download, Calendar, Filter, Search, FileText } from 'lucide-react';

export const UploadHistoryPage: React.FC = () => {
  const { records, navigateToProcessingStatus } = useLandRecord();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(r => 
    r.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => alert('Exporting Ingestion Manifest (CSV)...')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Manifest (.CSV)</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter history records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Ingested: {filtered.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Upload Timestamp</th>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">File Name & Format</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Officer In-Charge</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{r.uploadDate}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{r.documentName}</div>
                    <div className="text-[11px] text-slate-400">{r.fileType} • {r.fileSize}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{r.documentType}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{r.uploadedBy}</td>
                  <td className="py-3 px-4 text-slate-600">{r.district}, {r.village}</td>
                  <td className="py-3 px-4"><StatusBadge type="processing" value={r.processingStatus} /></td>
                  <td className="py-3 px-4 text-right">
                    {r.overallConfidence > 0 ? (
                      <ConfidenceBadge score={r.overallConfidence} size="sm" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
