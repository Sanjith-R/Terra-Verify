import React from 'react';
import { LandRecordProvider, useLandRecord } from './context/LandRecordContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Data Entry Pages
import { DataEntryDashboard } from './components/data-entry/DataEntryDashboard';
import { UploadDocumentPage } from './components/data-entry/UploadDocumentPage';
import { DocumentQueuePage } from './components/data-entry/DocumentQueuePage';
import { ProcessingStatusPage } from './components/data-entry/ProcessingStatusPage';
import { FailedDocumentsPage } from './components/data-entry/FailedDocumentsPage';
import { UploadHistoryPage } from './components/data-entry/UploadHistoryPage';
import { OfficerProfilePage } from './components/data-entry/OfficerProfilePage';

// Verification Pages
import { VerificationDashboard } from './components/verification/VerificationDashboard';
import { VerificationQueuePage } from './components/verification/VerificationQueuePage';
import { RecordReviewPage } from './components/verification/RecordReviewPage';
import { MutationAlertsPage } from './components/verification/MutationAlertsPage';
import { DuplicateRecordsPage } from './components/verification/DuplicateRecordsPage';
import { GISParcelPage } from './components/verification/GISParcelPage';
import { ULPINManagementPage } from './components/verification/ULPINManagementPage';
import { AnalyticsPage } from './components/verification/AnalyticsPage';
import { AuditLogPage } from './components/verification/AuditLogPage';
import { SettingsPage } from './components/verification/SettingsPage';

import { X, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, activeNav, toasts, dismissToast } = useLandRecord();

  const renderActiveView = () => {
    if (role === 'DATA_ENTRY_OFFICER') {
      switch (activeNav) {
        case 'upload':
          return <UploadDocumentPage />;
        case 'queue':
          return <DocumentQueuePage />;
        case 'processing':
          return <ProcessingStatusPage />;
        case 'failed':
          return <FailedDocumentsPage />;
        case 'history':
          return <UploadHistoryPage />;
        case 'profile':
          return <OfficerProfilePage />;
        case 'record-review':
          return <VerificationQueuePage />;
        case 'dashboard':
        default:
          return <DataEntryDashboard />;
      }
    } else {
      // DATA_VERIFICATION_OFFICER (Administrator)
      switch (activeNav) {
        case 'record-review':
        case 'verification-queue':
          return <VerificationQueuePage />;
        case 'mutation-alerts':
          return <MutationAlertsPage />;
        case 'duplicate-records':
          return <DuplicateRecordsPage />;
        case 'gis-parcels':
          return <GISParcelPage />;
        case 'ulpin-management':
          return <ULPINManagementPage />;
        case 'analytics':
          return <AnalyticsPage />;
        case 'audit-logs':
          return <AuditLogPage />;
        case 'settings':
          return <SettingsPage />;
        case 'dashboard':
        default:
          return <VerificationDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 font-sans text-slate-900">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Role-specific Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Toast Alerts Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-start gap-3 transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-500/40'
                : toast.type === 'warning'
                ? 'bg-amber-950 text-white border-amber-500/40'
                : 'bg-slate-900 text-white border-blue-500/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="text-xs font-bold leading-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LandRecordProvider>
      <AppContent />
    </LandRecordProvider>
  );
}
