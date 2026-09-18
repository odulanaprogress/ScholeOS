/**
 * Automated Verification Suite for Wave 7: document-service
 *
 * Tests generated_documents schema, health endpoint, SVG QR code generator,
 * white-label branding injection across all 4 templates, Browser Rendering / PDF generation,
 * Cloudinary PDF uploads, and caching behavior on immutable documents.
 */

import { app } from "./index";
import { generatedDocuments } from "../../db/schema/documents";
import { generateSvgQrCode } from "./qrcode";
import { renderReportCardHtml } from "./templates/report-card";
import { renderBroadsheetHtml } from "./templates/broadsheet";
import { renderReceiptHtml } from "./templates/receipt";
import { renderSingleIdCardHtml, renderBatchIdCardsHtml } from "./templates/id-card";
import type { SchoolBranding } from "./types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
}

async function runDocumentServiceTests() {
  console.log("\n===============================================================");
  console.log("       🧪 RUNNING WAVE 7 DOCUMENT-SERVICE VERIFICATION");
  console.log("===============================================================\n");

  let passCount = 0;
  const count = () => passCount++;

  // 1. Schema Verification
  console.log("1️⃣ Verifying Database Schema for Wave 7...");
  assert(generatedDocuments !== undefined, "generatedDocuments table exists in Drizzle schema");
  count();
  assert("schoolId" in generatedDocuments, "generatedDocuments has schoolId column");
  count();
  assert("type" in generatedDocuments, "generatedDocuments has type column");
  count();
  assert("referenceId" in generatedDocuments, "generatedDocuments has referenceId column");
  count();
  assert("cloudinaryUrl" in generatedDocuments, "generatedDocuments has cloudinaryUrl column");
  count();
  assert("generatedAt" in generatedDocuments, "generatedDocuments has generatedAt column");
  count();

  // 2. GET /health
  console.log("\n2️⃣ Verifying GET /health on Document Worker...");
  const healthRes = await app.request("/health");
  assert(healthRes.status === 200, "GET /health returns HTTP 200 OK");
  count();
  const healthData = (await healthRes.json()) as any;
  assert(healthData.service === "document-service", "Service name is 'document-service'");
  count();
  assert(healthData.wave === 7, "Wave version is 7");
  count();
  assert(healthData.engine === "cloudflare-browser-rendering", "Rendering engine is cloudflare-browser-rendering");
  count();

  // 3. SVG QR Code Generator Tests
  console.log("\n3️⃣ Verifying Pure TypeScript SVG QR Code Generator...");
  const qrSvg = generateSvgQrCode("SCHOLEOS:SCH-001:STUD-1234:2026", 120);
  assert(qrSvg.startsWith("<svg"), "QR output begins with <svg tag");
  count();
  assert(qrSvg.includes("</svg>"), "QR output ends with </svg> tag");
  count();
  assert(qrSvg.includes("<path d="), "QR output contains SVG path data");
  count();
  assert(qrSvg.includes('width="120"'), "QR output width matches requested size");
  count();

  // 4. White-Labeling Branding Injection Across All 4 Templates
  console.log("\n4️⃣ Verifying School White-Label Branding Injection...");
  const testBranding: SchoolBranding = {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Apex International College",
    shortName: "Apex College",
    logoUrl: "https://res.cloudinary.com/scholesos/image/upload/v1/crests/apex_crest.png",
    brandColor: "#4338CA",
    address: "15 Victoria Island Crescent, Lagos",
  };

  // Report card template branding
  const reportHtml = renderReportCardHtml({
    studentId: "s-1",
    studentName: "Amina Adeleke",
    admissionNumber: "SCH/2026/001",
    className: "JSS 1 Gold",
    termName: "First Term",
    sessionName: "2026/2027",
    subjects: [
      {
        subjectId: "sub-1",
        subjectName: "Mathematics",
        components: { "1st Test": 10, "Exam": 40 },
        total: 90,
        grade: "A",
        remark: "Excellent",
      },
    ],
    overallTotal: 90,
    maxPossibleTotal: 100,
    average: 90.0,
    position: "1st",
    teacherComment: "Great job!",
    headTeacherComment: "Well done!",
    status: "published",
    school: testBranding,
  });
  assert(reportHtml.includes("Apex International College"), "Report card template includes school name");
  count();
  assert(reportHtml.includes("#4338CA"), "Report card template applies school brand color");
  count();
  assert(reportHtml.includes("apex_crest.png"), "Report card template embeds school logo crest");
  count();
  assert(reportHtml.includes("1st"), "Report card template renders 1224 competition rank position");
  count();

  // Broadsheet template branding
  const broadsheetHtml = renderBroadsheetHtml({
    classId: "c-1",
    className: "JSS 1 Gold",
    termId: "t-1",
    termName: "First Term",
    sessionName: "2026/2027",
    subjects: [{ id: "sub-1", name: "Mathematics", code: "MATH" }],
    students: [
      {
        studentId: "s-1",
        studentName: "Amina Adeleke",
        admissionNumber: "SCH/2026/001",
        subjectScores: { "sub-1": 90 },
        overallTotal: 90,
        average: 90.0,
        position: "1st",
      },
    ],
    school: testBranding,
  });
  assert(broadsheetHtml.includes("Apex International College"), "Broadsheet template includes school name");
  count();
  assert(broadsheetHtml.includes("#4338CA"), "Broadsheet template applies school brand color");
  count();
  assert(broadsheetHtml.includes("landscape"), "Broadsheet uses landscape page orientation");
  count();

  // Receipt template branding
  const receiptHtml = renderReceiptHtml({
    paymentId: "p-1",
    receiptNumber: "REC-2026-001",
    invoiceId: "inv-1",
    studentName: "Amina Adeleke",
    admissionNumber: "SCH/2026/001",
    className: "JSS 1 Gold",
    feeType: "First Term Tuition Fee",
    amount: 150000,
    amountInWords: "One Hundred and Fifty Thousand Naira Only",
    channel: "paystack",
    providerRef: "REF_PAY_001",
    paymentDate: "18 Sep 2026",
    school: testBranding,
  });
  assert(receiptHtml.includes("Apex International College"), "Receipt template includes school name");
  count();
  assert(receiptHtml.includes("REC-2026-001"), "Receipt template includes receipt number");
  count();
  assert(receiptHtml.includes("Verified &amp; Cleared") || receiptHtml.includes("Verified & Cleared"), "Receipt template includes verified status seal");
  count();

  // ID Card template branding & QR
  const idCardHtml = renderSingleIdCardHtml({
    studentId: "s-1",
    studentName: "Amina Adeleke",
    admissionNumber: "SCH/2026/001",
    className: "JSS 1 Gold",
    photoUrl: null,
    school: testBranding,
  });
  assert(idCardHtml.includes("Apex International College"), "ID card includes school name");
  count();
  assert(idCardHtml.includes("<svg"), "ID card includes inline SVG QR code");
  count();
  assert(idCardHtml.includes("STUDENT"), "ID card includes student tag");
  count();

  // 5. Report Card Document Generation & Cache Test
  console.log("\n5️⃣ Verifying Report Card PDF Generation & Cache Hit...");
  const reportRes = await app.request("/documents/report-card/stud-test-01/term-test-01", {
    method: "POST",
  });
  assert(reportRes.status === 200, "POST /documents/report-card returns HTTP 200 OK");
  count();
  const reportData = (await reportRes.json()) as any;
  assert(reportData.documentUrl !== undefined, "Response contains documentUrl");
  count();
  assert(reportData.documentUrl.includes("cloudinary.com"), "Document URL points to Cloudinary storage");
  count();
  assert(reportData.type === "report_card", "Document type is report_card");
  count();

  // Second request: tests cache hit
  const cachedReportRes = await app.request("/documents/report-card/stud-test-01/term-test-01", {
    method: "POST",
  });
  assert(cachedReportRes.status === 200, "Second request returns HTTP 200 OK");
  count();
  const cachedReportData = (await cachedReportRes.json()) as any;
  assert(cachedReportData.cached === true, "Second request returns cached: true without re-rendering");
  count();
  assert(cachedReportData.documentUrl === reportData.documentUrl, "Cached URL matches initial generated URL");
  count();

  // 6. Landscape Broadsheet Document Generation
  console.log("\n6️⃣ Verifying Landscape Broadsheet PDF Generation...");
  const broadsheetRes = await app.request("/documents/broadsheet/class-test-01/term-test-01", {
    method: "POST",
  });
  assert(broadsheetRes.status === 200, "POST /documents/broadsheet returns HTTP 200 OK");
  count();
  const broadsheetData = (await broadsheetRes.json()) as any;
  assert(broadsheetData.type === "broadsheet", "Document type is broadsheet");
  count();
  assert(broadsheetData.documentUrl.includes("cloudinary.com"), "Broadsheet URL points to Cloudinary");
  count();

  // 7. Payment Receipt Document Generation
  console.log("\n7️⃣ Verifying Payment Receipt PDF Generation...");
  const receiptRes = await app.request("/documents/receipt/payment-test-01", {
    method: "POST",
  });
  assert(receiptRes.status === 200, "POST /documents/receipt returns HTTP 200 OK");
  count();
  const receiptData = (await receiptRes.json()) as any;
  assert(receiptData.type === "receipt", "Document type is receipt");
  count();
  assert(receiptData.documentUrl.includes("cloudinary.com"), "Receipt URL points to Cloudinary");
  count();

  // 8. Student ID Card Generation (Single & Batch)
  console.log("\n8️⃣ Verifying Student ID Cards PDF Generation (Single & Batch)...");
  // Single ID Card
  const idCardRes = await app.request("/documents/id-card/stud-test-01", {
    method: "POST",
  });
  assert(idCardRes.status === 200, "POST /documents/id-card/:studentId returns HTTP 200 OK");
  count();
  const idCardData = (await idCardRes.json()) as any;
  assert(idCardData.type === "id_card", "Document type is id_card");
  count();
  assert(idCardData.documentUrl.includes("cloudinary.com"), "ID Card URL points to Cloudinary");
  count();

  // Batch Class ID Cards
  const batchIdRes = await app.request("/documents/id-cards/batch/class-test-01", {
    method: "POST",
  });
  assert(batchIdRes.status === 200, "POST /documents/id-cards/batch/:classId returns HTTP 200 OK");
  count();
  const batchIdData = (await batchIdRes.json()) as any;
  assert(batchIdData.type === "id_card_batch", "Document type is id_card_batch");
  count();
  assert(batchIdData.documentUrl.includes("cloudinary.com"), "Batch ID Cards URL points to Cloudinary");
  count();

  console.log("\n===============================================================");
  console.log(`       🏁 TEST SUMMARY: ${passCount} PASSED, 0 FAILED`);
  console.log("===============================================================\n");
}

runDocumentServiceTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
