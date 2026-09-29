import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  FileCheck, 
  Clock, 
  GitFork, 
  CopyCheck, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  MapPin, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const VerificationDashboard: React.FC = () => {
  const { records, auditLogs, setActiveNav, setSelectedRecordId, navigateToRecordReview } = useLandRecord();

  const totalRecords = records.length;
  const pendingVerification = records.filter(r => r.verificationStatus === 'Pending Verification').length;
  const mutationAlerts = records.filter(r => r.mutation.detected && r.mutation.status === 'Detected').length;
  const duplicateRecords = records.filter(r => r.duplicate.detected && r.duplicate.status === 'Suspected').length;
  const approvedRecords = records.filter(r => r.verificationStatus === 'Approved').length;
  const rejectedRecords = records.filter(r => r.verificationStatus === 'Rejected').length;
  const ulpinGenerated = records.filter(r => !!r.ulpin).length;
  const gisLinked = records.filter(r => !!r.gisCoordinates).length;

  // Chart data
  const stateProgressData = [
    { state: 'Maharashtra', target: 2400, verified: 2180, pending: 220 },
    { state: 'Uttar Pradesh', target: 3100, verified: 2650, pending: 450 },
    { state: 'Rajasthan', target: 1950, verified: 1720, pending: 230 },
    { state: 'Gujarat', target: 2200, verified: 2090, pending: 110 },
    { state: 'Karnataka', target: 1800, verified: 1640, pending: 160 },
  ];

  const districtProgressData = [
    { district: 'Pune', progress: 91 },
    { district: 'Varanasi', progress: 85 },
    { district: 'Jaipur', progress: 88 },
    { district: 'Ahmedabad', progress: 95 },
    { district: 'Bengaluru R.', progress: 90 },
  ];

  const verificationTrendData = [
    { week: 'W1', approved: 42, rejected: 3, mutations: 8 },
    { week: 'W2', approved: 58, rejected: 4, mutations: 11 },
    { week: 'W3', approved: 64, rejected: 2, mutations: 14 },
    { week: 'W4', approved: 72, rejected: 5, mutations: 9 },
    { week: 'Current', approved: approvedRecords * 10 + 40, rejected: rejectedRecords * 5 + 4, mutations: mutationAlerts * 4 + 6 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setActiveNav('verification-queue')}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <span>Review Queue ({pendingVerification})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 8 Primary KPI Cards (Clickable Navigation) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        <button
          onClick={() => setActiveNav('verification-queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-blue-600 transition">Total Records</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Ingested records</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('verification-queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-amber-600 transition">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{pendingVerification}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Awaiting sign-off</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('mutation-alerts')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-purple-600 transition">Mutation Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{mutationAlerts}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Title transfers</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('duplicate-records')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-rose-600 transition">Duplicate Records</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition">
              <CopyCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{duplicateRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Colliding surveys</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('verification-queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-emerald-600 transition">Approved Records</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{approvedRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Digitally signed</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('verification-queue')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-slate-900 transition">Rejected Records</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-2">{rejectedRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Discrepancy logged</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('ulpin-management')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-teal-600 transition">ULPIN Generated</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-700 mt-2">{ulpinGenerated}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Bhu-Aadhaar assigned</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => setActiveNav('gis-parcels')}
          className="bg-white text-left rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase group-hover:text-indigo-600 transition">GIS Linked Parcels</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">{gisLinked}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Polygons mapped</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
          </div>
        </button>
      </div>

      {/* Progress Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Progress Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">State-wise Digitization & Verification Target</h3>
            <button
              onClick={() => setActiveNav('analytics')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">Total target records vs validated across major participating states</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="verified" name="Verified Records" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending Review" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Trend Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">Weekly Verification Trends</h3>
            <button
              onClick={() => setActiveNav('analytics')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">Weekly volume of approved records and mutations handled</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={verificationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mutations" name="Mutations Handled" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District Progress Bars & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District-wise Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">District-wise Cadastral Coverage</h3>
          <p className="text-xs text-slate-500 mb-4">% of village cadastre digitized and verified</p>

          <div className="space-y-4">
            {districtProgressData.map((d) => (
              <div key={d.district} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{d.district} District</span>
                  <span className="font-bold text-slate-900">{d.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.progress >= 90 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${d.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveNav('analytics')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Detailed Analytics →
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Verification Activity Feed</h3>
              <p className="text-xs text-slate-500">Live immutable audit trail of actions taken</p>
            </div>
            <button
              onClick={() => setActiveNav('audit-logs')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>All Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                      {log.recordId}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {log.remarks}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    By {log.user} ({log.userRole === 'DATA_ENTRY_OFFICER' ? 'DEO' : 'Admin'})
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {log.timestamp.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
