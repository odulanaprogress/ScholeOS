/**
 * Academic Scores Management Routes (Wave 4)
 *
 * Endpoints:
 * 1. POST /scores/:classId/:subjectId/:termId (Save draft scores with weight validation)
 * 2. POST /scores/:classId/:subjectId/:termId/submit (Submit scores & auto-compute draft report cards if complete)
 * 3. POST /scores/:classId/:subjectId/:termId/reopen-request (Request score sheet reopening)
 * 4. POST /reopen-requests/:id/approve (Class Teacher/Admin approves reopen request)
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { assessmentComponents, classes, subjects, reopenRequests } from "../../../db/schema/academics";
import { students } from "../../../db/schema/users";
import { getFirestoreDb } from "../../../firestore/admin";
import {
  getScoreEntryDocPath,
  getScoreEntryDocId,
  getSubmissionStatusDocPath,
  getReportCardDocPath,
} from "../../../firestore/paths";
import { computeStandardCompetitionRanks } from "../ranking";
import { eq, and, or, isNull } from "drizzle-orm";
import type { BatchScoresInput, ReopenRequestInput } from "../types";

export const scoreRoutes = new Hono();

/**
 * Helper: Resolve caller's staff profile and schoolId from Clerk user ID
 */
async function resolveCallerStaff(clerkUserId: string) {
  const [currentStaff] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.clerkUserId, clerkUserId), eq(staff.status, "active")))
    .limit(1);

  return currentStaff;
}

/**
 * Helper: Verify active subject teacher assignment
 */
async function assertSubjectTeacherAssignment(
  schoolId: string,
  staffId: string,
  classId: string,
  subjectId: string,
  termId: string
) {
  const [assignment] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, schoolId),
        eq(assignments.staffId, staffId),
        eq(assignments.classId, classId),
        eq(assignments.subjectId, subjectId),
        eq(assignments.termId, termId),
        eq(assignments.role, "subject_teacher"),
        eq(assignments.status, "active")
      )
    )
    .limit(1);

  return !!assignment;
}

