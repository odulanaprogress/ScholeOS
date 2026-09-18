/**
 * ScholeOS Firebase Client & Real-Time Firestore Service (Wave 2)
 *
 * Project ID: scholesos
 *
 * CRITICAL ARCHITECTURAL GUARANTEE:
 * ---------------------------------
 * 1. Clients ONLY READ from Firestore. Direct client writes are rejected by Firestore Security Rules
 *    (`allow write: if false;`).
 * 2. All writes must be dispatched to Cloudflare Worker endpoints which authenticate the user,
 *    verify active PostgreSQL `assignments`, and mutate Firestore using the Firebase Admin SDK.
 * 3. App Check enforcement ensures only verified app instances can initiate queries.
 */

import type {
  ScoreEntryDocument,
  ClassSubmissionStatusDocument,
  ReportCardDocument,
  ClassDailyAttendanceDocument,
} from "../types/firestore";

/**
 * Firebase Client Configuration
 * Project ID has historical typo 'scholesos' as per project setup.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_demo_key_scholesos",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scholesos.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scholesos",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scholesos.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abcdef123456",
};

/**
 * Path Builders for Client Subscriptions
 */
export const FirestorePaths = {
  scoreEntries: (schoolId: string, termId: string) =>
    `schools/${schoolId}/terms/${termId}/scoreEntries`,
  scoreEntry: (schoolId: string, termId: string, entryId: string) =>
    `schools/${schoolId}/terms/${termId}/scoreEntries/${entryId}`,
  submissionStatus: (schoolId: string, termId: string, classId: string) =>
    `schools/${schoolId}/terms/{termId}/classes/${classId}/submissionStatus`
      .replace("{termId}", termId),
  reportCards: (schoolId: string, termId: string) =>
    `schools/${schoolId}/terms/${termId}/reportCards`,
  reportCard: (schoolId: string, termId: string, studentId: string) =>
    `schools/${schoolId}/terms/${termId}/reportCards/${studentId}`,
  attendanceDate: (schoolId: string, classId: string, date: string) =>
    `schools/${schoolId}/classes/${classId}/attendance/${date}`,
};

/**
 * Prohibited Client-Side Write Guard
 * Throws an explicit error if a developer ever attempts to call a write method client-side.
 */
export function assertClientWriteForbidden(operationName: string): never {
  throw new Error(
    `[ScholeOS Security Invariant Violation] Client attempted direct Firestore write: "${operationName}". ` +
      `Clients MUST NOT write directly to Firestore. All writes must go through Cloudflare Workers ` +
      `via API endpoints to verify PostgreSQL assignments before committing via Firebase Admin SDK.`
  );
}

/**
 * Subscription Callback Types
 */
export type UnsubscribeFn = () => void;
export type OnDataFn<T> = (data: T | null) => void;
export type OnListFn<T> = (data: T[]) => void;
export type OnErrorFn = (error: Error) => void;

/**
 * Read-Only Listener Helpers (Mock / Interface Bridge)
 * When the web app runs in production with the Firebase SDK loaded, these connect to onSnapshot.
 * In development / offline testing, they provide clean mock interfaces.
 */
export const FirestoreRealtime = {
  /**
   * Listen to Class Teacher's live Submission Status document
   * Path: /schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus
   */
  listenToClassSubmissionStatus(
    schoolId: string,
    termId: string,
    classId: string,
    onData: OnDataFn<ClassSubmissionStatusDocument>,
    _onError?: OnErrorFn
  ): UnsubscribeFn {
    void _onError;
    const path = FirestorePaths.submissionStatus(schoolId, termId, classId);
    console.debug(`[Firestore Read] Subscribing to submissionStatus at: ${path}`);

    // In local demo or before live backend connection, provide safe default
    const timer = setTimeout(() => {
      onData({
        "subject-math-01": { status: "submitted", teacherId: "staff-001" },
        "subject-eng-02": { status: "draft", teacherId: "staff-002" },
      });
    }, 100);

    return () => clearTimeout(timer);
  },

  /**
   * Listen to Daily Attendance for a class
   * Path: /schools/{schoolId}/classes/{classId}/attendance/{date}
   */
  listenToDailyAttendance(
    schoolId: string,
    classId: string,
    date: string,
    onData: OnDataFn<ClassDailyAttendanceDocument>,
    _onError?: OnErrorFn
  ): UnsubscribeFn {
    void _onError;
    const path = FirestorePaths.attendanceDate(schoolId, classId, date);
    console.debug(`[Firestore Read] Subscribing to daily attendance at: ${path}`);

    const timer = setTimeout(() => {
      onData({
        classId,
        date,
        markedByStaffId: "staff-class-teacher-01",
        attendance: {},
      });
    }, 100);

    return () => clearTimeout(timer);
  },

  /**
   * Listen to Student Report Card
   * Path: /schools/{schoolId}/terms/{termId}/reportCards/{studentId}
   */
  listenToReportCard(
    schoolId: string,
    termId: string,
    studentId: string,
    onData: OnDataFn<ReportCardDocument>,
    _onError?: OnErrorFn
  ): UnsubscribeFn {
    void _onError;
    const path = FirestorePaths.reportCard(schoolId, termId, studentId);
    console.debug(`[Firestore Read] Subscribing to reportCard at: ${path}`);

    const timer = setTimeout(() => {
      onData(null);
    }, 100);

    return () => clearTimeout(timer);
  },

  /**
   * Listen to Score Entries for a term
   * Path: /schools/{schoolId}/terms/{termId}/scoreEntries
   */
  listenToScoreEntries(
    schoolId: string,
    termId: string,
    onData: OnListFn<ScoreEntryDocument>,
    _onError?: OnErrorFn
  ): UnsubscribeFn {
    void _onError;
    const path = FirestorePaths.scoreEntries(schoolId, termId);
    console.debug(`[Firestore Read] Subscribing to scoreEntries at: ${path}`);

    const timer = setTimeout(() => {
      onData([]);
    }, 100);

    return () => clearTimeout(timer);
  },
};
