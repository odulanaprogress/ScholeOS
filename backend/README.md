# ScholeOS Backend — Wave 1: Database Schema (Postgres) + Clerk Auth Setup

Welcome to the backend engine for **ScholeOS**, a multi-tenant school operating system and unified management platform.

---

## 🏗️ Wave 1 Architectural Overview

Wave 1 establishes the foundational data layer and authentication framework:
1. **Multi-Tenant PostgreSQL Schema (Drizzle ORM):** 16 strongly typed tables enforcing strict tenant isolation via `school_id`.
2. **Clerk Organization-Based Auth Architecture:**
   - One Clerk Organization per school.
   - Staff (Admins, Class Teachers, Subject Teachers) belong to the school's Clerk Organization with multi-role support.
   - Parents and Students are standard Clerk Users (NOT Organization members) linked to the school via `school_id` and metadata, keeping Clerk costs minimal and preventing permission bleed.
3. **Automated Migration & Seeding Tooling:** Seamless migration generation via Drizzle Kit, with programmatic migration runner and demo seed script for immediate testing.

---

## 🗄️ Database Tables Reference

| Table | Multi-Tenant Key | Description |
| :--- | :--- | :--- |
| `schools` | `id` (PK) | Educational institution profile, Clerk Org ID, brand settings, subdomain |
| `school_licenses` | `school_id` (FK) | SaaS plan (`basic`, `premium`, `unlimited`), status, trial dates, student limits |
| `sessions_terms` | `school_id` (FK) | Academic sessions and terms (e.g., 2025/2026 First Term) |
| `assessment_components` | `school_id` (FK) | Continuous assessment formula breakdown (weights summing to 100%) |
| `classes` | `school_id` (FK) | Classes/arms (e.g., JSS 1A, SS 1 Science) |
| `subjects` | `school_id` (FK) | Academic curriculum subjects (e.g., Mathematics, English Language) |
| `staff` | `school_id` (FK) | School staff members linked to Clerk Users and multi-role array |
| `guardians` | `school_id` (FK) | Parents and guardians |
| `students` | `school_id` (FK) | Enrolled students linked to a class and optional guardian |
| `guardian_students` | Join Table | Sibling-account mapping (one guardian oversees multiple students) |
| `assignments` | `school_id` (FK) | **Permission backbone:** Maps staff to classes, subjects, and terms |
| `fee_structures` | `school_id` (FK) | Fee schedules per term, optionally scoped to specific class arms |
| `invoices` | `school_id` (FK) | Fee liabilities generated per student with payment progress |
| `payments` | `school_id` (FK) | Transactions (Paystack, Flutterwave, Bank Transfer proofs) |
| `announcements` | `school_id` (FK) | Multi-channel broadcast messages (In-App, SMS, WhatsApp) |
| `webhook_log` | Global | Idempotency guard table for Clerk and payment processor webhooks |

> 🔒 **Critical Tenancy Rule:** Every single school-specific table explicitly has `school_id (UUID NOT NULL REFERENCES schools(id))`. In addition, tables like `assignments`, `invoices`, and `payments` include direct `school_id` foreign keys to ensure tenant boundaries cannot be crossed.

---

## 🔐 Clerk Authentication & Organizations Architecture

### Pricing & Scalability Analysis
- Under Clerk's **Core 3 pricing**, the Free Tier includes:
  - **100 Monthly Retained Organizations (MROs)**
  - **20 members per organization**
  - **50,000 Monthly Retained Users (MRUs)**
- **Staff (Admins & Teachers):** Added as members of the school's Clerk Organization (`org:admin` or `org:member`). Because schools typically employ 10–25 staff members, this cleanly fits within the included limits.
- **Parents and Students:** Created as standard Clerk users with metadata (`userType: 'guardian' | 'student'`, `schoolId: '...'`). They are **NOT** added to the school's Clerk Organization. This ensures:
  1. No consumption of organization member seats by hundreds or thousands of students/parents.
  2. Absolute security isolation (parents/students cannot inherit any organization-level admin or teacher permissions).

### Multi-Role Support
A staff member can hold multiple roles simultaneously (e.g., Mr. Adeyemi is both a **Class Teacher** for JSS 1A and a **Subject Teacher** for Mathematics).
- Stored as `roles: text[]` in the Postgres `staff` table.
- Mirrored into Clerk `user.publicMetadata.roles = ['class_teacher', 'subject_teacher']` for instant JWT claim resolution.
- Enforced server-side via the `assignments` table before any score or attendance write.

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your database connection string:
```bash
cp .env.example .env
```
For Neon / Supabase:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/[DATABASE]?sslmode=require"
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_WEBHOOK_SIGNING_SECRET="whsec_..."
```

### 3. Generate SQL Migrations
Generate clean SQL migration files from the Drizzle ORM schema:
```bash
npm run db:generate
```

### 4. Run Migrations
Apply the migrations to your PostgreSQL database:
```bash
npm run db:migrate
```
*(Or use `npm run db:push` for instant prototyping).*

### 5. Seed Demo Data
Populate your database with the complete demo school dataset (Apex International College, classes, subjects, dual-role staff, sibling students, invoices, and payments):
```bash
npm run db:seed
```

### 6. Explore via Drizzle Studio
Launch the visual database browser:
```bash
npm run db:studio
```
