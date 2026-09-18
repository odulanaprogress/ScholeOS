import { pgTable, uuid, varchar, text, date, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { staff } from "./users";
import { reopenRequestStatusEnum } from "./enums";

/**
 * Sessions & Terms Table
 * Represents an academic period (e.g., "2025/2026 - First Term").
 */
export const sessionsTerms = pgTable("sessions_terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isCurrent: boolean("is_current").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Assessment Components Table
 * Configurable breakdown of grading scheme (e.g. 1st CA: 20%, Midterm: 20%, Exam: 60%).
 * Note: term_id is NULL for session/school-wide default schemes, or non-null for term-specific overrides.
 */
export const assessmentComponents = pgTable("assessment_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  termId: uuid("term_id").references(() => sessionsTerms.id, {
    onDelete: "cascade",
  }),
  componentName: varchar("component_name", { length: 100 }).notNull(),
  weight: integer("weight").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Classes Table
 * School cohorts/arms (e.g. JSS1A, JSS2B, SS3 Science).
 */
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Subjects Table
 * Academic subjects taught in the school (e.g. Mathematics, English Language, Physics).
 */
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const sessionsTermsRelations = relations(sessionsTerms, ({ one, many }) => ({
  school: one(schools, {
    fields: [sessionsTerms.schoolId],
    references: [schools.id],
  }),
  assessmentComponents: many(assessmentComponents),
}));

export const assessmentComponentsRelations = relations(assessmentComponents, ({ one }) => ({
  school: one(schools, {
    fields: [assessmentComponents.schoolId],
    references: [schools.id],
  }),
  term: one(sessionsTerms, {
    fields: [assessmentComponents.termId],
    references: [sessionsTerms.id],
  }),
}));

export const classesRelations = relations(classes, ({ one }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ one }) => ({
  school: one(schools, {
    fields: [subjects.schoolId],
    references: [schools.id],
  }),
}));

/**
 * Reopen Requests Table (Wave 4)
 * Allows subject teachers to request score re-opening for submitted or locked score sheets.
 * Must be approved by the assigned class teacher or school administrator.
 */
export const reopenRequests = pgTable("reopen_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  termId: uuid("term_id")
    .notNull()
    .references(() => sessionsTerms.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  status: reopenRequestStatusEnum("status").default("pending").notNull(),
  reviewedByStaffId: uuid("reviewed_by_staff_id").references(() => staff.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reopenRequestsRelations = relations(reopenRequests, ({ one }) => ({
  school: one(schools, {
    fields: [reopenRequests.schoolId],
    references: [schools.id],
  }),
  requester: one(staff, {
    fields: [reopenRequests.staffId],
    references: [staff.id],
  }),
  class: one(classes, {
    fields: [reopenRequests.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [reopenRequests.subjectId],
    references: [subjects.id],
  }),
  term: one(sessionsTerms, {
    fields: [reopenRequests.termId],
    references: [sessionsTerms.id],
  }),
  reviewer: one(staff, {
    fields: [reopenRequests.reviewedByStaffId],
    references: [staff.id],
  }),
}));

