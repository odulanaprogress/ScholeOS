/**
 * Academic Service Data Contracts & Types (Wave 4)
 */

export interface ScoreEntryInput {
  studentId: string;
  componentScores: Record<string, number>;
}

export interface BatchScoresInput {
  entries: ScoreEntryInput[];
}

export interface ReopenRequestInput {
  reason: string;
}

export interface AttendanceRecordInput {
  studentId: string;
  status: "present" | "absent" | "late";
  note?: string;
}

export interface BatchAttendanceInput {
  records: AttendanceRecordInput[];
}

export interface UpdateReportCardCommentInput {
  comment: string;
}

export interface PublishReportCardsResponse {
  message: string;
  classId: string;
  termId: string;
  publishedCount: number;
  lockedScoresCount: number;
}

export interface BroadsheetStudentRow {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  subjectTotals: Record<string, number>;
  overallTotal: number;
  average: number;
  position: number | string;
  comment?: string;
}

export interface BroadsheetResponse {
  class: { id: string; name: string };
  term: { id: string; name: string };
  subjects: Array<{ id: string; name: string }>;
  students: BroadsheetStudentRow[];
}
