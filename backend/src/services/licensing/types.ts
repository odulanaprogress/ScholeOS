/**
 * Licensing Service Types (Wave 8)
 *
 * Defines SaaS subscription plans, lifecycle statuses, DTOs, and
 * response models for multi-tenant school licensing.
 */

export type LicensePlan = "trial" | "basic" | "premium" | "unlimited";

export type LicenseStatus = "trial" | "active" | "grace_period" | "suspended";

export interface SchoolLicenseDTO {
  id: string;
  schoolId: string;
  schoolName?: string;
  plan: LicensePlan;
  status: LicenseStatus;
  trialEndsAt: string | null;
  gracePeriodEndsAt: string | null;
  renewalDate: string | null;
  studentCountLimit: number | null;
  daysRemaining: number;
  isTrial: boolean;
  isGracePeriod: boolean;
  isSuspended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLicenseDTO {
  schoolId: string;
  plan?: LicensePlan;
  trialDays?: number; // defaults to 30 days
  studentCountLimit?: number;
}

export interface UpdateLicenseDTO {
  plan?: LicensePlan;
  status?: LicenseStatus;
  trialEndsAt?: string;
  gracePeriodEndsAt?: string | null;
  renewalDate?: string;
  studentCountLimit?: number;
}

export interface LicenseCheckResult {
  allowed: boolean;
  status: LicenseStatus;
  statusCode?: number;
  reason?: string;
  license?: SchoolLicenseDTO;
}

export interface CronTransitionResult {
  timestamp: string;
  trialToGraceCount: number;
  graceToSuspendedCount: number;
  remindersSentCount: number;
  details: Array<{
    schoolId: string;
    schoolName?: string;
    transition: "trial_to_grace" | "grace_to_suspended" | "reminder_3_day";
    message: string;
  }>;
}
