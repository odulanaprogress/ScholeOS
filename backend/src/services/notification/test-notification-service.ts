/**
 * Automated Verification Suite for Wave 6: notification-service
 *
 * Tests notifications table schema, health probe, all 6 message templates,
 * Termii provider abstraction & phone normalization, internal secret header guard on POST /notify,
 * asynchronous queue dispatching, delivery audit logging, and announcement broadcasting.
 */

import { app } from "./index";
import { notifications } from "../../db/schema/notifications";
import { announcements } from "../../db/schema/announcements";
import { renderNotificationTemplate } from "./templates";
import { TermiiProvider } from "./providers/termii";
import { processNotificationMessage } from "./queue";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
}

async function runNotificationServiceTests() {
  console.log("\n===============================================================");
  console.log("    🧪 RUNNING WAVE 6 NOTIFICATION-SERVICE VERIFICATION");
  console.log("===============================================================\n");

  let passCount = 0;
  const count = () => passCount++;

  // 1. Schema Verification
  console.log("1️⃣ Verifying Database Schema for Wave 6...");
  assert(notifications !== undefined, "notifications table exists in Drizzle schema");
  count();
  assert("schoolId" in notifications, "notifications has schoolId column");
  count();
  assert("channel" in notifications, "notifications has channel column");
  count();
  assert("recipientType" in notifications, "notifications has recipientType column");
  count();
  assert("recipientId" in notifications, "notifications has recipientId column");
  count();
  assert("templateKey" in notifications, "notifications has templateKey column");
  count();
  assert("status" in notifications, "notifications has status column");
  count();
  assert("providerRef" in notifications, "notifications has providerRef column");
  count();
  assert(announcements !== undefined, "announcements table exists in Drizzle schema");
  count();

  // 2. GET /health
  console.log("\n2️⃣ Verifying GET /health on Notification Worker...");
  const healthRes = await app.request("/health");
  assert(healthRes.status === 200, "GET /health returns HTTP 200 OK");
  count();
  const healthData = (await healthRes.json()) as any;
  assert(healthData.service === "notification-service", "Service name is 'notification-service'");
  count();
  assert(healthData.wave === 6, "Wave version is 6");
  count();
  assert(healthData.queue === "notifications-queue", "Target queue is 'notifications-queue'");
  count();
  assert(healthData.provider === "termii", "SMS provider is 'termii'");
  count();

  // 3. Template Rendering Tests for All 6 Required Templates
  console.log("\n3️⃣ Verifying All 6 Message Templates Rendering...");

  // absence_alert
  const absenceText = renderNotificationTemplate("absence_alert", {
    studentName: "Amina Adeleke",
    date: "18 Sep 2026",
    schoolName: "Apex International College",
  });
  assert(
    absenceText === "Your child Amina Adeleke was marked absent today (18 Sep 2026) at Apex International College.",
    "absence_alert template rendered correctly"
  );
  count();

  // payment_confirmation
  const payConfirmText = renderNotificationTemplate("payment_confirmation", {
    amount: "₦150,000",
    studentName: "Chinedu Okeke",
    feeType: "First Term Tuition Fee",
  });
  assert(
    payConfirmText === "Payment of ₦150,000 received for Chinedu Okeke's First Term Tuition Fee. Thank you.",
    "payment_confirmation template rendered correctly"
  );
  count();

  // payment_rejected
  const payRejectText = renderNotificationTemplate("payment_rejected", {
    studentName: "Emeka Obi",
    reason: "Transaction reference is illegible",
  });
  assert(
    payRejectText ===
      "Your payment proof for Emeka Obi could not be verified: Transaction reference is illegible. Please contact the school office.",
    "payment_rejected template rendered correctly"
  );
  count();

  // arrears_reminder
  const arrearsText = renderNotificationTemplate("arrears_reminder", {
    amount: "₦75,000",
    studentName: "Zainab Bello",
    feeType: "Science Lab Levy",
    dueDate: "30 Sep 2026",
  });
  assert(
    arrearsText ===
      "This is a reminder that ₦75,000 is outstanding for Zainab Bello's Science Lab Levy, due 30 Sep 2026.",
    "arrears_reminder template rendered correctly"
  );
  count();

  // submission_reminder
  const subReminderText = renderNotificationTemplate("submission_reminder", {
    subjectName: "Further Mathematics",
    className: "SS 3 Science",
  });
  assert(
    subReminderText === "Reminder: scores for Further Mathematics — SS 3 Science are still pending submission.",
    "submission_reminder template rendered correctly"
  );
  count();

  // announcement
  const announcementText = renderNotificationTemplate("announcement", {
    message: "School will close at 1:00 PM on Friday for mid-term staff development.",
  });
  assert(
    announcementText === "School will close at 1:00 PM on Friday for mid-term staff development.",
    "announcement template passes through message text directly"
  );
  count();

  // 4. Provider Abstraction & Phone Normalization Tests
  console.log("\n4️⃣ Verifying Termii Provider Abstraction & Phone Normalization...");
  const termii = new TermiiProvider();
  assert(termii.name === "termii", "Provider name is 'termii'");
  count();

  const sendSmsResult = await termii.send({
    to: "08031234567",
    message: "Test SMS message from ScholeOS",
    channel: "sms",
  });
  assert(sendSmsResult.success === true, "Termii provider send SMS succeeds");
  count();
  assert(sendSmsResult.providerRef !== undefined, "Provider reference ID returned");
  count();
  assert(sendSmsResult.costUnits === 1, "SMS cost units counted as 1");
  count();

  const sendWhatsAppResult = await termii.send({
    to: "+2348099887766",
    message: "Test WhatsApp message from ScholeOS",
    channel: "whatsapp",
  });
  assert(sendWhatsAppResult.success === true, "Termii provider send WhatsApp succeeds");
  count();
  assert(sendWhatsAppResult.costUnits === 2, "WhatsApp cost units counted as 2");
  count();

  // 5. Internal Security Guard on POST /notify
  console.log("\n5️⃣ Verifying Internal Secret Security Guard on POST /notify...");
  const unauthRes = await app.request("/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schoolId: "00000000-0000-0000-0000-000000000001",
      channel: "sms",
      recipientType: "parent",
      recipientId: "00000000-0000-0000-0000-000000000002",
      templateKey: "absence_alert",
      templateData: { studentName: "Amina", date: "Today", schoolName: "Apex" },
    }),
  });
  assert(unauthRes.status === 401, "POST /notify rejects call without x-internal-service-secret (HTTP 401)");
  count();

  // 6. Valid Enqueue Dispatch via POST /notify
  console.log("\n6️⃣ Verifying Notification Enqueueing via POST /notify...");
  const notifyRes = await app.request("/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-service-secret": "scholeos_internal_secret_key",
    },
    body: JSON.stringify({
      schoolId: "00000000-0000-0000-0000-000000000001",
      channel: "sms",
      recipientType: "parent",
      recipientId: "00000000-0000-0000-0000-000000000002",
      templateKey: "payment_confirmation",
      templateData: {
        amount: "₦150,000",
        studentName: "Chinedu Okeke",
        feeType: "Tuition",
      },
    }),
  });
  assert(notifyRes.status === 202, "POST /notify accepts valid payload and enqueues (HTTP 202 Accepted)");
  count();
  const notifyData = (await notifyRes.json()) as any;
  assert(notifyData.status === "queued", "Response status is 'queued'");
  count();
  assert(notifyData.messageId !== undefined, "Response contains messageId");
  count();

  // Direct Queue Consumer execution check
  const consumerResult = await processNotificationMessage({
    schoolId: "00000000-0000-0000-0000-000000000001",
    channel: "sms",
    recipientType: "parent",
    recipientId: "00000000-0000-0000-0000-000000000002",
    templateKey: "payment_confirmation",
    templateData: {
      amount: "₦150,000",
      studentName: "Chinedu Okeke",
      feeType: "Tuition",
    },
  });
  assert(consumerResult.status === "sent", "Queue consumer successfully dispatched message");
  count();
  assert(consumerResult.providerRef !== undefined, "Queue consumer logged providerRef");
  count();

  // In-app channel test
  const inAppResult = await processNotificationMessage({
    schoolId: "00000000-0000-0000-0000-000000000001",
    channel: "in_app",
    recipientType: "staff",
    recipientId: "00000000-0000-0000-0000-000000000003",
    templateKey: "submission_reminder",
    templateData: { subjectName: "Physics", className: "SS 2 Gold" },
  });
  assert(inAppResult.status === "sent", "In-app notification processed without external SMS provider");
  count();

  // 7. Announcement Multi-Channel Broadcast
  console.log("\n7️⃣ Verifying Announcement Multi-Channel Broadcasting...");
  const announceRes = await app.request("/announcements/ann-mock-01/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  assert(announceRes.status === 200, "POST /announcements/:id/send returns HTTP 200 OK");
  count();
  const announceData = (await announceRes.json()) as any;
  assert(announceData.status === "dispatched", "Announcement status is 'dispatched'");
  count();
  assert(announceData.newStatus === "sent", "Announcement status updated to 'sent'");
  count();
  assert(announceData.recipientCount > 0, "Recipients resolved from audience");
  count();
  assert(announceData.totalMessagesEnqueued > 0, "Messages enqueued across specified channels");
  count();

  console.log("\n===============================================================");
  console.log(`       🏁 TEST SUMMARY: ${passCount} PASSED, 0 FAILED`);
  console.log("===============================================================\n");
}

runNotificationServiceTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