// -----------------------------------------------------------------------------
// 1. POST /scores/:classId/:subjectId/:termId (Save Draft Scores)
// -----------------------------------------------------------------------------
scoreRoutes.post("/:classId/:subjectId/:termId", async (c) => {
  const auth = c.get("auth");
  const { classId, subjectId, termId } = c.req.param();

  // 1. Authenticate caller as staff
  const currentStaff = await resolveCallerStaff(auth.userId);
  if (!currentStaff) {
    return c.json(
      { error: "Forbidden", message: "Caller is not an active staff member in this institution." },
      403
    );
  }

  // 2. Verify exact subject teacher assignment in PostgreSQL
  const isAuthorized = await assertSubjectTeacherAssignment(
    currentStaff.schoolId,
    currentStaff.id,
    classId,
    subjectId,
    termId
  );

  if (!isAuthorized) {
    return c.json(
      {
        error: "Forbidden",
        message: `Unauthorized: You do not have an active subject teacher assignment for class '${classId}' and subject '${subjectId}' in this term.`,
      },
      403
    );
  }

  // 3. Parse and validate body
  let body: BatchScoresInput;
  try {
    body = await c.req.json<BatchScoresInput>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  const { entries } = body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return c.json({ error: "Bad Request", message: "Body must include a non-empty 'entries' array." }, 400);
  }

  // 4. Query assessment components for this school and term to validate weights
  const components = await db
    .select()
    .from(assessmentComponents)
    .where(
      and(
        eq(assessmentComponents.schoolId, currentStaff.schoolId),
        or(
          eq(assessmentComponents.termId, termId),
          isNull(assessmentComponents.termId)
        )
      )
    );

  const componentWeightMap = new Map<string, { name: string; weight: number }>();
  for (const comp of components) {
    componentWeightMap.set(comp.id, { name: comp.componentName, weight: comp.weight });
  }

  // 5. Validate component scores against configured weights & compute totals
  const validatedEntries = [];
  for (const entry of entries) {
    if (!entry.studentId || !entry.componentScores) {
      return c.json(
        { error: "Bad Request", message: "Each entry must specify 'studentId' and 'componentScores'." },
        400
      );
    }

    let calculatedTotal = 0;
    for (const [compId, scoreValue] of Object.entries(entry.componentScores)) {
      if (typeof scoreValue !== "number" || isNaN(scoreValue) || scoreValue < 0) {
        return c.json(
          {
            error: "Validation Error",
            message: `Invalid score value '${scoreValue}' for student '${entry.studentId}'. Scores must be non-negative numbers.`,
          },
          400
        );
      }

      const configured = componentWeightMap.get(compId);
      if (configured && scoreValue > configured.weight) {
        return c.json(
          {
            error: "Validation Error",
            message: `Validation Error: Student '${entry.studentId}' score of ${scoreValue} for component '${configured.name}' exceeds the configured maximum weight of ${configured.weight} points.`,
            failedStudentId: entry.studentId,
            componentId: compId,
            componentName: configured.name,
            maxAllowedWeight: configured.weight,
            submittedValue: scoreValue,
          },
          400
        );
      }

      calculatedTotal += scoreValue;
    }

    validatedEntries.push({
      studentId: entry.studentId,
      componentScores: entry.componentScores,
      total: calculatedTotal,
    });
  }

  // 6. Firestore Invariant Check: Reject overwrite if already submitted or locked
  const firestore = getFirestoreDb();
  for (const entry of validatedEntries) {
    const docId = getScoreEntryDocId(entry.studentId, subjectId);
    const docPath = getScoreEntryDocPath(currentStaff.schoolId, termId, docId);
    const existingSnap = await firestore.doc(docPath).get();

    if (existingSnap.exists) {
      const existingData = existingSnap.data();
      if (existingData?.status === "submitted" || existingData?.status === "locked") {
        return c.json(
          {
            error: "Conflict",
            message: `Cannot modify scores: Scores for student '${entry.studentId}' are currently '${existingData.status}'. Scores must be reopened by the class teacher or administrator before edits can be saved.`,
            studentId: entry.studentId,
            currentStatus: existingData.status,
          },
          409
        );
      }
    }
  }

  // 7. Upsert draft scoreEntries in Firestore
  const batch = firestore.batch();
  const now = new Date().toISOString();

  for (const entry of validatedEntries) {
    const docId = getScoreEntryDocId(entry.studentId, subjectId);
    const docPath = getScoreEntryDocPath(currentStaff.schoolId, termId, docId);
    const docRef = firestore.doc(docPath);

    batch.set(
      docRef,
      {
        studentId: entry.studentId,
        subjectId,
        classId,
        teacherId: currentStaff.id,
        componentScores: entry.componentScores,
        total: entry.total,
        status: "draft",
        updatedAt: now,
      },
      { merge: true }
    );
  }

  await batch.commit();

  return c.json(
    {
      message: "Draft scores saved successfully.",
      count: validatedEntries.length,
      classId,
      subjectId,
      termId,
    },
    200
  );
});

