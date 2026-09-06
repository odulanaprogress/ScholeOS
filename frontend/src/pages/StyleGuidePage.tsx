import React, { useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  IconBadge,
  Badge,
  Navbar,
  Footer,
} from '@/components/ui'
import { colors } from '@/design-system/tokens'
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  Sparkles,
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Copy,
  Check,
} from 'lucide-react'

export const StyleGuidePage: React.FC = () => {
  // Interactive state demos
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [buttonClickCount, setButtonClickCount] = useState(0)

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  return (
    <div className="min-h-screen bg-cream-base text-charcoal-dark flex flex-col font-sans">
      {/* Live Navbar Showcase */}
      <Navbar
        tagline="Operating System for Modern Schools"
        ctaText="Explore Wave 1"
        onCtaClick={() => {
          document.getElementById('components-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        
        {/* Hero Banner / Wave 1 Overview */}
        <div className="space-y-4 text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="primary" size="md">
              Wave 1: Foundation & Design System
            </Badge>
            <Badge variant="success" size="md">
              Tokens Verified
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-charcoal-dark tracking-tight leading-tight">
            ScholeOS <span className="text-indigo-brand">Design System</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-subtle leading-relaxed font-sans">
            A production-ready, accessible design system engineered for high-performance school operations. Built on warm cream surfaces, bold indigo actions, and golden prestige accents.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const el = document.getElementById('tokens-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Inspect Tokens
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                const el = document.getElementById('components-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Test Components
            </Button>
          </div>
        </div>

        {/* SECTION 1: DESIGN TOKENS & COLOR PALETTE */}
        <section id="tokens-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cream-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
                  Section 01
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
                Color Tokens & Palette
              </h2>
            </div>
            <p className="text-xs text-slate-subtle">
              Click any swatch to copy hex code to clipboard
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Base Background */}
            <div
              onClick={() => copyToClipboard(colors.cream.base)}
              className="group cursor-pointer bg-white rounded-2xl p-4 schole-card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-black/[0.04]"
            >
              <div
                className="h-24 w-full rounded-xl mb-3 flex items-center justify-center border border-amber-200/50 shadow-inner"
                style={{ backgroundColor: colors.cream.base }}
              >
                {copiedColor === colors.cream.base && (
                  <span className="bg-charcoal-dark text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold animate-in fade-in">
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </span>
                )}
              </div>
              <p className="font-display font-bold text-sm text-charcoal-dark">Warm Cream</p>
              <p className="text-xs text-slate-subtle font-mono mt-0.5 flex items-center justify-between">
                <span>{colors.cream.base}</span>
                <span className="text-[10px] text-gray-400">Base BG</span>
              </p>
            </div>

            {/* Surface White */}
            <div
              onClick={() => copyToClipboard(colors.cream.surface)}
              className="group cursor-pointer bg-white rounded-2xl p-4 schole-card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-black/[0.04]"
            >
              <div
                className="h-24 w-full rounded-xl mb-3 flex items-center justify-center border border-gray-200 shadow-inner"
                style={{ backgroundColor: colors.cream.surface }}
              >
                {copiedColor === colors.cream.surface && (
                  <span className="bg-charcoal-dark text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold animate-in fade-in">
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </span>
                )}
              </div>
              <p className="font-display font-bold text-sm text-charcoal-dark">Surface White</p>
              <p className="text-xs text-slate-subtle font-mono mt-0.5 flex items-center justify-between">
                <span>{colors.cream.surface}</span>
                <span className="text-[10px] text-gray-400">Card BG</span>
              </p>
            </div>

            {/* Primary Indigo */}
            <div
              onClick={() => copyToClipboard(colors.indigo.brand)}
              className="group cursor-pointer bg-white rounded-2xl p-4 schole-card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-black/[0.04]"
            >
              <div
                className="h-24 w-full rounded-xl mb-3 flex items-center justify-center text-white font-mono text-xs shadow-inner"
                style={{ backgroundColor: colors.indigo.brand }}
              >
                {copiedColor === colors.indigo.brand ? (
                  <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3 text-emerald-300" /> Copied!
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Primary</span>
                )}
              </div>
              <p className="font-display font-bold text-sm text-charcoal-dark">Primary Indigo</p>
              <p className="text-xs text-slate-subtle font-mono mt-0.5 flex items-center justify-between">
                <span>{colors.indigo.brand}</span>
                <span className="text-[10px] text-indigo-brand font-semibold">Brand Accent</span>
              </p>
            </div>

            {/* Secondary Gold */}
            <div
              onClick={() => copyToClipboard(colors.gold.brand)}
              className="group cursor-pointer bg-white rounded-2xl p-4 schole-card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-black/[0.04]"
            >
              <div
                className="h-24 w-full rounded-xl mb-3 flex items-center justify-center text-white font-mono text-xs shadow-inner"
                style={{ backgroundColor: colors.gold.brand }}
              >
                {copiedColor === colors.gold.brand ? (
                  <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3 text-emerald-300" /> Copied!
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Highlight</span>
                )}
              </div>
              <p className="font-display font-bold text-sm text-charcoal-dark">Warm Gold</p>
              <p className="text-xs text-slate-subtle font-mono mt-0.5 flex items-center justify-between">
                <span>{colors.gold.brand}</span>
                <span className="text-[10px] text-amber-700 font-semibold">Badge Accent</span>
              </p>
            </div>

            {/* Dark Charcoal */}
            <div
              onClick={() => copyToClipboard(colors.charcoal.dark)}
              className="group cursor-pointer bg-white rounded-2xl p-4 schole-card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-black/[0.04]"
            >
              <div
                className="h-24 w-full rounded-xl mb-3 flex items-center justify-center text-white font-mono text-xs shadow-inner"
                style={{ backgroundColor: colors.charcoal.dark }}
              >
                {copiedColor === colors.charcoal.dark ? (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3 text-emerald-300" /> Copied!
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Charcoal</span>
                )}
              </div>
              <p className="font-display font-bold text-sm text-charcoal-dark">Near-Black Charcoal</p>
              <p className="text-xs text-slate-subtle font-mono mt-0.5 flex items-center justify-between">
                <span>{colors.charcoal.dark}</span>
                <span className="text-[10px] text-gray-400">Footer/Dark</span>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY HIERARCHY */}
        <section className="space-y-6">
          <div className="border-b border-cream-border pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
              Section 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
              Typography & Hierarchy
            </h2>
          </div>

          <Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* Poppins Headings */}
              <div className="space-y-5 lg:pr-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-brand font-display">
                    Display Font: Poppins
                  </span>
                  <span className="text-xs text-slate-subtle font-mono">weights 600 - 900</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-black text-charcoal-dark">
                      Heading 1 (40px / 900)
                    </h1>
                    <p className="text-xs text-slate-subtle mt-0.5">Hero titles, major dashboard headers</p>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal-dark">
                      Heading 2 (30px / 800)
                    </h2>
                    <p className="text-xs text-slate-subtle mt-0.5">Card titles, section titles</p>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
                      Heading 3 (24px / 700)
                    </h3>
                    <p className="text-xs text-slate-subtle mt-0.5">Subsections, modal headers</p>
                  </div>
                </div>
              </div>

              {/* Inter Body */}
              <div className="space-y-5 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-brand font-display">
                    Body Font: Inter
                  </span>
                  <span className="text-xs text-slate-subtle font-mono">weights 400 - 600</span>
                </div>
                <div className="space-y-4 font-sans">
                  <div>
                    <p className="text-base text-charcoal-dark font-medium leading-relaxed">
                      Lead paragraph: ScholeOS automates end-to-end continuous assessment, academic broadsheets, fee collection, and parent engagement in one seamless interface.
                    </p>
                    <p className="text-xs text-slate-subtle mt-1 font-mono">16px / Regular - Medium</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Standard body: Designed with high contrast and optimal line-height for continuous data entry without cognitive fatigue.
                    </p>
                    <p className="text-xs text-slate-subtle mt-1 font-mono">14px / Regular</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">
                      Caption / Monospace: ID: SCH-2026-0891 · Last Synced: 2 mins ago
                    </p>
                    <p className="text-xs text-slate-subtle mt-1 font-mono">12px / Monospace</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 3: BUTTONS MATRIX & INTERACTION */}
        <section id="components-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cream-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
                Section 03
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
                Button Component
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-subtle flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={btnLoading}
                  onChange={(e) => setBtnLoading(e.target.checked)}
                  className="rounded text-indigo-brand focus:ring-indigo-brand"
                />
                Simulate Loading State
              </label>
            </div>
          </div>

          <Card>
            <div className="space-y-8">
              {/* Primary Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold font-display uppercase tracking-wider text-charcoal-dark">
                    1. Primary Variant — Solid Indigo Fill (#4338CA), Fully Pill-Shaped
                  </h4>
                  <span className="text-xs text-indigo-brand font-semibold">
                    Clicked: {buttonClickCount} times
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={btnLoading}
                    onClick={() => setButtonClickCount((c) => c + 1)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Large Pill Action
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={btnLoading}
                    onClick={() => setButtonClickCount((c) => c + 1)}
                    leftIcon={<Sparkles className="w-4 h-4 text-gold-brand" />}
                  >
                    Medium Action
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={btnLoading}
                    onClick={() => setButtonClickCount((c) => c + 1)}
                  >
                    Small Action
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    disabled
                  >
                    Disabled Primary
                  </Button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold font-display uppercase tracking-wider text-charcoal-dark">
                  2. Secondary Variant — Indigo Outline & Text, White/Transparent Surface
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    isLoading={btnLoading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Large Secondary
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    isLoading={btnLoading}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Export Broadsheet
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={btnLoading}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    disabled
                  >
                    Disabled Secondary
                  </Button>
                </div>
              </div>

              {/* Icon Buttons & Ghost */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold font-display uppercase tracking-wider text-charcoal-dark">
                  3. Icon-Button & Ghost Variants — Circular / Pill Toolbar Actions
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="icon"
                    size="lg"
                    aria-label="Search"
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                  <Button
                    variant="icon"
                    size="md"
                    aria-label="Calendar"
                    leftIcon={<Calendar className="w-4 h-4 text-indigo-brand" />}
                  />
                  <Button
                    variant="icon"
                    size="sm"
                    aria-label="Filter"
                    leftIcon={<Layers className="w-3.5 h-3.5" />}
                  />
                  <Button
                    variant="ghost"
                    size="md"
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Ghost Button
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 4: FORM INPUTS & VALIDATION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cream-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
                Section 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
                Form Inputs & Validation
              </h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowError(!showError)}
            >
              {showError ? 'Clear Error State' : 'Simulate Validation Error'}
            </Button>
          </div>

          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input with Search Icon Prefix */}
              <Input
                label="Student Name or Admission ID"
                placeholder="Search by name (e.g. Adebayo Kunle)..."
                icon={<Search className="w-4 h-4" />}
                helperText="Supports fuzzy lookup across student roster"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              {/* Email with Icon & Error toggle */}
              <Input
                label="School Administrator Email"
                placeholder="principal@kingscollege.edu"
                icon={<Mail className="w-4 h-4" />}
                error={showError ? 'Please provide a valid institutional email address' : undefined}
                helperText={!showError ? 'Official communications will be sent here' : undefined}
                defaultValue="admin@invalid-domain"
              />

              {/* Password with right element toggle */}
              <Input
                label="Master Security Passcode"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                icon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-indigo-brand focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                helperText="Minimum 8 characters with at least one number"
                defaultValue="ScholeOS2026!"
              />

              {/* Disabled Input */}
              <Input
                label="Campus ID Code (Locked)"
                value="CAMPUS-LAG-001"
                disabled
                helperText="Campus codes are provisioned by your system administrator"
              />
            </div>
          </Card>
        </section>

        {/* SECTION 5: ICON BADGES & STATUS BADGES / PILLS */}
        <section className="space-y-6">
          <div className="border-b border-cream-border pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
              Section 05
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
              Icon Badges & Status Pills
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Icon Badges */}
            <Card>
              <CardHeader>
                <CardTitle>IconBadge Component</CardTitle>
                <CardDescription>
                  Small squares (rounded-xl) filled solid warm gold (#D4A017) with centered white line icons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="text-center space-y-1">
                    <IconBadge size="lg" icon={<GraduationCap />} />
                    <span className="text-[11px] text-slate-subtle block font-mono">lg (56px)</span>
                  </div>
                  <div className="text-center space-y-1">
                    <IconBadge size="md" icon={<BookOpen />} />
                    <span className="text-[11px] text-slate-subtle block font-mono">md (44px)</span>
                  </div>
                  <div className="text-center space-y-1">
                    <IconBadge size="sm" icon={<Award />} />
                    <span className="text-[11px] text-slate-subtle block font-mono">sm (36px)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-dark font-display mb-3">
                    Icon Showcase in Gold Accent:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <IconBadge size="md" icon={<Users />} />
                    <IconBadge size="md" icon={<ShieldCheck />} />
                    <IconBadge size="md" icon={<Sparkles />} />
                    <IconBadge size="md" icon={<TrendingUp />} />
                    <IconBadge size="md" icon={<CheckCircle2 />} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Badges / Pills */}
            <Card>
              <CardHeader>
                <CardTitle>Status Badge / Pill</CardTitle>
                <CardDescription>
                  Small status labels for schools, students, invoices, and exam submissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-dark font-display">
                    Standard Status Variants:
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="success">Active Student</Badge>
                    <Badge variant="warning">Trial Institution</Badge>
                    <Badge variant="danger">Suspended</Badge>
                    <Badge variant="neutral">Draft Record</Badge>
                    <Badge variant="primary">Admin Verified</Badge>
                    <Badge variant="gold">Gold Tier</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-dark font-display">
                    Sizes & Dot Options:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="success" size="sm">
                      sm / Active
                    </Badge>
                    <Badge variant="success" size="md">
                      md / Active
                    </Badge>
                    <Badge variant="warning" showDot={false}>
                      No Dot / Pending
                    </Badge>
                    <Badge variant="danger" showDot={true}>
                      Overdue Fee
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 6: CARDS COMPOSITION & REALISTIC PREVIEWS */}
        <section className="space-y-6">
          <div className="border-b border-cream-border pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-brand font-display">
              Section 06
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
              Card Component & Compositions
            </h2>
            <p className="text-sm text-slate-subtle mt-1">
              White background, rounded-2xl corners, soft shadow, generous whitespace, compound parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <IconBadge size="md" icon={<Users />} />
                  <Badge variant="success">98.4% Present</Badge>
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-subtle font-display">
                    Total Enrolled Students
                  </p>
                  <p className="text-3xl font-display font-black text-charcoal-dark">
                    1,420
                  </p>
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 pt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +42 newly enrolled this term
                  </p>
                </div>
              </div>
              <CardFooter className="p-0 mt-6 pt-4 border-t border-cream-border/60 flex items-center justify-between">
                <span className="text-xs text-slate-subtle">Term 1 · 2026/2027</span>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Roster
                </Button>
              </CardFooter>
            </Card>

            {/* Stat Card 2 */}
            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <IconBadge size="md" icon={<BookOpen />} />
                  <Badge variant="primary">CA In Progress</Badge>
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-subtle font-display">
                    Subject Score Submissions
                  </p>
                  <p className="text-3xl font-display font-black text-charcoal-dark">
                    84 / 96
                  </p>
                  <p className="text-xs text-indigo-brand font-medium flex items-center gap-1 pt-1">
                    12 teachers pending submission
                  </p>
                </div>
              </div>
              <CardFooter className="p-0 mt-6 pt-4 border-t border-cream-border/60 flex items-center justify-between">
                <span className="text-xs text-slate-subtle">Deadline in 3 days</span>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Gradebook
                </Button>
              </CardFooter>
            </Card>

            {/* Stat Card 3 */}
            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <IconBadge size="md" icon={<Award />} />
                  <Badge variant="gold">Premier Tier</Badge>
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-subtle font-display">
                    Tuition Fees Collected
                  </p>
                  <p className="text-3xl font-display font-black text-charcoal-dark">
                    $482,500
                  </p>
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 89% collection rate
                  </p>
                </div>
              </div>
              <CardFooter className="p-0 mt-6 pt-4 border-t border-cream-border/60 flex items-center justify-between">
                <span className="text-xs text-slate-subtle">Wave 8 Integration</span>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Billing Hub
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* SECTION 7: SENIOR ARCHITECTURE SUMMARY */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 schole-card-shadow border border-black/[0.04] space-y-6">
          <div className="flex items-center gap-3">
            <IconBadge size="lg" icon={<Sparkles />} />
            <div>
              <h3 className="text-2xl font-display font-black text-charcoal-dark">
                Wave 1 Architecture Verification
              </h3>
              <p className="text-sm text-slate-subtle">
                Ready for Wave 2 (Public Landing Page) and Wave 3 (Auth & School Onboarding Wizard)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cream-base/50 border border-cream-border/60">
              <p className="text-xs text-slate-subtle font-display uppercase font-bold">Reusable Core</p>
              <p className="text-lg font-display font-bold text-charcoal-dark mt-1">7 UI Components</p>
              <p className="text-xs text-slate-subtle mt-0.5">Strict TypeScript contracts</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-base/50 border border-cream-border/60">
              <p className="text-xs text-slate-subtle font-display uppercase font-bold">Color Tokens</p>
              <p className="text-lg font-display font-bold text-indigo-brand mt-1">Warm Cream & Indigo</p>
              <p className="text-xs text-slate-subtle mt-0.5">Gold badges, charcoal dark</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-base/50 border border-cream-border/60">
              <p className="text-xs text-slate-subtle font-display uppercase font-bold">Typography</p>
              <p className="text-lg font-display font-bold text-charcoal-dark mt-1">Poppins + Inter</p>
              <p className="text-xs text-slate-subtle mt-0.5">Google Fonts pre-loaded</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-base/50 border border-cream-border/60">
              <p className="text-xs text-slate-subtle font-display uppercase font-bold">Developer Notes</p>
              <p className="text-lg font-display font-bold text-emerald-700 mt-1">Synchronized</p>
              <p className="text-xs text-slate-subtle mt-0.5">Kept updated across waves</p>
            </div>
          </div>
        </section>

      </main>

      {/* Live Dark Charcoal Footer Showcase */}
      <Footer className="mt-16" />
    </div>
  )
}
