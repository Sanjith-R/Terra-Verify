import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileStack, 
  Workflow, 
  AlertOctagon, 
  History, 
  User, 
  ShieldCheck, 
  GitFork, 
  CopyCheck, 
  FileCheck2, 
  MapPin, 
  Hash, 
  BarChart3, 
  ClipboardList, 
  Settings,
  HelpCircle,
  FolderGit2
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badgeColor?: string;
  pulse?: boolean;
}

export const Sidebar: React.FC = () => {
  const { role, setRole, activeNav, setActiveNav, records } = useLandRecord();

  // Metrics for badges
  const pendingProcessingCount = records.filter(r => r.processingStatus === 'Processing' || r.processingStatus === 'OCR Running' || r.processingStatus === 'Validation Running').length;
  const failedCount = records.filter(r => r.processingStatus === 'Failed').length;
  const pendingVerificationCount = records.filter(r => r.verificationStatus === 'Pending Verification').length;
  const mutationCount = records.filter(r => r.mutation.detected && r.mutation.status === 'Detected').length;
  const duplicateCount = records.filter(r => r.duplicate.detected && r.duplicate.status === 'Suspected').length;
  const ulpinCount = records.filter(r => !!r.ulpin).length;

  const dataEntryNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Documents', icon: UploadCloud },
    { id: 'queue', label: 'Document Queue', icon: FileStack, count: records.length },
    { id: 'processing', label: 'Processing Status', icon: Workflow, count: pendingProcessingCount > 0 ? pendingProcessingCount : undefined, pulse: pendingProcessingCount > 0 },
    { id: 'failed', label: 'Failed Documents', icon: AlertOctagon, count: failedCount > 0 ? failedCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'history', label: 'Upload History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const verificationNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verification-queue', label: 'Verification Queue', icon: FileCheck2, count: pendingVerificationCount, badgeColor: 'bg-blue-600 text-white' },
    { id: 'mutation-alerts', label: 'Mutation Alerts', icon: GitFork, count: mutationCount > 0 ? mutationCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'duplicate-records', label: 'Duplicate Records', icon: CopyCheck, count: duplicateCount > 0 ? duplicateCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'gis-parcels', label: 'GIS Parcels', icon: MapPin },
    { id: 'ulpin-management', label: 'ULPIN Management', icon: Hash, count: ulpinCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentItems = role === 'DATA_ENTRY_OFFICER' ? dataEntryNavItems : verificationNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 min-h-[calc(100vh-80px)] flex flex-col justify-between border-r border-slate-800">
      <div className="p-3.5 space-y-4">
        {/* Interactive Role & Profile Switcher Card */}
        <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Profile
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              role === 'DATA_ENTRY_OFFICER' 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            }`}>
              {role === 'DATA_ENTRY_OFFICER' ? 'DEO' : 'Admin'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
              role === 'DATA_ENTRY_OFFICER' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {role === 'DATA_ENTRY_OFFICER' ? 'RS' : 'AD'}
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {role === 'DATA_ENTRY_OFFICER' ? 'Rajesh Sharma' : 'Anand Deshmukh'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {role === 'DATA_ENTRY_OFFICER' ? 'Data Entry Officer' : 'Verification Admin'}
              </div>
            </div>
          </div>

          {/* Quick Switch Buttons */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/70 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setRole('DATA_ENTRY_OFFICER');
                setActiveNav('dashboard');
              }}
              className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition cursor-pointer text-center ${
                role === 'DATA_ENTRY_OFFICER'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Switch to Data Entry Officer (Rajesh Sharma)"
            >
              DEO (RS)
            </button>
            <button
              onClick={() => {
                setRole('DATA_VERIFICATION_OFFICER');
                setActiveNav('dashboard');
              }}
              className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition cursor-pointer text-center ${
                role === 'DATA_VERIFICATION_OFFICER'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Switch to Verification Officer & Admin (Anand Deshmukh)"
            >
              Admin (AD)
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Menu Navigation
          </div>

          {currentItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                      item.badgeColor || (isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300')
                    } ${item.pulse ? 'animate-pulse' : ''}`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-3.5 border-t border-slate-800 space-y-3">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>OCR Engine:</span>
            <span className="font-semibold text-emerald-400">TrOCR + Paddle</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>DILRMP Server:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Bhu-Aadhaar ULPIN:</span>
            <span className="font-semibold text-blue-400">Active</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center">
          DILRMP Standard v4.2 • NIC Secured
        </div>
      </div>
    </aside>
  );
};
