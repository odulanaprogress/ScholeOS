import { pgTable, uuid, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { licensePlanEnum, licenseStatusEnum } from "./enums";

/**
 * Schools Table
 * Multi-tenant root entity representing an educational institution.
 * Mapped 1-to-1 to a Clerk Organization.
 */
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: varchar("clerk_org_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 50 }).notNull(),
  address: text("address"),
  brandColor: varchar("brand_color", { length: 7 }).default("#4338CA").notNull(),
  logoUrl: text("logo_url"),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  feeGatedReportRelease: boolean("fee_gated_report_release").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * School Licenses Table
 * Manages SaaS subscriptions, trial periods, student limits, and status transitions.
 */
export const schoolLicenses = pgTable("school_licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  plan: licensePlanEnum("plan").default("trial").notNull(),
  status: licenseStatusEnum("status").default("trial").notNull(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  gracePeriodEndsAt: timestamp("grace_period_ends_at", { withTimezone: true }),
  renewalDate: timestamp("renewal_date", { withTimezone: true }),
  studentCountLimit: integer("student_count_limit").default(100),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const schoolsRelations = relations(schools, ({ one, many }) => ({
  license: one(schoolLicenses, {
    fields: [schools.id],
    references: [schoolLicenses.schoolId],
  }),
}));

export const schoolLicensesRelations = relations(schoolLicenses, ({ one }) => ({
  school: one(schools, {
    fields: [schoolLicenses.schoolId],
    references: [schools.id],
  }),
}));
