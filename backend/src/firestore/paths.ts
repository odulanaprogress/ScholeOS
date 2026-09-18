/**
 * Type-safe Firestore Collection & Document Path Builders (Wave 2)
 *
 * Enforces uniform path conventions across all backend Cloudflare Worker services.
 */

/**
 * Score Entries Collection Path
 * Pattern: /schools/{schoolId}/terms/{termId}/scoreEntries
 */
export function getScoreEntriesColPath(schoolId: string, termId: string): string {
  return `schools/${schoolId}/terms/${termId}/scoreEntries`;
}

/**
 * Score Entry Document Path
 * Pattern: /schools/{schoolId}/terms/{termId}/scoreEntries/{entryId}
 */
export function getScoreEntryDocPath(
  schoolId: string,
  termId: string,
  entryId: string
): string {
  return `schools/${schoolId}/terms/${termId}/scoreEntries/${entryId}`;
}

/**
 * Deterministic helper for Score Entry document ID
 * e.g., `${studentId}_${subjectId}`
 */
export function getScoreEntryDocId(studentId: string, subjectId: string): string {
  return `${studentId}_${subjectId}`;
}

/**
 * Per-Class Submission Status Document Path
 * Pattern: /schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus
 */
export function getSubmissionStatusDocPath(
  schoolId: string,
  termId: string,
  classId: string
): string {
  return `schools/${schoolId}/terms/${termId}/classes/${classId}/submissionStatus`;
}

/**
 * Report Cards Collection Path
 * Pattern: /schools/{schoolId}/terms/{termId}/reportCards
 */
export function getReportCardsColPath(schoolId: string, termId: string): string {
  return `schools/${schoolId}/terms/{termId}/reportCards`;
}

/**
 * Report Card Document Path
 * Pattern: /schools/{schoolId}/terms/{termId}/reportCards/{studentId}
 */
export function getReportCardDocPath(
  schoolId: string,
  termId: string,
  studentId: string
): string {
  return `schools/${schoolId}/terms/${termId}/reportCards/${studentId}`;
}

/**
 * Class Daily Attendance Document Path
 * Pattern: /schools/{schoolId}/classes/{classId}/attendance/{date}
 *
 * @param date ISO date string in YYYY-MM-DD format
 */
export function getClassDailyAttendanceDocPath(
  schoolId: string,
  classId: string,
  date: string
): string {
  return `schools/${schoolId}/classes/${classId}/attendance/${date}`;
}

/**
 * Class Daily Attendance Collection Path
 * Pattern: /schools/{schoolId}/classes/{classId}/attendance
 */
export function getClassAttendanceColPath(
  schoolId: string,
  classId: string
): string {
  return `schools/${schoolId}/classes/${classId}/attendance`;
}
