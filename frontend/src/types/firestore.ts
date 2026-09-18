/**
 * ScholeOS Frontend Firestore Schema & Type Definitions (Wave 2)
 *
 * CRITICAL ARCHITECTURAL RULE:
 * Frontend applications NEVER write to Firestore directly.
 * All mutations MUST be submitted to backend API endpoints (Cloudflare Workers).
 * The types defined here are strictly for REAL-TIME READ SUBSCRIPTIONS and queries.
 */

export type ScoreStatus = "draft" | "submitted" | "locked";
export type ReportCardStatus = "draft" | "published";
export type AttendanceStatus = "present" | "absent" | "late";

/**
 * 1. Score Entry Document
 * Path: /schools/{schoolId}/terms/{termId}/scoreEntries/{entryId}
 */
export interface ScoreEntryDocument {
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  /** Assessment component mark breakdown, e.g. { [componentId]: score } */
  componentScores: Record<string, number>;
  total: number;
  status: ScoreStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 2. Per-Class Submission Status Document
 * Path: /schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus
 * Monitored by the Class Teacher's live grading tracker.
 */
export interface SubjectSubmissionEntry {
  status: ScoreStatus;
  teacherId: string;
  updatedAt?: string;
}

export interface ClassSubmissionStatusDocument {
  [subjectId: string]: SubjectSubmissionEntry;
}

/**
 * 3. Report Card Document
 * Path: /schools/{schoolId}/terms/{termId}/reportCards/{studentId}
 */
export interface ReportCardDocument {
  studentId: string;
  classId?: string;
  perSubjectTotals: Record<string, number>;
  overallTotal: number;
  average: number;
  position: number | string;
  comment: string;
  status: ReportCardStatus;
  updatedAt?: string;
}

/**
 * Detailed student attendance entry
 */
export interface StudentAttendanceEntry {
  status: AttendanceStatus;
  note?: string;
}

/**
 * 4. Class Daily Attendance Document
 * Path: /schools/{schoolId}/classes/{classId}/attendance/{date}
 *
 * One document per class arm per calendar day (date format 'YYYY-MM-DD').
 */
export interface ClassDailyAttendanceDocument {
  classId?: string;
  date: string;
  markedByStaffId: string;
  attendance: Record<string, AttendanceStatus | StudentAttendanceEntry>;
  updatedAt?: string;
}
