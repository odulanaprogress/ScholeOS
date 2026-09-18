import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { staff } from "./users";
import { classes, subjects, sessionsTerms } from "./academics";
import { assignmentRoleEnum, assignmentStatusEnum } from "./enums";

/**
 * Assignments Table
 * The authorization backbone for academic score entry and attendance.
 * Every academic write operation must verify an active assignment matching:
 * (staff_id, class_id, [subject_id], term_id, school_id).
 */
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id").references(() => subjects.id, {
    onDelete: "cascade",
  }), // null for a pure class_teacher-only assignment
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  termId: uuid("term_id")
    .notNull()
    .references(() => sessionsTerms.id, { onDelete: "cascade" }),
  role: assignmentRoleEnum("role").notNull(),
  status: assignmentStatusEnum("status").default("active").notNull(),
  needsReassignment: boolean("needs_reassignment").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const assignmentsRelations = relations(assignments, ({ one }) => ({
  school: one(schools, {
    fields: [assignments.schoolId],
    references: [schools.id],
  }),
  staff: one(staff, {
    fields: [assignments.staffId],
    references: [staff.id],
  }),
  subject: one(subjects, {
    fields: [assignments.subjectId],
    references: [subjects.id],
  }),
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  term: one(sessionsTerms, {
    fields: [assignments.termId],
    references: [sessionsTerms.id],
  }),
}));
