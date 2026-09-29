import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ClipboardList, Download, Search, Filter, ShieldCheck, UserCheck, Calendar } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useLandRecord();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const actions = Array.from(new Set(auditLogs.map(l => l.action)));

  const filtered = auditLogs.filter(log => {
    const matchesSearch = 
      log.recordId.toLowerCase().includes(search.toLowerCase()) ||
      log.remarks.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const exportAuditLog = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Log ID,Timestamp,User,Role,Action,Record ID,Remarks,IP Address\n"
      + auditLogs.map(e => `"${e.id}","${e.timestamp}","${e.user}","${e.userRole}","${e.action}","${e.recordId}","${e.remarks.replace(/"/g, '""')}","${e.ipAddress || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DILRMP_Audit_Trail_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={exportAuditLog}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Record ID, user, or remark..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
          >
            <option value="ALL">All Actions</option>
            {actions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((log) => {
                let actionBadgeColor = 'bg-slate-100 text-slate-700';
                if (log.action.includes('Approved')) actionBadgeColor = 'bg-emerald-100 text-emerald-800';
                else if (log.action.includes('Rejected')) actionBadgeColor = 'bg-rose-100 text-rose-800';
                else if (log.action.includes('ULPIN')) actionBadgeColor = 'bg-teal-100 text-teal-800';
                else if (log.action.includes('Mutation')) actionBadgeColor = 'bg-amber-100 text-amber-800';
                else if (log.action.includes('OCR')) actionBadgeColor = 'bg-blue-100 text-blue-800';

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{log.user}</div>
                      <div className="text-[10px] text-slate-400">
                        {log.userRole === 'DATA_ENTRY_OFFICER' ? 'Data Entry Officer' : 'Data Verification Admin'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${actionBadgeColor}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {log.recordId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-md">
                      {log.remarks}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {log.ipAddress || '10.14.88.24'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
