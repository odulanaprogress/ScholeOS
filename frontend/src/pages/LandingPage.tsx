import React, { useState } from 'react'
import {
  Button,
  Card,
  IconBadge,
  Badge,
  Navbar,
  Footer,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui'
import { DashboardMockup } from '@/components/marketing/DashboardMockup'
import { DemoModal } from '@/components/marketing/DemoModal'
import {
  FileSpreadsheet,
  CreditCard,
  CalendarCheck2,
  Bot,
  UserCheck,
  Zap,
  Palette,
  Smartphone,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react'

export interface LandingPageProps {
  onOpenStyleGuide?: () => void
  onNavigateToLogin?: () => void
  onNavigateToOnboarding?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenStyleGuide,
  onNavigateToLogin,
  onNavigateToOnboarding,
}) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-cream-base text-charcoal-dark flex flex-col font-sans selection:bg-indigo-brand selection:text-white">
      {/* 1. NAVBAR */}
      <Navbar
        brandName="ScholeOS"
        tagline="Operating System for Modern Schools"
        navItems={[
          { label: 'About', href: '#about' },
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ]}
        ctaText="Book a Demo"
        secondaryCtaText="Log In"
        onCtaClick={() => setDemoModalOpen(true)}
        onSecondaryCtaClick={onNavigateToLogin}
        onItemClick={(item) => {
          const targetId = item.href.replace('#', '')
          scrollToSection(targetId)
        }}
      />

      {/* Floating Style Guide Access Switcher for Pair-Programming & Developer Review */}
      {onOpenStyleGuide && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            type="button"
            onClick={onOpenStyleGuide}
            className="bg-charcoal-dark/90 hover:bg-charcoal-dark text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/20 flex items-center gap-2 backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Layers className="w-3.5 h-3.5 text-gold-brand" />
            <span>Wave 1 Style Guide</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section id="about" className="relative pt-12 sm:pt-18 pb-16 sm:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Copy Column */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="primary" size="md">
                    First-of-its-Kind in Nigeria
                  </Badge>
                  <Badge variant="gold" size="md">
                    2026/2027 Academic Year Ready
                  </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-charcoal-dark tracking-tight leading-[1.08]">
                  Run Your Entire School From{' '}
                  <span className="text-indigo-brand relative inline-block">
                    One Place.
                    <span className="absolute bottom-1 left-0 w-full h-2.5 bg-gold-brand/20 -z-10 rounded-full" />
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-subtle leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
                  ScholeOS handles results, fees, attendance, and parent communication — so your term-end doesn't have to be chaos.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={onNavigateToOnboarding || (() => setDemoModalOpen(true))}
                    className="w-full sm:w-auto shadow-md"
                  >
                    Start Free Setup
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => scrollToSection('features')}
                    className="w-full sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </div>

                {/* Micro trust indicators */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-subtle font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No complex setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free full-term trial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated Lagos support
                  </span>
                </div>
              </div>

              {/* Right Mockup Column */}
              <div className="lg:col-span-6 w-full">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </section>

        {/* 3. STATS BAR (Dark Charcoal Background) */}
        <section className="bg-charcoal-dark text-white py-14 sm:py-16 border-y border-charcoal-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-charcoal-border/80">
              {/* Stat 1 */}
              <div className="pt-6 md:pt-0 md:px-6 first:pl-0 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-brand" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    3 roles
                  </h3>
                </div>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">
                  Admin, class teacher, subject teacher — each with exactly the view they need
                </p>
              </div>

              {/* Stat 2 */}
              <div className="pt-6 md:pt-0 md:px-6 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-border" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    Real-time results
                  </h3>
                </div>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">
                  The moment a teacher submits, the class teacher sees it — no more chasing spreadsheets
                </p>
              </div>

              {/* Stat 3 */}
              <div className="pt-6 md:pt-0 md:px-6 last:pr-0 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    Built for Nigerian schools
                  </h3>
                </div>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">
                  WAEC & NECO, 3-term calendar, USSD payments — designed around how schools here actually run
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURE CARDS (2-Column Grid) */}
        <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-charcoal-dark tracking-tight">
              Everything Your School Needs to Flourish
            </h2>
            <p className="text-base text-slate-subtle leading-relaxed">
              Purpose-built modules that eliminate manual paperwork, speed up assessments, and keep bursars and parents in sync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <Card hoverable className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <IconBadge size="lg" icon={<FileSpreadsheet className="w-7 h-7 text-white" />} />
                <h3 className="text-2xl font-display font-black text-charcoal-dark leading-snug">
                  Results, Report Cards & Broadsheets
                </h3>
                <p className="text-slate-subtle text-sm sm:text-base leading-relaxed">
                  Every school sets its own scoring formula; totals, rankings, and printable report cards computed automatically. Teachers input continuous assessment and exam marks once, and the master term broadsheet generates in seconds with zero math errors.
                </p>
              </div>
              <div className="pt-4 border-t border-cream-border/60 flex items-center gap-2 text-xs font-semibold text-indigo-brand">
                <span>WAEC/NECO Standardized Grading</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Card>

            {/* Feature 2 */}
            <Card hoverable className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <IconBadge size="lg" icon={<CreditCard className="w-7 h-7 text-white" />} />
                <h3 className="text-2xl font-display font-black text-charcoal-dark leading-snug">
                  Fees, Without the Spreadsheet
                </h3>
                <p className="text-slate-subtle text-sm sm:text-base leading-relaxed">
                  Installments, sibling accounts, bank transfer or card, arrears at a glance, payment proof upload. Parents can pay securely from their phones, and bursars verify bank teller slips with a single click.
                </p>
              </div>
              <div className="pt-4 border-t border-cream-border/60 flex items-center gap-2 text-xs font-semibold text-indigo-brand">
                <span>Multi-Child Invoicing & USSD Support</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Card>

            {/* Feature 3 */}
            <Card hoverable className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <IconBadge size="lg" icon={<CalendarCheck2 className="w-7 h-7 text-white" />} />
                <h3 className="text-2xl font-display font-black text-charcoal-dark leading-snug">
                  Attendance, Handled Daily
                </h3>
                <p className="text-slate-subtle text-sm sm:text-base leading-relaxed">
                  Class teachers mark attendance once a day; parents notified automatically on absence. Real-time school-wide rollup gives principals immediate visibility into daily student headcounts and chronic absenteeism patterns.
                </p>
              </div>
              <div className="pt-4 border-t border-cream-border/60 flex items-center gap-2 text-xs font-semibold text-indigo-brand">
                <span>One-Tap Morning Roll Call</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Card>

            {/* Feature 4 */}
            <Card hoverable className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <IconBadge size="lg" icon={<Bot className="w-7 h-7 text-white" />} />
                <h3 className="text-2xl font-display font-black text-charcoal-dark leading-snug">
                  An AI Assistant for Your Office and Your Students
                </h3>
                <p className="text-slate-subtle text-sm sm:text-base leading-relaxed">
                  Drafts report card comments and answers fee queries for admin; a curriculum-scoped AI tutor for students. Teachers no longer spend nights hand-writing 50 repetitive report remarks, while students get 24/7 guided homework assistance.
                </p>
              </div>
              <div className="pt-4 border-t border-cream-border/60 flex items-center gap-2 text-xs font-semibold text-indigo-brand">
                <span>Curriculum-Aligned Educational AI</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Card>
          </div>
        </section>

        {/* 5. THE SCHOLEOS ADVANTAGE (6-Item Grid) */}
        <section className="py-20 bg-white/70 border-y border-cream-border/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-brand font-display">
                Built For Distinction
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-charcoal-dark tracking-tight">
                The ScholeOS Advantage
              </h2>
              <p className="text-base text-slate-subtle leading-relaxed">
                Why forward-thinking school proprietors, principals, and teachers choose ScholeOS over outdated legacy systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Item 1 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<UserCheck className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  Role-Based, Not One-Size-Fits-All
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Admins, class teachers, and subject teachers each get tailored workspaces. Staff only see what they need, keeping daily data entry fast and clutter-free.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<Zap className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  Real-Time, Not Batch
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Grades, attendance marks, and tuition payments synchronize the instant they are entered. No more waiting for weekend spreadsheet consolidations.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<Palette className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  Your School, Your Look
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Generate bespoke report cards, broadsheets, and receipts stamped with your school's official crest, principal signature, and motto.
                </p>
              </div>

              {/* Item 4 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<Smartphone className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  Built for How Nigerian Parents Pay
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Native support for bank transfers, cards, and USSD payments, plus seamless proof-of-payment image uploads for instant bursar reconciliation.
                </p>
              </div>

              {/* Item 5 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<Sparkles className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  An AI Layer That Actually Helps
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Save hours every term with automated, personalized student remarks, administrative inquiry answers, and curriculum-aligned student tutoring.
                </p>
              </div>

              {/* Item 6 */}
              <div className="bg-cream-surface p-7 rounded-2xl schole-card-shadow border border-black/[0.03] space-y-4 transition-all duration-200 hover:-translate-y-1">
                <IconBadge size="md" icon={<TrendingUp className="w-5 h-5 text-white" />} />
                <h3 className="text-xl font-display font-bold text-charcoal-dark">
                  Start Free, Scale With You
                </h3>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Launch your school's digital operations immediately with zero upfront financial barrier, then scale seamlessly across classes and multiple campuses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA BANNER (Light / Cream Card Section) */}
        <section id="pricing" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center schole-card-shadow border border-cream-border/80 max-w-4xl mx-auto space-y-6 relative overflow-hidden">
            {/* Subtle decorative gold circle */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-brand/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-brand/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center mx-auto">
                <Badge variant="gold" size="md">
                  No Commitment · 100% Free Trial
                </Badge>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-charcoal-dark tracking-tight">
                Ready to end the term-end chaos?
              </h2>

              <p className="text-base sm:text-lg text-slate-subtle max-w-xl mx-auto leading-relaxed">
                Book a free demo and see ScholeOS running with your school's own grading structure.
              </p>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => setDemoModalOpen(true)}
                  className="shadow-lg shadow-indigo-900/15"
                >
                  Book a Demo
                </Button>
              </div>

              <p className="text-xs text-slate-subtle pt-1">
                Used by forward-thinking schools across Lagos, Abuja, Ibadan & Port Harcourt.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FAQ ACCORDION SECTION */}
        <section id="faq" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-charcoal-dark tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-subtle leading-relaxed">
              Everything you need to know about implementing ScholeOS at your institution.
            </p>
          </div>

          <Accordion defaultOpenIds={['faq-1']}>
            {/* Q1 */}
            <AccordionItem id="faq-1">
              <AccordionTrigger>
                What makes ScholeOS different from other school software in Nigeria?
              </AccordionTrigger>
              <AccordionContent>
                ScholeOS was built specifically for the realities of Nigerian school administration. Unlike generic international tools or clunky offline software, it natively supports 3-term academic calendars, WAEC/NECO grading structures, split CA formulas, and local payment methods like direct bank transfers and USSD.
              </AccordionContent>
            </AccordionItem>

            {/* Q2 */}
            <AccordionItem id="faq-2">
              <AccordionTrigger>
                Can I set up my own scoring system (CA, exams, tests)?
              </AccordionTrigger>
              <AccordionContent>
                Yes, absolutely. Whether your school uses a 20/20/60 distribution, 30/70, or multiple mid-term assessments and practical projects, you can customize your exact grading rules down to the individual subject level. Rankings, broadsheets, and cumulative GPAs adjust automatically.
              </AccordionContent>
            </AccordionItem>

            {/* Q3 */}
            <AccordionItem id="faq-3">
              <AccordionTrigger>
                Do parents need to install an app?
              </AccordionTrigger>
              <AccordionContent>
                No app installation is required. Parents receive instant SMS or WhatsApp notifications with secure, mobile-optimized links to view attendance alerts, download tamper-proof PDF report cards, and verify fee receipts right in their phone's browser.
              </AccordionContent>
            </AccordionItem>

            {/* Q4 */}
            <AccordionItem id="faq-4">
              <AccordionTrigger>
                How does the free trial work?
              </AccordionTrigger>
              <AccordionContent>
                You get full access to ScholeOS for a complete academic term with zero upfront financial commitment. You can upload your student rosters, let teachers enter real term scores, and produce official broadsheets to experience the time savings firsthand before making any decision.
              </AccordionContent>
            </AccordionItem>

            {/* Q5 */}
            <AccordionItem id="faq-5">
              <AccordionTrigger>
                Is my school's data safe and private from other schools on the platform?
              </AccordionTrigger>
              <AccordionContent>
                Completely safe. Each institution operates in a strictly isolated multi-tenant environment with role-based access control and bank-grade data encryption, ensuring your records and student information remain strictly confidential.
              </AccordionContent>
            </AccordionItem>

            {/* Q6 */}
            <AccordionItem id="faq-6">
              <AccordionTrigger>
                Can I use my own school's logo and colors?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Every printable report card, broadsheet, fee invoice, and parent notification is fully white-labeled with your school's official name, crest, signature stamps, and motto.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* 8. FOOTER (Wave 1 Component with Wave 2 Columns) */}
      <Footer
        columns={[
          {
            title: 'About',
            links: [
              { label: 'About ScholeOS', href: '#about' },
              { label: 'How It Works', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
            ],
          },
          {
            title: 'Features',
            links: [
              { label: 'Results & Broadsheets', href: '#features' },
              { label: 'Fees', href: '#features' },
              { label: 'Attendance', href: '#features' },
              { label: 'AI Assistant', href: '#features' },
              { label: 'LMS & CBT', href: '#features' },
            ],
          },
          {
            title: 'Support',
            links: [
              { label: 'FAQs', href: '#faq' },
              { label: 'Contact Us', href: '#contact' },
              { label: 'Book a Demo', href: '#pricing' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy Policy', href: '#privacy' },
              { label: 'Terms of Service', href: '#terms' },
              { label: 'Data Protection', href: '#data-protection' },
            ],
          },
        ]}
        copyrightText="Copyright © 2026 ScholeOS. All Rights Reserved."
      />

      {/* Interactive Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
