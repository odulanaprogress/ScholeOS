import { StaffRole, AuthContext } from "./types";

export const STAFF_ROLES: readonly StaffRole[] = [
  "admin",
  "class_teacher",
  "subject_teacher",
] as const;

/**
 * Check whether a user's multi-role array contains at least one of the required roles.
 */
export function hasAnyRole(
  userRoles: StaffRole[] | undefined,
  requiredRoles: StaffRole[]
): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Check whether a user's multi-role array contains all of the specified roles.
 */
export function hasAllRoles(
  userRoles: StaffRole[] | undefined,
  requiredRoles: StaffRole[]
): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  return requiredRoles.every((role) => userRoles.includes(role));
}

/**
 * Assert that the request context has school-admin level privileges.
 */
export function isSchoolAdmin(auth: AuthContext): boolean {
  return auth.userType === "staff" && auth.roles.includes("admin");
}

/**
 * Assert that the request context has class teacher privileges.
 */
export function isClassTeacher(auth: AuthContext): boolean {
  return auth.userType === "staff" && auth.roles.includes("class_teacher");
}

/**
 * Assert that the request context has subject teacher privileges.
 */
export function isSubjectTeacher(auth: AuthContext): boolean {
  return auth.userType === "staff" && auth.roles.includes("subject_teacher");
}
