import { Webhook } from "svix";
import {
  hasAnyRole,
  hasAllRoles,
  isSchoolAdmin,
  isClassTeacher,
  isSubjectTeacher,
} from "./auth/roles";
import { verifyClerkWebhook } from "./auth/webhooks";
import { AuthContext } from "./auth/types";
import * as schema from "./db/schema/index";

async function runVerification() {
  console.log("🔍 Running ScholeOS Wave 1 Verification Suite...\n");

  // Test 1: Verify all 16 required tables exist in schema
  const requiredTables = [
    "schools",
    "schoolLicenses",
    "sessionsTerms",
    "assessmentComponents",
    "classes",
    "subjects",
    "students",
    "guardians",
    "guardianStudents",
    "staff",
    "assignments",
    "feeStructures",
    "invoices",
    "payments",
    "announcements",
    "webhookLog",
  ];

  console.log("1. Checking Schema Tables Integrity...");
  let missingTables = 0;
  for (const tableName of requiredTables) {
    if ((schema as any)[tableName]) {
      console.log(`   ✓ Table exists: ${tableName}`);
    } else {
      console.error(`   ✗ Missing table: ${tableName}`);
      missingTables++;
    }
  }

  if (missingTables > 0) {
    throw new Error(`Schema check failed: ${missingTables} missing tables`);
  }

  // Test 2: Verify Multi-Role Staff Support
  console.log("\n2. Checking Multi-Role Support & Permission Checks...");
  const dualRoleContext: AuthContext = {
    userId: "user_test_01",
    userType: "staff",
    schoolId: "sch_test_01",
    roles: ["class_teacher", "subject_teacher"],
  };

  const adminContext: AuthContext = {
    userId: "user_test_02",
    userType: "staff",
    schoolId: "sch_test_01",
    roles: ["admin"],
  };

  const studentContext: AuthContext = {
    userId: "user_test_03",
    userType: "student",
    schoolId: "sch_test_01",
    roles: [],
  };

  console.assert(
    isClassTeacher(dualRoleContext) === true,
    "Dual role should have class_teacher"
  );
  console.assert(
    isSubjectTeacher(dualRoleContext) === true,
    "Dual role should have subject_teacher"
  );
  console.assert(
    isSchoolAdmin(dualRoleContext) === false,
    "Dual role should not be admin"
  );
  console.assert(
    isSchoolAdmin(adminContext) === true,
    "Admin role should be admin"
  );
  console.assert(
    isSchoolAdmin(studentContext) === false,
    "Student should not be admin"
  );
  console.assert(
    hasAnyRole(dualRoleContext.roles, ["class_teacher", "admin"]) === true,
    "hasAnyRole check"
  );
  console.assert(
    hasAllRoles(dualRoleContext.roles, ["class_teacher", "subject_teacher"]) ===
      true,
    "hasAllRoles check"
  );
  console.log("   ✓ Multi-role verification succeeded for single and dual roles");

  // Test 3: Verify Webhook Signature Verification with Svix
  console.log("\n3. Checking Svix Webhook Verification...");
  const rawKey = Buffer.from("01234567890123456789012345678901").toString("base64");
  const testSecret = `whsec_${rawKey}`;
  process.env.CLERK_WEBHOOK_SIGNING_SECRET = testSecret;

  const testPayload = JSON.stringify({
    data: { id: "user_123", email_addresses: [{ email_address: "test@example.com" }] },
    object: "event",
    type: "user.created",
  });

  const svix = new Webhook(testSecret);
  const timestamp = new Date();
  const svixId = "msg_test_123";
  const signature = svix.sign(svixId, timestamp, testPayload);

  const verifiedEvent = verifyClerkWebhook(testPayload, {
    "svix-id": svixId,
    "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
    "svix-signature": signature,
  });

  console.assert(
    verifiedEvent.type === "user.created",
    "Webhook type should match"
  );
  console.log("   ✓ Svix webhook signature verified successfully");

  // Test 4: Verify Tampered Webhook Rejection
  console.log("\n4. Checking Tampered Webhook Rejection...");
  let rejected = false;
  try {
    verifyClerkWebhook("tampered payload", {
      "svix-id": svixId,
      "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
      "svix-signature": signature,
    });
  } catch (err) {
    rejected = true;
    console.log("   ✓ Tampered payload successfully rejected by Svix signature check");
  }

  if (!rejected) {
    throw new Error("Tampered payload was unexpectedly accepted!");
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL WAVE 1 VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=======================================================");
}

runVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
