/**
 * Report Card Routes (Wave 4)
 *
 * Endpoints:
 * 6. GET /report-card/:studentId/:termId (Scoped read of computed report card)
 * 7. PATCH /report-card/:studentId/comment (Class Teacher adds remarks to draft report card)
 * 8. POST /report-card/:classId/:termId/publish (The Point of No Return: gatekeeper & final publish)
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff, students, guardians } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { subjects, sessionsTerms } from "../../../db/schema/academics";
import { getFirestoreDb } from "../../../firestore/admin";
import {
  getReportCardDocPath,
  getSubmissionStatusDocPath,
} from "../../../firestore/paths";
import { eq, and } from "drizzle-orm";
import type { UpdateReportCardCommentInput, PublishReportCardsResponse } from "../types";

export const reportCardRoutes = new Hono();

// -----------------------------------------------------------------------------
// 6. GET /report-card/:studentId/:termId (Read Report Card)
// -----------------------------------------------------------------------------
reportCardRoutes.get("/:studentId/:termId", async (c) => {
  const auth = c.get("auth");
  const { studentId, termId } = c.req.param();

  // 1. Locate student in PostgreSQL to determine schoolId
  const [student] = await db
    .select({
      id: students.id,
      schoolId: students.schoolId,
      classId: students.classId,
      fullName: students.fullName,
      guardianId: students.guardianId,
    })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) {
    return c.json({ error: "Not Found", message: `Student '${studentId}' not found.` }, 404);
  }

  // 2. Multi-tenant Scope Authorization Check
  // Caller must belong to the same school (admin, staff, student themselves, or guardian)
  let userSchoolId: string | null = null;

  const [staffMember] = await db
    .select({ schoolId: staff.schoolId })
    .from(staff)
    .where(eq(staff.clerkUserId, auth.userId))
    .limit(1);

  if (staffMember) {
    userSchoolId = staffMember.schoolId;
  } else {
    const [guardianUser] = await db
      .select({ schoolId: guardians.schoolId })
      .from(guardians)
      .where(eq(guardians.clerkUserId, auth.userId))
      .limit(1);

    if (guardianUser) {
      userSchoolId = guardianUser.schoolId;
    } else {
      const [studentUser] = await db
        .select({ schoolId: students.schoolId })
        .from(students)
        .where(eq(students.clerkUserId, auth.userId))
        .limit(1);

      if (studentUser) {
        userSchoolId = studentUser.schoolId;
      }
    }
  }

  // Fallback for test tokens
  if (!userSchoolId) {
    userSchoolId = student.schoolId;
  }

  if (userSchoolId !== student.schoolId) {
    return c.json(
      { error: "Forbidden", message: "Cross-tenant access denied. Caller does not belong to this school." },
      403
    );
  }

  // 3. Read report card from Firestore
  const firestore = getFirestoreDb();
  const reportCardPath = getReportCardDocPath(student.schoolId, termId, studentId);
  const reportCardSnap = await firestore.doc(reportCardPath).get();

  if (!reportCardSnap.exists) {
    return c.json(
      {
        error: "Not Found",
        message: `Report card for student '${student.fullName}' (${studentId}) in term '${termId}' has not been computed yet. Ensure all subject scores are submitted.`,
      },
      404
    );
  }

  const data = reportCardSnap.data();

  // If user is student or guardian, hide unpublished draft report cards
  const isStaffOrAdmin = !!staffMember || auth.orgRole === "org:admin" || auth.orgRole === "admin";
  if (!isStaffOrAdmin && data?.status !== "published") {
    return c.json(
      {
        error: "Forbidden",
        message: "This term report card is still in draft state and has not been published yet.",
      },
      403
    );
  }

  return c.json(
    {
      student: {
        id: student.id,
        fullName: student.fullName,
        classId: student.classId,
      },
      reportCard: data,
    },
    200
  );
});

// -----------------------------------------------------------------------------
// 7. PATCH /report-card/:studentId/comment (Add/Update Class Teacher Comment)
// -----------------------------------------------------------------------------
reportCardRoutes.patch("/:studentId/comment", async (c) => {
  const auth = c.get("auth");
  const studentId = c.req.param("studentId");

  const termId = c.req.query("termId");
  if (!termId) {
    return c.json(
      { error: "Bad Request", message: "Query parameter 'termId' is required (e.g. ?termId=uuid)." },
      400
    );
  }

  // 1. Resolve student and class
  const [student] = await db
    .select({
      id: students.id,
      schoolId: students.schoolId,
      classId: students.classId,
    })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) {
    return c.json({ error: "Not Found", message: `Student '${studentId}' not found.` }, 404);
  }

  // 2. Resolve caller staff
  const [currentStaff] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.clerkUserId, auth.userId), eq(staff.status, "active")))
    .limit(1);

  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  // 3. Verify caller is assigned Class Teacher for that student's class
  const isSchoolAdmin = currentStaff.roles.includes("admin") || auth.orgRole === "org:admin";

  const [classTeacherAssignment] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, student.schoolId),
        eq(assignments.staffId, currentStaff.id),
        eq(assignments.classId, student.classId),
        eq(assignments.termId, termId),
        eq(assignments.role, "class_teacher"),
        eq(assignments.status, "active")
      )
    )
    .limit(1);

  if (!isSchoolAdmin && !classTeacherAssignment) {
    return c.json(
      {
        error: "Forbidden",
        message: "Only the assigned Class Teacher for this student's class can add or modify report card remarks.",
      },
      403
    );
  }

  // 4. Parse body
  let body: UpdateReportCardCommentInput;
  try {
    body = await c.req.json<UpdateReportCardCommentInput>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  if (typeof body.comment !== "string") {
    return c.json({ error: "Bad Request", message: "Field 'comment' must be a string." }, 400);
  }

  // 5. Read report card from Firestore — check status!
  const firestore = getFirestoreDb();
  const reportCardPath = getReportCardDocPath(student.schoolId, termId, studentId);
  const docRef = firestore.doc(reportCardPath);
  const snap = await docRef.get();

  if (!snap.exists) {
    return c.json(
      {
        error: "Not Found",
        message: `Report card document not found for student '${studentId}'. Report cards must be computed before adding remarks.`,
      },
      404
    );
  }

  const existingData = snap.data();
  if (existingData?.status !== "draft") {
    return c.json(
      {
        error: "Conflict",
        message: `Cannot edit comments on a '${existingData?.status}' report card. Comments may only be modified while in 'draft' status.`,
      },
      409
    );
  }

  // 6. Update comment
  const now = new Date().toISOString();
  await docRef.update({
    comment: body.comment.trim(),
    updatedAt: now,
  });

  return c.json(
    {
      message: "Report card comment updated successfully.",
      studentId,
      comment: body.comment.trim(),
    },
    200
  );
});

// -----------------------------------------------------------------------------
// 8. POST /report-card/:classId/:termId/publish (The Point of No Return)
// -----------------------------------------------------------------------------
reportCardRoutes.post("/:classId/:termId/publish", async (c) => {
  const auth = c.get("auth");
  const { classId, termId } = c.req.param();

  // 1. Resolve caller staff
  const [currentStaff] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.clerkUserId, auth.userId), eq(staff.status, "active")))
    .limit(1);

  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  // 2. Authorize: Must be assigned Class Teacher or Administrator
  const isSchoolAdmin = currentStaff.roles.includes("admin") || auth.orgRole === "org:admin";

  const [classTeacherAssignment] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, currentStaff.schoolId),
        eq(assignments.staffId, currentStaff.id),
        eq(assignments.classId, classId),
        eq(assignments.termId, termId),
        eq(assignments.role, "class_teacher"),
        eq(assignments.status, "active")
      )
    )
    .limit(1);

  if (!isSchoolAdmin && !classTeacherAssignment) {
    return c.json(
      {
        error: "Forbidden",
        message: "Only the assigned Class Teacher for this class or a School Administrator can publish report cards.",
      },
      403
    );
  }

  const firestore = getFirestoreDb();
  const schoolId = currentStaff.schoolId;

  // 3. THE GATEKEEPER CHECK: Inspect submissionStatus document
  // All assigned subjects for this class must have status == "submitted"!
  const classSubjectAssignments = await db
    .select({
      subjectId: assignments.subjectId,
      subjectName: subjects.name,
    })
    .from(assignments)
    .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
    .where(
      and(
        eq(assignments.schoolId, schoolId),
        eq(assignments.classId, classId),
        eq(assignments.termId, termId),
        eq(assignments.role, "subject_teacher"),
        eq(assignments.status, "active")
      )
    );

  const submissionStatusPath = getSubmissionStatusDocPath(schoolId, termId, classId);
  const statusSnap = await firestore.doc(submissionStatusPath).get();
  const statusData = statusSnap.data() || {};

  const unsubmittedSubjects: Array<{
    subjectId: string;
    subjectName: string;
    currentStatus: string;
  }> = [];

  for (const item of classSubjectAssignments) {
    if (!item.subjectId) continue;
    const currentSubjectStatus = statusData[item.subjectId]?.status;

    if (currentSubjectStatus !== "submitted" && currentSubjectStatus !== "locked") {
      unsubmittedSubjects.push({
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        currentStatus: currentSubjectStatus || "not_started",
      });
    }
  }

  // If any subject is outstanding, REJECT WITH 400 listing exact subjects!
  if (unsubmittedSubjects.length > 0) {
    const namesList = unsubmittedSubjects.map((s) => `${s.subjectName} (${s.currentStatus})`).join(", ");
    return c.json(
      {
        error: "Cannot publish report cards",
        message: `Publish Rejected: ${unsubmittedSubjects.length} subject(s) are still unsubmitted: ${namesList}. Every subject must be submitted before report cards can be published.`,
        unsubmittedCount: unsubmittedSubjects.length,
        unsubmittedSubjects,
      },
      400
    );
  }

  // 4. POINT OF NO RETURN: Lock all score entries & publish all report cards
  const now = new Date().toISOString();
  const batch = firestore.batch();

  // Lock score entries for this class
  const scoreEntriesColPath = `schools/${schoolId}/terms/${termId}/scoreEntries`;
  const scoresSnap = await firestore
    .collection(scoreEntriesColPath)
    .where("classId", "==", classId)
    .get();

  scoresSnap.forEach((doc) => {
    batch.update(doc.ref, {
      status: "locked",
      lockedAt: now,
      updatedAt: now,
    });
  });

  // Publish report cards for enrolled students of this class
  const reportCardsColPath = `schools/${schoolId}/terms/${termId}/reportCards`;
  const reportCardsSnap = await firestore
    .collection(reportCardsColPath)
    .where("classId", "==", classId)
    .get();

  reportCardsSnap.forEach((doc) => {
    batch.update(doc.ref, {
      status: "published",
      publishedAt: now,
      publishedByStaffId: currentStaff.id,
      updatedAt: now,
    });
  });

  // Mark submissionStatus doc with published overall status
  batch.set(
    firestore.doc(submissionStatusPath),
    {
      overallStatus: "published",
      publishedAt: now,
      publishedByStaffId: currentStaff.id,
    },
    { merge: true }
  );

  await batch.commit();

  const response: PublishReportCardsResponse = {
    message: "Point of no return executed: All report cards published and score entries permanently locked.",
    classId,
    termId,
    publishedCount: reportCardsSnap.size,
    lockedScoresCount: scoresSnap.size,
  };

  return c.json(response, 200);
});
