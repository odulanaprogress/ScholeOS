/**
 * ScholeOS Notification Service — Cloudflare Worker Entrypoint (Wave 6)
 *
 * Microservice managing asynchronous multi-channel notification dispatches (SMS/WhatsApp via Termii,
 * and in-app alerts) backed by Cloudflare Queues, message templates, delivery logs, and announcement broadcasting.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { notifyRouter } from "./routes/notify";
import { announcementsRouter } from "./routes/announcements";
import { handleQueueBatch } from "./queue";

const app = new Hono();

// Global CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-internal-service-secret"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  })
);

// Public Health Check
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    service: "notification-service",
    wave: 6,
    queue: "notifications-queue",
    provider: "termii",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.route("/notify", notifyRouter);
app.route("/announcements", announcementsRouter);

export default {
  fetch: app.fetch,
  queue: handleQueueBatch,
};

export { app };
