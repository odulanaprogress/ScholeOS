# ScholeOS — Firestore Real-Time Layer & Security Rules Architecture (Wave 2)

**Firebase Project ID:** `scholesos` *(Internal Firebase project identifier with historical naming)*  
**Wave:** 2 (Real-Time Document Layer & Access Control)

---

## 🏛️ Core Architectural Invariant: Read-Only Client Layer

> [!CAUTION]
> **CRITICAL ARCHITECTURAL RULE:**  
> **Clients (Frontend React App, Mobile Apps, Tablets) MUST NEVER write directly to Firestore.**  
> **Clients ONLY READ via real-time snapshot listeners or one-off gets.**

### Why This Architecture Is Mandatory
In ScholeOS, academic grading authority and attendance ownership are strictly governed by relational constraints stored in PostgreSQL:
- An academic teacher may only record scores if they possess an active row in PostgreSQL's `assignments` table matching `(school_id, staff_id, class_id, subject_id, term_id)`.
- Daily class attendance may only be marked by the designated class teacher assigned in PostgreSQL.

**Firestore Security Rules have no direct connectivity to PostgreSQL.**  
If client apps were permitted to write directly to Firestore:
1. Firestore rules would have no way to verify whether a user is genuinely assigned to teach that subject or class in PostgreSQL.
2. Security would quickly bleed or require fragile data synchronization across two databases.

### The Solution: Cloudflare Worker Gateway with Firebase Admin SDK
- All write requests (entering continuous assessment scores, submitting term grades, locking broadsheets, logging daily attendance) are sent via HTTPS to our **Cloudflare Worker microservices**.
- The Worker queries PostgreSQL, validates permissions and active assignments, computes any totals/aggregates, and commits changes transactionally.
- Once validated, the Worker uses the **Firebase Admin SDK** (initialized with a secure server-side Service Account Key) to mutate documents in Firestore.
- The Firebase Admin SDK **bypasses security rules entirely**, allowing our application logic in the Worker to serve as the definitive gatekeeper.
- Firestore security rules only need to gate **READ** operations and enforce absolute lockdown on client writes.

```
+------------------+         REST / RPC (Bearer Token)        +-----------------------------------+
|  Client Browser  |  ======================================> |        Cloudflare Worker          |
|   (React / Vite) |                                          |  (e.g., academic / attendance)    |
+------------------+                                          +-----------------------------------+
         ^                                                                      |
         | Real-time Read Listener                                              | 1. Query Postgres `assignments`
         | (Gated by custom claim:                                              |    table to verify teacher role
         |  token.schoolId == schoolId)                                         v
         |                                                    +-----------------------------------+
         |                                                    |     PostgreSQL (Drizzle ORM)      |
         |                                                    +-----------------------------------+
         |                                                                      |
         |                                                                      | 2. Authorized! Worker writes
         |                                                                      |    using Firebase Admin SDK
         |                                                                      v
+-------------------------------------------------------------------------------------------------+
|                                 Google Cloud Firestore (`scholesos`)                            |
|                                                                                                 |
|   - Client Writes: `allow write: if false;` (BLOCKED)                                           |
|   - Admin SDK Writes: Permitted (bypasses security rules)                                       |
|   - Client Reads: `allow read: if request.auth.token.schoolId == schoolId;`                      |
+-------------------------------------------------------------------------------------------------+
```

---

## 🗄️ Firestore Collection Structure

All collections are strictly isolated under each institution's tenant path: `/schools/{schoolId}`.

### 1. Score Entries Collection
**Path:** `/schools/{schoolId}/terms/{termId}/scoreEntries/{entryId}`  
Stores individual student assessment component scores for a subject.

- **Document ID (`entryId`):** Deterministic UUID or hash (e.g., `${studentId}_${subjectId}`)
- **Fields:**
  - `studentId` *(string / UUID)*: Foreign key matching Postgres `students.id`.
  - `subjectId` *(string / UUID)*: Foreign key matching Postgres `subjects.id`.
  - `classId` *(string / UUID)*: Foreign key matching Postgres `classes.id`.
  - `teacherId` *(string / UUID)*: Staff ID who entered the scores.
  - `componentScores` *(map)*: Keyed by `assessment_component.id` (from Postgres `assessment_components`), value is the numerical mark (e.g. `{"comp_test_1": 18, "comp_midterm": 17, "comp_exam": 52}`).
  - `total` *(number)*: Computed cumulative score (e.g., `87`).
  - `status` *(string)*: `'draft' | 'submitted' | 'locked'`.
  - `updatedAt` *(string / timestamp)*: ISO timestamp of last modification.

---

### 2. Per-Class Submission Status Document
**Path:** `/schools/{schoolId}/terms/{termId}/classes/{classId}/submissionStatus`  
A single real-time document per class arm monitored by the designated Class Teacher's live dashboard tracker.

- **Document ID:** Fixed name `submissionStatus`.
- **Fields:**
  - Map keyed by `subjectId` containing:
    - `status` *(string)*: `'draft' | 'submitted' | 'locked'`.
    - `teacherId` *(string / UUID)*: ID of the subject teacher responsible for the subject.
    - `updatedAt` *(string / timestamp)*: Last state transition timestamp.

