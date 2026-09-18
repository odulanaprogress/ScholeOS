/**
 * ScholeOS AI Service — Cloudflare Worker Entrypoint (Wave 9)
 *
 * Microservice Core Capabilities:
 * 1. POST /admin/chat - Administrative AI Copilot with tool-calling across fees, submissions, attendance, and academics
 * 2. POST /admin/report-card-comment - Qualitative, encouraging report card remark generator
 * 3. POST /student/tutor/chat - Socratic, child-safe student tutor with homework-answer refusal & personal-topic filtering
 * 4. Gated as a Premium-tier feature via Wave 8 licensing middleware (Basic plan rejected with HTTP 403)
 * 5. Token usage tracking & logging to ai_usage_log with 500k monthly quota enforcement (HTTP 429)
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { licenseMiddleware } from "../licensing/middleware";
import { requireAiFeature } from "./feature-gate";
import { adminRouter } from "./routes/admin";
import { studentRouter } from "./routes/student";
import { ADMIN_AI_TOOLS } from "./tools";
import { env } from "../../config/env";

const app = new Hono();

// 1. CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-school-id",
      "x-user-role",
      "x-user-id",
      "x-platform-super-admin-key",
    ],
  })
);

// 2. Health Probe (Public)
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "ai-service",
    wave: 9,
    model: env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
    toolCalling: true,
    tools: ADMIN_AI_TOOLS.map((t) => t.name),
    safetyFilters: [
      "minors_academic_only",
      "homework_socratic_refusal",
      "personal_topic_redirect",
    ],
    timestamp: new Date().toISOString(),
  });
});

// 3. Shared License Verification Middleware (Wave 8)
app.use("*", licenseMiddleware);

// 4. Feature Gating & Quota Limiter Middleware (Wave 9)
// Rejects Basic tier with 403 and limits token consumption to prevent runaway costs
app.use("/admin/*", requireAiFeature);
app.use("/admin", requireAiFeature);
app.use("/student/*", requireAiFeature);
app.use("/student", requireAiFeature);
app.use("/ai/*", requireAiFeature);
app.use("/ai", requireAiFeature);

// 5. Mount Subrouters
app.route("/admin", adminRouter);
app.route("/student/tutor", studentRouter);

// Prefixed aliases for consistent gateway routing
app.route("/ai/admin", adminRouter);
app.route("/ai/student/tutor", studentRouter);

export default {
  fetch: app.fetch,
};

export { app };
