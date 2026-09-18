/**
 * Broadsheet Matrix Route (Wave 4)
 *
 * Endpoint:
 * GET /broadsheet/:classId/:termId (Class Teacher / Admin only)
 * Assembles the comprehensive class-wide academic ledger:
 * Every student, every subject's continuous assessment total, overall sum, percentage average, and position rank.
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff, students } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { classes, subjects, sessionsTerms } from "../../../db/schema/academics";
import { getFirestoreDb } from "../../../firestore/admin";
import { computeStandardCompetitionRanks, formatOrdinalPosition } from "../ranking";
import { eq, and } from "drizzle-orm";
import type { BroadsheetResponse, BroadsheetStudentRow } from "../types";

export const broadsheetRoutes = new Hono();

broadsheetRoutes.get("/:classId/:termId", async (c) => {
  const auth = c.get("auth");
  const { classId, termId } = c.req.param();

  // 1. Resolve staff profile
  const [currentStaff] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.clerkUserId, auth.userId), eq(staff.status, "active")))
    .limit(1);

  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  // 2. Authorize: Class Teacher for that class or School Administrator
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
        message: "Only the designated Class Teacher or a School Administrator may access the class broadsheet.",
      },
      403
    );
  }

  const schoolId = currentStaff.schoolId;

  // 3. Query Class, Term, and Subject metadata
  const [classRecord] = await db
    .select({ id: classes.id, name: classes.name })
    .from(classes)
    .where(eq(classes.id, classId))
    .limit(1);

  const [termRecord] = await db
    .select({ id: sessionsTerms.id, name: sessionsTerms.name })
    .from(sessionsTerms)
    .where(eq(sessionsTerms.id, termId))
    .limit(1);

  if (!classRecord || !termRecord) {
    return c.json({ error: "Not Found", message: "Class or Academic Term not found." }, 404);
  }

  // Fetch all curriculum subjects assigned for this class
  const classSubjects = await db
    .select({
      id: subjects.id,
      name: subjects.name,
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

  // De-duplicate subjects
  const uniqueSubjectsMap = new Map<string, { id: string; name: string }>();
  for (const s of classSubjects) {
    uniqueSubjectsMap.set(s.id, s);
  }
  const subjectList = Array.from(uniqueSubjectsMap.values());

  // 4. Query all enrolled students in this class
  const enrolledStudents = await db
    .select({
      id: students.id,
      fullName: students.fullName,
      admissionNumber: students.admissionNumber,
    })
    .from(students)
    .where(and(eq(students.schoolId, schoolId), eq(students.classId, classId)));

  // 5. Query Firestore for real-time scores and computed report cards
  const firestore = getFirestoreDb();

  // A. Fetch all score entries for this class and term
  const scoresColPath = `schools/${schoolId}/terms/${termId}/scoreEntries`;
  const scoresSnap = await firestore
    .collection(scoresColPath)
    .where("classId", "==", classId)
    .get();

  const studentScoresMap = new Map<string, Record<string, number>>();
  scoresSnap.forEach((doc) => {
    const data = doc.data();
    if (data?.studentId && data?.subjectId && typeof data.total === "number") {
      if (!studentScoresMap.has(data.studentId)) {
        studentScoresMap.set(data.studentId, {});
      }
      studentScoresMap.get(data.studentId)![data.subjectId] = data.total;
    }
  });

  // B. Fetch existing report card documents for comments & positions
  const reportCardsColPath = `schools/${schoolId}/terms/${termId}/reportCards`;
  const reportCardsSnap = await firestore
    .collection(reportCardsColPath)
    .where("classId", "==", classId)
    .get();

  const studentReportCardMap = new Map<string, any>();
  reportCardsSnap.forEach((doc) => {
    const data = doc.data();
    if (data?.studentId) {
      studentReportCardMap.set(data.studentId, data);
    }
  });

  // 6. Build Student Matrix Rows & Calculate Ranks
  const rawStudentRows = enrolledStudents.map((stud) => {
    const subjectTotals = studentScoresMap.get(stud.id) || {};
    const reportCard = studentReportCardMap.get(stud.id);

    const scoresArray = Object.values(subjectTotals);
    const overallTotal =
      reportCard?.overallTotal ?? scoresArray.reduce((acc, score) => acc + score, 0);

    const average =
      reportCard?.average ??
      (subjectList.length > 0
        ? Math.round((overallTotal / subjectList.length) * 100) / 100
        : 0);

    return {
      studentId: stud.id,
      studentName: stud.fullName,
      admissionNumber: stud.admissionNumber,
      subjectTotals,
      overallTotal,
      total: overallTotal, // For ranking helper
      average,
      comment: reportCard?.comment || "",
      savedPosition: reportCard?.position,
    };
  });

  // Standard Competition Ranking
  const rankedStudents = computeStandardCompetitionRanks(rawStudentRows);

  const finalStudentRows: BroadsheetStudentRow[] = rankedStudents.map((item) => ({
    studentId: item.studentId,
    studentName: item.studentName,
    admissionNumber: item.admissionNumber,
    subjectTotals: item.subjectTotals,
    overallTotal: item.overallTotal,
    average: item.average,
    position: item.savedPosition
      ? (typeof item.savedPosition === "number" ? formatOrdinalPosition(item.savedPosition) : item.savedPosition)
      : formatOrdinalPosition(item.position),
    comment: item.comment,
  }));

  const response: BroadsheetResponse = {
    class: classRecord,
    term: termRecord,
    subjects: subjectList,
    students: finalStudentRows,
  };

  return c.json(response, 200);
});
