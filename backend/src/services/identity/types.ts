/**
 * Identity Service Types & Contracts (Wave 3)
 */

import type { StaffRole, UserType } from "../../auth/types";

/**
 * Decoded Identity Session attached to Hono Context
 */
export interface IdentityAuthContext {
  userId: string;
  email?: string;
  orgId?: string;
  orgRole?: string;
  userType?: UserType;
  schoolId?: string;
  roles?: StaffRole[];
}

/**
 * Single Assignment payload for Staff Provisioning
 */
export interface StaffAssignmentInput {
  subject_id?: string;
  class_id: string;
  term_id: string;
  role?: "subject_teacher" | "class_teacher";
}

/**
 * POST /staff Request Body
 */
export interface ProvisionStaffRequest {
  fullName: string;
  email: string;
  role: StaffRole;
  assignments: StaffAssignmentInput[];
}

/**
 * PATCH /staff/:id/status Request Body
 */
export interface UpdateStaffStatusRequest {
  status: "active" | "suspended" | "deactivated";
}

/**
 * POST /firebase-token Response
 */
export interface FirebaseTokenResponse {
  firebaseToken: string;
  schoolId: string;
  role: string;
  userId: string;
}

/**
 * GET /assignments/me Response
 */
export interface MyAssignmentsResponse {
  staff: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    schoolId: string;
  };
  assignments: Array<{
    id: string;
    classId: string;
    className: string;
    subjectId: string | null;
    subjectName: string | null;
    termId: string;
    termName: string;
    role: string;
    status: string;
    needsReassignment: boolean;
  }>;
}
