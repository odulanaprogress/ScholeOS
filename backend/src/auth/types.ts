/**
 * Core User Types in ScholeOS
 */
export type UserType = "staff" | "guardian" | "student" | "platform_admin";

/**
 * Granular Operational Roles for School Staff
 * Note: A staff member can possess multiple roles simultaneously
 * (e.g. both "class_teacher" for JSS1A and "subject_teacher" for JSS1 & JSS2 Math).
 */
export type StaffRole = "admin" | "class_teacher" | "subject_teacher";

/**
 * Base Organization Role in Clerk (RBAC container)
 */
export type ClerkOrgRole = "org:admin" | "org:member";

/**
 * Clerk User Public Metadata Schema
 * Stored directly in Clerk JWT claims for zero-latency authorization checks.
 */
export interface ClerkUserPublicMetadata {
  userType: UserType;
  schoolId: string;
  roles?: StaffRole[];
  guardianId?: string;
  studentId?: string;
  [key: string]: unknown;
}

/**
 * Clerk Organization Public Metadata Schema
 * Stored on the Clerk Organization instance representing the school.
 */
export interface ClerkOrgPublicMetadata {
  schoolId: string;
  shortName: string;
  subdomain?: string;
  licensePlan: "basic" | "premium" | "unlimited";
  licenseStatus: "trial" | "active" | "grace_period" | "suspended";
  [key: string]: unknown;
}

/**
 * Decoded Session Auth Context attached to incoming backend requests
 */
export interface AuthContext {
  userId: string;
  userType: UserType;
  schoolId: string;
  roles: StaffRole[];
  orgId?: string;
  guardianId?: string;
  studentId?: string;
}
