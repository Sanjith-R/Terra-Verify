import React from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { User, Shield, Award, Calendar, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const OfficerProfilePage: React.FC = () => {
  const { role, records } = useLandRecord();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Officer ID Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            RS
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              <Shield className="w-3.5 h-3.5" />
              Designation: Data Entry Officer (Grade-II)
            </div>
            <h2 className="text-xl font-bold text-slate-900">Rajesh Sharma</h2>
            <p className="text-xs text-slate-500">
              Employee Code: <span className="font-mono font-semibold text-slate-700">NIC-DEO-2021-4019</span>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Revenue Division: Haveli & Pindra
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Active Since: March 2021
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Documents Ingested</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,482</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">99.4% OCR readable scans</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Current Session Uploads</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{records.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Daily Target: 30 records</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">DILRMP Security Clearance</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Level 2 (DEO)</div>
          <div className="text-[11px] text-slate-500 mt-1">Authorized for RoR and Khasra scan ingestion</div>
        </div>
      </div>
    </div>
  );
};
