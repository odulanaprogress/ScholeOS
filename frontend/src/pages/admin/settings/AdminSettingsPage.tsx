import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { SelectableCard } from '@/components/ui/SelectableCard'
import { StatCard } from '@/components/ui/StatCard'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Building2,
  Sparkles,
  BookOpen,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Check,
  Download,
  Users,
  Layers,
  Sliders,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react'
import {
  type SchoolInfoSettings,
  type ScoreComponent,
  type ClassItem,
  type SubscriptionPlan,
  type BillingTransaction,
  INITIAL_SCHOOL_INFO,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCORE_COMPONENTS,
  AVAILABLE_PLANS,
  INITIAL_BILLING_TRANSACTIONS,
  PRESET_COLORS,
} from './settingsData'

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('school_info')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Part A: School Info State
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfoSettings>(INITIAL_SCHOOL_INFO)

  // Part B: Branding State
  const [accentColor, setAccentColor] = useState('#4338CA')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Part C: Academic Setup State
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES)
  const [subjects, setSubjects] = useState<string[]>(INITIAL_SUBJECTS)
  const [scoreComponents, setScoreComponents] = useState<ScoreComponent[]>(
    INITIAL_SCORE_COMPONENTS
  )
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null)
  const [newClassName, setNewClassName] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')

  // Part D: My Plan State
  const [plans, setPlans] = useState<SubscriptionPlan[]>(AVAILABLE_PLANS)
  const [selectedUpgradePlanId, setSelectedUpgradePlanId] = useState('premium')
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [transactions] = useState<BillingTransaction[]>(
    INITIAL_BILLING_TRANSACTIONS
  )

  // Active plan lookup
  const currentPlan = useMemo(() => {
    return plans.find((p) => p.isCurrent) || plans[1]
  }, [plans])

  // Total assessment score weight
  const totalScoreWeight = useMemo(() => {
    return scoreComponents.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0)
  }, [scoreComponents])

  const isScoringValid = totalScoreWeight === 100

  // Total enrolled students across classes
  const totalStudentsEnrolled = useMemo(() => {
    return classes.reduce((sum, c) => sum + c.studentCount, 0)
  }, [classes])

  // Helper to trigger success toast
  const triggerSuccessBanner = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 4500)
  }

  // --- Handlers for Part B: Branding ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // --- Handlers for Part C: Academic Setup ---
  const handleAddClass = () => {
    if (!newClassName.trim()) return
    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      studentCount: 0,
    }
    setClasses([...classes, newClass])
    setNewClassName('')
  }

  const handleDeleteClassClick = (cls: ClassItem) => {
    if (cls.studentCount > 0) {
      setClassToDelete(cls)
    } else {
      setClasses(classes.filter((c) => c.id !== cls.id))
    }
  }

  const handleConfirmDeleteClass = () => {
    if (classToDelete) {
      setClasses(classes.filter((c) => c.id !== classToDelete.id))
      setClassToDelete(null)
    }
  }

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return
    setSubjects([...subjects, newSubjectName.trim()])
    setNewSubjectName('')
  }

  const handleDeleteSubject = (index: number) => {
    if (subjects.length <= 1) return
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const handleUpdateScoreComponent = (
    id: string,
    field: 'name' | 'weight',
    value: string | number
  ) => {
    setScoreComponents(
      scoreComponents.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            [field]: field === 'weight' ? Number(value) : value,
          }
        }
        return c
      })
    )
  }

  const handleAddScoreComponent = () => {
    const newComp: ScoreComponent = {
      id: `sc-${Date.now()}`,
      name: 'Continuous Assessment',
      weight: 10,
    }
    setScoreComponents([...scoreComponents, newComp])
  }

  const handleDeleteScoreComponent = (id: string) => {
    if (scoreComponents.length <= 1) return
    setScoreComponents(scoreComponents.filter((c) => c.id !== id))
  }

  // --- Handlers for Part D: Upgrade Plan ---
  const handleConfirmUpgrade = () => {
    setPlans((prev) =>
      prev.map((p) => ({
        ...p,
        isCurrent: p.id === selectedUpgradePlanId,
      }))
    )
    setIsUpgradeModalOpen(false)
    const target = plans.find((p) => p.id === selectedUpgradePlanId)
    triggerSuccessBanner(
      `Your subscription plan has been successfully updated to ${target?.name}!`
    )
  }

  const settingsTabs = [
    { id: 'school_info', label: 'School Info', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Sparkles },
    { id: 'academic', label: 'Academic Setup', icon: BookOpen },
    { id: 'plan', label: 'My Plan', icon: CreditCard },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-cream-surface p-5 sm:p-6 rounded-2xl border border-cream-border/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-brand font-semibold text-xs tracking-wider uppercase mb-1">
            <Building2 className="w-4 h-4" />
            Institutional Administration
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
            School Configuration & Settings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Manage your school profile, crest and colors, curriculum and assessment grading formula, and subscription tier.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Badge variant="primary" size="md">
            Academic Session 2025/2026
          </Badge>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="bg-cream-surface p-2 rounded-2xl border border-cream-border/80 shadow-xs">
        <Tabs
          tabs={settingsTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          accentColor="#4338CA"
        />
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SCHOOL INFO                                      */}
      {/* ======================================================== */}
      {activeTab === 'school_info' && (
        <Card className="p-6 sm:p-8 bg-white border border-cream-border shadow-xs rounded-2xl space-y-6">
          <div className="border-b border-cream-border pb-3">
            <h2 className="text-base font-bold font-display text-charcoal-dark">
              General Institution Profile
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Update your registered school name, acronym, physical location, and administrative contact lines.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl">
            <Input
              label="Official School Name"
              placeholder="e.g. Crown Academy Lagos"
              value={schoolInfo.schoolName}
              onChange={(e) =>
                setSchoolInfo({ ...schoolInfo, schoolName: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Short Name / Acronym"
                placeholder="e.g. CAL"
                helperText="Used on SMS headers, broadsheets, and candidate registration numbers"
                value={schoolInfo.schoolAbbr}
                onChange={(e) =>
                  setSchoolInfo({
                    ...schoolInfo,
                    schoolAbbr: e.target.value.toUpperCase(),
                  })
                }
              />

              <div className="space-y-1.5 text-left font-body">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Student Enrollment Range
                </label>
                <select
                  value={schoolInfo.studentRange}
                  onChange={(e) =>
                    setSchoolInfo({ ...schoolInfo, studentRange: e.target.value })
                  }
                  className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border border-cream-border focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 font-body transition-all"
                >
                  <option value="Under 200">Under 200 students</option>
                  <option value="200-500">200 – 500 students</option>
                  <option value="500-1000">500 – 1,000 students</option>
                  <option value="1000+">1,000+ students</option>
                </select>
              </div>
            </div>

            <Input
              label="Physical Campus Address"
              placeholder="e.g. Plot 12, Commercial Avenue, Yaba, Lagos State"
              value={schoolInfo.schoolAddress}
              onChange={(e) =>
                setSchoolInfo({ ...schoolInfo, schoolAddress: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Bursary & Admin Contact Email"
                placeholder="e.g. admin@crownacademy.sch.ng"
                value={schoolInfo.contactEmail}
                onChange={(e) =>
                  setSchoolInfo({ ...schoolInfo, contactEmail: e.target.value })
                }
              />

              <Input
                label="Official Helpline Phone Number"
                placeholder="e.g. +234 (0) 803 123 4567"
                value={schoolInfo.contactPhone}
                onChange={(e) =>
                  setSchoolInfo({ ...schoolInfo, contactPhone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-cream-border flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                triggerSuccessBanner('School details have been updated successfully.')
              }
              className="px-5 shadow-xs font-semibold text-xs sm:text-sm"
            >
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BRANDING                                         */}
      {/* ======================================================== */}
      {activeTab === 'branding' && (
        <Card className="p-6 sm:p-8 bg-white border border-cream-border shadow-xs rounded-2xl space-y-6">
          <div className="border-b border-cream-border pb-3">
            <h2 className="text-base font-bold font-display text-charcoal-dark">
              School Crest & Accent Theme
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Customize the visual identity rendered across student report cards, parent portals, and terminal broadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Upload & Color Swatches */}
            <div className="lg:col-span-7 space-y-6">
              {/* Logo Upload Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Official School Crest / Logo
                </label>
                <label className="border-2 border-dashed border-cream-border hover:border-indigo-brand/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-cream-base/20 hover:bg-cream-base/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-16 h-16 object-contain rounded-xl mx-auto shadow-sm border border-gray-100 bg-white"
                      />
                      <p className="text-xs font-semibold text-indigo-brand">
                        Click to replace current logo
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gold-brand/20 text-gold-brand flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-charcoal-dark">
                        Upload your school logo
                      </p>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        PNG, JPG, or SVG with transparent background recommended
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Accent Color Swatches */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Primary Accent Color
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setAccentColor(preset.hex)}
                      className="group flex flex-col items-center space-y-1.5 focus:outline-none"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs border-2"
                        style={{
                          backgroundColor: preset.hex,
                          borderColor:
                            accentColor === preset.hex ? '#1E1B1A' : 'transparent',
                        }}
                      >
                        {accentColor === preset.hex && (
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        )}
                      </div>
                      <span className="text-[10px] text-charcoal-muted font-medium text-center">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-cream-border p-0.5"
                  />
                  <Input
                    label=""
                    placeholder="#4338CA"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="font-mono text-xs max-w-[140px]"
                  />
                  <span className="text-xs text-charcoal-muted">
                    Custom Hex Code
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Live Header & Button Preview Panel */}
            <div className="lg:col-span-5 bg-cream-base/40 p-5 rounded-2xl border border-cream-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                  Live Header Preview
                </span>
                <Badge variant="primary" size="sm">
                  Dynamic
                </Badge>
              </div>

              {/* Mock Dashboard Header */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-cream-border space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-8 h-8 object-contain rounded-lg border border-gray-100"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: accentColor }}
                      >
                        {schoolInfo.schoolAbbr.slice(0, 2) || 'CA'}
                      </div>
                    )}
                    <div>
                      <p
                        className="font-display font-bold text-xs leading-tight"
                        style={{ color: accentColor }}
                      >
                        {schoolInfo.schoolName || 'Crown Academy Lagos'}
                      </p>
                      <p className="text-[10px] text-charcoal-muted">
                        Session 2025/2026
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Active
                  </span>
                </div>

                <div className="space-y-2">
                  <h4
                    className="font-display font-bold text-sm tracking-tight"
                    style={{ color: accentColor }}
                  >
                    Welcome, Administrator
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    Broadsheets and report cards will automatically reflect your selected primary theme color.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentColor }}
                  >
                    Sample Primary Button
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cream-border flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                triggerSuccessBanner('School branding and accent color saved successfully.')
              }
              className="px-5 shadow-xs font-semibold text-xs sm:text-sm"
            >
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ACADEMIC SETUP                                   */}
      {/* ======================================================== */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* Advisory Alert Banner */}
          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Important Policy Notice:</strong> Changes made to classes, subjects, and scoring formulas apply to current and upcoming terms only. Already published and approved report cards permanently preserve their historical formulas.
            </div>
          </div>

          {/* Section 1: Classes & Subjects Repeatable Lists */}
          <Card className="p-6 sm:p-8 bg-white border border-cream-border shadow-xs rounded-2xl space-y-6">
            <div className="border-b border-cream-border pb-3">
              <h2 className="text-base font-bold font-display text-charcoal-dark flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-brand" />
                Classes & Core Curriculum Subjects
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Manage class arms, enrollment streams, and official subjects taught across all secondary forms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-1">
              {/* Classes Repeatable List */}
              <div className="space-y-3 bg-cream-base/30 p-5 rounded-2xl border border-cream-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                    Classes ({classes.length})
                  </span>
                  <span className="text-xs text-charcoal-muted font-medium">
                    Total: {totalStudentsEnrolled} Students
                  </span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-cream-border"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-charcoal-dark">
                        {cls.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cream-base text-charcoal-muted border border-cream-border">
                          {cls.studentCount} Students
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteClassClick(cls)}
                          className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete class arm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Class Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-cream-border">
                  <input
                    type="text"
                    placeholder="New class (e.g. JSS 3 Gold)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="flex-1 bg-white text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 px-3 border border-cream-border focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddClass}
                    className="text-xs font-medium shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Subjects Repeatable List */}
              <div className="space-y-3 bg-cream-base/30 p-5 rounded-2xl border border-cream-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                    Curriculum Subjects ({subjects.length})
                  </span>
                  <span className="text-xs text-charcoal-muted font-medium">
                    Continuous Assessment
                  </span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {subjects.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-cream-border"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-charcoal-dark">
                        {sub}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(index)}
                        disabled={subjects.length <= 1}
                        className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 transition-colors"
                        title="Delete subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Subject Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-cream-border">
                  <input
                    type="text"
                    placeholder="New subject (e.g. Further Mathematics)"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="flex-1 bg-white text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 px-3 border border-cream-border focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSubject}
                    className="text-xs font-medium shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Scoring System & Weights Formula */}
          <Card className="p-6 sm:p-8 bg-white border border-cream-border shadow-xs rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-border pb-3">
              <div>
                <h2 className="text-base font-bold font-display text-charcoal-dark flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gold-brand" />
                  Terminal Assessment & Scoring Formula
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Set continuous assessment and terminal examination weights. All component percentages must sum exactly to 100%.
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {isScoringValid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    100% Total Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Total: {totalScoreWeight}% (Must equal 100%)
                  </span>
                )}
              </div>
            </div>

            {/* Repeatable Scoring Components List */}
            <div className="space-y-3 max-w-3xl">
              <div className="grid grid-cols-12 gap-3 text-xs font-display font-bold uppercase tracking-wider text-charcoal-muted px-2">
                <span className="col-span-8">Assessment Component Name</span>
                <span className="col-span-3">Weight (%)</span>
                <span className="col-span-1 text-center">Action</span>
              </div>

              <div className="space-y-2.5">
                {scoreComponents.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-3 items-center bg-cream-base/30 p-2.5 rounded-xl border border-cream-border/60"
                  >
                    <div className="col-span-8">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateScoreComponent(item.id, 'name', e.target.value)
                        }
                        className="w-full bg-white text-charcoal-dark text-xs sm:text-sm rounded-lg py-2 px-3 border border-cream-border focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                        placeholder="e.g. Mid-term Assessment"
                      />
                    </div>

                    <div className="col-span-3">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.weight}
                          onChange={(e) =>
                            handleUpdateScoreComponent(item.id, 'weight', e.target.value)
                          }
                          className="w-full bg-white text-charcoal-dark text-xs sm:text-sm font-mono font-bold rounded-lg py-2 pl-3 pr-7 border border-cream-border focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                        />
                        <span className="absolute right-2.5 text-xs text-charcoal-muted font-mono pointer-events-none">
                          %
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteScoreComponent(item.id)}
                        disabled={scoreComponents.length <= 1}
                        className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 transition-colors"
                        title="Delete component"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddScoreComponent}
                  className="text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Assessment Component
                </Button>
              </div>
            </div>

            {/* Bottom Combined Save Button */}
            <div className="pt-4 border-t border-cream-border flex items-center justify-between">
              <span className="text-xs text-charcoal-muted">
                Formula total: <strong className="text-charcoal-dark">{totalScoreWeight}%</strong>
              </span>

              <Button
                variant="primary"
                size="sm"
                disabled={!isScoringValid}
                onClick={() =>
                  triggerSuccessBanner('Academic structure and scoring formulas saved successfully.')
                }
                className="px-5 shadow-xs font-semibold text-xs sm:text-sm"
              >
                Save Academic Setup
              </Button>
            </div>
          </Card>

          {/* Class Deletion Safety Warning Modal */}
          {classToDelete && (
            <Modal
              isOpen={Boolean(classToDelete)}
              onClose={() => setClassToDelete(null)}
              title={`Delete Class Arm: ${classToDelete.name}?`}
              description="Confirming deletion will affect candidate records."
              size="md"
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong>Warning: Active Student Population</strong>
                    <p className="leading-relaxed">
                      This class currently has <strong>{classToDelete.studentCount} students</strong>. Deleting it won't delete their academic records, but they will need to be reassigned to another class arm before report cards can be generated.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClassToDelete(null)}
                    className="text-xs font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmDeleteClass}
                    className="text-xs font-semibold px-4 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-sm"
                  >
                    Confirm Deletion
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: MY PLAN                                          */}
      {/* ======================================================== */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Plan Summary Card */}
          <div className="bg-cream-surface rounded-2xl border border-cream-border p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-brand bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    Current Active Tier
                  </span>
                  <Badge variant="success" size="sm" showDot>
                    Active Subscription
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-charcoal-dark">
                  {currentPlan.name}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {currentPlan.tagline}. Renews automatically on <strong>October 31, 2026</strong> for Term 3.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-2xl font-display font-black text-charcoal-dark">
                    {currentPlan.priceFormatted}
                  </div>
                  <div className="text-xs text-charcoal-muted">Billed per academic term</div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <Sparkles className="w-4 h-4 mr-1.5 text-gold-brand" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Student Capacity StatCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Enrolled Student Capacity"
              value={`${totalStudentsEnrolled} / ${currentPlan.studentLimit}`}
              subtext={`${Math.round((totalStudentsEnrolled / currentPlan.studentLimit) * 100)}% capacity utilized`}
              icon={Users}
              tone="primary"
            />

            <StatCard
              label="Academic Term Status"
              value="Term 2 Active"
              subtext="Next billing cycle: 31 Oct 2026"
              icon={Clock}
              tone="gold"
            />

            <StatCard
              label="Multi-Channel Delivery"
              value="Unlimited In-App"
              subtext="SMS & WhatsApp Enabled"
              icon={ShieldCheck}
              tone="success"
            />
          </div>

          {/* Billing & Payment History Table */}
          <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-charcoal-dark font-display">
                  Subscription Invoicing & Payment History
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Official tax receipts and institutional payment logs for Crown Academy Lagos.
                </p>
              </div>
              <Badge variant="neutral" size="sm">
                3 Invoices
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Payment Date</TableHead>
                  <TableHead className="w-[38%]">Invoice Description</TableHead>
                  <TableHead className="w-[16%]">Amount</TableHead>
                  <TableHead className="w-[14%]">Status</TableHead>
                  <TableHead className="w-[12%] text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-cream-base/30 transition-colors">
                    <TableCell>
                      <span className="font-mono text-xs text-charcoal-dark font-medium">
                        {tx.date}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-xs sm:text-sm text-charcoal-dark">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-charcoal-muted font-mono mt-0.5">
                        Ref: {tx.invoiceRef}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-display font-bold text-xs sm:text-sm text-charcoal-dark">
                        {tx.amountFormatted}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tx.status === 'paid' ? (
                        <Badge variant="success" size="sm" showDot>
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          alert(`Downloading official receipt for invoice ${tx.invoiceRef}...`)
                        }
                        className="h-8 px-2.5 text-xs text-charcoal-muted hover:text-indigo-brand"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Upgrade Plan Modal */}
          <Modal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
            title="Upgrade School Subscription Plan"
            description="Choose the ideal plan tier for your institution's enrollment size and digital requirements."
            size="lg"
          >
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map((p) => {
                  const isSelected = selectedUpgradePlanId === p.id

                  return (
                    <SelectableCard
                      key={p.id}
                      selected={isSelected}
                      onSelect={() => setSelectedUpgradePlanId(p.id)}
                      accentColor="#4338CA"
                      className="p-4"
                    >
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-charcoal-dark font-display">
                            {p.name}
                          </span>
                          {p.isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-brand border border-indigo-100 uppercase">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="text-base sm:text-lg font-black font-display text-indigo-brand">
                          {p.priceFormatted}
                        </div>

                        <p className="text-[11px] text-charcoal-muted leading-tight">
                          {p.tagline}
                        </p>

                        <div className="pt-2 border-t border-cream-border space-y-1">
                          {p.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="text-[11px] text-charcoal-dark flex items-start gap-1">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SelectableCard>
                  )
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmUpgrade}
                  className="text-xs font-semibold px-4"
                >
                  Confirm Upgrade
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}