---

### 3. Report Cards Collection
**Path:** `/schools/{schoolId}/terms/{termId}/reportCards/{studentId}`  
Computed summary sheet and cumulative terminal performance for a student.

- **Document ID (`studentId`):** Foreign key matching Postgres `students.id`.
- **Fields:**
  - `studentId` *(string / UUID)*: Identifies the student.
  - `classId` *(string / UUID)*: Class arm student belonged to for this term.
  - `perSubjectTotals` *(map)*: Keyed by `subjectId`, mapping to the final aggregated total for each subject.
  - `overallTotal` *(number)*: Cumulative points across all subjects.
  - `average` *(number)*: Arithmetic mean score percentage.
  - `position` *(number | string)*: Student rank in class (e.g., `1` or `"1st"`).
  - `comment` *(string)*: Form master / principal continuous assessment remark.
  - `status` *(string)*: `'draft' | 'published'`.
  - `updatedAt` *(string / timestamp)*: Timestamp of last computation.

---

### 4. Class Daily Attendance Collection
**Path:** `/schools/{schoolId}/classes/{classId}/attendance/{date}`  
One document per class arm per calendar day (`YYYY-MM-DD`). Note: Attendance is keyed under the class entity rather than term to allow direct daily retrieval.

- **Document ID (`date`):** ISO Date string (`YYYY-MM-DD`, e.g., `2026-09-18`).
- **Fields:**
  - `classId` *(string / UUID)*: The class arm.
  - `date` *(string)*: Calendar date.
  - `markedByStaffId` *(string / UUID)*: Class teacher staff ID who submitted attendance.
  - `attendance` *(map)*: Keyed by `studentId`, value indicates status:
    - Status: `'present' | 'absent' | 'late'`
    - Note (optional): reason for absence or tardiness.
  - `updatedAt` *(string / timestamp)*: Timestamp when register was taken.

---

## 🔒 Security Rules (`firestore.rules`)

The security rules are deployed at `firestore.rules`:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function belongsToSchool(schoolId) {
      return isAuthenticated() && request.auth.token.schoolId == schoolId;
    }

    match /schools/{schoolId} {
      allow read, write: if false;

      match /terms/{termId} {
        match /scoreEntries/{entryId} {
          allow read: if belongsToSchool(schoolId);
          allow write: if false;
        }

        match /classes/{classId}/submissionStatus {
          allow read: if belongsToSchool(schoolId);
          allow write: if false;
        }

        match /reportCards/{studentId} {
          allow read: if belongsToSchool(schoolId);
          allow write: if false;
        }
      }

      match /classes/{classId}/attendance/{date} {
        allow read: if belongsToSchool(schoolId);
        allow write: if false;
      }

      match /{allChildren=**} {
        allow read: if belongsToSchool(schoolId);
        allow write: if false;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Explanation of Rules Behavior:
1. **Zero Client Writes:** All `write` rules are hardcoded to `if false;`. No authenticated or unauthenticated client SDK write can succeed.
2. **Multi-Tenant Read Boundary:** Reads are only allowed if `request.auth.token.schoolId == schoolId`. Cross-tenant reading is impossible.
3. **Custom Claim Sync (Wave 3 dependency):**
   - The token claim `schoolId` will be synced by **Wave 3 (`identity-service`)** when users authenticate.
   - `identity-service` issues custom claims using `firebase-admin`'s `setCustomUserClaims(uid, { schoolId: user.schoolId })` upon successful Clerk token validation.

---

## 🛡️ Firebase App Check Enforcement

To defend Firestore against bot abuse, API scraping, and replay attacks, **Firebase App Check** must be enforced. When enabled, requests lacking a valid attestation token are dropped by Google's infrastructure before reaching security rules.

### How to Enable in Firebase Console:
1. Open [Firebase Console](https://console.firebase.google.com/) and select project **`scholesos`**.
2. In the left navigation, click on **Build** > **Firestore Database**.
3. Select the **Settings** or **App Check** tab (or navigate directly to **Build** > **App Check**).
4. Under the **Apps** tab, register the ScholeOS web application provider:
   - For Production: Select **reCAPTCHA Enterprise** (or **reCAPTCHA v3**) and register the web domain (`scholeos.ng` or Vercel deployment domain).
   - For Local Development: Enable **Debug Provider** and copy the generated debug token into `frontend/.env`.
5. Under the **APIs** tab in App Check:
   - Find **Cloud Firestore**.
   - Click **Enforce**.
   - Review metrics in the monitoring window, then click **Enforce** to activate rejection of unverified traffic.

---

## 🚀 Deployment Instructions

### 1. Firebase CLI Setup
Ensure you have the Firebase CLI installed and are logged in:
```bash
npm install -g firebase-tools
firebase login
```

### 2. Verify Project Target
The project is configured via `.firebaserc` to target `scholesos`:
```bash
firebase use scholesos
```

### 3. Deploy Security Rules
To deploy rules without overwriting other services:
```bash
firebase deploy --only firestore:rules
```

To deploy rules and indexes together:
```bash
firebase deploy --only firestore
```
