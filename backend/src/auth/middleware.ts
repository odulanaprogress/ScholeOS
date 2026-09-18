import { db } from "../db/index";
import { assignments } from "../db/schema/assignments";
import { and, eq } from "drizzle-orm";
import { AuthContext } from "./types";

/**
 * Enforce strict school tenant scoping
 */
export function assertSchoolScope(
  requestedSchoolId: string,
  auth: AuthContext
): void {
  if (auth.schoolId !== requestedSchoolId) {
    throw new Error(
      `Forbidden: Access denied to school ${requestedSchoolId} from tenant ${auth.schoolId}`
    );
  }
}

/**
 * Verify Server-Side Academic Assignment
 * The permission backbone: Checks if staff is explicitly assigned to write scores
 * or attendance for the target class, subject, and term.
 */
export async function assertStaffAssignment(params: {
  schoolId: string;
  staffId: string;
  classId: string;
  termId: string;
  role: "subject_teacher" | "class_teacher";
  subjectId?: string;
}): Promise<boolean> {
  const conditions = [
    eq(assignments.schoolId, params.schoolId),
    eq(assignments.staffId, params.staffId),
    eq(assignments.classId, params.classId),
    eq(assignments.termId, params.termId),
    eq(assignments.role, params.role),
    eq(assignments.status, "active"),
  ];

  if (params.role === "subject_teacher") {
    if (!params.subjectId) {
      throw new Error(
        "Subject teacher permission check requires a valid subjectId"
      );
    }
    conditions.push(eq(assignments.subjectId, params.subjectId));
  }

  const validAssignment = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(and(...conditions))
    .limit(1);

  if (validAssignment.length === 0) {
    throw new Error(
      `Unauthorized: Staff ${params.staffId} does not possess an active ${params.role} assignment for class ${params.classId}${
        params.subjectId ? ` and subject ${params.subjectId}` : ""
      }`
    );
  }

  return true;
}
