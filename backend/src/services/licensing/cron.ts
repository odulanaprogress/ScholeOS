/**
 * Licensing Lifecycle Automation & Cron Trigger (Wave 8)
 *
 * Runs daily via Cloudflare Cron Trigger to:
 * 1. Transition expired trials -> grace_period (7-day grace period).
 * 2. Transition expired grace periods -> suspended.
 * 3. Send 3-day renewal / expiration reminder alerts to school administrators.
 * 4. Dispatch status change notifications at every transition point.
 */

import { db } from "../../db/index";
import { schoolLicenses, schools } from "../../db/schema/schools";
import { staff } from "../../db/schema/users";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { invalidateLicenseCache, formatLicenseDTO } from "./cache";
import type { CronTransitionResult } from "./types";
import { enqueueNotification } from "../notification/queue";

/**
 * Dispatch license lifecycle notifications to the school administrator
 */
async function notifySchoolAdmin(
  schoolId: string,
  schoolName: string,
  templateKey: "announcement" | "arrears_reminder",
  message: string,
  env?: any
) {
  try {
    // Find the school's primary admin staff member
    const [adminStaff] = await db
      .select({ id: staff.id, phone: staff.phone })
      .from(staff)
      .where(and(eq(staff.schoolId, schoolId), eq(staff.status, "active")))
      .limit(1);

    const recipientId = adminStaff?.id || "admin_placeholder";

    await enqueueNotification(
      {
        schoolId,
        channel: "in_app",
        recipientType: "staff",
        recipientId,
        templateKey: "announcement",
        templateData: {
          title: "ScholeOS License Notice",
          message,
          schoolName,
        },
      },
      env
    );
  } catch (err) {
    console.warn(`[Licensing Cron] Failed to enqueue notification for school ${schoolId}:`, err);
  }
}

/**
 * Executes the daily license audit and lifecycle transitions
 */
export async function runDailyLicenseCheck(env?: any): Promise<CronTransitionResult> {
  const now = new Date();
  const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const result: CronTransitionResult = {
    timestamp: now.toISOString(),
    trialToGraceCount: 0,
    graceToSuspendedCount: 0,
    remindersSentCount: 0,
    details: [],
  };

  try {
    // Fetch all active, trial, and grace period licenses with school metadata
    const licenses = await db
      .select({
        id: schoolLicenses.id,
        schoolId: schoolLicenses.schoolId,
        plan: schoolLicenses.plan,
        status: schoolLicenses.status,
        trialEndsAt: schoolLicenses.trialEndsAt,
        gracePeriodEndsAt: schoolLicenses.gracePeriodEndsAt,
        renewalDate: schoolLicenses.renewalDate,
        studentCountLimit: schoolLicenses.studentCountLimit,
        schoolName: schools.name,
      })
      .from(schoolLicenses)
      .leftJoin(schools, eq(schoolLicenses.schoolId, schools.id));

    for (const lic of licenses) {
      const schoolName = lic.schoolName || "School";
      const trialEndsAt = lic.trialEndsAt ? new Date(lic.trialEndsAt) : null;
      const gracePeriodEndsAt = lic.gracePeriodEndsAt ? new Date(lic.gracePeriodEndsAt) : null;
      const renewalDate = lic.renewalDate ? new Date(lic.renewalDate) : null;

      // 1. TRANSITION: Expired Trial -> Grace Period
      if (lic.status === "trial" && trialEndsAt && trialEndsAt < now) {
        const graceEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days grace

        await db
          .update(schoolLicenses)
          .set({
            status: "grace_period",
            gracePeriodEndsAt: graceEnd,
            updatedAt: now,
          })
          .where(eq(schoolLicenses.id, lic.id));

        await invalidateLicenseCache(lic.schoolId, env);

        const alertMsg = `Your 30-day ScholeOS trial for ${schoolName} has ended. You have entered a 7-day grace period. Read access remains active, but score submissions and modifications are blocked until subscription renewal.`;
        await notifySchoolAdmin(lic.schoolId, schoolName, "announcement", alertMsg, env);

        result.trialToGraceCount++;
        result.details.push({
          schoolId: lic.schoolId,
          schoolName,
          transition: "trial_to_grace",
          message: "Moved from trial to grace_period (7 days grace)",
        });
        continue;
      }

      // 2. TRANSITION: Expired Grace Period -> Suspended
      if (lic.status === "grace_period" && gracePeriodEndsAt && gracePeriodEndsAt < now) {
        await db
          .update(schoolLicenses)
          .set({
            status: "suspended",
            updatedAt: now,
          })
          .where(eq(schoolLicenses.id, lic.id));

        await invalidateLicenseCache(lic.schoolId, env);

        const alertMsg = `Your ScholeOS grace period for ${schoolName} has expired. Access to your platform has been suspended. Please contact billing support or reactivate your subscription to restore full access.`;
        await notifySchoolAdmin(lic.schoolId, schoolName, "announcement", alertMsg, env);

        result.graceToSuspendedCount++;
        result.details.push({
          schoolId: lic.schoolId,
          schoolName,
          transition: "grace_to_suspended",
          message: "Grace period expired; license suspended",
        });
        continue;
      }

      // 3. REMINDER: 3-Day Countdown to Trial Expiration
      if (
        lic.status === "trial" &&
        trialEndsAt &&
        trialEndsAt > now &&
        trialEndsAt <= threeDaysAhead
      ) {
        const daysLeft = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const alertMsg = `Reminder: Your ScholeOS trial for ${schoolName} expires in ${daysLeft} day(s). Upgrade to a subscription plan now to ensure uninterrupted staff and student access.`;
        await notifySchoolAdmin(lic.schoolId, schoolName, "announcement", alertMsg, env);

        result.remindersSentCount++;
        result.details.push({
          schoolId: lic.schoolId,
          schoolName,
          transition: "reminder_3_day",
          message: `Sent 3-day trial expiry reminder (${daysLeft} days remaining)`,
        });
      }

      // 4. REMINDER: 3-Day Countdown to Active Renewal
      if (
        lic.status === "active" &&
        renewalDate &&
        renewalDate > now &&
        renewalDate <= threeDaysAhead
      ) {
        const daysLeft = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const alertMsg = `Reminder: Your annual/term ScholeOS subscription for ${schoolName} renews in ${daysLeft} day(s). Please verify your billing payment to avoid entering grace period.`;
        await notifySchoolAdmin(lic.schoolId, schoolName, "announcement", alertMsg, env);

        result.remindersSentCount++;
        result.details.push({
          schoolId: lic.schoolId,
          schoolName,
          transition: "reminder_3_day",
          message: `Sent 3-day subscription renewal reminder (${daysLeft} days remaining)`,
        });
      }
    }
  } catch (cronErr) {
    console.error("[Licensing Cron] Error executing daily license check:", cronErr);
  }

  return result;
}
