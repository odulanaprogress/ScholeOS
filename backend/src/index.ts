import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./config/env";
import { db } from "./db/index";
import { sql } from "drizzle-orm";
import { app as identityApp } from "./services/identity/index";
import { app as academicApp } from "./services/academic/index";
import { app as feesApp } from "./services/fees/index";
import { app as notificationApp } from "./services/notification/index";
import { app as documentApp } from "./services/document/index";
import { app as licensingApp } from "./services/licensing/index";
import { app as aiApp } from "./services/ai/index";

const app = new Hono();

// Global CORS
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
      "x-internal-service-secret",
      "x-platform-super-admin-key",
      "svix-id",
      "svix-timestamp",
      "svix-signature",
    ],
  })
);

// Unified System Health Check & Database Live Probe
app.get("/health", async (c) => {
  try {
    const [dbResult] = await db.execute(sql`SELECT NOW() as db_time, current_database() as db_name, version() as version`);
    return c.json({
      status: "ok",
      service: "scholeos-backend-engine",
      environment: env.NODE_ENV,
      port: env.PORT,
      database: {
        status: "connected",
        provider: "Supabase PostgreSQL",
        database: (dbResult as any).db_name,
        dbTime: (dbResult as any).db_time,
      },
      microservices: [
        "identity-service",
        "academic-service",
        "fees-service",
        "notification-service",
        "document-service",
        "licensing-service",
        "ai-service",
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return c.json(
      {
        status: "degraded",
        service: "scholeos-backend-engine",
        database: {
          status: "error",
          message: err.message,
        },
      },
      500
    );
  }
});

// Mount Namespaced Microservice Gateways
app.route("/api/identity", identityApp);
app.route("/api/academic", academicApp);
app.route("/api/fees", feesApp);
app.route("/api/notification", notificationApp);
app.route("/api/document", documentApp);
app.route("/api/licensing", licensingApp);
app.route("/api/ai", aiApp);

// Mount Direct Service Routes for Root Dispatching
app.route("/", identityApp);
app.route("/", academicApp);
app.route("/", feesApp);
app.route("/", notificationApp);
app.route("/", documentApp);
app.route("/", licensingApp);
app.route("/", aiApp);

console.log("==========================================");
console.log("       ScholeOS Backend Engine");
console.log("==========================================");
console.log(`Environment : ${env.NODE_ENV}`);
console.log(`Port        : ${env.PORT}`);
console.log("Database    : Connected to Supabase");
console.log("==========================================");

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 ScholeOS Backend listening on http://localhost:${info.port}`);
    console.log(`🩺 Health probe available at http://localhost:${info.port}/health`);
  }
);

export default app;
