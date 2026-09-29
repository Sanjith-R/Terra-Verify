import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { LandRecord } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Hash, 
  Database, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  GitFork, 
  CopyCheck, 
  Sparkles, 
  FileText,
  Building2,
  Printer,
  Edit3,
  ArrowLeft
} from 'lucide-react';

export interface RecordReviewPageProps {
  onBackToQueue?: () => void;
}

export const RecordReviewPage: React.FC<RecordReviewPageProps> = ({ onBackToQueue }) => {
  const { 
    records, 
    selectedRecordId, 
    setSelectedRecordId,
    updateRecordField, 
    approveRecord, 
    rejectRecord, 
    requestReVerification,
    handleMutationDecision,
    handleDuplicateResolution,
    generateUlpinForRecord
  } = useLandRecord();

  const currentRecord = records.find(r => r.id === selectedRecordId) || records[0];

  // Viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Remarks / Comments for action
  const [remarks, setRemarks] = useState<string>('');
  const [remarksError, setRemarksError] = useState<string | null>(null);
  const [copiedRawText, setCopiedRawText] = useState<boolean>(false);

  // Editable fields local state or direct update
  const [activeTab, setActiveTab] = useState<'extracted' | 'ocr' | 'cross-verify'>('extracted');

  if (!currentRecord) {
    return (
      <div className="p-12 text-center text-slate-500">
        No record selected for review.
      </div>
    );
  }

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(200, Math.max(60, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleApprove = () => {
    approveRecord(currentRecord.id, remarks || 'Verified and confirmed against cadastral land registry.');
    setRemarks('');
    setRemarksError(null);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      setRemarksError('Mandatory remarks required explaining why this record is rejected.');
      return;
    }
    rejectRecord(currentRecord.id, remarks);
    setRemarks('');
    setRemarksError(null);
  };

  const handleReVerify = () => {
    if (!remarks.trim()) {
      setRemarksError('Please provide field investigation instructions in the remarks box.');
      return;
    }
    requestReVerification(currentRecord.id, remarks);
    setRemarks('');
    setRemarksError(null);
  };

  const copyRawText = () => {
    navigator.clipboard.writeText(currentRecord.rawOcrText);
    setCopiedRawText(true);
    setTimeout(() => setCopiedRawText(false), 2000);
  };

  // Helper for field confidence color indicator
  const getFieldBorder = (confidence: number) => {
    if (confidence >= 85) return 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200';
    if (confidence >= 70) return 'border-amber-300 focus:border-amber-500 focus:ring-amber-200 bg-amber-50/20';
    return 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30';
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Record Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToQueue && (
            <button
              onClick={onBackToQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-white text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Return to Verification Queue list"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Queue Roster</span>
            </button>
          )}
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900">{currentRecord.id}</span>
              <StatusBadge type="verification" value={currentRecord.verificationStatus} />
              {currentRecord.ulpin && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  ULPIN: {currentRecord.ulpin}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {currentRecord.documentName} • {currentRecord.village}, {currentRecord.district}
            </div>
          </div>
        </div>

        {/* Record switch selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Record:</span>
          <select
            value={currentRecord.id}
            onChange={(e) => {
              setSelectedRecordId(e.target.value);
              setRemarks('');
              setRemarksError(null);
            }}
            className="text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            {records.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.fields.ownerName.value} ({r.verificationStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* LEFT PANEL: Original Document Viewer (5 cols)             */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[820px] overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleZoom(-15)}
                className="p-1.5 hover:bg-slate-800 rounded transition text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-12 text-center">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => handleZoom(15)}
                className="p-1.5 hover:bg-slate-800 rounded transition text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 hover:bg-slate-800 rounded transition text-slate-300 hover:text-white ml-1"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Bounding box toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  showBoundingBoxes 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle OCR Bounding Boxes"
              >
                {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>OCR Boxes</span>
              </button>

              {/* Page Navigator */}
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="disabled:opacity-30 hover:text-white text-slate-400"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>{currentPage}/2</span>
                <button
                  type="button"
                  disabled={currentPage === 2}
                  onClick={() => setCurrentPage(2)}
                  className="disabled:opacity-30 hover:text-white text-slate-400"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Canvas / Realistic Land Record Simulation */}
          <div className="flex-1 bg-slate-800/80 p-4 overflow-auto flex items-center justify-center relative select-none">
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-[430px] min-h-[580px] bg-[#fbf8ed] shadow-2xl rounded-sm p-6 text-slate-800 font-serif border border-amber-200/60 relative"
            >
              {/* Archival paper texture watermark */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#8b5a2b_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Government Stamp / Crest */}
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-slate-800 flex items-center justify-center mb-1 text-slate-800">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold tracking-widest uppercase">
                  GOVERNMENT OF {currentRecord.state.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-600 font-sans tracking-wide">
                  REVENUE DEPARTMENT • LAND RECORDS ARCHIVE
                </div>
                <div className="text-xs font-bold uppercase mt-1 text-blue-950 font-sans">
                  {currentRecord.documentType.toUpperCase()}
                </div>
              </div>

              {/* Realistic Archival Form Content */}
              <div className="space-y-3 text-xs leading-relaxed font-sans">
                <div className="flex justify-between border-b border-slate-300 pb-1 text-[11px]">
                  <span><strong>Village:</strong> {currentRecord.village}</span>
                  <span><strong>Tehsil:</strong> {currentRecord.tehsil}</span>
                  <span><strong>Dist:</strong> {currentRecord.district}</span>
                </div>

                <div className="bg-amber-100/40 p-2.5 rounded border border-amber-300/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[11px] text-slate-600">Survey / Gat No:</span>
                    <strong className="text-slate-900 font-mono">{currentRecord.fields.surveyNumber.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-slate-600">Khata / Ledger No:</span>
                    <strong className="text-slate-900 font-mono">{currentRecord.fields.khataNumber.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-slate-600">Khasra Number:</span>
                    <strong className="text-slate-900 font-mono">{currentRecord.fields.khasraNumber.value}</strong>
                  </div>
                </div>

                <div className="border border-slate-300 rounded p-2 text-[11px] space-y-1">
                  <div className="text-slate-500 uppercase text-[9px] font-bold">Occupant / Owner of Record</div>
                  <div className="font-bold text-slate-950 text-xs">{currentRecord.fields.ownerName.value}</div>
                  {currentRecord.fields.coOwners?.value && (
                    <div className="text-slate-600 italic">Co-holder: {currentRecord.fields.coOwners.value}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="border border-slate-300 p-2 rounded">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Total Plot Area</div>
                    <div className="font-bold text-slate-900">{currentRecord.fields.plotArea.value}</div>
                  </div>
                  <div className="border border-slate-300 p-2 rounded">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Classification</div>
                    <div className="font-bold text-slate-900">{currentRecord.fields.landClassification.value}</div>
                  </div>
                </div>

                {/* Archival seals */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-300">
                  <div className="w-16 h-16 rounded-full border-2 border-red-700/70 text-red-700/80 flex flex-col items-center justify-center text-[7px] font-bold rotate-[-12deg] p-1 text-center">
                    <span>SEAL OF</span>
                    <span>SUB-REGISTRAR</span>
                    <span>AUTHENTICATED</span>
                  </div>

                  <div className="text-right text-[10px]">
                    <div className="italic text-slate-600">Signed & Attested</div>
                    <div className="font-bold text-slate-900 font-sans">Revenue Officer / Talathi</div>
                    <div className="text-[9px] text-slate-500">Date: {currentRecord.uploadDate.split(' ')[0]}</div>
                  </div>
                </div>
              </div>

              {/* OVERLAY: OCR Bounding Boxes */}
              {showBoundingBoxes && (
                <div className="absolute inset-0 pointer-events-auto">
                  {currentRecord.boundingBoxes.map((bb) => {
                    const [x, y, w, h] = bb.box;
                    const isSelected = selectedBoxId === bb.id;
                    const colorClass = bb.confidence >= 85
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800'
                      : bb.confidence >= 70
                      ? 'border-amber-500 bg-amber-500/20 text-amber-900'
                      : 'border-rose-500 bg-rose-500/20 text-rose-900';

                    return (
                      <div
                        key={bb.id}
                        onClick={() => setSelectedBoxId(bb.id)}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${w}%`,
                          height: `${h}%`
                        }}
                        className={`absolute border-2 rounded cursor-pointer transition-all ${colorClass} ${
                          isSelected ? 'ring-2 ring-blue-600 scale-105 z-20 shadow-md' : 'opacity-85 hover:opacity-100'
                        }`}
                        title={`${bb.field}: "${bb.text}" (${bb.confidence}%)`}
                      >
                        <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[8px] font-bold bg-slate-900 text-white font-mono shadow-xs">
                          {bb.field} • {bb.confidence}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Left panel footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs flex items-center justify-between text-slate-500">
            <span>OCR Engine: <strong className="text-slate-800">{currentRecord.ocrEngine}</strong></span>
            <span>Boxes: <strong className="text-slate-800">{currentRecord.boundingBoxes.length} detected</strong></span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Extracted Structured Data & Modules (7 cols)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Navigation Tabs between Extracted Data, OCR Raw, and Cross-Verification */}
          <div className="bg-white rounded-xl border border-slate-200 p-1 flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('extracted')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'extracted'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Extracted Structured Data (Editable)
            </button>

            <button
              onClick={() => setActiveTab('ocr')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ocr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              OCR Engine Extraction Results
            </button>

            <button
              onClick={() => setActiveTab('cross-verify')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'cross-verify'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cross-Verification (DILRMP & LRMS)
            </button>
          </div>

          {/* TAB 1: EXTRACTED STRUCTURED DATA (EDITABLE FIELDS) */}
          {activeTab === 'extracted' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Extracted Cadastral Parameters</h3>
                  <p className="text-xs text-slate-500">Edit fields directly to correct OCR discrepancies before authorization.</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> High (≥85%)
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Med (70-84%)
                  </span>
                  <span className="flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Low (&lt;70%)
                  </span>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Name */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <span>Owner Name</span>
                      {currentRecord.fields.ownerName.isEdited && (
                        <span className="text-[10px] text-blue-600 font-bold">(Edited)</span>
                      )}
                    </label>
                    <ConfidenceBadge score={currentRecord.fields.ownerName.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.ownerName.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'ownerName', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.ownerName.confidence)}`}
                  />
                </div>

                {/* Co-owners */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Co-Owners / Joint Titleholders</label>
                    {currentRecord.fields.coOwners && (
                      <ConfidenceBadge score={currentRecord.fields.coOwners.confidence} size="sm" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.coOwners?.value || ''}
                    onChange={(e) => updateRecordField(currentRecord.id, 'coOwners', e.target.value)}
                    placeholder="None or list co-holders"
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.coOwners?.confidence || 90)}`}
                  />
                </div>

                {/* Survey Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Survey / Gat Number</label>
                    <ConfidenceBadge score={currentRecord.fields.surveyNumber.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.surveyNumber.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'surveyNumber', e.target.value)}
                    className={`w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.surveyNumber.confidence)}`}
                  />
                </div>

                {/* Khata Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Khata Number</label>
                    <ConfidenceBadge score={currentRecord.fields.khataNumber.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.khataNumber.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'khataNumber', e.target.value)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.khataNumber.confidence)}`}
                  />
                </div>

                {/* Khasra Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Khasra Number</label>
                    <ConfidenceBadge score={currentRecord.fields.khasraNumber.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.khasraNumber.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'khasraNumber', e.target.value)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.khasraNumber.confidence)}`}
                  />
                </div>

                {/* Plot Area */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Plot Area (Ha / Acres)</label>
                    <ConfidenceBadge score={currentRecord.fields.plotArea.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.plotArea.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'plotArea', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.plotArea.confidence)}`}
                  />
                </div>

                {/* Village */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Village (Mouza)</label>
                    <ConfidenceBadge score={currentRecord.fields.village.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.village.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'village', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.village.confidence)}`}
                  />
                </div>

                {/* Tehsil */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Tehsil / Taluka</label>
                    <ConfidenceBadge score={currentRecord.fields.tehsil.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.tehsil.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'tehsil', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.tehsil.confidence)}`}
                  />
                </div>

                {/* District */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">District</label>
                    <ConfidenceBadge score={currentRecord.fields.district.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.district.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'district', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.district.confidence)}`}
                  />
                </div>

                {/* Land Classification */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Land Classification</label>
                    <ConfidenceBadge score={currentRecord.fields.landClassification.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.landClassification.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'landClassification', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.landClassification.confidence)}`}
                  />
                </div>

                {/* Ownership Details */}
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Ownership Details / Rights Class</label>
                    <ConfidenceBadge score={currentRecord.fields.ownershipDetails.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.ownershipDetails.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'ownershipDetails', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.ownershipDetails.confidence)}`}
                  />
                </div>

                {/* Mutation Details */}
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Mutation Order & Previous Reference</label>
                    <ConfidenceBadge score={currentRecord.fields.mutationDetails.confidence} size="sm" />
                  </div>
                  <input
                    type="text"
                    value={currentRecord.fields.mutationDetails.value}
                    onChange={(e) => updateRecordField(currentRecord.id, 'mutationDetails', e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none transition ${getFieldBorder(currentRecord.fields.mutationDetails.confidence)}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OCR EXTRACTION SECTION */}
          {activeTab === 'ocr' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">OCR Extraction & Neural Model Diagnostics</h3>
                  <p className="text-xs text-slate-500">PaddleOCR v4 + TrOCR character recognition output</p>
                </div>
                <button
                  type="button"
                  onClick={copyRawText}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedRawText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRawText ? 'Copied' : 'Copy Raw Text'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">OCR Engine:</span>
                  <strong className="text-slate-900">{currentRecord.ocrEngine}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Overall Confidence:</span>
                  <ConfidenceBadge score={currentRecord.overallConfidence} showLabel />
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Detected Language:</span>
                  <strong className="text-slate-900">{currentRecord.detectedLanguage}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Raw Transcript Extracted:
                </label>
                <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {currentRecord.rawOcrText}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CROSS VERIFICATION SECTION */}
          {activeTab === 'cross-verify' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cross-Verification Database Signals</h3>
                <p className="text-xs text-slate-500">
                  Automated triangulation against Digital India Land Records Modernization Programme (DILRMP), Land Records Management System (LRMS), and district cadastral repository.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentRecord.crossVerifications.map((check, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      check.status === 'Matched'
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-amber-50/50 border-amber-300'
                    } space-y-2 text-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{check.item}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        check.status === 'Matched' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {check.status} ({check.matchScore}%)
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 text-[11px]">
                      <div><strong>Source Authority:</strong> {check.source}</div>
                      <div><strong>Database Value:</strong> <span className="font-medium text-slate-800">{check.databaseValue}</span></div>
                      <div><strong>Extracted from Document:</strong> <span className="font-medium text-slate-800">{check.extractedValue}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MUTATION DETECTION MODULE (CONDITIONAL)                  */}
          {/* ======================================================== */}
          {currentRecord.mutation.detected && (
            <div className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <GitFork className="w-5 h-5 text-amber-700" />
                  <span>Ownership Mutation Detected (Chain of Title Alert)</span>
                </div>
                <StatusBadge type="mutation" value={currentRecord.mutation.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-3 rounded-lg border border-amber-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Previous Titleholder:</span>
                  <strong className="text-slate-900">{currentRecord.mutation.previousOwner}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Current Claimant / Buyer:</span>
                  <strong className="text-slate-900">{currentRecord.mutation.currentOwner}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Mutation Deed Execution:</span>
                  <strong className="text-slate-900">{currentRecord.mutation.mutationDate} ({currentRecord.mutation.mutationType})</strong>
                </div>
              </div>

              <div className="text-xs text-amber-900">
                <span className="font-semibold">Supporting Instruments: </span>
                {currentRecord.mutation.supportingDocuments.join(', ')}
              </div>

              {currentRecord.mutation.notes && (
                <div className="text-xs text-amber-800 italic bg-amber-100/50 p-2 rounded">
                  Note: {currentRecord.mutation.notes}
                </div>
              )}

              {/* Mutation Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleMutationDecision(currentRecord.id, 'Approved', 'Mutation approved per registered deed.')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Approve Mutation
                </button>
                <button
                  type="button"
                  onClick={() => handleMutationDecision(currentRecord.id, 'Rejected', 'Mutation rejected due to title dispute.')}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Reject Mutation
                </button>
                <button
                  type="button"
                  onClick={() => handleMutationDecision(currentRecord.id, 'Under Investigation', 'Referred to Tehsildar Court.')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  Needs Investigation
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* DUPLICATE DETECTION MODULE (CONDITIONAL)                 */}
          {/* ======================================================== */}
          {currentRecord.duplicate.detected && (
            <div className="bg-rose-50/90 border-2 border-rose-300 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                  <CopyCheck className="w-5 h-5 text-rose-700" />
                  <span>Potential Duplicate Record Flagged ({currentRecord.duplicate.similarityPercentage}% Similarity)</span>
                </div>
                <StatusBadge type="duplicate" value={currentRecord.duplicate.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-rose-200">
                  <div className="font-bold text-slate-800 text-xs mb-1">Record A (Current Intake):</div>
                  <div className="text-slate-600">{currentRecord.id} • {currentRecord.fields.ownerName.value}</div>
                  <div className="text-slate-500 text-[11px]">Survey: {currentRecord.fields.surveyNumber.value} ({currentRecord.fields.plotArea.value})</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-rose-200">
                  <div className="font-bold text-slate-800 text-xs mb-1">Record B (Archival Match):</div>
                  <div className="text-slate-600">{currentRecord.duplicate.duplicateRecordId || 'DILR-ARCHIVE-9081'}</div>
                  <div className="text-slate-500 text-[11px]">Matches: {currentRecord.duplicate.matchingFields.join(', ')}</div>
                </div>
              </div>

              {/* Duplicate Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDuplicateResolution(currentRecord.id, 'Merged')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Merge Records
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateResolution(currentRecord.id, 'Resolved (Separate)')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  Keep Separate
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateResolution(currentRecord.id, 'False Positive')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Mark False Positive
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ULPIN GENERATION MODULE                                  */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Unique Land Parcel Identification Number (ULPIN)</h4>
                  <p className="text-xs text-blue-200">14-Digit Bhu-Aadhaar National Standard Cadastral Key</p>
                </div>
              </div>

              {currentRecord.ulpin ? (
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono">
                  ACTIVE & GEOREFERENCED
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => generateUlpinForRecord(currentRecord.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate ULPIN Now</span>
                </button>
              )}
            </div>

            {currentRecord.ulpin && (
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-sans">Assigned ULPIN</span>
                  <span className="text-base font-bold text-white tracking-wider">{currentRecord.ulpin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-sans">Generation Date</span>
                  <span className="text-slate-200">{currentRecord.ulpinGeneratedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-sans">GIS Lat / Lng</span>
                  <span className="text-slate-200">18.5793° N, 73.9812° E</span>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* VERIFICATION ACTION PANEL                                */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verification Action & Officer Decision
            </h4>

            {remarksError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{remarksError}</span>
              </div>
            )}

            {/* Comment Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adjudication Remarks / Auditor Notes <span className="text-slate-400 font-normal">(Mandatory before rejection)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Enter remarks or grounds for approval / rejection / re-survey..."
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (remarksError) setRemarksError(null);
                }}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReVerify}
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Request Re-Verification</span>
              </button>

              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Record</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Record & Sign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
