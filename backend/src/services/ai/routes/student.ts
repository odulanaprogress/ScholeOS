/**
 * Student Socratic AI Tutor Routes (Wave 9)
 *
 * Endpoints:
 * 1. POST /student/tutor/chat - Child-safe Socratic tutoring assistant for students
 *
 * MINORS SAFETY POLICY:
 * - Strictly academic & curriculum-aligned
 * - Refuses to solve homework or test problems directly (Socratic questioning only)
 * - Detects and redirects away from personal, romantic, or non-educational topics
 */

import { Hono } from "hono";
import { resolveSchoolId } from "../../licensing/middleware";
import { generateStudentTutorResponse } from "../client";
import type { StudentTutorRequestDTO } from "../types";

export const studentRouter = new Hono();

/**
 * POST /chat (relative to /student/tutor)
 * Socratic question-answering and subject guidance
 */
studentRouter.post("/chat", async (c) => {
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

  const auth = c.get("auth" as any) as any;
  const userId = auth?.userId || c.req.header("x-user-id") || "student_user_01";

  let body: StudentTutorRequestDTO;
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

  if (!body.subject || typeof body.subject !== "string" || body.subject.trim().length === 0) {
    return c.json(
      {
        error: "Bad Request",
        message: "A target 'subject' (e.g. 'Mathematics', 'English Language', 'Basic Science') is required.",
      },
      400
    );
  }

  try {
    const result = await generateStudentTutorResponse(
      body.message.trim(),
      body.subject.trim(),
      schoolId,
      userId,
      body.conversationHistory || []
    );

    return c.json(result, 200);
  } catch (err: any) {
    console.error("[AI Student Tutor Error]:", err);
    return c.json(
      {
        error: "AI Service Error",
        message: err.message || "Failed to process student tutor request.",
      },
      500
    );
  }
});
