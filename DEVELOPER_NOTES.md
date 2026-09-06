# ScholeOS — Engineering Handbook & Developer Notes

> **Platform:** ScholeOS — Modern Operating System & Management Platform for Schools  
> **Status:** ✅ Wave 1, Wave 2 & Wave 3 COMPLETE · Ready for Wave 4 (Admin Dashboard Shell)  
> **Last Updated:** September 2026  
> **Lead Architect:** Senior Frontend Engineer

---

## 1. Project Roadmap & Wave Tracker

ScholeOS is constructed in sequential, self-contained **Waves**. Each wave establishes a stable, production-grade layer before the next is layered on top.

| Wave | Milestone | Scope / Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Wave 1** | **Foundation & Design System** | Token architecture, Tailwind config, core UI components (Button, Card, Input, IconBadge, Badge, Navbar, Footer), interactive Style Guide | 🟢 **COMPLETED** |
| **Wave 2** | **Public Landing Page** | High-converting marketing homepage, hero, features, testimonials, pricing, mobile nav, stats bar, FAQ accordion, demo booking modal | 🟢 **COMPLETED** |
| **Wave 3** | **Auth & School Onboarding** | Login screen, multi-step school setup wizard, Stepper component, dynamic grading formula builder, logo & branding live preview | 🟢 **COMPLETED** |
| **Wave 4** | **Admin Dashboard Shell** | Master layout, sidebar, quick stats, school metrics, user directory, announcements | ⚪ Next Up |
| **Wave 5** | **Subject Teacher Dashboard** | Gradebook, score entry grid, continuous assessment (CA), bulk uploads, audit trails | ⚪ Queued |
| **Wave 6** | **Class Teacher Dashboard** | Daily attendance tracker, submission monitor, broadsheet generation, term report cards | ⚪ Queued |
| **Wave 7** | **Parent & Student Views** | Progress tracking, timetable, homework submissions, report card download, notifications | ⚪ Queued |
| **Wave 8** | **Fees & Payments UI** | Invoicing, payment gateway integration (cards/transfers), payment history, receipts | ⚪ Queued |
| **Wave 9** | **AI Assistant Panels** | Administrative automation copilot, student learning tutor, analytics insights | ⚪ Queued |

---

## 2. Design System Tokens & Foundations

Every UI screen in ScholeOS strictly follows these design tokens.

### Color Palette
- **Base Background:** `#FBF0E1` (Warm Cream) — Soft, approachable, reduces eye strain compared to harsh whites.
- **Surface / Cards:** `#FFFFFF` (Pure White) — Elevated card surfaces on top of the cream background.
- **Primary Brand Accent:** `#4338CA` (Indigo) — Primary buttons, active navigation states, prominent headings, focus rings.
- **Secondary Brand Accent:** `#D4A017` (Warm Gold) — Icon badges, star highlights, featured indicators, decorative accents.
- **Dark Surface:** `#1E1B1A` (Charcoal) — Footer, stats bar, high-contrast dark sections.
- **Text Primary:** `#1E1B1A` (Near Black) for high contrast and readability.
- **Text Muted:** `#6B7280` (Cool Gray) for secondary labels, helper descriptions, and placeholders.
- **Status Accents:**
  - Success: `#059669` (Emerald Green)
  - Warning: `#D97706` (Amber)
  - Danger: `#DC2626` (Crimson Red)
  - Neutral: `#64748B` (Slate Gray)

### Typography
- **Headings (`font-display`):** Google Fonts **Poppins** (`600`, `700`, `800`, `900`) — Bold, rounded, friendly yet authoritative sans-serif with tight line-height.
- **Body Text (`font-sans`):** Google Fonts **Inter** (`400`, `500`, `600`, `700`) — Highly legible, neutral workhorse sans-serif.

---

## 3. Component Library API & Architecture (`frontend/src/components/`)

### Core UI Library (`ui/`)
- **`Button`**: Fully pill-shaped (`rounded-full`), primary (solid indigo), secondary (outline indigo), icon button, and ghost variants.
- **`Card`**: Elevated white surface container with `rounded-2xl` corners, soft drop shadow (`schole-card-shadow`), and compound composition.
- **`Input`**: Clean white background, thin border, icon prefix support, focus ring (`#4338CA`), and validation error state.
- **`IconBadge`**: Small square container (`rounded-xl`) with solid warm gold fill (`#D4A017`) and centered white line icons.
- **`Badge`**: Status label pills (`success`, `warning`, `danger`, `neutral`, `primary`, `gold`) with animated pulse dot option.
- **`Accordion`**: Compound accordion primitives (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) with smooth chevron rotation and height transitions.
- **`Stepper` (New in Wave 3)**:
  - Horizontal progress indicator showing numbered / labeled steps.
  - Highlights current step in primary indigo `#4338CA`.
  - Completed steps render crisp checkmark icons.
  - Mobile responsive: collapses to "Step X of 5" with a clean progress bar.
