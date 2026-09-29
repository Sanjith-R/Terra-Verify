import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  Percent, 
  FileCheck, 
  Layers, 
  GitFork, 
  CopyCheck, 
  Activity,
  Award
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { records } = useLandRecord();

  const totalProcessed = records.length;
  const approvedCount = records.filter(r => r.verificationStatus === 'Approved').length;
  const approvalRate = totalProcessed > 0 ? ((approvedCount / totalProcessed) * 100).toFixed(1) : '88.4';
  const ocrAccuracy = 94.6;
  const verificationAccuracy = 98.2;

  // Monthly trends (Jan - Oct)
  const monthlyTrendsData = [
    { month: 'May', processed: 320, ocrSuccess: 304, mutations: 38, duplicates: 14 },
    { month: 'Jun', processed: 440, ocrSuccess: 420, mutations: 52, duplicates: 19 },
    { month: 'Jul', processed: 510, ocrSuccess: 490, mutations: 64, duplicates: 22 },
    { month: 'Aug', processed: 620, ocrSuccess: 598, mutations: 71, duplicates: 28 },
    { month: 'Sep', processed: 780, ocrSuccess: 755, mutations: 89, duplicates: 31 },
    { month: 'Oct (MTD)', processed: 840, ocrSuccess: 812, mutations: 94, duplicates: 36 },
  ];

  // State-wise Progress
  const stateData = [
    { state: 'Maharashtra', digitized: 840, verified: 790, pending: 50 },
    { state: 'Uttar Pradesh', digitized: 920, verified: 810, pending: 110 },
    { state: 'Rajasthan', digitized: 640, verified: 590, pending: 50 },
    { state: 'Gujarat', digitized: 710, verified: 690, pending: 20 },
    { state: 'Karnataka', digitized: 590, verified: 550, pending: 40 },
  ];

  // District-wise Progress
  const districtData = [
    { district: 'Pune', accuracy: 96.2, volume: 420 },
    { district: 'Varanasi', accuracy: 91.8, volume: 460 },
    { district: 'Jaipur', accuracy: 94.1, volume: 320 },
    { district: 'Ahmedabad', accuracy: 97.5, volume: 390 },
    { district: 'Bengaluru R.', accuracy: 95.0, volume: 290 },
  ];

  // Document Type Distribution (Pie Chart)
  const docTypeData = [
    { name: 'Ownership (Jamabandi)', value: 45, color: '#2563eb' },
    { name: 'Khasra Records', value: 25, color: '#059669' },
    { name: 'Sale Deeds', value: 15, color: '#f59e0b' },
    { name: 'Mutation Extracts', value: 10, color: '#8b5cf6' },
    { name: 'Patta Grants', value: 5, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>National Benchmark Compliance: Tier 1</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Processed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">3,700+</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% this month</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">OCR Accuracy</span>
          <div className="text-2xl font-bold text-blue-700 mt-1">{ocrAccuracy}%</div>
          <span className="text-[10px] text-slate-500">Paddle + TrOCR</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Verification Accuracy</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{verificationAccuracy}%</div>
          <span className="text-[10px] text-slate-500">Multi-source match</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Approval Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{approvalRate}%</div>
          <span className="text-[10px] text-slate-500">First-pass validation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Mutation Rate</span>
          <div className="text-2xl font-bold text-purple-700 mt-1">11.4%</div>
          <span className="text-[10px] text-slate-500">Deed transfers flagged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Duplicate Collision</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">4.2%</div>
          <span className="text-[10px] text-slate-500">Survey match overlap</span>
        </div>
      </div>

      {/* Row 1 Charts: Ingestion Trends & State-wise Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Mutation & Duplicate Trends */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mutation & Duplicate Trend Analysis</h3>
              <p className="text-xs text-slate-500">Monthly progression of title transfers and deduplication collisions</p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Trend: Upward Ingestion
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="mutations" name="Mutations Detected" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="duplicates" name="Duplicates Flagged" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: State-wise Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">State-wise Digitization vs Verification Progress</h3>
              <p className="text-xs text-slate-500">Volume of digitized records compared to final authenticated records</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="digitized" name="Total Ingested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" name="Fully Verified & ULPIN" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Document Type Distribution & District Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Document Classification Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Document Types Ingested</h3>
          <p className="text-xs text-slate-500 mb-4">Proportion of physical records digitized by legal class</p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {docTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Proportion']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {docTypeData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </span>
                <span className="font-semibold text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: District Accuracy & Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">District OCR Accuracy & Ingestion Volume</h3>
              <p className="text-xs text-slate-500">OCR recognition accuracy percentage by district administrative center</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              High Precision Tier
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Accuracy']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="accuracy" name="OCR Accuracy (%)" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
