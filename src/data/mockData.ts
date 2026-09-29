import { LandRecord, AuditLogItem, GISParcelData } from '../types';

export const INITIAL_LAND_RECORDS: LandRecord[] = [
  {
    id: 'DILR-MH-2024-8841',
    documentName: 'Jamabandi_RoR_Survey_142_Haveli.pdf',
    documentType: 'Ownership Record',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    uploadDate: '2024-10-14 09:30',
    uploadedBy: 'Rajesh Sharma (DEO-401)',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi',
    processingStatus: 'Completed',
    currentStage: 'Ready for Officer Verification',
    processingStageIndex: 5,
    overallConfidence: 94.2,
    ocrEngine: 'PaddleOCR v4',
    detectedLanguage: 'Marathi & English (Dual Script)',
    processingTimeSeconds: 14.2,
    sampleDocType: 'jamabandi',
    fields: {
      ownerName: { value: 'Suresh Babanrao Patil', confidence: 96, isEdited: false },
      coOwners: { value: 'Sunita Suresh Patil (Wife)', confidence: 91, isEdited: false },
      surveyNumber: { value: '142/2A', confidence: 98, isEdited: false },
      khataNumber: { value: 'KH-894', confidence: 92, isEdited: false },
      khasraNumber: { value: '142/2A/1', confidence: 95, isEdited: false },
      village: { value: 'Wagholi', confidence: 99, isEdited: false },
      tehsil: { value: 'Haveli', confidence: 98, isEdited: false },
      district: { value: 'Pune', confidence: 99, isEdited: false },
      plotArea: { value: '1.450 Hectares (3.58 Acres)', confidence: 93, isEdited: false },
      landClassification: { value: 'Jirayat (Dry Crop Agricultural)', confidence: 91, isEdited: false },
      ownershipDetails: { value: 'Sole Titleholder (Class I Bhumiswami)', confidence: 95, isEdited: false },
      mutationDetails: { value: 'Mutation Entry No. 4419 dated 12/03/2018', confidence: 88, isEdited: false }
    },
    rawOcrText: `GOVERNMENT OF MAHARASHTRA - REVENUE DEPARTMENT\nFORM VII-XII (COMBINED RECORD OF RIGHTS)\nVillage: Wagholi | Tehsil: Haveli | District: Pune\nSurvey / Gat No: 142/2A | Khata No: 894\nHolder Name: Suresh Babanrao Patil\nSub-division Area: 1.450 Hectares | Assessment: Rs. 14.50\nNature of Right: Class 1 Occupant\nOther Rights / Encumbrance: Nil (Bank of Baroda lien released on 14/08/2021).\nVerified by Talathi Wagholi Circle.`,
    boundingBoxes: [
      { id: 'b1', field: 'Owner Name', box: [15, 28, 45, 6], text: 'Suresh Babanrao Patil', confidence: 96 },
      { id: 'b2', field: 'Survey Number', box: [65, 28, 25, 6], text: '142/2A', confidence: 98 },
      { id: 'b3', field: 'Village & Tehsil', box: [15, 36, 40, 5], text: 'Wagholi, Haveli', confidence: 98 },
      { id: 'b4', field: 'Khata Number', box: [65, 36, 25, 5], text: 'KH-894', confidence: 92 },
      { id: 'b5', field: 'Plot Area', box: [15, 43, 35, 6], text: '1.450 Hectares', confidence: 93 },
      { id: 'b6', field: 'Land Classification', box: [55, 43, 35, 6], text: 'Jirayat (Dry Crop)', confidence: 91 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Suresh Babanrao Patil', extractedValue: 'Suresh Babanrao Patil', matchScore: 99 },
      { item: 'Survey Match', source: 'LRMS', status: 'Matched', databaseValue: '142/2A (Gat 142)', extractedValue: '142/2A', matchScore: 98 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '1.450 Ha', extractedValue: '1.450 Hectares', matchScore: 97 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Wagholi (LGD: 182391)', extractedValue: 'Wagholi', matchScore: 100 }
    ],
    mutation: {
      detected: false,
      previousOwner: '',
      currentOwner: 'Suresh Babanrao Patil',
      mutationDate: '',
      mutationType: 'Sale',
      supportingDocuments: [],
      status: 'None'
    },
    duplicate: {
      detected: false,
      similarityPercentage: 12.4,
      matchingFields: [],
      status: 'None'
    },
    verificationStatus: 'Pending Verification'
  },
  {
    id: 'DILR-UP-2024-5219',
    documentName: 'Khasra_Girdawari_Fasli_1429_Varanasi.jpg',
    documentType: 'Khasra Record',
    fileType: 'JPG',
    fileSize: '4.8 MB',
    uploadDate: '2024-10-14 10:15',
    uploadedBy: 'Rajesh Sharma (DEO-401)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    tehsil: 'Pindra',
    village: 'Phulpur',
    processingStatus: 'Completed',
    currentStage: 'Ready for Officer Verification',
    processingStageIndex: 5,
    overallConfidence: 78.4,
    ocrEngine: 'TrOCR (Indic)',
    detectedLanguage: 'Hindi (Devanagari)',
    processingTimeSeconds: 19.8,
    sampleDocType: 'khasra',
    fields: {
      ownerName: { value: 'Ram Lakhan Verma', confidence: 82, isEdited: false },
      coOwners: { value: 'Shiv Pujan Verma (Brother)', confidence: 71, isEdited: false },
      surveyNumber: { value: '318/Ka', confidence: 86, isEdited: false },
      khataNumber: { value: '00142', confidence: 84, isEdited: false },
      khasraNumber: { value: '318/1/Ka', confidence: 79, isEdited: false },
      village: { value: 'Phulpur', confidence: 96, isEdited: false },
      tehsil: { value: 'Pindra', confidence: 95, isEdited: false },
      district: { value: 'Varanasi', confidence: 98, isEdited: false },
      plotArea: { value: '0.820 Hectare', confidence: 74, isEdited: false },
      landClassification: { value: 'Abadi / Multi-Crop Irrigated', confidence: 68, isEdited: false },
      ownershipDetails: { value: 'Sankramaniya Bhumidhar', confidence: 81, isEdited: false },
      mutationDetails: { value: 'Succession Entry order No. 89 dated 2019', confidence: 66, isEdited: false }
    },
    rawOcrText: `उत्तर प्रदेश भू-राजस्व परिषद - प्रपत्र ४ (खसरा गिरदावरी)\nग्राम: फूलपुर | परगना व तहसील: पिंडरा | जनपद: वाराणसी\nखाता संख्या: ००१४२ | खसरा संख्या: ३१८/क\nकाश्तकार / भूमिधर: राम लखन वर्मा पुत्र रामेश्वर वर्मा\nसह-खातेदार: शिव पूजन वर्मा\nक्षेत्रफल: ०.८२० हेक्टर | सिंचाई साधन: नलकूप\nफसली वर्ष १४२९ | दर्ज स्थिति: संक्रमणीय अधिकार वाले भूमिधर।`,
    boundingBoxes: [
      { id: 'b11', field: 'Owner Name', box: [18, 25, 42, 7], text: 'राम लखन वर्मा (Ram Lakhan Verma)', confidence: 82 },
      { id: 'b12', field: 'Survey Number', box: [64, 25, 26, 6], text: '318/Ka', confidence: 86 },
      { id: 'b13', field: 'Khata Number', box: [18, 34, 30, 6], text: '00142', confidence: 84 },
      { id: 'b14', field: 'Plot Area', box: [55, 34, 35, 6], text: '0.820 Hectare', confidence: 74 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Ram Lakhan Verma', extractedValue: 'Ram Lakhan Verma', matchScore: 94 },
      { item: 'Survey Match', source: 'LRMS', status: 'Discrepancy', databaseValue: '318/Kha', extractedValue: '318/Ka', matchScore: 78 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '0.820 Ha', extractedValue: '0.820 Hectare', matchScore: 95 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Phulpur', extractedValue: 'Phulpur', matchScore: 100 }
    ],
    mutation: {
      detected: true,
      mutationId: 'MUT-UP-2024-092',
      previousOwner: 'Rameshwar Prasad Verma (Deceased)',
      currentOwner: 'Ram Lakhan Verma & Shiv Pujan Verma',
      mutationDate: '2024-04-18',
      mutationType: 'Inheritance',
      supportingDocuments: ['Death Certificate #DC-8819', 'Family Tree / Waris Certificate', 'Tehsildar Pindra Order'],
      status: 'Detected',
      notes: 'Succession claimed under Section 33 of UP Revenue Code 2006. Verification officer review pending.'
    },
    duplicate: {
      detected: false,
      similarityPercentage: 21.0,
      matchingFields: [],
      status: 'None'
    },
    verificationStatus: 'Pending Verification'
  },
  {
    id: 'DILR-RJ-2024-3104',
    documentName: 'SaleDeed_Bainama_Reg_4481_Jaipur.pdf',
    documentType: 'Sale Deed',
    fileType: 'PDF',
    fileSize: '5.1 MB',
    uploadDate: '2024-10-13 14:20',
    uploadedBy: 'Priya Meena (DEO-402)',
    state: 'Rajasthan',
    district: 'Jaipur',
    tehsil: 'Sanganer',
    village: 'Muhana',
    processingStatus: 'Completed',
    currentStage: 'Duplicate Detected Flag',
    processingStageIndex: 5,
    overallConfidence: 91.5,
    ocrEngine: 'PaddleOCR v4',
    detectedLanguage: 'Hindi & English',
    processingTimeSeconds: 16.5,
    sampleDocType: 'deed',
    fields: {
      ownerName: { value: 'Vikram Singh Rathore', confidence: 95, isEdited: false },
      coOwners: { value: 'Manju Kanwar (Joint Co-Purchaser)', confidence: 89, isEdited: false },
      surveyNumber: { value: '512/3', confidence: 94, isEdited: false },
      khataNumber: { value: 'KH-1029', confidence: 88, isEdited: false },
      khasraNumber: { value: '512/3/A', confidence: 91, isEdited: false },
      village: { value: 'Muhana', confidence: 98, isEdited: false },
      tehsil: { value: 'Sanganer', confidence: 97, isEdited: false },
      district: { value: 'Jaipur', confidence: 99, isEdited: false },
      plotArea: { value: '2500 Sq Yards (0.209 Hectares)', confidence: 92, isEdited: false },
      landClassification: { value: 'Converted Commercial / Mixed Use', confidence: 89, isEdited: false },
      ownershipDetails: { value: 'Registered Conveyance Deed Holder', confidence: 94, isEdited: false },
      mutationDetails: { value: 'Sub-Registrar Sanganer Deed #4481 Book 1 Vol 891', confidence: 93, isEdited: false }
    },
    rawOcrText: `SUB-REGISTRAR OFFICE SANGANER - JAIPUR (RAJASTHAN)\nREGISTERED DEED OF SALE / CONVEYANCE DEED #4481\nDate of Execution: 09/09/2024 | Stamp Duty Paid: Rs. 1,85,000\nVendor: M/s Aravali Developers through Partner Ashok Gehlot\nPurchaser: Vikram Singh Rathore S/o Lt. Mohan Singh\nPlot/Khasra No: 512/3/A Muhana Mandi Road, Sanganer\nArea: 2500 Sq. Yards | Dimension: 50 x 50 yds\nBoundaries: North: 40ft Road, South: Khasra 512/4, East: Canal, West: Pvt Plot.`,
    boundingBoxes: [
      { id: 'b21', field: 'Purchaser Name', box: [20, 24, 45, 6], text: 'Vikram Singh Rathore', confidence: 95 },
      { id: 'b22', field: 'Khasra / Survey', box: [65, 24, 25, 6], text: '512/3/A', confidence: 94 },
      { id: 'b23', field: 'Area', box: [20, 32, 35, 6], text: '2500 Sq Yards', confidence: 92 },
      { id: 'b24', field: 'Deed No.', box: [65, 32, 25, 5], text: 'Reg. Deed #4481', confidence: 93 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Vikram Singh Rathore', extractedValue: 'Vikram Singh Rathore', matchScore: 98 },
      { item: 'Survey Match', source: 'LRMS', status: 'Matched', databaseValue: '512/3', extractedValue: '512/3', matchScore: 95 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '2500 Sq Yards', extractedValue: '2500 Sq Yards (0.209 Hectares)', matchScore: 94 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Muhana', extractedValue: 'Muhana', matchScore: 100 }
    ],
    mutation: {
      detected: true,
      mutationId: 'MUT-RJ-2024-814',
      previousOwner: 'M/s Aravali Developers',
      currentOwner: 'Vikram Singh Rathore',
      mutationDate: '2024-09-09',
      mutationType: 'Sale',
      supportingDocuments: ['Registered Sale Deed #4481', 'E-Challan GRN #9918237', 'Encumbrance Clearance Certificate'],
      status: 'Detected',
      notes: 'Commercial plot subdivision registration pending revenue court approval.'
    },
    duplicate: {
      detected: true,
      duplicateRecordId: 'DILR-RJ-2023-9081',
      similarityPercentage: 94.8,
      matchingFields: ['Survey 512/3', 'Plot Area 2500 Sq Yards', 'Village Muhana', 'Sub-Registrar Sanganer'],
      status: 'Suspected'
    },
    verificationStatus: 'Pending Verification'
  },
  {
    id: 'DILR-GJ-2024-1188',
    documentName: 'Anyor_Village_E_Dhara_Record_Ahmedabad.pdf',
    documentType: 'Ownership Record',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    uploadDate: '2024-10-12 11:45',
    uploadedBy: 'Rajesh Sharma (DEO-401)',
    state: 'Gujarat',
    district: 'Ahmedabad',
    tehsil: 'Daskroi',
    village: 'Sanand Rural',
    processingStatus: 'Completed',
    currentStage: 'Verified & ULPIN Assigned',
    processingStageIndex: 5,
    overallConfidence: 97.8,
    ocrEngine: 'Hybrid Ensemble',
    detectedLanguage: 'Gujarati & English',
    processingTimeSeconds: 11.2,
    sampleDocType: 'jamabandi',
    fields: {
      ownerName: { value: 'Bhupendra Kanjibhai Patel', confidence: 99, isEdited: false },
      coOwners: { value: 'None', confidence: 97, isEdited: false },
      surveyNumber: { value: '241/P1', confidence: 98, isEdited: false },
      khataNumber: { value: 'KH-552', confidence: 96, isEdited: false },
      khasraNumber: { value: '241/P1/3', confidence: 97, isEdited: false },
      village: { value: 'Sanand Rural', confidence: 99, isEdited: false },
      tehsil: { value: 'Daskroi', confidence: 99, isEdited: false },
      district: { value: 'Ahmedabad', confidence: 100, isEdited: false },
      plotArea: { value: '2.100 Hectares (5.18 Acres)', confidence: 98, isEdited: false },
      landClassification: { value: 'Bagayat (Orchard / Irrigated)', confidence: 96, isEdited: false },
      ownershipDetails: { value: 'Independent Occupant Holder', confidence: 98, isEdited: false },
      mutationDetails: { value: 'Mutation Entry 1928 Certified without objection', confidence: 95, isEdited: false }
    },
    rawOcrText: `REVENUE DEPARTMENT GOVT OF GUJARAT - ANYOR E-DHARA\nVillage: Sanand Rural | Taluka: Daskroi | Dist: Ahmedabad\nKhata No: 552 | Block / Survey No: 241/P1\nOwner: Bhupendra Kanjibhai Patel\nArea: 2-10-00 Hectare-Are-SqMtr\nAssessment: Rs. 21.00 | Water source: Canal\nStatus: Verified under RoR Act 2021. No injunctions.`,
    boundingBoxes: [
      { id: 'b31', field: 'Owner Name', box: [15, 20, 50, 7], text: 'Bhupendra Kanjibhai Patel', confidence: 99 },
      { id: 'b32', field: 'Survey Number', box: [65, 20, 25, 6], text: '241/P1', confidence: 98 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Bhupendra Kanjibhai Patel', extractedValue: 'Bhupendra Kanjibhai Patel', matchScore: 100 },
      { item: 'Survey Match', source: 'LRMS', status: 'Matched', databaseValue: '241/P1', extractedValue: '241/P1', matchScore: 99 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '2.100 Ha', extractedValue: '2.100 Hectares', matchScore: 99 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Sanand Rural', extractedValue: 'Sanand Rural', matchScore: 100 }
    ],
    mutation: {
      detected: false,
      previousOwner: '',
      currentOwner: 'Bhupendra Kanjibhai Patel',
      mutationDate: '',
      mutationType: 'Sale',
      supportingDocuments: [],
      status: 'None'
    },
    duplicate: {
      detected: false,
      similarityPercentage: 5.2,
      matchingFields: [],
      status: 'None'
    },
    verificationStatus: 'Approved',
    reviewedBy: 'Anand Deshmukh (Verification Officer)',
    reviewDate: '2024-10-13 16:30',
    reviewerRemarks: 'Record meticulously verified with Anyor E-Dhara and cadastral map. All biometric and title deed parameters match.',
    ulpin: 'GJ-24-007-024188-001',
    ulpinGeneratedDate: '2024-10-13 16:32',
    gisCoordinates: [22.9868, 72.3789]
  },
  {
    id: 'DILR-MP-2024-0943',
    documentName: 'Patta_Allotment_1974_Indore.tiff',
    documentType: 'Patta Record',
    fileType: 'TIFF',
    fileSize: '8.2 MB',
    uploadDate: '2024-10-14 08:10',
    uploadedBy: 'Priya Meena (DEO-402)',
    state: 'Madhya Pradesh',
    district: 'Indore',
    tehsil: 'Mhow',
    village: 'Simrol',
    processingStatus: 'Failed',
    currentStage: 'Failed OCR Recognition',
    processingStageIndex: 1,
    overallConfidence: 42.1,
    ocrEngine: 'TrOCR (Indic)',
    detectedLanguage: 'Old Hindi Manuscript (Faded Ink)',
    processingTimeSeconds: 24.1,
    failureReason: 'Severe ink degradation, torn ledger border, low contrast scan (confidence below 50% threshold).',
    sampleDocType: 'patta',
    fields: {
      ownerName: { value: 'Deviram S/o Chhaganlal (?)', confidence: 48, isEdited: false },
      coOwners: { value: 'Unreadable', confidence: 25, isEdited: false },
      surveyNumber: { value: '88/?', confidence: 51, isEdited: false },
      khataNumber: { value: 'Unclear (K-12?)', confidence: 38, isEdited: false },
      khasraNumber: { value: '88/1B', confidence: 45, isEdited: false },
      village: { value: 'Simrol', confidence: 82, isEdited: false },
      tehsil: { value: 'Mhow', confidence: 84, isEdited: false },
      district: { value: 'Indore', confidence: 91, isEdited: false },
      plotArea: { value: '0.40 Hectare Approx', confidence: 39, isEdited: false },
      landClassification: { value: 'Shaskiya Patta (Government Grant)', confidence: 49, isEdited: false },
      ownershipDetails: { value: 'Non-alienable Bhumiswami 1974', confidence: 41, isEdited: false },
      mutationDetails: { value: 'Faded revenue seal', confidence: 28, isEdited: false }
    },
    rawOcrText: `[HIGH NOISE] शासन म.प्र. पट्टा आवंटन पत्र ... संवत २०३१ ... [UNCLEAR TEXT] ... देवीराम वल्द छगनलाल ... रकबा ०.४० ... तहसील महू ... [STAMP OBSCURITY]`,
    boundingBoxes: [
      { id: 'b41', field: 'Partial Name', box: [20, 22, 35, 7], text: 'देवीराम (Deviram?)', confidence: 48 },
      { id: 'b42', field: 'Survey fragment', box: [60, 22, 20, 6], text: '88/?', confidence: 51 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Discrepancy', databaseValue: 'Deviram Chhaganlal Ahirwar', extractedValue: 'Deviram S/o Chhaganlal (?)', matchScore: 61 },
      { item: 'Survey Match', source: 'LRMS', status: 'Pending', databaseValue: '88/1', extractedValue: '88/?', matchScore: 52 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Discrepancy', databaseValue: '0.405 Ha', extractedValue: '0.40 Hectare Approx', matchScore: 65 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Simrol', extractedValue: 'Simrol', matchScore: 82 }
    ],
    mutation: {
      detected: false,
      previousOwner: '',
      currentOwner: '',
      mutationDate: '',
      mutationType: 'Inheritance',
      supportingDocuments: [],
      status: 'None'
    },
    duplicate: {
      detected: false,
      similarityPercentage: 18.0,
      matchingFields: [],
      status: 'None'
    },
    verificationStatus: 'Pending Verification'
  },
  {
    id: 'DILR-KA-2024-6052',
    documentName: 'Bhoomi_RTC_Form16_Survey_84_Devanahalli.png',
    documentType: 'Mutation Register',
    fileType: 'PNG',
    fileSize: '4.1 MB',
    uploadDate: '2024-10-14 11:00',
    uploadedBy: 'Rajesh Sharma (DEO-401)',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    tehsil: 'Devanahalli',
    village: 'Vijayapura',
    processingStatus: 'Processing',
    currentStage: 'Running Confidence Evaluation',
    processingStageIndex: 3,
    overallConfidence: 89.0,
    ocrEngine: 'Hybrid Ensemble',
    detectedLanguage: 'Kannada & English',
    processingTimeSeconds: 8.5,
    sampleDocType: 'mutation',
    fields: {
      ownerName: { value: 'K. Venkateshappa', confidence: 92, isEdited: false },
      coOwners: { value: 'Manjunatha V. (Son)', confidence: 87, isEdited: false },
      surveyNumber: { value: '84/3', confidence: 93, isEdited: false },
      khataNumber: { value: 'KH-198', confidence: 89, isEdited: false },
      khasraNumber: { value: '84/3/P2', confidence: 88, isEdited: false },
      village: { value: 'Vijayapura', confidence: 98, isEdited: false },
      tehsil: { value: 'Devanahalli', confidence: 97, isEdited: false },
      district: { value: 'Bengaluru Rural', confidence: 99, isEdited: false },
      plotArea: { value: '1 Acre 20 Guntas (0.607 Ha)', confidence: 90, isEdited: false },
      landClassification: { value: 'Dry Agricultural (Tari)', confidence: 88, isEdited: false },
      ownershipDetails: { value: 'Joint Hindu Family Title', confidence: 89, isEdited: false },
      mutationDetails: { value: 'Mutation MR-2024-00192 Partition Deed', confidence: 86, isEdited: false }
    },
    rawOcrText: `GOVERNMENT OF KARNATAKA - REVENUE DEPARTMENT\nBHOOMI LAND RECORDS SYSTEM - FORM 16 (RTC)\nDistrict: Bengaluru Rural | Taluk: Devanahalli | Hobli: Vijayapura\nSurvey No: 84/3 | Hissa: 3 | Total Area: 1-20-00\nOwner: K. Venkateshappa S/o Kempaiah\nMutation Register No: MR No. 2024/00192 under Section 129(A)\nStatus: Provisionally Entered. Awaiting Tahsildar approval.`,
    boundingBoxes: [
      { id: 'b51', field: 'Owner', box: [18, 22, 45, 6], text: 'K. Venkateshappa', confidence: 92 },
      { id: 'b52', field: 'Survey', box: [65, 22, 25, 6], text: '84/3', confidence: 93 }
    ],
    crossVerifications: [
      { item: 'Ownership Match', source: 'DILRMP', status: 'Matched', databaseValue: 'K. Venkateshappa', extractedValue: 'K. Venkateshappa', matchScore: 95 },
      { item: 'Survey Match', source: 'LRMS', status: 'Matched', databaseValue: '84/3', extractedValue: '84/3', matchScore: 94 },
      { item: 'Area Match', source: 'Land Records Database', status: 'Matched', databaseValue: '1-20 Acre', extractedValue: '1 Acre 20 Guntas', matchScore: 93 },
      { item: 'Village Match', source: 'DILRMP', status: 'Matched', databaseValue: 'Vijayapura', extractedValue: 'Vijayapura', matchScore: 100 }
    ],
    mutation: {
      detected: true,
      mutationId: 'MUT-KA-2024-511',
      previousOwner: 'Kempaiah (Father - Late)',
      currentOwner: 'K. Venkateshappa & Manjunatha V.',
      mutationDate: '2024-08-22',
      mutationType: 'Partition',
      supportingDocuments: ['Registered Family Settlement Deed #1192', 'Village Panchayat No-Objection'],
      status: 'Detected',
      notes: 'Mutation entry for division of family ancestral holdings.'
    },
    duplicate: {
      detected: false,
      similarityPercentage: 14.5,
      matchingFields: [],
      status: 'None'
    },
    verificationStatus: 'Pending Verification'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-9921',
    timestamp: '2024-10-14 11:00:22',
    user: 'Rajesh Sharma',
    userRole: 'DATA_ENTRY_OFFICER',
    action: 'Document Uploaded',
    recordId: 'DILR-KA-2024-6052',
    remarks: 'Bhoomi RTC high resolution scan uploaded. OCR processing initiated automatically.',
    ipAddress: '10.14.88.24'
  },
  {
    id: 'LOG-9920',
    timestamp: '2024-10-14 10:18:05',
    user: 'System (PaddleOCR + TrOCR)',
    userRole: 'DATA_ENTRY_OFFICER',
    action: 'OCR Completed',
    recordId: 'DILR-UP-2024-5219',
    remarks: 'Dual-pass OCR extracted 11 fields with 78.4% average confidence. Discrepancy logged for survey sub-division.',
    ipAddress: 'Internal Microservice'
  },
  {
    id: 'LOG-9919',
    timestamp: '2024-10-14 09:44:11',
    user: 'System (Cross-Validation Bot)',
    userRole: 'DATA_ENTRY_OFFICER',
    action: 'Cross Verification Completed',
    recordId: 'DILR-MH-2024-8841',
    remarks: 'DILRMP and LRMS database matches confirmed with 94.2% confidence. Pushed to Verification Queue.',
    ipAddress: 'Internal Microservice'
  },
  {
    id: 'LOG-9918',
    timestamp: '2024-10-13 16:32:00',
    user: 'Anand Deshmukh (Admin)',
    userRole: 'DATA_VERIFICATION_OFFICER',
    action: 'ULPIN Generated',
    recordId: 'DILR-GJ-2024-1188',
    remarks: 'ULPIN GJ-24-007-024188-001 created and georeferenced on cadastral map layer.',
    ipAddress: '10.14.88.102'
  },
  {
    id: 'LOG-9917',
    timestamp: '2024-10-13 16:30:14',
    user: 'Anand Deshmukh (Admin)',
    userRole: 'DATA_VERIFICATION_OFFICER',
    action: 'Record Approved',
    recordId: 'DILR-GJ-2024-1188',
    remarks: 'All 7/12 parameters authenticated. Digital stamp affixed.',
    ipAddress: '10.14.88.102'
  },
  {
    id: 'LOG-9916',
    timestamp: '2024-10-13 15:10:45',
    user: 'System (Duplicate Engine)',
    userRole: 'DATA_VERIFICATION_OFFICER',
    action: 'Duplicate Flagged',
    recordId: 'DILR-RJ-2024-3104',
    remarks: 'High potential overlap (94.8%) with archival deed DILR-RJ-2023-9081 detected.',
    ipAddress: 'Internal Engine'
  }
];

export const GIS_PARCELS: GISParcelData[] = [
  {
    id: 'PARCEL-142-2A',
    ulpin: 'MH-27-012-014285-001',
    surveyNumber: '142/2A',
    ownerName: 'Suresh Babanrao Patil',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    area: '1.450 Hectares',
    classification: 'Agricultural (Dry Crop)',
    status: 'Approved & Linked',
    centroid: [18.5793, 73.9812],
    coordinates: [
      [18.5805, 73.9800],
      [18.5810, 73.9830],
      [18.5785, 73.9835],
      [18.5778, 73.9805],
      [18.5805, 73.9800]
    ]
  },
  {
    id: 'PARCEL-142-2B',
    ulpin: 'MH-27-012-014286-002',
    surveyNumber: '142/2B',
    ownerName: 'Kishore Anandrao Jadhav',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    area: '0.980 Hectares',
    classification: 'Agricultural (Irrigated)',
    status: 'Approved & Linked',
    centroid: [18.5818, 73.9845],
    coordinates: [
      [18.5810, 73.9830],
      [18.5828, 73.9838],
      [18.5822, 73.9865],
      [18.5802, 73.9858],
      [18.5810, 73.9830]
    ]
  },
  {
    id: 'PARCEL-143-1',
    ulpin: 'MH-27-012-014301-001',
    surveyNumber: '143/1',
    ownerName: 'M/s Wagholi Agro Warehousing',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    area: '3.120 Hectares',
    classification: 'Non-Agricultural Commercial',
    status: 'Mutation Active',
    centroid: [18.5765, 73.9820],
    coordinates: [
      [18.5778, 73.9805],
      [18.5785, 73.9835],
      [18.5755, 73.9840],
      [18.5748, 73.9810],
      [18.5778, 73.9805]
    ]
  },
  {
    id: 'PARCEL-144-A',
    ulpin: 'MH-27-012-014401-003',
    surveyNumber: '144/A',
    ownerName: 'Gram Panchayat Common Grazing Land',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    area: '4.800 Hectares',
    classification: 'Gairan / Public Commons',
    status: 'Approved & Linked',
    centroid: [18.5825, 73.9785],
    coordinates: [
      [18.5835, 73.9765],
      [18.5842, 73.9802],
      [18.5812, 73.9808],
      [18.5805, 73.9772],
      [18.5835, 73.9765]
    ]
  },
  {
    id: 'PARCEL-145-3',
    ulpin: 'MH-27-012-014503-004',
    surveyNumber: '145/3',
    ownerName: 'Sunita Ravindra Shinde',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    area: '1.150 Hectares',
    classification: 'Agricultural (Orchard)',
    status: 'Pending Verification',
    centroid: [18.5790, 73.9868],
    coordinates: [
      [18.5802, 73.9858],
      [18.5808, 73.9885],
      [18.5780, 73.9892],
      [18.5772, 73.9862],
      [18.5802, 73.9858]
    ]
  }
];

export const STATES_AND_DISTRICTS: Record<string, { districts: string[]; tehsils: Record<string, string[]> }> = {
  Maharashtra: {
    districts: ['Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Satara'],
    tehsils: {
      Pune: ['Haveli', 'Baramati', 'Shirur', 'Khed', 'Maval'],
      Nagpur: ['Nagpur Rural', 'Katol', 'Umred', 'Ramtek'],
      Nashik: ['Nashik', 'Dindori', 'Sinnar', 'Malegaon'],
      Aurangabad: ['Aurangabad', 'Paithan', 'Gangapur'],
      Satara: ['Satara', 'Karad', 'Wai', 'Phaltan']
    }
  },
  'Uttar Pradesh': {
    districts: ['Varanasi', 'Lucknow', 'Prayagraj', 'Gorakhpur', 'Agra'],
    tehsils: {
      Varanasi: ['Pindra', 'Varanasi Sadar', 'Raja Talab'],
      Lucknow: ['Lucknow Sadar', 'Bakshi Ka Talab', 'Mohanlalganj'],
      Prayagraj: ['Soraon', 'Phulpur', 'Koraon'],
      Gorakhpur: ['Sadar', 'Campierganj', 'Sahjanwa'],
      Agra: ['Agra', 'Etmadpur', 'Kheragarh']
    }
  },
  Rajasthan: {
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    tehsils: {
      Jaipur: ['Sanganer', 'Amber', 'Chaksu', 'Bassai'],
      Jodhpur: ['Jodhpur', 'Luni', 'Osian'],
      Udaipur: ['Girwa', 'Mavli', 'Vallabhnagar'],
      Kota: ['Ladpura', 'Digod', 'Ramganj Mandi'],
      Ajmer: ['Ajmer', 'Kishangarh', 'Beawar']
    }
  },
  Gujarat: {
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    tehsils: {
      Ahmedabad: ['Daskroi', 'Sanand', 'Dholka', 'Viramgam'],
      Surat: ['Chorasi', 'Olpad', 'Kamrej'],
      Vadodara: ['Vadodara', 'Padra', 'Savli'],
      Rajkot: ['Rajkot', 'Gondal', 'Jasdan'],
      Gandhinagar: ['Gandhinagar', 'Kalol', 'Dehgam']
    }
  },
  Karnataka: {
    districts: ['Bengaluru Rural', 'Mysuru', 'Belagavi', 'Dharwad', 'Tumakuru'],
    tehsils: {
      'Bengaluru Rural': ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'],
      Mysuru: ['Mysuru', 'Hunsur', 'Nanjangud'],
      Belagavi: ['Belagavi', 'Gokak', 'Chikkodi'],
      Dharwad: ['Dharwad', 'Hubballi', 'Navalgund'],
      Tumakuru: ['Tumakuru', 'Tiptur', 'Sira']
    }
  }
};
