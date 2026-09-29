import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { 
  Hash, 
  Sparkles, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Printer, 
  X,
  Search,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { LandRecord } from '../../types';

export const ULPINManagementPage: React.FC = () => {
  const { records, generateUlpinForRecord, navigateToRecordReview } = useLandRecord();
  const [selectedRecordForCert, setSelectedRecordForCert] = useState<LandRecord | null>(null);
  const [search, setSearch] = useState('');

  const ulpinRecords = records.filter(r => !!r.ulpin);
  const approvedPendingUlpin = records.filter(r => r.verificationStatus === 'Approved' && !r.ulpin);

  const filtered = ulpinRecords.filter(r => 
    (r.ulpin && r.ulpin.toLowerCase().includes(search.toLowerCase())) ||
    r.fields.ownerName.value.toLowerCase().includes(search.toLowerCase()) ||
    r.fields.surveyNumber.value.toLowerCase().includes(search.toLowerCase()) ||
    r.village.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 text-right">
          <span className="text-[11px] text-teal-700 font-semibold uppercase">Assigned: </span>
          <span className="text-xs font-bold text-teal-900">{ulpinRecords.length} Active ULPINs</span>
        </div>
      </div>

      {/* Batch generation notification if approved records lack ULPIN */}
      {approvedPendingUlpin.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
          <div>
            <strong className="text-sm font-bold block">{approvedPendingUlpin.length} Verified Records Awaiting ULPIN Generation</strong>
            <span>These records have been officially validated by the officer and are ready for cadastral key assignment.</span>
          </div>

          <button
            onClick={() => approvedPendingUlpin.forEach(r => generateUlpinForRecord(r.id))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate All Pending ULPINs</span>
          </button>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ULPIN, Owner, Survey #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Format: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">SS-DD-SSS-PPPPPP-SSS</code>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">ULPIN (Bhu-Aadhaar)</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Survey Number</th>
                <th className="py-3 px-4">Village / District</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Generation Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                    {rec.ulpin}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {rec.fields.ownerName.value}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {rec.fields.surveyNumber.value}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {rec.village}, {rec.district}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {rec.fields.plotArea.value}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {rec.ulpinGeneratedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Georeferenced
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRecordForCert(rec)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Bhu-Aadhaar Digital Certificate Modal */}
      {selectedRecordForCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecordForCert(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Canvas */}
            <div className="border-4 border-double border-slate-800 p-6 rounded-xl bg-amber-50/20 text-slate-900 font-sans space-y-5 relative">
              {/* Header */}
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-slate-800 flex items-center justify-center mb-1 text-slate-800">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase">
                  GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES
                </div>
                <div className="text-sm font-extrabold text-blue-900 uppercase">
                  Digital India Land Records Modernization Programme (DILRMP)
                </div>
                <div className="text-base font-black tracking-tight text-slate-900 uppercase pt-1">
                  BHU-AADHAAR (ULPIN) CERTIFICATE OF TITLE INTEGRITY
                </div>
              </div>

              {/* ULPIN Big Display */}
              <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1">
                <div className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                  Unique Land Parcel Identification Number
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-emerald-400">
                  {selectedRecordForCert.ulpin}
                </div>
              </div>

              {/* Attributes Table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Registered Titleholder:</span>
                  <strong className="text-slate-900 text-sm">{selectedRecordForCert.fields.ownerName.value}</strong>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Cadastral Survey / Gat:</span>
                  <strong className="text-slate-900 text-sm font-mono">{selectedRecordForCert.fields.surveyNumber.value}</strong>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Jurisdiction (Village / Tehsil):</span>
                  <strong className="text-slate-900">{selectedRecordForCert.village}, {selectedRecordForCert.tehsil}</strong>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">District & State:</span>
                  <strong className="text-slate-900">{selectedRecordForCert.district}, {selectedRecordForCert.state}</strong>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Total Extent / Area:</span>
                  <strong className="text-slate-900">{selectedRecordForCert.fields.plotArea.value}</strong>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Classification of Land:</span>
                  <strong className="text-slate-900">{selectedRecordForCert.fields.landClassification.value}</strong>
                </div>
              </div>

              {/* QR and Attestation */}
              <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div>Scan to verify against</div>
                    <div className="font-semibold text-slate-800">bhu-aadhaar.gov.in</div>
                    <div>Certified on: {selectedRecordForCert.ulpinGeneratedDate}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">Anand Deshmukh</div>
                  <div className="text-[10px] text-slate-500">Authorized Data Verification Officer</div>
                  <div className="text-[9px] text-emerald-700 font-bold uppercase mt-0.5">Digital Signature Affixed ✓</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedRecordForCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
