/**
 * Attendance Management Routes (Wave 4)
 *
 * Endpoint:
 * POST /attendance/:classId/:date (Class Teacher only)
 * Records daily attendance register for a class arm.
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { getFirestoreDb } from "../../../firestore/admin";
import { getClassDailyAttendanceDocPath } from "../../../firestore/paths";
import { eq, and } from "drizzle-orm";
import type { BatchAttendanceInput } from "../types";

export const attendanceRoutes = new Hono();

attendanceRoutes.post("/:classId/:date", async (c) => {
  const auth = c.get("auth");
  const { classId, date } = c.req.param();

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return c.json(
      {
        error: "Bad Request",
        message: `Invalid date format '${date}'. Expected 'YYYY-MM-DD'.`,
      },
      400
    );
  }

  // 1. Resolve staff profile
  const [currentStaff] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.clerkUserId, auth.userId), eq(staff.status, "active")))
    .limit(1);

  if (!currentStaff) {
    return c.json({ error: "Forbidden", message: "Caller is not an active staff member." }, 403);
  }

  // 2. Verify active class_teacher assignment for this exact class
  const [classTeacherAssignment] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(
      and(
        eq(assignments.schoolId, currentStaff.schoolId),
        eq(assignments.staffId, currentStaff.id),
        eq(assignments.classId, classId),
        eq(assignments.role, "class_teacher"),
        eq(assignments.status, "active")
      )
    )
    .limit(1);

  if (!classTeacherAssignment) {
    return c.json(
      {
        error: "Forbidden",
        message: `Unauthorized: Only the assigned Class Teacher for class '${classId}' can record daily attendance.`,
      },
      403
    );
  }

  // 3. Parse body
  let body: BatchAttendanceInput;
  try {
    body = await c.req.json<BatchAttendanceInput>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  const { records } = body;
  if (!Array.isArray(records) || records.length === 0) {
    return c.json(
      { error: "Bad Request", message: "Body must contain a non-empty 'records' array." },
      400
    );
  }

  // 4. Construct attendance map
  const attendanceMap: Record<string, string> = {};
  for (const record of records) {
    if (!record.studentId || !["present", "absent", "late"].includes(record.status)) {
      return c.json(
        {
          error: "Validation Error",
          message: `Invalid attendance record for student '${record.studentId}'. Status must be 'present', 'absent', or 'late'.`,
        },
        400
      );
    }
    attendanceMap[record.studentId] = record.status;
  }

  // 5. Upsert document in Firestore under /schools/{schoolId}/classes/{classId}/attendance/{date}
  const firestore = getFirestoreDb();
  const docPath = getClassDailyAttendanceDocPath(currentStaff.schoolId, classId, date);
  const now = new Date().toISOString();

  await firestore.doc(docPath).set(
    {
      classId,
      date,
      markedByStaffId: currentStaff.id,
      attendance: attendanceMap,
      updatedAt: now,
    },
    { merge: true }
  );

  return c.json(
    {
      message: "Attendance recorded successfully.",
      classId,
      date,
      markedCount: records.length,
      markedByStaffId: currentStaff.id,
    },
    200
  );
});
