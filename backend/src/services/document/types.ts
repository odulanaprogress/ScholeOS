/**
 * Document Service Types (Wave 7)
 */

export interface SchoolBranding {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
  brandColor: string; // hex color e.g. '#4338CA'
  address: string | null;
}

export interface SubjectScoreItem {
  subjectId: string;
  subjectName: string;
  components: Record<string, number>; // componentName -> score
  total: number;
  grade: string;
  remark: string;
}

export interface ReportCardDocumentData {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  termName: string;
  sessionName: string;
  subjects: SubjectScoreItem[];
  overallTotal: number;
  maxPossibleTotal: number;
  average: number;
  position: string; // e.g. '1st', '2nd'
  teacherComment: string | null;
  headTeacherComment: string | null;
  status: "draft" | "published";
  school: SchoolBranding;
}

export interface BroadsheetStudentRow {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  subjectScores: Record<string, number>; // subjectId -> totalScore
  overallTotal: number;
  average: number;
  position: string;
}

export interface BroadsheetDocumentData {
  classId: string;
  className: string;
  termId: string;
  termName: string;
  sessionName: string;
  subjects: { id: string; name: string; code: string }[];
  students: BroadsheetStudentRow[];
  school: SchoolBranding;
}

export interface ReceiptDocumentData {
  paymentId: string;
  receiptNumber: string;
  invoiceId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  feeType: string;
  amount: number;
  amountInWords: string;
  channel: string;
  providerRef: string | null;
  paymentDate: string;
  school: SchoolBranding;
}

export interface StudentIdCardData {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  photoUrl: string | null;
  dateOfBirth?: string | null;
  school: SchoolBranding;
}

export type GeneratedDocumentType =
  | "report_card"
  | "broadsheet"
  | "receipt"
  | "id_card"
  | "id_card_batch";

export interface DocumentResponseDTO {
  documentUrl: string;
  type: GeneratedDocumentType;
  referenceId: string;
  cached: boolean;
  generatedAt: string;
}

