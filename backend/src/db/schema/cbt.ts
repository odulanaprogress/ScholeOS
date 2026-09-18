import { pgTable, uuid, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { classes, subjects, sessionsTerms } from "./academics";
import { staff, students } from "./users";
import { cbtTestStatusEnum, cbtSubmissionStatusEnum } from "./enums";

export { cbtTestStatusEnum, cbtSubmissionStatusEnum };

/**
 * CBT Tests Table (Wave 10)
 *
 * Defines scheduled, live, or completed Computer-Based Tests created by subject teachers.
 */
export const cbtTests = pgTable("cbt_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  termId: uuid("term_id")
    .notNull()
    .references(() => sessionsTerms.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: cbtTestStatusEnum("status").default("draft").notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  createdByStaffId: uuid("created_by_staff_id").references(() => staff.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * CBT Questions Table (Wave 10)
 *
 * Multiple choice question bank linked to a test.
 * Note: correct_option_index is stored server-side and must NEVER be exposed
 * to the student before/during test execution.
 */
export const cbtQuestions = pgTable("cbt_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => cbtTests.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  options: jsonb("options").$type<string[]>().notNull(),
  correctOptionIndex: integer("correct_option_index").notNull(), // 0, 1, 2, 3
  points: integer("points").default(1).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * CBT Submissions Table (Wave 10)
 *
 * Tracks individual student test sessions, incremental answer selections,
 * duration taken, and final server-computed score.
 */
export const cbtSubmissions = pgTable("cbt_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => cbtTests.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Record<string, number>>().default({}).notNull(), // questionId -> selectedOptionIndex
  score: integer("score"), // computed server-side upon submit
  timeTakenSeconds: integer("time_taken_seconds"),
  status: cbtSubmissionStatusEnum("status").default("not_started").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const cbtTestsRelations = relations(cbtTests, ({ one, many }) => ({
  school: one(schools, {
    fields: [cbtTests.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [cbtTests.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [cbtTests.subjectId],
    references: [subjects.id],
  }),
  term: one(sessionsTerms, {
    fields: [cbtTests.termId],
    references: [sessionsTerms.id],
  }),
  createdByStaff: one(staff, {
    fields: [cbtTests.createdByStaffId],
    references: [staff.id],
  }),
  questions: many(cbtQuestions),
  submissions: many(cbtSubmissions),
}));

export const cbtQuestionsRelations = relations(cbtQuestions, ({ one }) => ({
  test: one(cbtTests, {
    fields: [cbtQuestions.testId],
    references: [cbtTests.id],
  }),
}));

export const cbtSubmissionsRelations = relations(cbtSubmissions, ({ one }) => ({
  test: one(cbtTests, {
    fields: [cbtSubmissions.testId],
    references: [cbtTests.id],
  }),
  student: one(students, {
    fields: [cbtSubmissions.studentId],
    references: [students.id],
  }),
}));
