/**
 * ScholeOS Document Service — Cloudflare Worker Entrypoint (Wave 7)
 *
 * Microservice generating white-labeled report cards, broadsheets, receipts,
 * and printable student ID cards (with inline SVG QR codes) using Cloudflare
 * Browser Rendering API (Puppeteer), uploading to Cloudinary, and caching in PostgreSQL.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { reportCardsDocRouter } from "./routes/report-cards";
import { broadsheetsDocRouter } from "./routes/broadsheets";
import { receiptsDocRouter } from "./routes/receipts";
import { idCardsDocRouter } from "./routes/id-cards";
import { licenseMiddleware } from "../licensing/middleware";

const app = new Hono();

// Global CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-school-id"],
    exposeHeaders: ["Content-Length", "X-License-Status"],
    maxAge: 86400,
  })
);

// Public Health Check
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    service: "document-service",
    wave: 7,
    engine: "cloudflare-browser-rendering",
    storage: "cloudinary",
    timestamp: new Date().toISOString(),
  });
});

// Shared License Verification Middleware
app.use("*", licenseMiddleware);

// Mount Document Routes under /documents prefix (and root)
app.route("/documents/report-card", reportCardsDocRouter);
app.route("/documents/broadsheet", broadsheetsDocRouter);
app.route("/documents/receipt", receiptsDocRouter);
app.route("/documents/id-card", idCardsDocRouter);
app.route("/documents/id-cards", idCardsDocRouter);

// Also mount without /documents prefix for direct service routing
app.route("/report-card", reportCardsDocRouter);
app.route("/broadsheet", broadsheetsDocRouter);
app.route("/receipt", receiptsDocRouter);
app.route("/id-card", idCardsDocRouter);
app.route("/id-cards", idCardsDocRouter);

export default {
  fetch: app.fetch,
};

export { app };
