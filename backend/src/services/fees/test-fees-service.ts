/**
 * Automated Verification Suite for Wave 5: fees-service
 *
 * Tests all 10 endpoints, database schema additions, Paystack/Flutterwave signature & idempotency guards,
 * parent-student authorization checks, Cloudinary proof handling, approval/rejection lifecycle, and arrears ledger.
 */

import { app } from "./index";
import { schools } from "../../db/schema/schools";
import { feeStructures, invoices, payments } from "../../db/schema/fees";
import { webhookLog } from "../../db/schema/webhooks";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
}

async function runFeesServiceTests() {
  console.log("\n===============================================================");
  console.log("       🧪 RUNNING WAVE 5 FEES-SERVICE VERIFICATION");
  console.log("===============================================================\n");

  let passCount = 0;
  const count = () => passCount++;

  // 1. Schema Addition Verification
  console.log("1️⃣ Verifying Database Schema Additions for Wave 5...");
  assert("feeGatedReportRelease" in schools, "schools.feeGatedReportRelease column exists in Drizzle schema");
  count();
  assert(feeStructures !== undefined, "feeStructures table exists in Drizzle schema");
  count();
  assert(invoices !== undefined, "invoices table exists in Drizzle schema");
  count();
  assert(payments !== undefined, "payments table exists in Drizzle schema");
  count();
  assert(webhookLog !== undefined, "webhookLog table exists in Drizzle schema");
  count();

  // 2. GET /health
  console.log("\n2️⃣ Verifying GET /health on Fees Worker...");
  const healthRes = await app.request("/health");
  assert(healthRes.status === 200, "GET /health returns HTTP 200 OK");
  count();
  const healthData = (await healthRes.json()) as any;
  assert(healthData.service === "fees-service", "Service name is 'fees-service'");
  count();
  assert(healthData.wave === 5, "Wave version is 5");
  count();

  // 3. Global 401 Authentication Rejection Across Protected Routes
  console.log("\n3️⃣ Verifying Global 401 Authentication Rejection...");
  const protectedRoutes = [
    { method: "POST", path: "/fee-structures", body: {} },
    { method: "GET", path: "/fee-structures/school-01" },
    { method: "POST", path: "/invoices/generate", body: { termId: "t1" } },
    { method: "GET", path: "/invoices/student/stud-01" },
    { method: "GET", path: "/invoices/school/school-01" },
    { method: "POST", path: "/payments/proof", body: { invoiceId: "inv-1", amount: 50000, proofImage: "base64" } },
    { method: "POST", path: "/payments/pay-1/approve" },
    { method: "POST", path: "/payments/pay-1/reject", body: { reason: "Blurry" } },
    { method: "GET", path: "/arrears/school-01" },
  ];

  for (const r of protectedRoutes) {
    const res = await app.request(r.path, {
      method: r.method,
      headers: { "Content-Type": "application/json" },
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    assert(res.status === 401, `${r.method} ${r.path} rejects unauthenticated request with HTTP 401`);
    count();
  }

  // 4. Admin Role Guards (403 for Non-Admins)
  console.log("\n4️⃣ Verifying Admin-Only 403 Authorization Guards...");
  const adminOnlyRoutes = [
    { method: "POST", path: "/fee-structures", body: { feeType: "Tuition", amount: 100000, termId: "t1", dueDate: "2026-10-15" } },
    { method: "POST", path: "/invoices/generate", body: { termId: "t1" } },
    { method: "POST", path: "/payments/pay-mock-01/approve" },
    { method: "POST", path: "/payments/pay-mock-01/reject", body: { reason: "Invalid receipt" } },
  ];

  for (const r of adminOnlyRoutes) {
    const res = await app.request(r.path, {
      method: r.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_token_guardian", // non-admin
      },
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    assert(res.status === 403, `${r.method} ${r.path} rejects non-admin caller with HTTP 403 Forbidden`);
    count();
  }

  // 5. Parent-Student Authorization Check
  console.log("\n5️⃣ Verifying Parent-Student Authorization Guard...");
  // Guardian trying to upload proof for unauthorized child
  const unauthorizedProofRes = await app.request("/payments/proof", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_guardian",
    },
    body: JSON.stringify({
      invoiceId: "inv-foreign-99",
      amount: 50000,
      proofImage: "data:image/jpeg;base64,mockimagedata",
    }),
  });
  assert(unauthorizedProofRes.status === 403, "POST /payments/proof rejects unauthorized guardian with HTTP 403");
  count();

  // Guardian trying to view invoices for unauthorized child
  const unauthorizedStudentInvoices = await app.request("/invoices/student/student_unauthorized_99", {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_guardian",
    },
  });
  assert(unauthorizedStudentInvoices.status === 403, "GET /invoices/student/:studentId rejects foreign guardian with HTTP 403");
  count();

  // 6. Fee Structures (Admin creation & listing)
  console.log("\n6️⃣ Verifying Fee Structure Creation & Querying...");
  const createFeeRes = await app.request("/fee-structures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_admin",
    },
    body: JSON.stringify({
      feeType: "Tuition Fee",
      amount: 150000,
      termId: "00000000-0000-0000-0000-000000000001",
      dueDate: "2026-10-15",
      isRecurring: true,
    }),
  });
  if (createFeeRes.status !== 201) {
    console.error("  DEBUG createFeeRes status:", createFeeRes.status, await createFeeRes.text());
  }
  assert(createFeeRes.status === 201, "POST /fee-structures creates fee structure (HTTP 201)");
  count();
  const feeData = (await createFeeRes.json()) as any;
  assert(feeData.feeStructure.feeType === "Tuition Fee", "Fee structure feeType matches input");
  count();

  const listFeesRes = await app.request("/fee-structures/school-01", {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_admin",
    },
  });
  assert(listFeesRes.status === 200, "GET /fee-structures/:schoolId returns HTTP 200");
  count();
  const listFeesData = (await listFeesRes.json()) as any;
  assert(Array.isArray(listFeesData.feeStructures), "Fee structures response contains array");
  count();

  // 7. Batch Invoice Generation
  console.log("\n7️⃣ Verifying Batch Invoice Generation...");
  const genInvRes = await app.request("/invoices/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_admin",
    },
    body: JSON.stringify({
      termId: "00000000-0000-0000-0000-000000000001",
    }),
  });
  assert(genInvRes.status === 200, "POST /invoices/generate executes batch generation (HTTP 200)");
  count();
  const genData = (await genInvRes.json()) as any;
  assert(typeof genData.generatedCount === "number", "Generated count returned");
  count();

  // 8. Payment Webhook Signatures & Idempotency Guards
  console.log("\n8️⃣ Verifying Paystack & Flutterwave Webhooks & Idempotency...");
  // Paystack valid webhook
  const paystackPayload = {
    event: "charge.success",
    data: {
      id: 123456,
      reference: "ref_test_paystack_001",
      amount: 15000000, // 150,000 NGN in kobo
      status: "success",
      metadata: { invoiceId: "inv-mock-01" },
    },
  };
  const paystackRes = await app.request("/payments/webhook/paystack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": "test_valid_paystack_signature",
    },
    body: JSON.stringify(paystackPayload),
  });
  assert(paystackRes.status === 200, "POST /payments/webhook/paystack accepts valid signature (HTTP 200)");
  count();

  // Paystack duplicate webhook (Idempotency)
  const paystackDuplicateRes = await app.request("/payments/webhook/paystack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": "test_valid_paystack_signature",
    },
    body: JSON.stringify(paystackPayload),
  });
  assert(paystackDuplicateRes.status === 200, "Duplicate Paystack webhook handled gracefully (HTTP 200)");
  count();

  // Flutterwave valid webhook
  const flwPayload = {
    event: "charge.completed",
    data: {
      id: 789012,
      tx_ref: "flw_ref_test_001",
      amount: 150000,
      status: "successful",
      meta: { invoiceId: "inv-mock-01" },
    },
  };
  const flwRes = await app.request("/payments/webhook/flutterwave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "verif-hash": "test_valid_flutterwave_hash",
    },
    body: JSON.stringify(flwPayload),
  });
  assert(flwRes.status === 200, "POST /payments/webhook/flutterwave accepts valid hash (HTTP 200)");
  count();

  // 9. Bank Transfer Proof Upload, Approve, and Reject
  console.log("\n9️⃣ Verifying Bank Transfer Proof Lifecycle...");
  // Upload proof
  const uploadRes = await app.request("/payments/proof", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_guardian",
    },
    body: JSON.stringify({
      invoiceId: "inv-mock-01",
      amount: 150000,
      proofImage: "data:image/jpeg;base64,mockimagedata",
    }),
  });
  assert(uploadRes.status === 201, "POST /payments/proof uploads receipt (HTTP 201)");
  count();
  const uploadData = (await uploadRes.json()) as any;
  assert(uploadData.payment.verificationStatus === "pending", "Payment created in pending status");
  count();
  assert(uploadData.proofUrl.includes("cloudinary"), "Proof image uploaded to Cloudinary URL");
  count();

  // Approve payment
  const approveRes = await app.request(`/payments/${uploadData.payment.id}/approve`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_admin",
    },
  });
  assert(approveRes.status === 200, "POST /payments/:id/approve approves payment (HTTP 200)");
  count();
  const approveData = (await approveRes.json()) as any;
  assert(approveData.payment.verificationStatus === "approved", "Payment status updated to approved");
  count();

  // Reject payment with reason (and revert invoice)
  const rejectRes = await app.request(`/payments/pay-mock-02/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_admin",
    },
    body: JSON.stringify({
      reason: "Receipt screenshot is blurred and transaction reference is unreadable",
    }),
  });
  assert(rejectRes.status === 200, "POST /payments/:id/reject rejects payment (HTTP 200)");
  count();
  const rejectData = (await rejectRes.json()) as any;
  assert(rejectData.payment.verificationStatus === "rejected", "Payment status updated to rejected");
  count();
  assert(rejectData.payment.rejectionReason.includes("blurred"), "Rejection reason saved");
  count();

  // 10. School Invoices & Arrears Ledger
  console.log("\n🔟 Verifying School Invoices & Arrears Summary...");
  const schoolInvRes = await app.request("/invoices/school/school-01", {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_admin",
    },
  });
  assert(schoolInvRes.status === 200, "GET /invoices/school/:schoolId returns HTTP 200");
  count();
  const schoolInvData = (await schoolInvRes.json()) as any;
  assert(schoolInvData.summary !== undefined, "Response includes inline arrears summary");
  count();
  assert(typeof schoolInvData.summary.totalOwed === "number", "summary.totalOwed computed");
  count();

  const arrearsRes = await app.request("/arrears/school-01", {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_admin",
    },
  });
  assert(arrearsRes.status === 200, "GET /arrears/:schoolId returns HTTP 200");
  count();
  const arrearsData = (await arrearsRes.json()) as any;
  assert(Array.isArray(arrearsData.arrears), "Arrears ledger contains array of students with balances");
  count();
  assert(arrearsData.arrears[0].totalOwed >= arrearsData.arrears[1].totalOwed, "Arrears ledger sorted descending by amount owed");
  count();

  console.log("\n===============================================================");
  console.log(`       🏁 TEST SUMMARY: ${passCount} PASSED, 0 FAILED`);
  console.log("===============================================================\n");
}

runFeesServiceTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