- **`Navbar`**: Responsive header with logo + gold badge, navigation links (*About, Features, Pricing, FAQ*), "Log In" secondary button, "Book a Demo" primary button, and mobile hamburger drawer.
- **`Footer`**: Dark charcoal (`#1E1B1A`) footer with 4 columns (*About, Features, Support, Legal*) and exact copyright notice.

---

## 4. Wave 3 Implementation: Authentication & School Onboarding Wizard

### Part A — Login Page (`pages/LoginPage.tsx`)
- Centered white `Card` (`max-w-[420px]`) on warm cream background.
- Heading *"Welcome back"* and subtext *"Log in to manage your school on ScholeOS."*.
- Email input with envelope icon prefix and format validation.
- Password input with lock icon prefix and visibility reveal toggle (`Eye` / `EyeOff`).
- Right-aligned *"Forgot password?"* link.
- Full-width primary pill button *"Continue"*.
- Register prompt linking directly to the onboarding wizard.
- Field-level validation displaying red borders and descriptive helper error messages.

### Part B — School Setup Wizard (`pages/OnboardingWizardPage.tsx`)
Multi-step flow powered by the `Stepper` component across 5 steps:
1. **Step 1: School Details**
   - Official School Name (text input)
   - School Short Name / Abbreviation (text input for SMS/documents)
   - Physical Address (text input)
   - Number of Students (approximate select: Under 200, 200-500, 500-1000, 1000+)
2. **Step 2: Branding**
   - School Logo Upload dropzone with live preview
   - Preset accent color swatches (Royal Indigo, Forest Emerald, Deep Navy, Crimson Maroon, Warm Gold, Regal Purple) + custom hex input
   - Live Branding Preview panel showing a mock mini dashboard header with the logo and chosen accent color
3. **Step 3: Classes & Subjects**
   - Repeatable list builder for classes with text input and delete icon button
   - Repeatable list builder for subjects with text input and delete icon button
   - *"Load a starter template"* pre-fills standard Nigerian secondary school structure (JSS 1-3, SSS 1-3 WAEC, core sciences and humanities)
4. **Step 4: Dynamic Scoring System**
   - Headings: *"Set up how your school calculates results"* and subtext explaining 100% weight requirement
   - Repeatable assessment components with name and percentage inputs (pre-filled with editable defaults: Exam 60%, Welcome Back Test 20%, Final Test 20%)
   - Live running total calculator: displays green when total equals exactly 100%, red/amber otherwise
   - Continue button enforced/disabled until weights equal exactly 100%
5. **Step 5: Review & Finish**
   - Read-only summary card of all configuration metrics
   - Final submit action *"Create My School"* triggering celebratory confirmation state

---

## 5. Verification Log

- **[2026-09-06]**: Built `Stepper` component in `components/ui/Stepper/` with responsive mobile collapse.
- **[2026-09-06]**: Built `LoginPage.tsx` with email/password validation and error states.
- **[2026-09-06]**: Built `OnboardingWizardPage.tsx` with 5-step wizard, Nigerian starter templates, live branding preview, and dynamic scoring formula validation.
- **[2026-09-06]**: Updated `App.tsx` with a floating multi-wave switcher for seamless review between Landing, Login, Onboarding Wizard, and Design Tokens.
- **[2026-09-06]**: Ran `tsc -b && vite build` — compilation passed cleanly with **0 errors** in `30.08s`.
- **[2026-09-06]**: Hot Module Replacement updated dev server at `http://127.0.0.1:5173/`.
- **[2026-09-06]**: **Wave 3 is complete and verified! Ready for Wave 4 (Admin Dashboard Shell).**
- **[2026-09-06]**: Git repository initialized, `.gitignore` configured to exclude `node_modules` & `dist`, branch configured to `main`, remote origin linked to `https://github.com/odulanaprogress/ScholeOS.git`, and successfully pushed to GitHub.
