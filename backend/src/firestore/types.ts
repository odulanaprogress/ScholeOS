/**
 * ScholeOS Firestore Document Schema & Data Types (Wave 2)
 *
 * All collections in Firestore are nested under /schools/{schoolId} to enforce strict
 * multi-tenant isolation.
 *
 * ARCHITECTURAL INVARIANT:
 * These types define the documents that are:
 * 1. READ directly by authenticated client applications (gated by schoolId claim).
 * 2. WRITTEN EXCLUSIVELY by Cloudflare Worker microservices using the Firebase Admin SDK
 *    after validating PostgreSQL assignments.
 */

export type ScoreStatus = "draft" | "submitted" | "locked";
export type ReportCardStatus = "draft" | "published";
export type AttendanceStatus = "present" | "absent" | "late";

/**
 * 1. Score Entries Document
 * Path: /schools/{schoolId}/terms/{termId}/scoreEntries/{entryId}
 *
 * Represents continuous assessment scores for a single student in a single subject.
 */
export interface ScoreEntryDocument {
  /** Student UUID from Postgres `students.id` */
  studentId: string;
  /** Subject UUID from Postgres `subjects.id` */
  subjectId: string;
  /** Class UUID from Postgres `classes.id` */
  classId: string;
  /** Staff UUID of the assigned teacher from Postgres `staff.id` */
  teacherId: string;
  /**
   * Continuous assessment breakdown keyed by `assessment_components.id` (Postgres UUID).
   * e.g., { "ca-test-1-uuid": 18, "ca-test-2-uuid": 19, "exam-uuid": 54 }
   */
  componentScores: Record<string, number>;
  /** Computed cumulative total (e.g. 91) */
  total: number;
  /** Submission state */
  status: ScoreStatus;
  /** Optional metadata tracking */
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 2. Per-Class Subject Submission Status Entry
 * Value structure for subjects within the class submissionStatus document.
 */
export interface SubjectSubmissionEntry {
  status: ScoreStatus;
  teacherId: string;
  updatedAt?: string;
}

/**
 * Per-Class Submission Status Document
 * Path: /schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus
 *
 * A single document per class arm monitored by the Class Teacher's live grading tracker.
 * Maps each subjectId to its current submission status and the teacher who owns it.
 */
export interface ClassSubmissionStatusDocument {
  [subjectId: string]: SubjectSubmissionEntry;
}

/**
 * 3. Report Card Document
 * Path: /schools/{schoolId}/terms/{termId}/reportCards/{studentId}
 *
 * Computed terminal summary for a single student.
 */
export interface ReportCardDocument {
  /** Student UUID from Postgres `students.id` */
  studentId: string;
  /** Class UUID from Postgres `classes.id` */
  classId?: string;
  /** Map of subjectId to computed aggregate total for that subject */
  perSubjectTotals: Record<string, number>;
  /** Cumulative points across all subjects */
  overallTotal: number;
  /** Mean percentage average */
  average: number;
  /** Class rank position (e.g. 1 or "1st") */
  position: number | string;
  /** Class teacher or Principal general remark */
  comment: string;
  /** Publication state */
  status: ReportCardStatus;
  updatedAt?: string;
}

/**
 * Detailed attendance entry for a student
 */
export interface StudentAttendanceEntry {
  status: AttendanceStatus;
  note?: string;
}

/**
 * 4. Class Daily Attendance Document
 * Path: /schools/{schoolId}/classes/{classId}/attendance/{date}
 *
 * One document per class arm per calendar day (ISO 'YYYY-MM-DD').
 * Owned and marked by the class teacher assigned in Postgres.
 */
export interface ClassDailyAttendanceDocument {
  /** Class UUID from Postgres `classes.id` */
  classId?: string;
  /** Date formatted as 'YYYY-MM-DD' */
  date: string;
  /** Staff UUID of the class teacher who marked attendance */
  markedByStaffId: string;
  /** Map of studentId (UUID) -> status or detailed status object */
  attendance: Record<string, AttendanceStatus | StudentAttendanceEntry>;
  updatedAt?: string;
}

/**
 * Firebase Custom JWT Claims
 * Populated by `identity-service` (Wave 3) upon user authentication.
 */
export interface ScholeOSFirebaseClaims {
  /** Multi-tenant isolation claim matching Postgres `schools.id` */
  schoolId: string;
  /** User role (e.g. 'org:admin', 'class_teacher', 'subject_teacher', 'guardian', 'student') */
  role?: string;
  /** Linked entity IDs in Postgres */
  staffId?: string;
  studentId?: string;
  guardianId?: string;
  [key: string]: unknown;
}