// -----------------------------------------------------------------------------
// 2. POST /scores/:classId/:subjectId/:termId/submit (Submit Scores & Auto-Compute)
// -----------------------------------------------------------------------------
scoreRoutes.post("/:classId/:subjectId/:termId/submit", async (c) => {
  const auth = c.get("auth");
  const { classId, subjectId, termId } = c.req.param();

  const currentStaff = await resolveCallerStaff(auth.userId);
  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  const isAuthorized = await assertSubjectTeacherAssignment(
    currentStaff.schoolId,
    currentStaff.id,
    classId,
    subjectId,
    termId
  );

  if (!isAuthorized) {
    return c.json(
      {
        error: "Forbidden",
        message: `Unauthorized: You do not have an active subject teacher assignment for class '${classId}' and subject '${subjectId}'.`,
      },
      403
    );
  }

  const firestore = getFirestoreDb();
  const schoolId = currentStaff.schoolId;

  // 1. Fetch all score entries for this class+subject+term from Firestore
  const scoreEntriesColPath = `schools/${schoolId}/terms/${termId}/scoreEntries`;
  const entriesSnapshot = await firestore
    .collection(scoreEntriesColPath)
    .where("classId", "==", classId)
    .where("subjectId", "==", subjectId)
    .get();

  if (entriesSnapshot.empty) {
    return c.json(
      {
        error: "Bad Request",
        message: "No score entries found to submit for this class and subject. Please save draft scores before submitting.",
      },
      400
    );
  }

  // 2. Batch flip all score entries from "draft" to "submitted"
  const batch = firestore.batch();
  const now = new Date().toISOString();

  entriesSnapshot.forEach((doc) => {
    batch.update(doc.ref, {
      status: "submitted",
      updatedAt: now,
    });
  });

  // 3. Update the per-class submissionStatus document
  const submissionStatusPath = getSubmissionStatusDocPath(schoolId, termId, classId);
  const submissionStatusRef = firestore.doc(submissionStatusPath);

  batch.set(
    submissionStatusRef,
    {
      [subjectId]: {
        status: "submitted",
        teacherId: currentStaff.id,
        updatedAt: now,
      },
    },
    { merge: true }
  );

  await batch.commit();

  // 4. Check whether EVERY subject for this class is now submitted!
  // Query all active subject assignments for this class from PostgreSQL
  const classSubjectAssignments = await db
    .select({ subjectId: assignments.subjectId })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, schoolId),
        eq(assignments.classId, classId),
        eq(assignments.termId, termId),
        eq(assignments.role, "subject_teacher"),
        eq(assignments.status, "active")
      )
    );

  const requiredSubjectIds = new Set(
    classSubjectAssignments
      .map((a) => a.subjectId)
      .filter((id): id is string => id !== null)
  );

  // Read updated submissionStatus document
  const updatedStatusSnap = await submissionStatusRef.get();
  const statusData = updatedStatusSnap.data() || {};

  let allSubmitted = true;
  for (const reqSubId of requiredSubjectIds) {
    const subStatus = statusData[reqSubId]?.status;
    if (subStatus !== "submitted" && subStatus !== "locked") {
      allSubmitted = false;
      break;
    }
  }

  let draftReportCardsComputed = false;

  // 5. If ALL subjects are submitted, auto-compute draft report cards with 1224 competition ranking!
  if (allSubmitted && requiredSubjectIds.size > 0) {
    // A. Query all enrolled students in this class
    const classStudents = await db
      .select({ id: students.id, fullName: students.fullName })
      .from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.classId, classId)));

    // B. Query all submitted score entries for this class and term
    const allClassScoresSnap = await firestore
      .collection(scoreEntriesColPath)
      .where("classId", "==", classId)
      .get();

    // Map: studentId -> map of subjectId -> total score
    const studentSubjectMap = new Map<string, Record<string, number>>();
    allClassScoresSnap.forEach((doc) => {
      const data = doc.data();
      if (data?.studentId && data?.subjectId && typeof data.total === "number") {
        if (!studentSubjectMap.has(data.studentId)) {
          studentSubjectMap.set(data.studentId, {});
        }
        studentSubjectMap.get(data.studentId)![data.subjectId] = data.total;
      }
    });

    // C. Calculate totals and averages
    const studentAggregates = classStudents.map((stud) => {
      const subjectScores = studentSubjectMap.get(stud.id) || {};
      const subjectTotals = Object.values(subjectScores);
      const overallTotal = subjectTotals.reduce((sum, val) => sum + val, 0);
      const average =
        requiredSubjectIds.size > 0
          ? Math.round((overallTotal / requiredSubjectIds.size) * 100) / 100
          : 0;

      return {
        studentId: stud.id,
        perSubjectTotals: subjectScores,
        overallTotal,
        total: overallTotal, // For ranking helper
        average,
      };
    });

    // D. Rank students using 1224 Standard Competition Ranking
    const rankedStudents = computeStandardCompetitionRanks(studentAggregates);

    // E. Batch write draft reportCard documents to Firestore
    const reportCardBatch = firestore.batch();
    for (const ranked of rankedStudents) {
      const reportCardPath = getReportCardDocPath(schoolId, termId, ranked.studentId);
      const reportCardRef = firestore.doc(reportCardPath);

      reportCardBatch.set(
        reportCardRef,
        {
          studentId: ranked.studentId,
          classId,
          perSubjectTotals: ranked.perSubjectTotals,
          overallTotal: ranked.overallTotal,
          average: ranked.average,
          position: ranked.position,
          comment: "",
          status: "draft",
          updatedAt: now,
        },
        { merge: true }
      );
    }

    await reportCardBatch.commit();
    draftReportCardsComputed = true;
  }

  return c.json(
    {
      message: "Scores submitted successfully.",
      submittedEntriesCount: entriesSnapshot.size,
      allSubjectsSubmitted: allSubmitted,
      draftReportCardsComputed,
    },
    200
  );
});

