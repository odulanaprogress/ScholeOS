# 🎓 ScholeOS — Beta Testing & Quality Assurance Guide

> **ScholeOS Multi-Tenant School Management Platform**  
> Comprehensive Operating System for Modern School Administration, Continuous Assessment, Broadsheets, Fee Reconciliation, CBT Examination, and AI-Assisted Pedagogy.

---

## 📌 Executive Summary

This guide provides instructions and pre-seeded test data for **Beta Testers**, **School Administrators**, **Teachers**, **QA Engineers**, and **Product Reviewers** evaluating ScholeOS.

ScholeOS provides complete end-to-end functionality across both backend and frontend layers:
- **8 Backend Microservices**: `identity-service`, `academic-service`, `fees-service`, `notification-service`, `document-service`, `licensing-service`, `ai-service`, and `cbt-service` (416 automated integration tests passing at 100%).
- **6 Integrated User Portals**: School Administrator, Subject Teacher, Class Teacher, Parent Portal, Student Portal, and Platform Super Admin.
- **Real-Time Telemetry & Fail-Safe Protection**: Live event bus, offline demo fallbacks, and resilient `<ErrorBoundary>` wrappers.

---

## 🚀 1. Quickstart: Launching the Platform

### Prerequisites
- Node.js 18 or higher (`node -v`)
- npm or pnpm

### Starting the Services

Open two terminal windows:

#### Terminal 1 — Backend Engine
```bash
npm run dev:backend
```
- **Service Address:** `http://localhost:4000`
- **Health Check Probe:** `http://localhost:4000/health` (inspect live Supabase PostgreSQL connection & active microservices)

#### Terminal 2 — Frontend Application
```bash
npm run dev:frontend
```
- **Application URL:** `http://localhost:5173`
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 2. Automated Test Verification & Quality Gates

Run the automated test suites from the root directory to verify system integrity:

```bash
# 1. Run all 416 automated backend microservice tests
npm test

# 2. Run TypeScript strict typecheck & Vite production build
npm run typecheck

# 3. Complete CI pipeline check (Typecheck + Tests)
npm run check
```

### Verified Test Suites Breakdown:
| Microservice / Module | Test Command | Tests | Status |
| :--- | :--- | :---: | :---: |
| **Identity Service** | `npm --prefix backend run test:identity` | 24 | ✅ 100% Pass |
| **Academic Service** | `npm --prefix backend run test:academic` | 34 | ✅ 100% Pass |
| **Fees Service** | `npm --prefix backend run test:fees` | 46 | ✅ 100% Pass |
| **Notification Service** | `npm --prefix backend run test:notification` | 34 | ✅ 100% Pass |
| **Document Service** | `npm --prefix backend run test:document` | 46 | ✅ 100% Pass |
| **Licensing Service** | `npm --prefix backend run test:licensing` | 50 | ✅ 100% Pass |
| **AI Service (Copilot & Tutor)**| `npm --prefix backend run test:ai` | 86 | ✅ 100% Pass |
| **CBT Examination Module** | `npm --prefix backend run test:cbt` | 96 | ✅ 100% Pass |
| **Total Automated Tests** | `npm test` | **416** | **✅ 100% Pass** |

---

## 👥 3. Pre-Seeded Beta Testing Personas

