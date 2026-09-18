/**
 * Admin AI Copilot & Qualitative Comment Routes (Wave 9)
 *
 * Endpoints:
 * 1. POST /admin/chat - Multi-turn administrative analytics copilot with scoped tool calling
 * 2. POST /admin/report-card-comment - Qualitative, encouraging report card remark generator
 */

import { Hono } from "hono";
import { resolveSchoolId } from "../../licensing/middleware";
import { generateAdminAiResponse, generateReportCardComment } from "../client";
import type { AdminChatRequestDTO, ReportCardCommentRequestDTO } from "../types";

export const adminRouter = new Hono();

/**
 * Helper to extract role and caller info
 */
function getCallerInfo(c: any): { userId: string; role: string; isStaffOrAdmin: boolean } {
  const auth = c.get("auth" as any) as any;
  const authHeader = c.req.header("Authorization") || "";
  const roleHeader = c.req.header("x-user-role") || "";

  let role = "admin";
  let userId = "admin_user_01";

  if (auth) {
    role = auth.roles?.[0] || auth.userType || "admin";
    userId = auth.userId || userId;
  } else if (authHeader.includes("student") || roleHeader === "student") {
    role = "student";
    userId = "student_user_01";
  } else if (authHeader.includes("teacher") || roleHeader === "teacher") {
    role = "class_teacher";
    userId = "teacher_user_01";
  } else if (authHeader.includes("guardian") || roleHeader === "guardian") {
    role = "guardian";
    userId = "guardian_user_01";
  }

  const isStaffOrAdmin = ["admin", "class_teacher", "subject_teacher", "staff", "platform_admin", "org:admin"].includes(
    role
  );

  return { userId, role, isStaffOrAdmin };
}

/**
 * POST /admin/chat
 * Multi-turn administrative query engine with scoped function calling
 */
adminRouter.post("/chat", async (c) => {
  const { userId, isStaffOrAdmin, role } = getCallerInfo(c);

  // Authorization: Only admin and staff may access Copilot
  if (!isStaffOrAdmin) {
    return c.json(
      {
        error: "Forbidden",
        message: `Only school administrators and authorized staff may access the AI Copilot. Current role '${role}' is unauthorized.`,
      },
      403
    );
  }

  const schoolId = resolveSchoolId(c);
  if (!schoolId) {
    return c.json(
      {
        error: "Bad Request",
        message: "A valid school ID is required via x-school-id header, param, or query.",
      },
      400
    );
  }

  let body: AdminChatRequestDTO;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON request payload." }, 400);
  }

  if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
    return c.json(
      {
        error: "Bad Request",
        message: "A 'message' string is required.",
      },
      400
    );
  }

  try {
    const result = await generateAdminAiResponse(
      body.message.trim(),
      schoolId,
      userId,
      body.conversationHistory || []
    );

    return c.json(result, 200);
  } catch (err: any) {
    console.error("[AI Admin Chat Error]:", err);
    return c.json(
      {
        error: "AI Service Error",
        message: err.message || "Failed to process administrative AI request.",
      },
      500
    );
  }
});

/**
 * POST /admin/report-card-comment
 * Generates qualitative, encouraging report card comments grounded in student's academic history
 */
adminRouter.post("/report-card-comment", async (c) => {
  const { userId, isStaffOrAdmin, role } = getCallerInfo(c);

  // Authorization: Only staff and admin can draft report card remarks
  if (!isStaffOrAdmin) {
    return c.json(
      {
        error: "Forbidden",
        message: `Only class teachers and school administrators can generate report card comments. Current role '${role}' is unauthorized.`,
      },
      403
    );
  }

  const schoolId = resolveSchoolId(c);
  if (!schoolId) {
    return c.json(
      {
        error: "Bad Request",
        message: "A valid school ID is required.",
      },
      400
    );
  }

  let body: ReportCardCommentRequestDTO;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Bad Request", message: "Invalid JSON request payload." }, 400);
  }

  if (!body.studentId || !body.termId) {
    return c.json(
      {
        error: "Bad Request",
        message: "Both 'studentId' and 'termId' are required parameters.",
      },
      400
    );
  }

  try {
    const result = await generateReportCardComment(
      body.studentId,
      body.termId,
      schoolId,
      userId,
      body.customPrompt
    );

    return c.json(result, 200);
  } catch (err: any) {
    console.error("[AI Report Card Comment Error]:", err);
    return c.json(
      {
        error: "AI Service Error",
        message: err.message || "Failed to generate report card comment.",
      },
      500
    );
  }
});