// -----------------------------------------------------------------------------
// 3. POST /scores/:classId/:subjectId/:termId/reopen-request (Request Reopen)
// -----------------------------------------------------------------------------
scoreRoutes.post("/:classId/:subjectId/:termId/reopen-request", async (c) => {
  const auth = c.get("auth");
  const { classId, subjectId, termId } = c.req.param();

  const currentStaff = await resolveCallerStaff(auth.userId);
  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  const isAuthorized = await assertSubjectTeacherAssignment(
    currentStaff.schoolId,
    currentStaff.id,
    classId,
    subjectId,
    termId
  );

  if (!isAuthorized) {
    return c.json(
      {
        error: "Forbidden",
        message: "Unauthorized: You must be the assigned subject teacher to request reopening scores.",
      },
      403
    );
  }

  let body: ReopenRequestInput;
  try {
    body = await c.req.json<ReopenRequestInput>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  if (!body.reason || body.reason.trim().length < 5) {
    return c.json(
      { error: "Bad Request", message: "A specific reason (minimum 5 characters) must be provided." },
      400
    );
  }

  // Insert reopen request row into PostgreSQL
  const [newRequest] = await db
    .insert(reopenRequests)
    .values({
      schoolId: currentStaff.schoolId,
      staffId: currentStaff.id,
      classId,
      subjectId,
      termId,
      reason: body.reason.trim(),
      status: "pending",
    })
    .returning();

  return c.json(
    {
      message: "Score sheet reopen request submitted successfully.",
      request: newRequest,
    },
    201
  );
});

// -----------------------------------------------------------------------------
// 4. POST /reopen-requests/:id/approve (Approve Reopen Request)
// -----------------------------------------------------------------------------
scoreRoutes.post("/reopen-requests/:id/approve", async (c) => {
  const auth = c.get("auth");
  const requestId = c.req.param("id");

  const currentStaff = await resolveCallerStaff(auth.userId);
  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  // 1. Fetch reopen request from PostgreSQL
  const [request] = await db
    .select()
    .from(reopenRequests)
    .where(eq(reopenRequests.id, requestId))
    .limit(1);

  if (!request) {
    return c.json({ error: "Not Found", message: `Reopen request '${requestId}' not found.` }, 404);
  }

  if (request.status !== "pending") {
    return c.json(
      {
        error: "Conflict",
        message: `This reopen request has already been ${request.status}.`,
      },
      409
    );
  }

  // 2. Authorize: Caller must be Class Teacher for that class, or Admin
  const isSchoolAdmin = currentStaff.roles.includes("admin") || auth.orgRole === "org:admin";

  const [classTeacherAssignment] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, currentStaff.schoolId),
        eq(assignments.staffId, currentStaff.id),
        eq(assignments.classId, request.classId),
        eq(assignments.termId, request.termId),
        eq(assignments.role, "class_teacher"),
        eq(assignments.status, "active")
      )
    )
    .limit(1);

  if (!isSchoolAdmin && !classTeacherAssignment) {
    return c.json(
      {
        error: "Forbidden",
        message: "Only the assigned Class Teacher for this class or a School Administrator can approve reopen requests.",
      },
      403
    );
  }

  // 3. Flip Firestore scoreEntries back to "draft"
  const firestore = getFirestoreDb();
  const schoolId = currentStaff.schoolId;
  const scoreEntriesColPath = `schools/${schoolId}/terms/${request.termId}/scoreEntries`;

  const scoresSnapshot = await firestore
    .collection(scoreEntriesColPath)
    .where("classId", "==", request.classId)
    .where("subjectId", "==", request.subjectId)
    .get();

  const batch = firestore.batch();
  const now = new Date().toISOString();

  scoresSnapshot.forEach((doc) => {
    batch.update(doc.ref, {
      status: "draft",
      updatedAt: now,
    });
  });

  // 4. Flip per-class submissionStatus subject entry back to "draft"
  const submissionStatusPath = getSubmissionStatusDocPath(schoolId, request.termId, request.classId);
  batch.set(
    firestore.doc(submissionStatusPath),
    {
      [request.subjectId]: {
        status: "draft",
        updatedAt: now,
      },
    },
    { merge: true }
  );

  await batch.commit();

  // 5. Update reopen_requests status in PostgreSQL
  const [updatedRequest] = await db
    .update(reopenRequests)
    .set({
      status: "approved",
      reviewedByStaffId: currentStaff.id,
      reviewedAt: new Date(),
    })
    .where(eq(reopenRequests.id, requestId))
    .returning();

  return c.json(
    {
      message: "Reopen request approved. Subject scores and submission status have been reverted to draft.",
      request: updatedRequest,
      revertedScoresCount: scoresSnapshot.size,
    },
    200
  );
});
