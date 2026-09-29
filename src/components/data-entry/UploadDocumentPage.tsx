import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { DocumentType } from '../../types';
import { STATES_AND_DISTRICTS } from '../../data/mockData';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Sparkles,
  FileCheck,
  FolderOpen,
  Info
} from 'lucide-react';

const DOCUMENT_TYPES: DocumentType[] = [
  'Ownership Record',
  'Mutation Register',
  'Survey Record',
  'Khata Record',
  'Khasra Record',
  'Land Register',
  'Sale Deed',
  'Patta Record'
];

interface SampleFilePreset {
  name: string;
  type: DocumentType;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'TIFF';
  size: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  description: string;
}

const SAMPLE_PRESETS: SampleFilePreset[] = [
  {
    name: 'Form_VII_XII_Jamabandi_Haveli_1982.pdf',
    type: 'Ownership Record',
    fileType: 'PDF',
    size: '3.6 MB',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi',
    description: 'Archival 7/12 Jamabandi ledger scan with revenue stamp and Talathi seal'
  },
  {
    name: 'Khasra_Girdawari_Fasli_Pindra_Varanasi.jpg',
    type: 'Khasra Record',
    fileType: 'JPG',
    size: '4.2 MB',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    tehsil: 'Pindra',
    village: 'Phulpur',
    description: 'Bilingual Hindi/English agricultural crop census ledger form'
  },
  {
    name: 'Registered_Sale_Deed_Bainama_Jaipur_2024.pdf',
    type: 'Sale Deed',
    fileType: 'PDF',
    size: '5.8 MB',
    state: 'Rajasthan',
    district: 'Jaipur',
    tehsil: 'Sanganer',
    village: 'Muhana',
    description: 'Conveyance deed executed at Sub-Registrar with e-Challan stamp'
  },
  {
    name: 'Government_Patta_Grant_Allotment_1974.tiff',
    type: 'Patta Record',
    fileType: 'TIFF',
    size: '7.9 MB',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi',
    description: 'Historic revenue department settlement deed on archival paper'
  }
];

export const UploadDocumentPage: React.FC = () => {
  const { uploadNewRecord, navigateToProcessingStatus } = useLandRecord();

  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [district, setDistrict] = useState<string>('Pune');
  const [tehsil, setTehsil] = useState<string>('Haveli');
  const [village, setVillage] = useState<string>('Wagholi');
  const [documentType, setDocumentType] = useState<DocumentType>('Ownership Record');
  
  const [file, setFile] = useState<{
    name: string;
    size: string;
    fileType: 'PDF' | 'JPG' | 'PNG' | 'TIFF';
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available districts and tehsils based on state
  const stateData = STATES_AND_DISTRICTS[selectedState] || STATES_AND_DISTRICTS['Maharashtra'];
  const districts = stateData.districts;
  const tehsils = stateData.tehsils[district] || ['Sadar', 'Rural'];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const newDistricts = STATES_AND_DISTRICTS[newState]?.districts || [];
    const firstDist = newDistricts[0] || 'Default District';
    setDistrict(firstDist);
    const firstTehsil = STATES_AND_DISTRICTS[newState]?.tehsils[firstDist]?.[0] || 'Default Tehsil';
    setTehsil(firstTehsil);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const firstTehsil = stateData.tehsils[newDist]?.[0] || 'Default Tehsil';
    setTehsil(firstTehsil);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileType = (['PDF', 'JPG', 'PNG', 'TIFF'].includes(ext) ? ext : 'PDF') as 'PDF' | 'JPG' | 'PNG' | 'TIFF';
      const sizeMb = (droppedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      setFile({
        name: droppedFile.name,
        size: sizeMb,
        fileType
      });
      setValidationError(null);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const ext = f.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileType = (['PDF', 'JPG', 'PNG', 'TIFF'].includes(ext) ? ext : 'PDF') as 'PDF' | 'JPG' | 'PNG' | 'TIFF';
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      setFile({
        name: f.name,
        size: sizeMb,
        fileType
      });
      setValidationError(null);
    }
  };

  const applyPreset = (preset: SampleFilePreset) => {
    setSelectedState(preset.state);
    setDistrict(preset.district);
    setTehsil(preset.tehsil);
    setVillage(preset.village);
    setDocumentType(preset.type);
    setFile({
      name: preset.name,
      size: preset.size,
      fileType: preset.fileType
    });
    setValidationError(null);
  };

  const handleSubmit = (autoProcess: boolean) => {
    if (!file) {
      setValidationError('Please select or drag-and-drop a document file (PDF, JPG, PNG, or TIFF).');
      return;
    }
    if (!village.trim()) {
      setValidationError('Please specify the Village name.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const newId = uploadNewRecord({
      documentName: file.name,
      documentType,
      state: selectedState,
      district,
      tehsil,
      village,
      fileType: file.fileType,
      fileSize: file.size,
      autoProcess
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigateToProcessingStatus(newId);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Supported: PDF, JPG, PNG, TIFF (Up to 25 MB)</span>
        </div>
      </div>

      {/* Preset Quick Select for prototype evaluation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quick Test: Pre-Configured Sample Legacy Documents
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Click any preset to auto-fill form</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-100 transition group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  {preset.fileType}
                </span>
                <span className="text-[10px] text-slate-400">{preset.size}</span>
              </div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 mt-2 line-clamp-1">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {preset.type} • {preset.district}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Administrative Jurisdiction Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Administrative Location Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                District <span className="text-rose-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {districts.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tehsil / Taluka <span className="text-rose-500">*</span>
              </label>
              <select
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {tehsils.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Village (Revenue Mouza) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Wagholi, Phulpur"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Document Classification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Land Record Classification
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full max-w-md text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting the appropriate classification routes the scan to tailored PaddleOCR & TrOCR field templates.
            </p>
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            3. Document File Ingestion
          </h3>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-600 bg-blue-50/50'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="text-sm font-bold text-slate-900">
              Drag and drop your scanned document here
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supports single or multi-page <strong className="text-slate-700">PDF, JPG, PNG, TIFF</strong> up to 25 MB
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition inline-flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Selected File Card */}
          {file && (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{file.name}</div>
                  <div className="text-[11px] text-emerald-800">
                    Format: {file.fileType} • Size: {file.size} • Ready for pipeline
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold px-2 py-1"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition"
          >
            Upload (Queue Only)
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Upload & Process (Start OCR)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