On the **Login Page** (`http://localhost:5173` -> Click **Sign In**), click any of the **Quick Launch Role** buttons to instantly sign in with pre-seeded data without typing credentials:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           QUICK LAUNCH ROLE BUTTONS                            │
├───────────────────────┬────────────────────────┬───────────────────────────────┤
│ 🛡️ Principal / Admin  │ 👨‍🏫 Subject Teacher    │ 📋 Class Teacher              │
├───────────────────────┼────────────────────────┼───────────────────────────────┤
│ 👪 Parent Portal      │ 🎓 Student Portal      │ ⚡ Super Admin                │
└───────────────────────┴────────────────────────┴───────────────────────────────┘
```

Alternatively, use the **Persistent Floating Review Bar** pinned at the bottom-right of the screen to jump directly to any persona or page during interactive testing.

---

## 📋 4. Key Workflows to Test

### Workflow A: School Setup & Onboarding Wizard
- **How to test:** On the Landing Page, click **Get Started** or click **Wizard** in the bottom switcher.
- **What to verify:**
  1. Complete the 5-step interactive wizard (School Identity, Grade Levels, Continuous Assessment Formula, Logo Branding, Plan Selection).
  2. Test the **Continuous Assessment Weight Calculator** — ensure total sums to exactly 100%.
  3. Observe live branding preview updating in real-time as colors and school details change.

### Workflow B: Principal / Administrator Command Center
- **How to test:** Click **Principal / Admin** (`principal@apexcollege.ng`).
- **What to verify:**
  1. **Overview:** View institutional metrics, submission progress bars, and recent activity feed.
  2. **Staff Directory:** View teachers, assign class arms and subjects, or invite new staff.
  3. **Fees & Payments:** Review collection metrics, filter outstanding student arrears, test **Send Reminder** SMS triggers, and review pending bank transfer receipts.
  4. **AI Copilot:** Ask questions about student debtors, submission deadlines, or attendance trends.
  5. **Announcements:** Compose a multi-channel broadcast (In-App, SMS, WhatsApp) with target audience filters.
  6. **Settings:** Customize school branding swatches, term dates, and grading scales.

### Workflow C: Subject Teacher Score Entry & CBT Builder
- **How to test:** Click **Subject Teacher** (`adeyemi@apexcollege.ng`).
- **What to verify:**
  1. **Score Entry:** Select class `JSS 2A` -> `Mathematics`. Enter Continuous Assessment scores (e.g. 1st CA /20, Mid-Term /20, Exam /60).
  2. Observe the automatic **WAEC Grade Calculation** (A1, B2, C4, etc.) and cumulative total computing live.
  3. **CBT Builder:** Navigate to **Tests (CBT)** -> Click **Create New Assessment**. Add multiple-choice questions, set points and duration, and publish the test.

### Workflow D: Class Teacher Broadsheet & Attendance Register
- **How to test:** Click **Class Teacher** (`babatunde@apexcollege.ng`).
- **What to verify:**
  1. **Attendance Register:** Mark students as **Present**, **Absent**, or **Late** for today's roll call.
  2. **Submission Tracker:** Track which subject teachers have submitted or have drafts pending. Click **Send Reminder**.
  3. **Master Broadsheet:** Inspect the comprehensive class broadsheet with sticky student names, subject totals, and calculated **1224 Standard Competition Ranking** positions (1st, 2nd, 3rd, etc.).
  4. **Report Card Modal:** Click on a student to inspect their individual report card, customize the qualitative teacher remark, or test **AI Remark Generation**.

### Workflow E: Parent Portal & Fee Payment
- **How to test:** Click **Parent Portal** (`mrs.obi@gmail.com`).
- **What to verify:**
  1. **Multi-Child Switcher:** Toggle between enrolled children (e.g. Chinedu Okeke in JSS 2A vs. Amaka Okeke in SSS 1).
  2. **Results:** View official published report cards with letter grades and class position rankings.
  3. **Fees:** View invoice balance, test simulation card payment, or test uploading a bank payment transfer receipt.

### Workflow F: Student Portal, CBT Exam & AI Tutor
- **How to test:** Click **Student Portal** (`somtochukwu@apexcollege.ng`).
- **What to verify:**
  1. **CBT Examination Room:** Open **Tests (CBT)** -> Click **Start Test**.
     - Notice the full-screen distraction-free examination view.
     - Live countdown timer with amber/red time warnings.
     - **Security Invariant:** Answer keys are stripped from the client payload for test security.
     - Click **Submit Assessment** -> Server-side auto-grading evaluates answers and presents an instant graded breakdown.
  2. **AI Tutor:** Navigate to **AI Tutor** -> Select Subject (e.g. Mathematics or Literature).
     - Ask: *"How do I solve 3x + 7 = 22?"* -> Observe Socratic step-by-step guidance rather than handing over direct answers.
     - Verify child-safe guardrails and age-appropriate pedagogy.

### Workflow G: Platform Super Admin Dashboard
- **How to test:** Click **Super Admin** (`superadmin@scholeos.ng`).
- **What to verify:**
  1. Cross-school institutional metrics (Total Schools, Active Subscriptions, Platform MRR).
  2. Schools Directory with plan status (Trial, Basic, Premium).
  3. Test manual school onboarding, plan upgrades, and safety suspension/reactivation actions.

---

## 🛡️ 5. Security & Multi-Tenant Invariants

The platform enforces the following security invariants across all requests:
1. **Tenant Isolation:** Every database entity is partitioned by `school_id`. No cross-tenant data leakage is permitted.
2. **License Guard Middleware:** Zero-network-hop middleware blocks write operations if a school's license is suspended or in arrears.
3. **CBT Answer Key Protection:** Server strictly strips `correctOptionIndex` before transmitting question banks to students.
4. **App Check & Rate Limiting:** All real-time Firestore listeners and worker endpoints enforce authentication headers and App Check tokens.
5. **Resilient Error Boundaries:** Any localized UI error is isolated to its component, preventing total application crashes.

---

## 💬 6. Feedback & Issue Reporting

During beta testing, if you encounter any unexpected behavior, layout anomalies, or feature suggestions:
1. Note the current URL and the Persona role you were testing.
2. Open the browser Developer Console (`F12`) to check for diagnostic logs.
3. Check the backend log in Terminal 1 or query the `/health` endpoint.
4. Share feedback with the ScholeOS engineering team for rapid remediation.

---
*ScholeOS Engineering — Ready for Beta Testing.*
