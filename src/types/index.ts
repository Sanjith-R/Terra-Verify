export type UserRole = 'DATA_ENTRY_OFFICER' | 'DATA_VERIFICATION_OFFICER';

export type DocumentType = 
  | 'Ownership Record'
  | 'Mutation Register'
  | 'Survey Record'
  | 'Khata Record'
  | 'Khasra Record'
  | 'Land Register'
  | 'Sale Deed'
  | 'Patta Record';

export type ProcessingStatus = 
  | 'Uploaded'
  | 'Processing'
  | 'OCR Running'
  | 'Validation Running'
  | 'Completed'
  | 'Failed';

export type VerificationStatus = 
  | 'Pending Verification'
  | 'Approved'
  | 'Rejected'
  | 'Re-Verification Requested';

export type MutationStatus = 'None' | 'Detected' | 'Approved' | 'Rejected' | 'Under Investigation';
export type DuplicateStatus = 'None' | 'Suspected' | 'Merged' | 'Resolved (Separate)' | 'False Positive';

export interface ConfidenceDetail {
  score: number; // 0 to 100
  level: 'High' | 'Medium' | 'Low';
}

export interface LandRecordField<T = string> {
  value: T;
  confidence: number; // 0 - 100
  isEdited?: boolean;
}

export interface MutationInfo {
  detected: boolean;
  mutationId?: string;
  previousOwner: string;
  currentOwner: string;
  mutationDate: string;
  mutationType: 'Sale' | 'Inheritance' | 'Gift' | 'Partition';
  supportingDocuments: string[];
  status: MutationStatus;
  notes?: string;
}

export interface DuplicateInfo {
  detected: boolean;
  duplicateRecordId?: string;
  similarityPercentage: number;
  matchingFields: string[];
  status: DuplicateStatus;
}

export interface CrossVerificationCheck {
  item: 'Ownership Match' | 'Survey Match' | 'Area Match' | 'Village Match';
  source: 'DILRMP' | 'LRMS' | 'Land Records Database';
  status: 'Matched' | 'Discrepancy' | 'Pending';
  databaseValue: string;
  extractedValue: string;
  matchScore: number;
}

export interface OCRBoundingBox {
  id: string;
  field: string;
  box: [number, number, number, number]; // x, y, width, height (percentages)
  text: string;
  confidence: number;
}

export interface LandRecord {
  id: string; // e.g. LR-2024-8841
  documentName: string;
  documentType: DocumentType;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'TIFF';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  
  // Administrative geography
  state: string;
  district: string;
  tehsil: string;
  village: string;

  // Processing & Stages
  processingStatus: ProcessingStatus;
  currentStage: string;
  processingStageIndex: number; // 0 to 5
  overallConfidence: number; // 0 to 100
  ocrEngine: 'PaddleOCR v4' | 'TrOCR (Indic)' | 'Hybrid Ensemble';
  detectedLanguage: string;
  processingTimeSeconds?: number;
  failureReason?: string;

  // Extracted structured fields (editable in review)
  fields: {
    ownerName: LandRecordField<string>;
    coOwners?: LandRecordField<string>;
    surveyNumber: LandRecordField<string>;
    khataNumber: LandRecordField<string>;
    khasraNumber: LandRecordField<string>;
    village: LandRecordField<string>;
    tehsil: LandRecordField<string>;
    district: LandRecordField<string>;
    plotArea: LandRecordField<string>; // e.g. "2.45 Hectares" or "1.12 Acres"
    landClassification: LandRecordField<string>; // Agricultural, Residential, Commercial, Forest, Nazul
    ownershipDetails: LandRecordField<string>; // Sole Proprietor, Ancestral Joint, etc.
    mutationDetails: LandRecordField<string>;
  };

  rawOcrText: string;
  boundingBoxes: OCRBoundingBox[];

  // Verification & Modules
  crossVerifications: CrossVerificationCheck[];
  mutation: MutationInfo;
  duplicate: DuplicateInfo;

  // Final verification & ULPIN
  verificationStatus: VerificationStatus;
  reviewedBy?: string;
  reviewDate?: string;
  reviewerRemarks?: string;
  ulpin?: string;
  ulpinGeneratedDate?: string;
  gisCoordinates?: [number, number]; // [lat, lng]
  gisPolygon?: [number, number][]; // Array of lat/lng coordinates
  
  // Archival visual sample representation
  sampleDocType: 'deed' | 'jamabandi' | 'khasra' | 'mutation' | 'patta';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: string;
  recordId: string;
  remarks: string;
  ipAddress?: string;
}

export interface GISParcelData {
  id: string;
  ulpin: string;
  surveyNumber: string;
  ownerName: string;
  village: string;
  tehsil: string;
  district: string;
  area: string;
  classification: string;
  status: 'Approved & Linked' | 'Pending Verification' | 'Mutation Active';
  coordinates: [number, number][]; // Polygon coords [lat, lng]
  centroid: [number, number];
}
