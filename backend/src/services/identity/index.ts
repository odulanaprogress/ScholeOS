/**
 * ScholeOS Identity Service — Cloudflare Worker (Wave 3)
 *
 * Microservice Responsibilities:
 * 1. POST /clerk-webhook: Svix verification, syncs Clerk user/membership events into PostgreSQL.
 * 2. POST /staff: Admin-only staff provisioning (Clerk invite, Postgres staff row, assignments).
 * 3. PATCH /staff/:id/status: Admin-only staff deactivation (revokes Clerk org access, flags assignments).
 * 4. POST /firebase-token: Authenticated bridge minting Firebase custom token with { schoolId, role }.
 * 5. GET /assignments/me: Authenticated staff endpoint returning assigned classes, subjects, and terms.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkAuthMiddleware } from "./middleware";
import { webhookRoutes } from "./routes/webhooks";
import { staffRoutes } from "./routes/staff";
import { firebaseTokenRoutes } from "./routes/firebase-token";
import { assignmentsRoutes } from "./routes/assignments";
import { licenseMiddleware } from "../licensing/middleware";

const app = new Hono();

// 1. CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "svix-id", "svix-timestamp", "svix-signature", "x-school-id"],
  })
);

// 2. Health Check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "identity-service",
    wave: 3,
    timestamp: new Date().toISOString(),
  });
});

// 3. Shared License Verification Middleware
app.use("*", licenseMiddleware);

// 4. Webhook Route (Unprotected by Clerk JWT - uses Svix signature verification instead)
app.route("/clerk-webhook", webhookRoutes);

// 4. Protected Routes (Enforce Clerk JWT verification with immediate 401 on failure)
app.use("/staff/*", clerkAuthMiddleware);
app.use("/staff", clerkAuthMiddleware);
app.use("/firebase-token/*", clerkAuthMiddleware);
app.use("/firebase-token", clerkAuthMiddleware);
app.use("/assignments/*", clerkAuthMiddleware);
app.use("/assignments", clerkAuthMiddleware);

// 5. Mount Protected Microservice Routes
app.route("/staff", staffRoutes);
app.route("/firebase-token", firebaseTokenRoutes);
app.route("/assignments", assignmentsRoutes);

// 6. Global 404 & Error Handlers
app.notFound((c) => {
  return c.json({ error: "Not Found", message: `Route ${c.req.method} ${c.req.path} not found` }, 404);
});

app.onError((err, c) => {
  console.error("[Identity Service Error]:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    },
    500
  );
});

export default {
  fetch: app.fetch,
};
