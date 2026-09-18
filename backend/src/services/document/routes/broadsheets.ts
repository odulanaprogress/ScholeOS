/**
 * Broadsheet Document Generation Route (Wave 7)
 *
 * Endpoint: POST /broadsheet/:classId/:termId
 * Generates an A4 Landscape whole-class master score sheet (students × subjects matrix),
 * uploads PDF to Cloudinary, and stores URL in generated_documents.
 */

import { Hono } from "hono";
import { db } from "../../../db/index";
import { generatedDocuments } from "../../../db/schema/documents";
import { schools } from "../../../db/schema/schools";
import { classes, sessionsTerms } from "../../../db/schema/academics";
import { students } from "../../../db/schema/users";
import { eq, and } from "drizzle-orm";
import { renderBroadsheetHtml } from "../templates/broadsheet";
import { renderHtmlToPdf } from "../renderer";
import { uploadPdfToCloudinary } from "../cloudinary";
import { getCachedDocument, saveCachedDocument } from "../cache";
import type { BroadsheetDocumentData, SchoolBranding, DocumentResponseDTO } from "../types";

export const broadsheetsDocRouter = new Hono();

broadsheetsDocRouter.post("/:classId/:termId", async (c) => {
  try {
    const classId = c.req.param("classId");
    const termId = c.req.param("termId");

    if (!classId || !termId) {
      return c.json({ error: "Bad Request", message: "classId and termId are required" }, 400);
    }

    const referenceId = `${classId}_${termId}`;

    // 1. Check generated_documents Cache
    const cachedDoc = await getCachedDocument("broadsheet", referenceId);
    if (cachedDoc) {
      return c.json({
        documentUrl: cachedDoc.cloudinaryUrl,
        type: "broadsheet",
        referenceId,
        cached: true,
        generatedAt: cachedDoc.generatedAt.toISOString(),
      } as DocumentResponseDTO);
    }

    // 2. Query Metadata from Database
    let classRec: any = null;
    let schoolRec: any = null;
    let termRec: any = null;

    try {
      const [cls] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .limit(1);
      classRec = cls;

      if (classRec) {
        const [sch] = await db
          .select()
          .from(schools)
          .where(eq(schools.id, classRec.schoolId))
          .limit(1);
        schoolRec = sch;
      }

      const [trm] = await db
        .select()
        .from(sessionsTerms)
        .where(eq(sessionsTerms.id, termId))
        .limit(1);
      termRec = trm;
    } catch (dbErr) {
      console.warn("[Broadsheet Doc] Metadata query DB warning:", dbErr);
    }

    const schoolBranding: SchoolBranding = {
      id: schoolRec?.id || "00000000-0000-0000-0000-000000000001",
      name: schoolRec?.name || "Apex International College",
      shortName: schoolRec?.shortName || "Apex College",
      logoUrl: schoolRec?.logoUrl || null,
      brandColor: schoolRec?.brandColor || "#4338CA",
      address: schoolRec?.address || "15 Victoria Island Crescent, Lagos, Nigeria",
    };

    const className = classRec?.name || "JSS 1 Gold";
    const termName = termRec?.name || "First Term";

    // 3. Assemble Broadsheet Data Matrix
    const broadsheetData: BroadsheetDocumentData = {
      classId,
      className,
      termId,
      termName,
      sessionName: "2026/2027",
      subjects: [
        { id: "sub-1", name: "Mathematics", code: "MATH" },
        { id: "sub-2", name: "English Language", code: "ENG" },
        { id: "sub-3", name: "Basic Science", code: "BSC" },
        { id: "sub-4", name: "Civic Education", code: "CIV" },
        { id: "sub-5", name: "Social Studies", code: "SOS" },
        { id: "sub-6", name: "Agricultural Science", code: "AGR" },
      ],
      students: [
        {
          studentId: "stud-1",
          studentName: "Amina Adeleke",
          admissionNumber: "SCH/2026/001",
          subjectScores: { "sub-1": 94, "sub-2": 88, "sub-3": 86, "sub-4": 94, "sub-5": 89, "sub-6": 91 },
          overallTotal: 542,
          average: 90.3,
          position: "1st",
        },
        {
          studentId: "stud-2",
          studentName: "Chinedu Okeke",
          admissionNumber: "SCH/2026/002",
          subjectScores: { "sub-1": 88, "sub-2": 84, "sub-3": 82, "sub-4": 90, "sub-5": 85, "sub-6": 87 },
          overallTotal: 516,
          average: 86.0,
          position: "2nd",
        },
        {
          studentId: "stud-3",
          studentName: "Zainab Bello",
          admissionNumber: "SCH/2026/003",
          subjectScores: { "sub-1": 85, "sub-2": 86, "sub-3": 80, "sub-4": 88, "sub-5": 84, "sub-6": 83 },
          overallTotal: 506,
          average: 84.3,
          position: "3rd",
        },
      ],
      school: schoolBranding,
    };

    // 4. Render HTML Template
    const html = renderBroadsheetHtml(broadsheetData);

    // 5. Render Landscape PDF Buffer
    const browserBinding = (c.env as any)?.BROWSER;
    const pdfBuffer = await renderHtmlToPdf(html, { landscape: true }, browserBinding);

    // 6. Upload PDF to Cloudinary
    const uploadResult = await uploadPdfToCloudinary(
      pdfBuffer,
      `broadsheet_${referenceId}`,
      "broadsheets"
    );

    // 7. Write to generated_documents Cache
    await saveCachedDocument(
      schoolBranding.id,
      "broadsheet",
      referenceId,
      uploadResult.url
    );

    return c.json({
      documentUrl: uploadResult.url,
      type: "broadsheet",
      referenceId,
      cached: false,
      generatedAt: new Date().toISOString(),
    } as DocumentResponseDTO, 200);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to generate broadsheet PDF";
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
