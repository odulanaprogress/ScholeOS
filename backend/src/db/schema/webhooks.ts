import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

/**
 * Webhook Log Table
 * Idempotency guard for Clerk, Paystack, Flutterwave, and other third-party webhooks.
 * The unique constraint on event_id guarantees that retried webhooks are ignored immediately.
 */
export const webhookLog = pgTable("webhook_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: varchar("provider", { length: 50 }).notNull(), // 'clerk', 'paystack', 'flutterwave'
  eventId: varchar("event_id", { length: 255 }).notNull().unique(),
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
});
