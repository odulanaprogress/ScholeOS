/**
 * ScholeOS Academic Service — Cloudflare Worker (Wave 4)
 *
 * Microservice Core Capabilities:
 * 1. POST /scores/:classId/:subjectId/:termId (Validate & save draft scores)
 * 2. POST /scores/:classId/:subjectId/:termId/submit (Submit scores & auto-compute draft report cards)
 * 3. POST /scores/:classId/:subjectId/:termId/reopen-request (Request score sheet reopening)
 * 4. POST /reopen-requests/:id/approve (Class Teacher / Admin approves reopen)
 * 5. POST /attendance/:classId/:date (Class Teacher logs daily attendance)
 * 6. GET /report-card/:studentId/:termId (Scoped read of computed report card)
 * 7. PATCH /report-card/:studentId/comment (Class Teacher adds remarks to draft report card)
 * 8. POST /report-card/:classId/:termId/publish (Point of no return: gatekeeper & final lock/publish)
 * 9. GET /broadsheet/:classId/:termId (Class-wide broadsheet matrix ledger)
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkAuthMiddleware } from "../identity/middleware";
import { licenseMiddleware } from "../licensing/middleware";
import { scoreRoutes } from "./routes/scores";
import { attendanceRoutes } from "./routes/attendance";
import { reportCardRoutes } from "./routes/report-cards";
import { broadsheetRoutes } from "./routes/broadsheet";
import { cbtRoutes } from "./routes/cbt";

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
      "x-student-id",
      "x-staff-id",
      "x-class-id",
    ],
  })
);

// 2. Health Check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "academic-service",
    wave: 4,
    waves: [4, 10],
    cbt: "enabled",
    timestamp: new Date().toISOString(),
  });
});

// 3. Shared License Verification Middleware
app.use("*", licenseMiddleware);

// 3. Apply Global Clerk Authentication Middleware to all academic routes
app.use("/scores/*", clerkAuthMiddleware);
app.use("/scores", clerkAuthMiddleware);
app.use("/reopen-requests/*", clerkAuthMiddleware);
app.use("/reopen-requests", clerkAuthMiddleware);
app.use("/attendance/*", clerkAuthMiddleware);
app.use("/attendance", clerkAuthMiddleware);
app.use("/report-card/*", clerkAuthMiddleware);
app.use("/report-card", clerkAuthMiddleware);
app.use("/broadsheet/*", clerkAuthMiddleware);
app.use("/broadsheet", clerkAuthMiddleware);
app.use("/cbt/*", clerkAuthMiddleware);
app.use("/cbt", clerkAuthMiddleware);

// 4. Mount Academic Routes
app.route("/scores", scoreRoutes);
app.route("/reopen-requests", scoreRoutes);
app.route("/attendance", attendanceRoutes);
app.route("/report-card", reportCardRoutes);
app.route("/broadsheet", broadsheetRoutes);
app.route("/cbt", cbtRoutes);

// 5. Global 404 & Error Handling
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      message: `Academic service route '${c.req.method} ${c.req.path}' not found.`,
    },
    404
  );
});

app.onError((err, c) => {
  console.error("[Academic Service Error]:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err instanceof Error ? err.message : "An unexpected academic processing error occurred.",
    },
    500
  );
});

export default {
  fetch: app.fetch,
};

export { app };
