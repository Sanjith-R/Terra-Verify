import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Bell, 
  Search, 
  HelpCircle,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Layers,
  ChevronDown,
  User,
  ArrowRightLeft,
  Check
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, records, auditLogs, setActiveNav, setSelectedRecordId } = useLandRecord();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof records>([]);
  const [isSearching, setIsSearching] = useState(false);

  const pendingVerificationCount = records.filter(r => r.verificationStatus === 'Pending Verification').length;
  const mutationCount = records.filter(r => r.mutation.detected && r.mutation.status === 'Detected').length;
  const failedCount = records.filter(r => r.processingStatus === 'Failed').length;

  const handleSelectRole = (newRole: 'DATA_ENTRY_OFFICER' | 'DATA_VERIFICATION_OFFICER') => {
    setRole(newRole);
    setActiveNav('dashboard');
    setShowProfileMenu(false);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const lower = q.toLowerCase();
    const filtered = records.filter(r => 
      r.id.toLowerCase().includes(lower) ||
      r.documentName.toLowerCase().includes(lower) ||
      r.fields.ownerName.value.toLowerCase().includes(lower) ||
      r.fields.surveyNumber.value.toLowerCase().includes(lower) ||
      r.village.toLowerCase().includes(lower) ||
      r.district.toLowerCase().includes(lower)
    );
    setSearchResults(filtered);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main App Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Portal Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 flex items-center justify-center text-amber-400 shadow-md border border-amber-500/20">
            {/* National emblem emblem crest silhouette */}
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base lg:text-lg leading-tight tracking-tight flex items-center gap-1.5">
                <span className="text-blue-900 font-extrabold tracking-tight">Terra</span><span className="text-emerald-600 font-extrabold tracking-tight">Verify</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Land Record Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Survey No, Owner, ULPIN, Village, or Document ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setIsSearching(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder-slate-400 transition"
            />
          </div>

          {/* Quick Search Popover */}
          {isSearching && searchQuery && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-50 max-h-72 overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider">
                Matching Records ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-400 p-3 text-center">No land records found matching "{searchQuery}"</div>
              ) : (
                searchResults.map(res => (
                  <button
                    key={res.id}
                    onClick={() => {
                      setSelectedRecordId(res.id);
                      setIsSearching(false);
                      if (role === 'DATA_VERIFICATION_OFFICER') {
                        setActiveNav('verification-queue');
                      } else {
                        setActiveNav('processing');
                      }
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-blue-50 rounded-md transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        {res.fields.ownerName.value}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Survey: {res.fields.surveyNumber.value} • {res.village}, {res.district}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {res.id}
                      </span>
                      <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                        {role === 'DATA_VERIFICATION_OFFICER' ? 'Review →' : 'View Status →'}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Prominent Profile / Role Switcher & User Profile Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Segmented Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-2 pr-1 hidden sm:inline">
              Role:
            </span>

            <button
              type="button"
              onClick={() => handleSelectRole('DATA_ENTRY_OFFICER')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                role === 'DATA_ENTRY_OFFICER'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              title="Switch to Data Entry Officer (Rajesh Sharma)"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                role === 'DATA_ENTRY_OFFICER' ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                RS
              </span>
              <div className="text-left">
                <div className="leading-tight font-bold">Data Entry</div>
                <div className={`text-[9px] leading-none hidden xl:block ${
                  role === 'DATA_ENTRY_OFFICER' ? 'text-blue-100' : 'text-slate-400'
                }`}>Rajesh Sharma</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('DATA_VERIFICATION_OFFICER')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                role === 'DATA_VERIFICATION_OFFICER'
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              title="Switch to Data Verification Officer & Administrator (Anand Deshmukh)"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                role === 'DATA_VERIFICATION_OFFICER' ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                AD
              </span>
              <div className="text-left">
                <div className="leading-tight font-bold">Admin / Verifier</div>
                <div className={`text-[9px] leading-none hidden xl:block ${
                  role === 'DATA_VERIFICATION_OFFICER' ? 'text-emerald-100' : 'text-slate-400'
                }`}>Anand Deshmukh</div>
              </div>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="System Alerts & Audit Updates"
            >
              <Bell className="w-5 h-5" />
              {(pendingVerificationCount > 0 || mutationCount > 0 || failedCount > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    System Notifications
                  </h3>
                  <span className="text-[11px] font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => setActiveNav('audit-logs')}>
                    View Audit Logs
                  </span>
                </div>

                <div className="space-y-2.5 py-3 max-h-80 overflow-y-auto">
                  {mutationCount > 0 && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-900">{mutationCount} Ownership Mutation Alert(s)</span>
                        <p className="text-amber-800 text-[11px] mt-0.5">Title change detected via registered sale deed. Requires Tehsildar approval.</p>
                      </div>
                    </div>
                  )}

                  {failedCount > 0 && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-rose-900">{failedCount} Failed OCR Recognition</span>
                        <p className="text-rose-800 text-[11px] mt-0.5">Low scan contrast in Simrol Patta 1974. Ready for re-submission.</p>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">DILRMP Database Synchronized</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">LRMS cadastral layers refreshed for Pune & Varanasi districts.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive User Profile Menu & Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs group cursor-pointer"
              title="Click to view officer profile or switch roles"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                role === 'DATA_ENTRY_OFFICER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}>
                {role === 'DATA_ENTRY_OFFICER' ? 'RS' : 'AD'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {role === 'DATA_ENTRY_OFFICER' ? 'Rajesh Sharma' : 'Anand Deshmukh'}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                    role === 'DATA_ENTRY_OFFICER' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}></span>
                  {role === 'DATA_ENTRY_OFFICER' ? 'DEO Grade-II' : 'Admin & Verifier'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
            </button>

            {/* Profile Switching Popover Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Switch Profile / Role</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">DILRMP v4</span>
                </div>

                <div className="space-y-2">
                  {/* Profile 1: Data Entry Officer */}
                  <button
                    onClick={() => handleSelectRole('DATA_ENTRY_OFFICER')}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      role === 'DATA_ENTRY_OFFICER'
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      RS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Rajesh Sharma</span>
                        {role === 'DATA_ENTRY_OFFICER' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                        Data Entry Officer (DEO)
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                        Document ingestion, scan processing, TrOCR handwriting extraction & status tracking.
                      </p>
                    </div>
                  </button>

                  {/* Profile 2: Data Verification Officer */}
                  <button
                    onClick={() => handleSelectRole('DATA_VERIFICATION_OFFICER')}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      role === 'DATA_VERIFICATION_OFFICER'
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      AD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Anand Deshmukh</span>
                        {role === 'DATA_VERIFICATION_OFFICER' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                        Verification Officer & Admin
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                        Cadastral review, title mutations, duplicate resolving, 14-digit ULPIN & GIS mapping.
                      </p>
                    </div>
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pune & Varanasi Division</span>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
