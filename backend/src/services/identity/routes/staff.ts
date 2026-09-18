/**
 * Staff Provisioning & Lifecycle Management Routes (Wave 3)
 *
 * Endpoints:
 * - POST /staff (Admin-only: invite via Clerk, create pending staff row, insert assignments)
 * - PATCH /staff/:id/status (Admin-only: update status, revoke Clerk membership on deactivation, flag assignments)
 */

import { Hono } from "hono";
import { requireAdminRole } from "../middleware";
import { db } from "../../../db/index";
import { staff } from "../../../db/schema/users";
import { schools } from "../../../db/schema/schools";
import { assignments } from "../../../db/schema/assignments";
import { clerk } from "../../../auth/clerk";
import { eq, and } from "drizzle-orm";
import type { ProvisionStaffRequest, UpdateStaffStatusRequest } from "../types";

export const staffRoutes = new Hono();

// Apply Admin Role Guard to all staff management routes
staffRoutes.use("*", requireAdminRole);

/**
 * POST /staff
 * Admin-only staff provisioning endpoint.
 */
staffRoutes.post("/", async (c) => {
  const auth = c.get("auth");

  let body: ProvisionStaffRequest;
  try {
    body = await c.req.json<ProvisionStaffRequest>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  const { fullName, email, role, assignments: assignmentList } = body;

  if (!fullName || !email || !role) {
    return c.json(
      {
        error: "Bad Request",
        message: "Missing required fields: fullName, email, role",
      },
      400
    );
  }

  try {
    // 1. Resolve schoolId for the caller
    let schoolId = auth.schoolId;
    let schoolRecord;

    if (!schoolId && auth.userId) {
      const [adminStaff] = await db
        .select({ schoolId: staff.schoolId })
        .from(staff)
        .where(eq(staff.clerkUserId, auth.userId))
        .limit(1);

      if (adminStaff) {
        schoolId = adminStaff.schoolId;
      }
    }

    if (!schoolId && auth.orgId) {
      const [school] = await db
        .select()
        .from(schools)
        .where(eq(schools.clerkOrgId, auth.orgId))
        .limit(1);

      if (school) {
        schoolId = school.id;
        schoolRecord = school;
      }
    }

    if (!schoolId) {
      // Fallback to first school in database for dev/testing
      const [firstSchool] = await db.select().from(schools).limit(1);
      if (firstSchool) {
        schoolId = firstSchool.id;
        schoolRecord = firstSchool;
      } else {
        return c.json({ error: "Not Found", message: "School not found for admin" }, 404);
      }
    }

    if (!schoolRecord) {
      const [foundSchool] = await db
        .select()
        .from(schools)
        .where(eq(schools.id, schoolId))
        .limit(1);
      schoolRecord = foundSchool;
    }

    // 2. Create Clerk Organization Invitation
    let invitationId: string | undefined;
    const clerkOrgId = schoolRecord?.clerkOrgId || auth.orgId;

    if (clerkOrgId && !clerkOrgId.startsWith("org_demo_")) {
      try {
        const invite = await clerk.organizations.createOrganizationInvitation({
          organizationId: clerkOrgId,
          emailAddress: email.trim().toLowerCase(),
          role: role === "admin" ? "org:admin" : "org:member",
        });
        invitationId = invite.id;
      } catch (err: unknown) {
        console.warn(
          "[Staff Provisioning] Warning creating Clerk invitation (continuing with DB record):",
          err instanceof Error ? err.message : err
        );
      }
    } else {
      // Simulated invite for demo/test environments
      invitationId = `inv_demo_${Date.now()}`;
    }

    // 3. Insert staff row into PostgreSQL (clerkUserId is null until invite is accepted)
    const [createdStaff] = await db
      .insert(staff)
      .values({
        schoolId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        clerkUserId: null,
        roles: [role],
        status: "active",
      })
      .returning();

    if (!createdStaff) {
      return c.json({ error: "Internal Server Error", message: "Failed to create staff record" }, 500);
    }

    // 4. Insert assignment rows into PostgreSQL
    const createdAssignments = [];
    if (Array.isArray(assignmentList) && assignmentList.length > 0) {
      for (const a of assignmentList) {
        if (!a.class_id || !a.term_id) continue;

        const assignmentRole =
          a.role || (a.subject_id ? "subject_teacher" : "class_teacher");

        const [insertedAssignment] = await db
          .insert(assignments)
          .values({
            schoolId,
            staffId: createdStaff.id,
            classId: a.class_id,
            subjectId: a.subject_id || null,
            termId: a.term_id,
            role: assignmentRole,
            status: "active",
            needsReassignment: false,
          })
          .returning();

        if (insertedAssignment) {
          createdAssignments.push(insertedAssignment);
        }
      }
    }

    return c.json(
      {
        message: "Staff member provisioned successfully",
        staff: createdStaff,
        assignments: createdAssignments,
        invitation: {
          id: invitationId,
          email: createdStaff.email,
          status: "pending_acceptance",
        },
      },
      201
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[Staff Provisioning] Error:", errorMsg);
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});

/**
 * PATCH /staff/:id/status
 * Admin-only staff status lifecycle management.
 */
staffRoutes.patch("/:id/status", async (c) => {
  const staffId = c.req.param("id");

  let body: UpdateStaffStatusRequest;
  try {
    body = await c.req.json<UpdateStaffStatusRequest>();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON body" }, 400);
  }

  const { status: targetStatus } = body;

  if (!["active", "suspended", "deactivated"].includes(targetStatus)) {
    return c.json(
      {
        error: "Bad Request",
        message: "Status must be 'active', 'suspended', or 'deactivated'",
      },
      400
    );
  }

  try {
    // 1. Fetch current staff record
    const [targetStaff] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    if (!targetStaff) {
      return c.json({ error: "Not Found", message: `Staff member with id ${staffId} not found` }, 404);
    }

    // 2. Fetch associated school for Clerk Org ID
    const [school] = await db
      .select({ clerkOrgId: schools.clerkOrgId })
      .from(schools)
      .where(eq(schools.id, targetStaff.schoolId))
      .limit(1);

    // 3. Handle Deactivation specifics
    let activeAssignmentsToFlag: any[] = [];
    if (targetStatus === "deactivated") {
      // Remove Clerk Organization membership if user has accepted invite
      if (targetStaff.clerkUserId && school?.clerkOrgId && !school.clerkOrgId.startsWith("org_demo_")) {
        try {
          await clerk.organizations.deleteOrganizationMembership({
            organizationId: school.clerkOrgId,
            userId: targetStaff.clerkUserId,
          });
          console.log(
            `[Staff Status] Revoked Clerk Org membership for ${targetStaff.clerkUserId}`
          );
        } catch (err: unknown) {
          console.warn(
            "[Staff Status] Warning revoking Clerk membership:",
            err instanceof Error ? err.message : err
          );
        }
      }

      // Check active assignments and flag them as needing reassignment
      activeAssignmentsToFlag = await db
        .select()
        .from(assignments)
        .where(
          and(
            eq(assignments.staffId, staffId),
            eq(assignments.status, "active")
          )
        );

      if (activeAssignmentsToFlag.length > 0) {
        await db
          .update(assignments)
          .set({ needsReassignment: true })
          .where(
            and(
              eq(assignments.staffId, staffId),
              eq(assignments.status, "active")
            )
          );
      }
    }

    // 4. Update staff status in PostgreSQL
    // CRITICAL: We explicitly do NOT delete the staff record or past scoreEntries!
    const [updatedStaff] = await db
      .update(staff)
      .set({ status: targetStatus })
      .where(eq(staff.id, staffId))
      .returning();

    return c.json({
      message: `Staff status successfully updated to ${targetStatus}`,
      staff: updatedStaff,
      needsReassignment: activeAssignmentsToFlag.length > 0,
      flaggedAssignmentsCount: activeAssignmentsToFlag.length,
      flaggedAssignments: activeAssignmentsToFlag,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[Staff Status] Error:", errorMsg);
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
