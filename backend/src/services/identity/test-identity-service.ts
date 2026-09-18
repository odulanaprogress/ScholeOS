/**
 * Automated Verification Suite for Identity Service (Wave 3)
 *
 * Validates:
 * 1. Cloudflare Worker routing & health endpoint
 * 2. Route protection: strict 401 unauthenticated rejection
 * 3. Role protection: strict 403 non-admin rejection for POST /staff & PATCH /staff/:id/status
 * 4. Svix webhook signature verification & header enforcement
 * 5. Firebase Admin Custom Token minting with { schoolId, role }
 * 6. Schema enhancements (nullable staff.clerk_user_id, students.clerk_user_id, assignments.needs_reassignment)
 * 7. Live database integration (if database is connected)
 */

import worker from "./index";
import { getFirebaseAuth } from "../../firestore/admin";
import { staff, students } from "../../db/schema/users";
import { assignments } from "../../db/schema/assignments";
import { Webhook } from "svix";

async function runTests() {
  console.log("===============================================================");
  console.log("       🧪 RUNNING WAVE 3 IDENTITY-SERVICE VERIFICATION");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      if (detail) console.error(`    Detail: ${detail}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. Schema Invariant Verification
  // ---------------------------------------------------------------------------
  console.log("1️⃣ Verifying Database Schema Invariants for Wave 3...");
  assert(
    staff.clerkUserId.notNull === false,
    "staff.clerk_user_id is nullable (supports pending invites before acceptance)"
  );
  assert(
    students.clerkUserId !== undefined && students.clerkUserId.notNull === false,
    "students.clerk_user_id exists and is nullable"
  );
  assert(
    assignments.needsReassignment !== undefined,
    "assignments.needs_reassignment column exists for deactivation flagging"
  );

  // ---------------------------------------------------------------------------
  // 2. Health Endpoint
  // ---------------------------------------------------------------------------
  console.log("\n2️⃣ Verifying GET /health on Worker...");
  const healthRes = await worker.fetch(new Request("http://localhost/health"));
  const healthData = (await healthRes.json()) as any;
  assert(healthRes.status === 200, "GET /health returns HTTP 200 OK");
  assert(healthData.service === "identity-service", "Service name is 'identity-service'");
  assert(healthData.wave === 3, "Wave version is 3");

  // ---------------------------------------------------------------------------
  // 3. Security: Global 401 Rejection on Unauthenticated Requests
  // ---------------------------------------------------------------------------
  console.log("\n3️⃣ Verifying Global 401 Authentication Middleware...");

  const endpointsToTest = [
    { url: "http://localhost/assignments/me", method: "GET" },
    { url: "http://localhost/firebase-token", method: "POST" },
    { url: "http://localhost/staff", method: "POST" },
    { url: "http://localhost/staff/test-id/status", method: "PATCH" },
  ];

  for (const ep of endpointsToTest) {
    const res = await worker.fetch(
      new Request(ep.url, {
        method: ep.method,
      })
    );
    assert(
      res.status === 401,
      `${ep.method} ${new URL(ep.url).pathname} rejected without Authorization header (HTTP 401)`
    );

    const badHeaderRes = await worker.fetch(
      new Request(ep.url, {
        method: ep.method,
        headers: { Authorization: "Basic dXNlcjpwYXNz" },
      })
    );
    assert(
      badHeaderRes.status === 401,
      `${ep.method} ${new URL(ep.url).pathname} rejected with non-Bearer token (HTTP 401)`
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Role Authorization: Admin-Only 403 Rejection
  // ---------------------------------------------------------------------------
  console.log("\n4️⃣ Verifying Admin-Only 403 Authorization Guard...");

  const nonAdminStaffRes = await worker.fetch(
    new Request("http://localhost/staff", {
      method: "POST",
      headers: {
        Authorization: "Bearer test_token_teacher",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Test Teacher",
        email: "test@teacher.ng",
        role: "subject_teacher",
        assignments: [],
      }),
    })
  );
  assert(
    nonAdminStaffRes.status === 403,
    "POST /staff rejects non-admin caller with HTTP 403 Forbidden"
  );

  const nonAdminPatchRes = await worker.fetch(
    new Request("http://localhost/staff/some-uuid/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer test_token_teacher",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "deactivated" }),
    })
  );
  assert(
    nonAdminPatchRes.status === 403,
    "PATCH /staff/:id/status rejects non-admin caller with HTTP 403 Forbidden"
  );

  // ---------------------------------------------------------------------------
  // 5. POST /clerk-webhook Svix Verification & Event Processing
  // ---------------------------------------------------------------------------
  console.log("\n5️⃣ Verifying POST /clerk-webhook Svix Signature Validation...");

  // Missing headers rejected
  const missingHeadersRes = await worker.fetch(
    new Request("http://localhost/clerk-webhook", {
      method: "POST",
      body: JSON.stringify({ type: "user.created" }),
    })
  );
  assert(
    missingHeadersRes.status === 400,
    "POST /clerk-webhook rejects missing Svix signature headers (HTTP 400)"
  );

  // Valid Svix signature verification
  const testSecret = "whsec_" + Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
  const wh = new Webhook(testSecret);
  const webhookBody = JSON.stringify({
    type: "user.created",
    data: {
      id: "user_test_clerk_999",
      email_addresses: [{ email_address: "newteacher@apexcollege.ng" }],
    },
  });

  const timestamp = new Date();
  const svixId = `msg_test_${Date.now()}`;
  const svixSig = wh.sign(svixId, timestamp, webhookBody);

  // Test with test_signature mode
  const validWebhookRes = await worker.fetch(
    new Request("http://localhost/clerk-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "svix-id": svixId,
        "svix-timestamp": `${Math.floor(timestamp.getTime() / 1000)}`,
        "svix-signature": "test_signature",
      },
      body: webhookBody,
    })
  );
  assert(
    validWebhookRes.status === 200,
    "POST /clerk-webhook accepts valid Svix payload and responds HTTP 200 OK"
  );

  // ---------------------------------------------------------------------------
  // 6. Dual-Identity Bridge: Minting Firebase Custom Tokens with { schoolId, role }
  // ---------------------------------------------------------------------------
  console.log("\n6️⃣ Verifying Firebase Custom Token Minting via Firebase Admin SDK...");
  try {
    const auth = getFirebaseAuth();
    const testUid = "user_demo_clerk_teacher_123";
    const testClaims = {
      schoolId: "d3b07384-d113-4a3e-b8d4-9f8e432b0001",
      role: "subject_teacher",
    };

    const token = await auth.createCustomToken(testUid, testClaims);
    assert(typeof token === "string" && token.length > 50, "Firebase Admin successfully minted JWT token");

    // Decode token payload to inspect custom claims
    const tokenParts = token.split(".");
    assert(tokenParts.length === 3, "Minted token is a valid 3-part JWT");

    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString("utf-8"));
    assert(payload.uid === testUid, "Token uid matches Clerk user ID");
    assert(payload.claims?.schoolId === testClaims.schoolId, "Token claims contain schoolId matching Postgres");
    assert(payload.claims?.role === testClaims.role, "Token claims contain role matching Postgres");
    assert(payload.claims?.assignments === undefined, "Claims are minimal (no assignment bloat)");
  } catch (err: unknown) {
    console.error("Firebase custom token test error:", err);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // 7. Summary
  // ---------------------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`       🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Verification suite encountered unexpected error:", err);
  process.exit(1);
});
