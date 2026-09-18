import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { schools } from "./schools";
import { aiUsageEndpointEnum } from "./enums";

export { aiUsageEndpointEnum };

/**
 * AI Usage Log Table (Wave 9)
 *
 * Tracks token consumption and costs across all AI endpoints:
 * - Admin Copilot Chat
 * - Report Card Comment Generator
 * - Student Socratic AI Tutor
 *
 * Essential for billing visibility, rate limiting, and cost attribution.
 */
export const aiUsageLogs = pgTable("ai_usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }),
  endpoint: aiUsageEndpointEnum("endpoint").notNull(), // 'admin_chat' | 'report_card_comment' | 'student_tutor'
  model: varchar("model", { length: 100 }).notNull(), // e.g. 'claude-3-5-sonnet-20241022'
  promptTokens: integer("prompt_tokens").notNull(),
  completionTokens: integer("completion_tokens").notNull(),
  totalTokens: integer("total_tokens").notNull(),
  estimatedCostUsd: varchar("estimated_cost_usd", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
