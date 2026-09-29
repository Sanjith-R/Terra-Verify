import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  LandRecord, 
  UserRole, 
  AuditLogItem, 
  DocumentType,
  MutationStatus,
  DuplicateStatus
} from '../types';
import { INITIAL_LAND_RECORDS, INITIAL_AUDIT_LOGS } from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface LandRecordContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  records: LandRecord[];
  auditLogs: AuditLogItem[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (type: ToastNotification['type'], title: string, message: string) => void;
  
  // Navigation helper
  navigateToRecordReview: (recordId: string) => void;
  navigateToProcessingStatus: (recordId: string) => void;

  // Actions
  uploadNewRecord: (params: {
    documentName: string;
    documentType: DocumentType;
    state: string;
    district: string;
    tehsil: string;
    village: string;
    fileType: 'PDF' | 'JPG' | 'PNG' | 'TIFF';
    fileSize: string;
    autoProcess: boolean;
  }) => string;

  reprocessRecord: (recordId: string) => void;
  updateRecordField: (recordId: string, fieldKey: keyof LandRecord['fields'], value: string) => void;
  approveRecord: (recordId: string, remarks: string) => void;
  rejectRecord: (recordId: string, remarks: string) => void;
  requestReVerification: (recordId: string, remarks: string) => void;
  handleMutationDecision: (recordId: string, status: MutationStatus, notes: string) => void;
  handleDuplicateResolution: (recordId: string, status: DuplicateStatus) => void;
  generateUlpinForRecord: (recordId: string) => string;
}

const LandRecordContext = createContext<LandRecordContextType | undefined>(undefined);

