import {
  pgTable,
  uuid,
  varchar,
  numeric,
  date,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./schools";
import { sessionsTerms, classes } from "./academics";
import { students } from "./users";
import {
  invoiceStatusEnum,
  paymentChannelEnum,
  paymentVerificationStatusEnum,
} from "./enums";

/**
 * Fee Structures Table
 * Configured school fee schedule per term, optionally scoped to a specific class arm.
 */
export const feeStructures = pgTable("fee_structures", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  termId: uuid("term_id")
    .notNull()
    .references(() => sessionsTerms.id, { onDelete: "cascade" }),
  classId: uuid("class_id").references(() => classes.id, {
    onDelete: "cascade",
  }), // null means applies to all classes in the school
  feeType: varchar("fee_type", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  isRecurring: boolean("is_recurring").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Invoices Table
 * Individual fee liability generated for a specific student for a term.
 */
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  termId: uuid("term_id")
    .notNull()
    .references(() => sessionsTerms.id, { onDelete: "cascade" }),
  feeStructureId: uuid("fee_structure_id")
    .notNull()
    .references(() => feeStructures.id, { onDelete: "restrict" }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  status: invoiceStatusEnum("status").default("unpaid").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Payments Table
 * Payment transactions processed online or uploaded as manual bank transfer proofs.
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  channel: paymentChannelEnum("channel").notNull(),
  providerRef: varchar("provider_ref", { length: 255 }),
  proofUrl: text("proof_url"),
  verificationStatus: paymentVerificationStatusEnum("verification_status")
    .default("n_a")
    .notNull(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const feeStructuresRelations = relations(feeStructures, ({ one, many }) => ({
  school: one(schools, {
    fields: [feeStructures.schoolId],
    references: [schools.id],
  }),
  term: one(sessionsTerms, {
    fields: [feeStructures.termId],
    references: [sessionsTerms.id],
  }),
  class: one(classes, {
    fields: [feeStructures.classId],
    references: [classes.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  school: one(schools, {
    fields: [invoices.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [invoices.studentId],
    references: [students.id],
  }),
  term: one(sessionsTerms, {
    fields: [invoices.termId],
    references: [sessionsTerms.id],
  }),
  feeStructure: one(feeStructures, {
    fields: [invoices.feeStructureId],
    references: [feeStructures.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  school: one(schools, {
    fields: [payments.schoolId],
    references: [schools.id],
  }),
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));
