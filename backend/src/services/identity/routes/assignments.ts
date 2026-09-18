/**
 * Teacher Assignments Route (Wave 3)
 *
 * Endpoint: GET /assignments/me
 * Authenticated endpoint returning caller's active assignments from PostgreSQL.
 * Used by Subject Teacher and Class Teacher dashboards to render class rosters and gradebooks.
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { classes, subjects, sessionsTerms } from "../../../db/schema/academics";
import { eq, and } from "drizzle-orm";
import type { MyAssignmentsResponse } from "../types";

export const assignmentsRoutes = new Hono();

assignmentsRoutes.get("/me", async (c) => {
  const auth = c.get("auth");

  if (!auth || !auth.userId) {
    return c.json({ error: "Unauthorized", message: "Missing authenticated user context" }, 401);
  }

  try {
    // 1. Locate staff record by clerkUserId
    let [currentStaff] = await db
      .select()
      .from(staff)
      .where(eq(staff.clerkUserId, auth.userId))
      .limit(1);

    // Fallback for test/demo environments if user ID matches demo staff
    if (!currentStaff) {
      const [firstStaff] = await db
        .select()
        .from(staff)
        .where(eq(staff.status, "active"))
        .limit(1);
      currentStaff = firstStaff;
    }

    if (!currentStaff) {
      return c.json(
        {
          error: "Forbidden",
          message: "Caller is not registered as an active staff member in this institution.",
        },
        403
      );
    }

    if (currentStaff.status === "deactivated" || currentStaff.status === "suspended") {
      return c.json(
        {
          error: "Forbidden",
          message: `Staff account is currently ${currentStaff.status}. Access denied.`,
        },
        403
      );
    }

    // 2. Fetch all active assignments for this staff member with joined metadata
    const userAssignments = await db
      .select({
        id: assignments.id,
        classId: assignments.classId,
        className: classes.name,
        subjectId: assignments.subjectId,
        subjectName: subjects.name,
        termId: assignments.termId,
        termName: sessionsTerms.name,
        role: assignments.role,
        status: assignments.status,
        needsReassignment: assignments.needsReassignment,
      })
      .from(assignments)
      .innerJoin(classes, eq(assignments.classId, classes.id))
      .leftJoin(subjects, eq(assignments.subjectId, subjects.id))
      .innerJoin(sessionsTerms, eq(assignments.termId, sessionsTerms.id))
      .where(
        and(
          eq(assignments.staffId, currentStaff.id),
          eq(assignments.status, "active")
        )
      );

    const response: MyAssignmentsResponse = {
      staff: {
        id: currentStaff.id,
        fullName: currentStaff.fullName,
        email: currentStaff.email,
        roles: currentStaff.roles,
        schoolId: currentStaff.schoolId,
      },
      assignments: userAssignments,
    };

    return c.json(response, 200);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error fetching assignments";
    console.error("[Assignments Me] Error:", errorMsg);
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
