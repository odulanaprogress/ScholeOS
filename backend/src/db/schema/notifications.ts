import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";

/**
 * Notifications Table
 * Asynchronous delivery log for SMS, WhatsApp, and in-app communications.
 * Records status, provider reference IDs, and acts as an audit trail and cost tracking proxy.
 */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 20 }).notNull(), // 'sms', 'whatsapp', 'in_app'
  recipientType: varchar("recipient_type", { length: 20 }).notNull(), // 'parent', 'staff', 'student'
  recipientId: uuid("recipient_id").notNull(),
  templateKey: varchar("template_key", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'queued', 'sent', 'failed'
  providerRef: varchar("provider_ref", { length: 255 }),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  school: one(schools, {
    fields: [notifications.schoolId],
    references: [schools.id],
  }),
}));
