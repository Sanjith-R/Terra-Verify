import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  FileUp, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Percent, 
  Layers,
  ArrowUpRight,
  Upload,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const DataEntryDashboard: React.FC = () => {
  const { records, setActiveNav, setSelectedRecordId, navigateToProcessingStatus } = useLandRecord();

  const totalUploaded = records.length;
  const processingCount = records.filter(r => r.processingStatus === 'Processing' || r.processingStatus === 'OCR Running' || r.processingStatus === 'Validation Running').length;
  const completedCount = records.filter(r => r.processingStatus === 'Completed').length;
  const failedCount = records.filter(r => r.processingStatus === 'Failed').length;

  const validRecordsWithConfidence = records.filter(r => r.overallConfidence > 0);
  const avgConfidence = validRecordsWithConfidence.length > 0 
    ? (validRecordsWithConfidence.reduce((acc, r) => acc + r.overallConfidence, 0) / validRecordsWithConfidence.length).toFixed(1)
    : '0';

  const statusChartData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'In Processing', value: processingCount, color: '#3b82f6' },
    { name: 'Failed OCR', value: failedCount, color: '#ef4444' },
    { name: 'Queued', value: records.filter(r => r.processingStatus === 'Uploaded').length, color: '#64748b' }
  ].filter(d => d.value > 0);

  const dailyThroughputData = [
    { day: 'Mon', uploaded: 18, ocrSuccess: 17 },
    { day: 'Tue', uploaded: 24, ocrSuccess: 22 },
    { day: 'Wed', uploaded: 31, ocrSuccess: 29 },
    { day: 'Thu', uploaded: 28, ocrSuccess: 26 },
    { day: 'Fri', uploaded: 35, ocrSuccess: 33 },
    { day: 'Sat', uploaded: 12, ocrSuccess: 11 },
    { day: 'Today', uploaded: records.length, ocrSuccess: completedCount }
  ];

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          onClick={() => setActiveNav('upload')}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
        <button
          onClick={() => setActiveNav('queue')}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 shadow-2xs transition"
        >
          <Layers className="w-4 h-4" />
          <span>View Queue</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveNav('queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition">Documents Uploaded Today</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
              <FileUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalUploaded}</div>
          <div className="flex items-center justify-between text-xs text-emerald-600 mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% today</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('processing-status')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition">Documents Processing</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition">
              <RotateCw className={`w-5 h-5 ${processingCount > 0 ? 'animate-spin' : ''}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{processingCount}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Active OCR pipelines</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition">Documents Completed</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{completedCount}</div>
          <div className="flex items-center justify-between text-xs text-emerald-600 mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Ready for Review</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('failed')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-rose-600 transition">Failed OCR Records</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{failedCount}</div>
          <div className="flex items-center justify-between text-xs text-rose-600 mt-2 font-medium">
            <span>Requires manual filter</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>
      </div>

      {/* Additional Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">OCR Success Rate</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{avgConfidence}%</div>
            <div className="text-[11px] text-slate-500">Threshold requirement: &gt;75%</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Average Processing Time</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">14.8 seconds</div>
            <div className="text-[11px] text-slate-500">PaddleOCR + TrOCR Indic Ensemble</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Pending Queue Count</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{records.filter(r => r.verificationStatus === 'Pending Verification').length} Records</div>
            <div className="text-[11px] text-slate-500">Waiting for Verification Officer</div>
          </div>
        </div>
      </div>

      {/* Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing status chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Processing Status Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Current state of ingested land records</p>
          
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val, name) => [`${val} Documents`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            {statusChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600">{d.name}:</span>
                <span className="font-semibold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OCR Success Statistics */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">Weekly Digitization & OCR Success Statistics</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              94.6% Accuracy Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Volume of documents ingested vs successfully structured</p>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyThroughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="uploaded" name="Uploaded Documents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ocrSuccess" name="OCR Extracted Cleanly" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Uploads</h3>
            <p className="text-xs text-slate-500">Latest digitized records in local district queue</p>
          </div>
          <button
            onClick={() => setActiveNav('queue')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>View All Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">District / Village</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">OCR Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.slice(0, 5).map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {rec.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate" title={rec.documentName}>
                    {rec.documentName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {rec.documentType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {rec.district} • {rec.village}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {rec.uploadDate}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge type="processing" value={rec.processingStatus} />
                  </td>
                  <td className="py-3 px-4">
                    {rec.overallConfidence > 0 ? (
                      <ConfidenceBadge score={rec.overallConfidence} size="sm" showLabel />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigateToProcessingStatus(rec.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Stage
                    </button>
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
