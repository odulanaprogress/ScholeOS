import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";

/**
 * Generated Documents Table (Wave 7)
 * Caches generated PDF URLs in Cloudinary to avoid redundant browser renders.
 * Locked/published report cards and cleared payment receipts are immutable and never re-rendered.
 */
export const generatedDocuments = pgTable("generated_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // 'report_card' | 'broadsheet' | 'receipt' | 'id_card' | 'id_card_batch'
  referenceId: varchar("reference_id", { length: 255 }).notNull(), // e.g. `${studentId}_${termId}`, `${classId}_${termId}`, or `paymentId`
  cloudinaryUrl: text("cloudinary_url").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  school: one(schools, {
    fields: [generatedDocuments.schoolId],
    references: [schools.id],
  }),
}));
