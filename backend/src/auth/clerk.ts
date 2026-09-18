import { createClerkClient } from "@clerk/backend";
import { env } from "../config/env";
import {
  ClerkUserPublicMetadata,
  ClerkOrgPublicMetadata,
  StaffRole,
} from "./types";

/**
 * Initialized Clerk Backend Client
 */
export const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

/**
 * Provision a new Clerk Organization representing a school
 */
export async function createSchoolOrganization(params: {
  schoolId: string;
  name: string;
  shortName: string;
  subdomain?: string;
  creatorClerkUserId: string;
}) {
  const metadata: ClerkOrgPublicMetadata = {
    schoolId: params.schoolId,
    shortName: params.shortName,
    subdomain: params.subdomain,
    licensePlan: "basic",
    licenseStatus: "trial",
  };

  const org = await clerk.organizations.createOrganization({
    name: params.name,
    createdBy: params.creatorClerkUserId,
    publicMetadata: metadata,
  });

  return org;
}

/**
 * Assign staff member to a School's Clerk Organization with multi-role metadata
 */
export async function assignStaffToOrganization(params: {
  organizationId: string;
  clerkUserId: string;
  roles: StaffRole[];
  schoolId: string;
}) {
  // 1. Create Organization Membership in Clerk
  const membership = await clerk.organizations.createOrganizationMembership({
    organizationId: params.organizationId,
    userId: params.clerkUserId,
    role: params.roles.includes("admin") ? "org:admin" : "org:member",
  });

  // 2. Update user's publicMetadata to hold their multi-roles and school association
  const metadata: ClerkUserPublicMetadata = {
    userType: "staff",
    schoolId: params.schoolId,
    roles: params.roles,
  };

  await clerk.users.updateUserMetadata(params.clerkUserId, {
    publicMetadata: metadata,
  });

  return membership;
}

/**
 * Provision a Guardian user in Clerk (NOT added to School Organization)
 */
export async function provisionGuardianUser(params: {
  clerkUserId: string;
  schoolId: string;
  guardianId: string;
}) {
  const metadata: ClerkUserPublicMetadata = {
    userType: "guardian",
    schoolId: params.schoolId,
    guardianId: params.guardianId,
  };

  return await clerk.users.updateUserMetadata(params.clerkUserId, {
    publicMetadata: metadata,
  });
}

/**
 * Provision a Student user in Clerk (NOT added to School Organization)
 */
export async function provisionStudentUser(params: {
  clerkUserId: string;
  schoolId: string;
  studentId: string;
}) {
  const metadata: ClerkUserPublicMetadata = {
    userType: "student",
    schoolId: params.schoolId,
    studentId: params.studentId,
  };

  return await clerk.users.updateUserMetadata(params.clerkUserId, {
    publicMetadata: metadata,
  });
}