export const LandRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('DATA_VERIFICATION_OFFICER');
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('DILR-MH-2024-8841');
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addAuditLog = useCallback((action: string, recordId: string, remarks: string) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: role === 'DATA_ENTRY_OFFICER' ? 'Rajesh Sharma (DEO-401)' : 'Anand Deshmukh (Admin)',
      userRole: role,
      action,
      recordId,
      remarks,
      ipAddress: '10.14.88.' + (role === 'DATA_ENTRY_OFFICER' ? '24' : '102')
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [role]);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    setActiveNav('dashboard');
    showToast(
      'info',
      `Switched to ${newRole === 'DATA_ENTRY_OFFICER' ? 'Data Entry Officer' : 'Data Verification Officer (Admin)'}`,
      'Dashboard view and permissions updated.'
    );
  }, [showToast]);

  const navigateToRecordReview = useCallback((recordId: string) => {
    setSelectedRecordId(recordId);
    if (role !== 'DATA_VERIFICATION_OFFICER') {
      setRoleState('DATA_VERIFICATION_OFFICER');
    }
    setActiveNav('verification-queue');
  }, [role]);

  const navigateToProcessingStatus = useCallback((recordId: string) => {
    setSelectedRecordId(recordId);
    setActiveNav('processing');
  }, []);

  const uploadNewRecord = useCallback((params: {
    documentName: string;
    documentType: DocumentType;
    state: string;
    district: string;
    tehsil: string;
    village: string;
    fileType: 'PDF' | 'JPG' | 'PNG' | 'TIFF';
    fileSize: string;
    autoProcess: boolean;
  }) => {
    const newId = `DILR-${params.state.substring(0, 2).toUpperCase()}-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: LandRecord = {
      id: newId,
      documentName: params.documentName,
      documentType: params.documentType,
      fileType: params.fileType,
      fileSize: params.fileSize,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      uploadedBy: 'Rajesh Sharma (DEO-401)',
      state: params.state,
      district: params.district,
      tehsil: params.tehsil,
      village: params.village,
      processingStatus: params.autoProcess ? 'Processing' : 'Uploaded',
      currentStage: params.autoProcess ? 'Executing OCR Extraction (PaddleOCR v4)' : 'Queued for Digitization Engine',
      processingStageIndex: params.autoProcess ? 1 : 0,
      overallConfidence: params.autoProcess ? 92.5 : 0,
      ocrEngine: 'PaddleOCR v4',
      detectedLanguage: 'Dual Script (Regional & English)',
      processingTimeSeconds: params.autoProcess ? 6.2 : 0,
      sampleDocType: 'jamabandi',
      fields: {
        ownerName: { value: 'Rameshwar Mahadev Shinde', confidence: 94, isEdited: false },
        coOwners: { value: 'Suman Rameshwar Shinde', confidence: 89, isEdited: false },
        surveyNumber: { value: '204/1B', confidence: 96, isEdited: false },
        khataNumber: { value: 'KH-492', confidence: 91, isEdited: false },
        khasraNumber: { value: '204/1B/4', confidence: 93, isEdited: false },
        village: { value: params.village, confidence: 99, isEdited: false },
        tehsil: { value: params.tehsil, confidence: 98, isEdited: false },
        district: { value: params.district, confidence: 99, isEdited: false },
        plotArea: { value: '1.850 Hectares (4.57 Acres)', confidence: 92, isEdited: false },
        landClassification: { value: 'Jirayat (Agricultural)', confidence: 90, isEdited: false },
        ownershipDetails: { value: 'Class I Bhumiswami Occupant', confidence: 94, isEdited: false },
        mutationDetails: { value: 'Regular Mutation Entry', confidence: 88, isEdited: false }
      },
      rawOcrText: `REVENUE DEPARTMENT\nDocument Type: ${params.documentType}\nDistrict: ${params.district} | Tehsil: ${params.tehsil} | Village: ${params.village}\nOwner: Rameshwar Mahadev Shinde\nSurvey: 204/1B | Khata: KH-492\nArea: 1.850 Ha`,
      boundingBoxes: [
        { id: 'nb1', field: 'Owner Name', box: [15, 25, 45, 6], text: 'Rameshwar Mahadev Shinde', confidence: 94 },
        { id: 'nb2', field: 'Survey Number', box: [65, 25, 25, 6], text: '204/1B', confidence: 96 }
      ],
      crossVerifications: [
        { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Rameshwar Mahadev Shinde', extractedValue: 'Rameshwar Mahadev Shinde', matchScore: 97 },
        { item: 'Survey Match', source: 'LRMS', status: 'Matched', databaseValue: '204/1B', extractedValue: '204/1B', matchScore: 96 },
        { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '1.850 Ha', extractedValue: '1.850 Hectares', matchScore: 95 },
        { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: params.village, extractedValue: params.village, matchScore: 100 }
      ],
      mutation: {
        detected: false,
        previousOwner: '',
        currentOwner: 'Rameshwar Mahadev Shinde',
        mutationDate: '',
        mutationType: 'Sale',
        supportingDocuments: [],
        status: 'None'
      },
      duplicate: {
        detected: false,
        similarityPercentage: 8.0,
        matchingFields: [],
        status: 'None'
      },
      verificationStatus: 'Pending Verification'
    };

    setRecords(prev => [newRecord, ...prev]);
    addAuditLog('Document Uploaded', newId, `Document ${params.documentName} uploaded under ${params.village}, ${params.district}.`);
    showToast('success', 'Document Uploaded', `Document registered successfully with ID ${newId}`);

    // If auto-process was chosen, simulate automated stages completing after brief delays
    if (params.autoProcess) {
      setTimeout(() => {
        setRecords(curr => curr.map(r => r.id === newId ? {
          ...r,
          processingStatus: 'OCR Running',
          currentStage: 'Extracting text and bounding boxes via TrOCR & PaddleOCR',
          processingStageIndex: 2
        } : r));
      }, 1200);

      setTimeout(() => {
        setRecords(curr => curr.map(r => r.id === newId ? {
          ...r,
          processingStatus: 'Validation Running',
          currentStage: 'Cross-verifying against DILRMP & LRMS databases',
          processingStageIndex: 4
        } : r));
      }, 2500);

      setTimeout(() => {
        setRecords(curr => curr.map(r => r.id === newId ? {
          ...r,
          processingStatus: 'Completed',
          currentStage: 'Ready for Officer Verification',
          processingStageIndex: 5,
          overallConfidence: 94.8
        } : r));
        addAuditLog('OCR Completed', newId, 'PaddleOCR + TrOCR extracted structured data. Confidence: 94.8%.');
      }, 4000);
    }

    return newId;
  }, [addAuditLog, showToast]);

  const reprocessRecord = useCallback((recordId: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        processingStatus: 'OCR Running',
        currentStage: 'Re-running TrOCR enhanced model with contrast filters',
        processingStageIndex: 1,
        failureReason: undefined
      };
    }));

    addAuditLog('Re-submission Requested', recordId, 'Data Entry Officer triggered re-OCR processing with enhanced filter.');
    showToast('info', 'Re-processing Triggered', `Re-scanning document ${recordId} with high-contrast Indic model.`);

    setTimeout(() => {
      setRecords(prev => prev.map(rec => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          processingStatus: 'Completed',
          currentStage: 'Ready for Officer Verification',
          processingStageIndex: 5,
          overallConfidence: 84.6,
          ocrEngine: 'TrOCR (Indic)'
        };
      }));
      addAuditLog('OCR Completed', recordId, 'Re-OCR completed successfully with 84.6% confidence.');
      showToast('success', 'Re-processing Succeeded', `Record ${recordId} is now verified and ready in queue.`);
    }, 2800);
  }, [addAuditLog, showToast]);

  const updateRecordField = useCallback((recordId: string, fieldKey: keyof LandRecord['fields'], value: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      const currentField = rec.fields[fieldKey];
      return {
        ...rec,
        fields: {
          ...rec.fields,
          [fieldKey]: {
            ...currentField,
            value,
            confidence: 99, // Manually verified field elevates to 99%
            isEdited: true
          }
        }
      };
    }));
  }, []);

  const generateUlpinForRecord = useCallback((recordId: string): string => {
    const rec = records.find(r => r.id === recordId);
    const stateCode = rec ? (rec.state === 'Maharashtra' ? 'MH' : rec.state === 'Uttar Pradesh' ? 'UP' : rec.state === 'Rajasthan' ? 'RJ' : rec.state === 'Gujarat' ? 'GJ' : 'KA') : 'IN';
    const distCode = '27';
    const subDist = '014';
    const randomParcel = Math.floor(100000 + Math.random() * 900000);
    const ulpin = `${stateCode}-${distCode}-${subDist}-${randomParcel}-001`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        ulpin,
        ulpinGeneratedDate: now,
        gisCoordinates: r.gisCoordinates || [18.5793, 73.9812]
      };
    }));

    addAuditLog('ULPIN Generated', recordId, `Unique Land Parcel Identification Number ${ulpin} generated and registered into Bhu-Aadhaar.`);
    showToast('success', 'ULPIN Generated', `Assigned Bhu-Aadhaar ULPIN: ${ulpin}`);
    return ulpin;
  }, [records, addAuditLog, showToast]);

  const approveRecord = useCallback((recordId: string, remarks: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let assignedUlpin = '';

    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      assignedUlpin = rec.ulpin || `MH-27-014-${Math.floor(100000 + Math.random() * 900000)}-001`;
      return {
        ...rec,
        verificationStatus: 'Approved',
        reviewedBy: 'Anand Deshmukh (Verification Officer)',
        reviewDate: now,
        reviewerRemarks: remarks || 'All land record parameters verified against cadastral database.',
        ulpin: assignedUlpin,
        ulpinGeneratedDate: now,
        gisCoordinates: rec.gisCoordinates || [18.5793, 73.9812]
      };
    }));

    addAuditLog('Record Approved', recordId, remarks || 'Land Record validated and confirmed.');
    addAuditLog('ULPIN Generated', recordId, `ULPIN ${assignedUlpin} auto-generated upon approval.`);
    showToast('success', 'Record Approved', `Record ${recordId} approved. ULPIN ${assignedUlpin} generated.`);
  }, [addAuditLog, showToast]);

  const rejectRecord = useCallback((recordId: string, remarks: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        verificationStatus: 'Rejected',
        reviewedBy: 'Anand Deshmukh (Verification Officer)',
        reviewDate: now,
        reviewerRemarks: remarks
      };
    }));

    addAuditLog('Record Rejected', recordId, `Rejected with remark: ${remarks}`);
    showToast('error', 'Record Rejected', `Record ${recordId} was rejected.`);
  }, [addAuditLog, showToast]);

  const requestReVerification = useCallback((recordId: string, remarks: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        verificationStatus: 'Re-Verification Requested',
        reviewedBy: 'Anand Deshmukh (Verification Officer)',
        reviewDate: now,
        reviewerRemarks: remarks
      };
    }));

    addAuditLog('Re-Verification Requested', recordId, `Action required: ${remarks}`);
    showToast('warning', 'Re-Verification Sent', `Record ${recordId} queued for field re-survey verification.`);
  }, [addAuditLog, showToast]);

  const handleMutationDecision = useCallback((recordId: string, status: MutationStatus, notes: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        mutation: {
          ...rec.mutation,
          status,
          notes: notes || rec.mutation.notes
        }
      };
    }));

    const actionText = status === 'Approved' ? 'Mutation Approved' : status === 'Rejected' ? 'Mutation Rejected' : 'Mutation Under Investigation';
    addAuditLog(actionText, recordId, `Mutation decision: ${status}. ${notes}`);
    showToast(status === 'Approved' ? 'success' : 'warning', actionText, `Mutation updated for ${recordId}`);
  }, [addAuditLog, showToast]);

  const handleDuplicateResolution = useCallback((recordId: string, status: DuplicateStatus) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        duplicate: {
          ...rec.duplicate,
          status
        }
      };
    }));

    addAuditLog(`Duplicate Resolution: ${status}`, recordId, `Administrator resolved duplicate match as ${status}.`);
    showToast('info', 'Duplicate Resolved', `Record ${recordId} marked as ${status}.`);
  }, [addAuditLog, showToast]);

  const value = useMemo(() => ({
    role,
    setRole,
    activeNav,
    setActiveNav,
    selectedRecordId,
    setSelectedRecordId,
    records,
    auditLogs,
    toasts,
    dismissToast,
    showToast,
    navigateToRecordReview,
    navigateToProcessingStatus,
    uploadNewRecord,
    reprocessRecord,
    updateRecordField,
    approveRecord,
    rejectRecord,
    requestReVerification,
    handleMutationDecision,
    handleDuplicateResolution,
    generateUlpinForRecord
  }), [
    role,
    setRole,
    activeNav,
    selectedRecordId,
    records,
    auditLogs,
    toasts,
    dismissToast,
    showToast,
    navigateToRecordReview,
    navigateToProcessingStatus,
    uploadNewRecord,
    reprocessRecord,
    updateRecordField,
    approveRecord,
    rejectRecord,
    requestReVerification,
    handleMutationDecision,
    handleDuplicateResolution,
    generateUlpinForRecord
  ]);

  return (
    <LandRecordContext.Provider value={value}>
      {children}
    </LandRecordContext.Provider>
  );
};

export const useLandRecord = () => {
  const ctx = useContext(LandRecordContext);
  if (!ctx) throw new Error('useLandRecord must be used within LandRecordProvider');
  return ctx;
};
