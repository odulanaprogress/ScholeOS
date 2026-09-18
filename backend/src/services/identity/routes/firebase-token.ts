/**
 * Firebase Custom Token Bridge Route (Wave 3)
 *
 * Endpoint: POST /firebase-token
 * Authenticated endpoint that resolves the user's Postgres school association
 * and mints a Firebase custom token with { schoolId, role } claims for Firestore read security rules.
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { staff, guardians, students } from "../../../db/schema/users";
import { schools } from "../../../db/schema/schools";
import { getFirebaseAuth } from "../../../firestore/admin";
import { eq, and, ne } from "drizzle-orm";
import type { FirebaseTokenResponse } from "../types";

export const firebaseTokenRoutes = new Hono();

firebaseTokenRoutes.post("/", async (c) => {
  const auth = c.get("auth");

  if (!auth || !auth.userId) {
    return c.json({ error: "Unauthorized", message: "Missing authenticated user context" }, 401);
  }

  try {
    let resolvedSchoolId: string | null = null;
    let resolvedRole: string = "user";

    // 1. Check staff table (excluding deactivated accounts)
    const [staffUser] = await db
      .select({
        schoolId: staff.schoolId,
        roles: staff.roles,
        status: staff.status,
      })
      .from(staff)
      .where(
        and(
          eq(staff.clerkUserId, auth.userId),
          ne(staff.status, "deactivated")
        )
      )
      .limit(1);

    if (staffUser) {
      resolvedSchoolId = staffUser.schoolId;
      resolvedRole = staffUser.roles[0] || "staff";
    }

    // 2. Check guardians table
    if (!resolvedSchoolId) {
      const [guardianUser] = await db
        .select({ schoolId: guardians.schoolId })
        .from(guardians)
        .where(eq(guardians.clerkUserId, auth.userId))
        .limit(1);

      if (guardianUser) {
        resolvedSchoolId = guardianUser.schoolId;
        resolvedRole = "guardian";
      }
    }

    // 3. Check students table
    if (!resolvedSchoolId) {
      const [studentUser] = await db
        .select({ schoolId: students.schoolId })
        .from(students)
        .where(eq(students.clerkUserId, auth.userId))
        .limit(1);

      if (studentUser) {
        resolvedSchoolId = studentUser.schoolId;
        resolvedRole = "student";
      }
    }

    // 4. Fallback: match by Organization ID in schools table or first school for demo
    if (!resolvedSchoolId && auth.orgId) {
      const [school] = await db
        .select({ id: schools.id })
        .from(schools)
        .where(eq(schools.clerkOrgId, auth.orgId))
        .limit(1);

      if (school) {
        resolvedSchoolId = school.id;
        resolvedRole = auth.orgRole === "org:admin" ? "admin" : "staff";
      }
    }

    // 5. Fallback for development/testing
    if (!resolvedSchoolId) {
      const [demoSchool] = await db.select({ id: schools.id }).from(schools).limit(1);
      if (demoSchool) {
        resolvedSchoolId = demoSchool.id;
        resolvedRole = auth.orgRole?.includes("admin") ? "admin" : "staff";
      }
    }

    if (!resolvedSchoolId) {
      return c.json(
        {
          error: "Not Found",
          message: "No active school association found in PostgreSQL for this user account.",
        },
        404
      );
    }

    // 6. Mint Firebase Custom Token with minimal claims: { schoolId, role }
    // CRITICAL: Keep claims minimal to respect token size limits.
    const firebaseAuth = getFirebaseAuth();
    const customToken = await firebaseAuth.createCustomToken(auth.userId, {
      schoolId: resolvedSchoolId,
      role: resolvedRole,
    });

    const response: FirebaseTokenResponse = {
      firebaseToken: customToken,
      schoolId: resolvedSchoolId,
      role: resolvedRole,
      userId: auth.userId,
    };

    return c.json(response, 200);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error minting Firebase token";
    console.error("[Firebase Token Bridge] Error:", errorMsg);
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
