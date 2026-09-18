/**
 * ScholeOS Fees Service — Cloudflare Worker Entrypoint (Wave 5)
 *
 * Microservice managing fee schedules, student invoices, Paystack & Flutterwave webhooks
 * with idempotency guards, bank-transfer proof uploads with Cloudinary storage, and arrears reporting.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { feeStructuresRouter } from "./routes/fee-structures";
import { invoicesRouter } from "./routes/invoices";
import { paymentsRouter } from "./routes/payments";
import { arrearsRouter } from "./routes/arrears";
import { licenseMiddleware } from "../licensing/middleware";

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
      "x-paystack-signature",
      "verif-hash",
      "x-test-user-id",
      "x-test-org-id",
      "x-school-id",
    ],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  })
);

// Public Health Check
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    service: "fees-service",
    wave: 5,
    timestamp: new Date().toISOString(),
  });
});

// Shared License Verification Middleware
app.use("*", licenseMiddleware);

// Mount Routes
app.route("/fee-structures", feeStructuresRouter);
app.route("/invoices", invoicesRouter);
app.route("/payments", paymentsRouter);
app.route("/arrears", arrearsRouter);

export default {
  fetch: app.fetch,
};

export { app };
