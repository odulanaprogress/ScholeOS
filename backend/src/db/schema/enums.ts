import { pgEnum } from "drizzle-orm/pg-core";

// Licensing Plan & Status Enums
export const licensePlanEnum = pgEnum("license_plan", [
  "trial",
  "basic",
  "premium",
  "unlimited",
]);

export const licenseStatusEnum = pgEnum("license_status", [
  "trial",
  "active",
  "grace_period",
  "suspended",
]);

// Staff Employment Status Enum
export const staffStatusEnum = pgEnum("staff_status", [
  "active",
  "suspended",
  "deactivated",
]);

// Assignment Roles & Status
export const assignmentRoleEnum = pgEnum("assignment_role", [
  "subject_teacher",
  "class_teacher",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "active",
  "ended",
]);

// Invoices & Billing
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "unpaid",
  "partially_paid",
  "paid",
  "pending_verification",
]);

// Payment Channels
export const paymentChannelEnum = pgEnum("payment_channel", [
  "paystack",
  "flutterwave",
  "bank_transfer_proof",
  "manual",
]);

// Payment Verification Status
export const paymentVerificationStatusEnum = pgEnum("payment_verification_status", [
  "n_a",
  "pending",
  "approved",
  "rejected",
]);

// Announcements
export const announcementStatusEnum = pgEnum("announcement_status", [
  "draft",
  "scheduled",
  "sent",
]);

// Reopen Requests Status (Wave 4)
export const reopenRequestStatusEnum = pgEnum("reopen_request_status", [
  "pending",
  "approved",
  "rejected",
]);

// AI Usage Endpoint Enum (Wave 9)
export const aiUsageEndpointEnum = pgEnum("ai_usage_endpoint", [
  "admin_chat",
  "report_card_comment",
  "student_tutor",
]);

// CBT Test & Submission Status Enums (Wave 10)
export const cbtTestStatusEnum = pgEnum("cbt_test_status", [
  "draft",
  "scheduled",
  "live",
  "completed",
]);

export const cbtSubmissionStatusEnum = pgEnum("cbt_submission_status", [
  "not_started",
  "in_progress",
  "completed",
  "auto_submitted",
]);

