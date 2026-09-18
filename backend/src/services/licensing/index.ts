/**
 * ScholeOS Licensing Service — Cloudflare Worker Entrypoint (Wave 8)
 *
 * Microservice managing SaaS subscription plans, trial countdowns, 7-day grace periods,
 * and suspension enforcement for multi-tenant school licensing.
 *
 * Provides:
 * 1. Admin endpoints for license provisioning, status checking, and manual updates
 * 2. Daily Cloudflare Cron Trigger running lifecycle status transitions and renewal reminders
 * 3. Shared licenseMiddleware for zero-network-hop enforcement across all microservices
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { licensesRouter } from "./routes/licenses";
import { runDailyLicenseCheck } from "./cron";
import { licenseMiddleware, checkSchoolLicense } from "./middleware";

const app = new Hono();

// Global CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-school-id",
      "x-platform-super-admin-key",
      "x-internal-service-secret",
    ],
    exposeHeaders: ["Content-Length", "X-License-Status"],
    maxAge: 86400,
  })
);

// Public Health Check
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    service: "licensing-service",
    wave: 8,
    cron: "daily",
    enforcement: "shared-middleware-zero-hop",
    timestamp: new Date().toISOString(),
  });
});

// Mount Licensing Routes under /licenses and root
app.route("/licenses", licensesRouter);
app.route("/", licensesRouter);

export default {
  fetch: app.fetch,
  scheduled: async (event: any, env: any, ctx: any) => {
    console.log("[Licensing Service] Running scheduled daily license check cron...");
    const result = await runDailyLicenseCheck(env);
    console.log("[Licensing Service] Daily cron completed:", result);
  },
};

export { app, licenseMiddleware, checkSchoolLicense };
