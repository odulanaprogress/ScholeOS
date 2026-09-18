/**
 * ScholeOS Backend Firebase Admin SDK Integration (Wave 2)
 *
 * Project ID: scholesos
 *
 * CRITICAL ARCHITECTURAL ENFORCEMENT:
 * -----------------------------------
 * In ScholeOS, all Firestore write mutations MUST originate here on the server
 * (Cloudflare Workers / Node services) using the Firebase Admin SDK.
 *
 * Direct client writes are barred by Security Rules.
 * Before invoking any write method below, the caller MUST have already verified
 * caller authorization against the PostgreSQL `assignments` table.
 */

import crypto from "crypto";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "../config/env";
import type {
  ScoreEntryDocument,
  ClassSubmissionStatusDocument,
  SubjectSubmissionEntry,
  ReportCardDocument,
  ClassDailyAttendanceDocument,
  ScholeOSFirebaseClaims,
} from "./types";
import {
  getScoreEntryDocPath,
  getSubmissionStatusDocPath,
  getReportCardDocPath,
  getClassDailyAttendanceDocPath,
} from "./paths";

let adminApp: App | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

/**
 * Initializes or returns the singleton Firebase Admin App
 */
export function getFirebaseAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const projectId = env.FIREBASE_PROJECT_ID || "scholesos";

  // If private key & client email are supplied, authenticate via certificate
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      projectId,
    });
  } else if (env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsedKey = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(parsedKey),
        projectId,
      });
    } catch {
      adminApp = initializeApp({ projectId });
    }
  } else {
    // Development / test fallback: generate local RSA cert so createCustomToken can sign tokens locally
    try {
      const { privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail: `dev-admin@${projectId}.iam.gserviceaccount.com`,
          privateKey,
        }),
        projectId,
      });
    } catch {
      adminApp = initializeApp({ projectId });
    }
  }

  return adminApp;
}

/**
 * Returns typed Firestore Admin database instance
 */
export function getFirestoreDb(): Firestore {
  if (!firestoreDb) {
    firestoreDb = getFirestore(getFirebaseAdminApp());
  }
  return firestoreDb;
}

/**
 * Returns Firebase Auth instance for custom claims management
 */
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseAdminApp());
  }
  return firebaseAuth;
}

/**
 * Verification contract required before any write to guarantee
 * Postgres assignments were validated first.
 */
export interface AssignmentVerificationProof {
  verifiedAgainstPostgres: true;
  staffId: string;
  verifiedAt: Date;
}

// -----------------------------------------------------------------------------
// SECURE SERVER-SIDE WRITE OPERATIONS
// -----------------------------------------------------------------------------

/**
 * Writes or updates a Score Entry document
 * Path: /schools/{schoolId}/terms/{termId}/scoreEntries/{entryId}
 */
export async function writeScoreEntry(
  schoolId: string,
  termId: string,
  entryId: string,
  data: ScoreEntryDocument,
  proof: AssignmentVerificationProof
): Promise<void> {
  if (!proof.verifiedAgainstPostgres) {
    throw new Error(
      "[Security Invariant] Cannot write scoreEntry without verified PostgreSQL assignment proof."
    );
  }

  const db = getFirestoreDb();
  const docPath = getScoreEntryDocPath(schoolId, termId, entryId);
  await db.doc(docPath).set(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Updates a subject's status in the per-class Submission Status document
 * Path: /schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus
 */
export async function updateClassSubmissionStatus(
  schoolId: string,
  termId: string,
  classId: string,
  subjectId: string,
  entry: SubjectSubmissionEntry,
  proof: AssignmentVerificationProof
): Promise<void> {
  if (!proof.verifiedAgainstPostgres) {
    throw new Error(
      "[Security Invariant] Cannot update submissionStatus without verified PostgreSQL assignment proof."
    );
  }

  const db = getFirestoreDb();
  const docPath = getSubmissionStatusDocPath(schoolId, termId, classId);
  await db.doc(docPath).set(
    {
      [subjectId]: {
        ...entry,
        updatedAt: new Date().toISOString(),
      },
    },
    { merge: true }
  );
}

/**
 * Writes a computed Report Card document for a student
 * Path: /schools/{schoolId}/terms/{termId}/reportCards/{studentId}
 */
export async function writeReportCard(
  schoolId: string,
  termId: string,
  studentId: string,
  data: ReportCardDocument,
  proof: AssignmentVerificationProof
): Promise<void> {
  if (!proof.verifiedAgainstPostgres) {
    throw new Error(
      "[Security Invariant] Cannot write reportCard without verified PostgreSQL permission proof."
    );
  }

  const db = getFirestoreDb();
  const docPath = getReportCardDocPath(schoolId, termId, studentId);
  await db.doc(docPath).set(
    {
      ...data,
      studentId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Writes Daily Class Attendance
 * Path: /schools/{schoolId}/classes/{classId}/attendance/{date}
 */
export async function writeClassDailyAttendance(
  schoolId: string,
  classId: string,
  date: string,
  data: ClassDailyAttendanceDocument,
  proof: AssignmentVerificationProof
): Promise<void> {
  if (!proof.verifiedAgainstPostgres) {
    throw new Error(
      "[Security Invariant] Cannot write daily attendance without verified Class Teacher assignment proof."
    );
  }

  const db = getFirestoreDb();
  const docPath = getClassDailyAttendanceDocPath(schoolId, classId, date);
  await db.doc(docPath).set(
    {
      ...data,
      date,
      markedByStaffId: proof.staffId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Sets Custom Claims for User
 * Prepares user JWT token with `schoolId` claim required by Firestore Security Rules.
 * (Used by `identity-service` in Wave 3).
 */
export async function setSchoolUserClaims(
  uid: string,
  claims: ScholeOSFirebaseClaims
): Promise<void> {
  const auth = getFirebaseAuth();
  await auth.setCustomUserClaims(uid, claims as unknown as object);
}
