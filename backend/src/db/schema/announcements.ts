import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { staff } from "./users";
import { announcementStatusEnum } from "./enums";

export type AnnouncementAudience =
  | { scope: "everyone" }
  | { scope: "parents" }
  | { scope: "students" }
  | { scope: "staff" }
  | { scope: "classes"; classIds: string[] };

export type AnnouncementChannel = "in_app" | "sms" | "whatsapp";

/**
 * Announcements Table
 * Broadcast communications scheduled or dispatched across multi-channel targets.
 */
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  audience: jsonb("audience").$type<AnnouncementAudience>().notNull(),
  channels: jsonb("channels").$type<AnnouncementChannel[]>().notNull(),
  status: announcementStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdByStaffId: uuid("created_by_staff_id")
    .notNull()
    .references(() => staff.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const announcementsRelations = relations(announcements, ({ one }) => ({
  school: one(schools, {
    fields: [announcements.schoolId],
    references: [schools.id],
  }),
  createdByStaff: one(staff, {
    fields: [announcements.createdByStaffId],
    references: [staff.id],
  }),
}));
