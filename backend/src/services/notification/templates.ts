/**
 * Notification Templates (Wave 6)
 *
 * Defines message templates with placeholder substitution for attendance,
 * billing, submissions, and announcement broadcasts.
 */

import type { NotificationTemplateKey } from "./types";

export const TEMPLATE_DEFINITIONS: Record<
  NotificationTemplateKey,
  string | ((data: Record<string, any>) => string)
> = {
  absence_alert: "Your child [studentName] was marked absent today ([date]) at [schoolName].",
  payment_confirmation: "Payment of [amount] received for [studentName]'s [feeType]. Thank you.",
  payment_rejected:
    "Your payment proof for [studentName] could not be verified: [reason]. Please contact the school office.",
  arrears_reminder:
    "This is a reminder that [amount] is outstanding for [studentName]'s [feeType], due [dueDate].",
  submission_reminder:
    "Reminder: scores for [subjectName] — [className] are still pending submission.",
  announcement: (data: Record<string, any>) => data.message || data.text || "",
};

/**
 * Renders a template with provided data keys.
 * Handles string placeholders in the format `[key]`.
 */
export function renderNotificationTemplate(
  key: NotificationTemplateKey,
  data: Record<string, any>
): string {
  const template = TEMPLATE_DEFINITIONS[key];

  if (!template) {
    return data.message || "";
  }

  if (typeof template === "function") {
    return template(data);
  }

  return template.replace(/\[(\w+)\]/g, (_, placeholder) => {
    const value = data[placeholder];
    return value !== undefined ? String(value) : `[${placeholder}]`;
  });
}
