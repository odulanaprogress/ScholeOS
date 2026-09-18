import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { classes } from "./academics";
import { staffStatusEnum } from "./enums";

/**
 * Staff Table
 * School employees (administrators, subject teachers, class teachers).
 * Linked to a Clerk Organization member via clerk_user_id.
 */
export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  status: staffStatusEnum("status").default("active").notNull(),
  roles: text("roles")
    .array()
    .notNull()
    .$defaultFn(() => []),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Guardians Table
 * Parents or sponsors of students.
 * Standalone Clerk users (NOT members of the school Clerk Org).
 */
export const guardians = pgTable("guardians", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Students Table
 * Enrolled students within a school cohort.
 */
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "restrict" }),
  guardianId: uuid("guardian_id").references(() => guardians.id, {
    onDelete: "set null",
  }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  admissionNumber: varchar("admission_number", { length: 50 }).notNull(),
  dateOfBirth: date("date_of_birth"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Guardian Students Join Table
 * Handles multi-child / sibling relationships where one guardian oversees multiple students.
 */
export const guardianStudents = pgTable(
  "guardian_students",
  {
    guardianId: uuid("guardian_id")
      .notNull()
      .references(() => guardians.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.guardianId, table.studentId] }),
  ]
);

// Relations
export const staffRelations = relations(staff, ({ one }) => ({
  school: one(schools, {
    fields: [staff.schoolId],
    references: [schools.id],
  }),
}));

export const guardiansRelations = relations(guardians, ({ one, many }) => ({
  school: one(schools, {
    fields: [guardians.schoolId],
    references: [schools.id],
  }),
  guardianStudents: many(guardianStudents),
  primaryStudents: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  guardian: one(guardians, {
    fields: [students.guardianId],
    references: [guardians.id],
  }),
  guardianLinks: many(guardianStudents),
}));

export const guardianStudentsRelations = relations(guardianStudents, ({ one }) => ({
  guardian: one(guardians, {
    fields: [guardianStudents.guardianId],
    references: [guardians.id],
  }),
  student: one(students, {
    fields: [guardianStudents.studentId],
    references: [students.id],
  }),
}));
