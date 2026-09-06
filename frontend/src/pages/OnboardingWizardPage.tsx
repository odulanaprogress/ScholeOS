import React, { useState } from 'react'
import {
  Button,
  Card,
  Input,
  IconBadge,
  Badge,
  Stepper,
} from '@/components/ui'
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Check,
  Building2,
  BookOpen,
  Layers,
  Calculator,
  Sliders,
} from 'lucide-react'

export interface OnboardingWizardPageProps {
  onNavigateToHome: () => void
  onNavigateToLogin: () => void
  onNavigateToDashboard?: () => void
}

interface ScoreComponent {
  id: string
  name: string
  weight: number
}

const PRESET_COLORS = [
  { name: 'Royal Indigo', hex: '#4338CA' },
  { name: 'Forest Emerald', hex: '#059669' },
  { name: 'Deep Navy', hex: '#1E3A8A' },
  { name: 'Crimson Maroon', hex: '#991B1B' },
  { name: 'Warm Gold', hex: '#D4A017' },
  { name: 'Regal Purple', hex: '#7C3AED' },
]

export const OnboardingWizardPage: React.FC<OnboardingWizardPageProps> = ({
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [createdSuccess, setCreatedSuccess] = useState(false)

  // Step 1: School Details
  const [schoolName, setSchoolName] = useState('Kings Comprehensive College')
  const [schoolAbbr, setSchoolAbbr] = useState('KCC')
  const [schoolAddress, setSchoolAddress] = useState('12 Commercial Avenue, Yaba, Lagos')
  const [studentRange, setStudentRange] = useState('200-500')

  // Step 2: Branding
  const [accentColor, setAccentColor] = useState('#4338CA')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Step 3: Classes & Subjects
  const [classes, setClasses] = useState<string[]>([
    'JSS 1 Gold',
    'JSS 2 Diamond',
    'JSS 3 Silver',
    'SSS 1 Science',
    'SSS 2 Arts',
    'SSS 3 Commercial',
  ])
  const [subjects, setSubjects] = useState<string[]>([
    'Mathematics',
    'English Language',
    'Biology',
    'Chemistry',
    'Physics',
    'Economics',
    'Civic Education',
  ])

  // Step 4: Scoring System (Dynamic)
  const [scoreComponents, setScoreComponents] = useState<ScoreComponent[]>([
    { id: '1', name: 'Exam', weight: 60 },
    { id: '2', name: 'Welcome Back Test', weight: 20 },
    { id: '3', name: 'Final Test', weight: 20 },
  ])

  const stepsList = [
    { title: 'School Details', description: 'Name & location' },
    { title: 'Branding', description: 'Logo & colors' },
    { title: 'Classes & Subjects', description: 'Curriculum structure' },
    { title: 'Scoring System', description: 'Weight formulas' },
    { title: 'Review & Finish', description: 'Final confirmation' },
  ]

  // Calculate total score weight
  const totalWeight = scoreComponents.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
  const isWeightValid = totalWeight === 100

  // Starter template loader for Step 3
  const loadNigerianStarterTemplate = () => {
    setClasses(['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'SSS 1 Science', 'SSS 1 Arts', 'SSS 2 Science', 'SSS 3 WAEC'])
    setSubjects([
      'Mathematics',
      'English Language',
      'Basic Science',
      'Civic Education',
      'Agricultural Science',
      'Biology',
      'Chemistry',
      'Physics',
      'Economics',
      'Government',
    ])
  }

  // Handle image upload simulation
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

  // Scoring handlers
  const handleAddComponent = () => {
    const newId = Date.now().toString()
    setScoreComponents([...scoreComponents, { id: newId, name: 'Continuous Assessment', weight: 10 }])
  }

  const handleRemoveComponent = (id: string) => {
    if (scoreComponents.length <= 1) return
    setScoreComponents(scoreComponents.filter((item) => item.id !== id))
  }

  const handleUpdateComponent = (id: string, field: 'name' | 'weight', val: string | number) => {
    setScoreComponents(
      scoreComponents.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'weight' ? Number(val) || 0 : val,
          }
        }
        return item
      })
    )
  }

  // Validation rules per step
  const canContinue = () => {
    if (currentStep === 1) {
      return Boolean(schoolName.trim() && schoolAbbr.trim() && schoolAddress.trim())
    }
    if (currentStep === 2) {
      return Boolean(accentColor)
    }
    if (currentStep === 3) {
      return classes.length > 0 && subjects.length > 0
    }
    if (currentStep === 4) {
      return isWeightValid
    }
    return true
  }

  return (
    <div className="min-h-screen bg-cream-base flex flex-col font-sans selection:bg-indigo-brand selection:text-white p-4 sm:p-6 lg:p-8">
      {/* Top Bar Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-cream-border/60 pb-4">
        <button
          type="button"
          onClick={onNavigateToHome}
          className="flex items-center gap-3 select-none group text-left focus:outline-none"
        >
          <IconBadge size="sm" icon={<GraduationCap className="w-4 h-4 text-white" />} />
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tight text-indigo-brand group-hover:opacity-85 transition-opacity">
              ScholeOS
            </span>
            <span className="text-[10px] text-slate-subtle -mt-0.5 font-medium">
              School Setup Wizard
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-subtle hidden sm:inline">Already registered?</span>
          <Button variant="secondary" size="sm" onClick={onNavigateToLogin}>
            Log In
          </Button>
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="max-w-4xl w-full mx-auto my-6 sm:my-10 space-y-8">
        {/* Stepper Progress Bar */}
        <Stepper
          steps={stepsList}
          currentStep={currentStep}
          onStepClick={(s) => {
            if (s < currentStep) setCurrentStep(s)
          }}
        />

        {/* STEP CONTENT CONTAINER */}
        <div className="transition-all duration-300">
          {/* SUCCESS SCREEN */}
          {createdSuccess ? (
            <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <Badge variant="success" size="md">
                  School Provisioned Successfully
                </Badge>
                <h2 className="text-3xl font-display font-black text-charcoal-dark">
                  Welcome to ScholeOS, {schoolName}!
                </h2>
                <p className="text-sm text-slate-subtle max-w-md mx-auto leading-relaxed">
                  Your academic configuration for <span className="font-semibold text-charcoal-dark">{classes.length} classes</span> and{' '}
                  <span className="font-semibold text-charcoal-dark">{subjects.length} subjects</span> is active. Your grading formula ({scoreComponents.map((s) => `${s.name}: ${s.weight}%`).join(', ')}) is now locked for Term 1.
                </p>
              </div>

              <div className="bg-cream-base/50 p-5 rounded-2xl border border-cream-border/60 text-left space-y-2 font-mono text-xs">
                <p className="flex justify-between">
                  <span className="text-slate-subtle font-sans">School ID:</span>
                  <span className="font-bold text-charcoal-dark">SCH-{schoolAbbr.toUpperCase()}-2026</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-subtle font-sans">SMS Sender ID:</span>
                  <span className="font-bold text-charcoal-dark">{schoolAbbr.toUpperCase()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-subtle font-sans">Assessment Total:</span>
                  <span className="font-bold text-emerald-700">100% Verified</span>
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={onNavigateToDashboard || onNavigateToHome}
                  className="w-full sm:w-auto shadow-md"
                >
                  Go to School Dashboard
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onNavigateToHome}
                  className="w-full sm:w-auto"
                >
                  Return to Homepage
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sm:p-10 border border-black/[0.04]">
              {/* STEP 1: SCHOOL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-black text-charcoal-dark tracking-tight">
                      Step 1 — School Details
                    </h2>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Enter your official institution name, location, and student enrollment tier.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <Input
                      label="Official School Name"
                      placeholder="e.g. Corona Secondary School, Agbara"
                      icon={<Building2 className="w-4 h-4" />}
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="School Short Name / Abbreviation"
                        placeholder="e.g. CSSA or CORONA"
                        helperText="Used in SMS alerts, report card headers, and student IDs"
                        value={schoolAbbr}
                        onChange={(e) => setSchoolAbbr(e.target.value.toUpperCase())}
                        required
                      />

                      <div className="space-y-1.5 text-left font-sans">
                        <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                          Approximate Number of Students
                        </label>
                        <select
                          value={studentRange}
                          onChange={(e) => setStudentRange(e.target.value)}
                          className="w-full bg-white text-charcoal-dark text-sm rounded-xl py-2.5 px-4 border border-gray-200 hover:border-gray-300 focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 focus:outline-none transition-all shadow-sm font-sans"
                        >
                          <option value="Under 200">Under 200 students</option>
                          <option value="200-500">200 – 500 students</option>
                          <option value="500-1000">500 – 1,000 students</option>
                          <option value="1000+">1,000+ students</option>
                        </select>
                        <p className="text-[11px] text-slate-subtle mt-1">
                          Used for future tier capacity planning; not enforced here.
                        </p>
                      </div>
                    </div>

                    <Input
                      label="School Physical Address"
                      placeholder="Street address, City, State (e.g. Plot 4, Lekki Expressway, Lagos)"
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: BRANDING & COLORS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-black text-charcoal-dark tracking-tight">
                      Step 2 — School Branding
                    </h2>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Upload your official school logo and select your school's brand accent color.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-start">
                    {/* Left Column: Upload & Color Swatches */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Logo Upload Dropzone */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                          School Logo
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
                                Click to replace logo
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-xl bg-gold-brand/20 text-gold-brand flex items-center justify-center mb-2">
                                <Upload className="w-6 h-6" />
                              </div>
                              <p className="text-sm font-semibold text-charcoal-dark">
                                Upload your school logo
                              </p>
                              <p className="text-xs text-slate-subtle mt-0.5">
                                PNG, JPG, or SVG up to 5MB (transparent background recommended)
                              </p>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Accent Color Picker */}
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                          School Accent Color
                        </label>

                        {/* Preset Swatches */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {PRESET_COLORS.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => setAccentColor(preset.hex)}
                              className="group flex flex-col items-center space-y-1.5 focus:outline-none"
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border-2"
                                style={{
                                  backgroundColor: preset.hex,
                                  borderColor: accentColor === preset.hex ? '#1E1B1A' : 'transparent',
                                }}
                              >
                                {accentColor === preset.hex && (
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-subtle font-medium text-center">
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
                            className="w-9 h-9 rounded-xl cursor-pointer border border-gray-200 p-0.5"
                          />
                          <Input
                            label=""
                            placeholder="#4338CA"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="font-mono text-xs max-w-[140px]"
                          />
                          <span className="text-xs text-slate-subtle font-sans">
                            Custom Hex Code
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Header & Button Preview Panel */}
                    <div className="lg:col-span-5 bg-cream-base/40 p-5 rounded-2xl border border-cream-border/70 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                          Live Branding Preview
                        </span>
                        <Badge variant="primary" size="sm">
                          Dynamic
                        </Badge>
                      </div>

                      {/* Mock Mini Dashboard Header */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-black/[0.04] space-y-3">
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
                                {schoolAbbr.slice(0, 2) || 'SC'}
                              </div>
                            )}
                            <div>
                              <p
                                className="font-display font-bold text-xs leading-tight"
                                style={{ color: accentColor }}
                              >
                                {schoolName || 'Your School Name'}
                              </p>
                              <p className="text-[10px] text-slate-subtle">
                                Term 1 Portal
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

                        {/* Sample Heading and Button */}
                        <div className="space-y-2">
                          <h4
                            className="font-display font-black text-sm tracking-tight"
                            style={{ color: accentColor }}
                          >
                            Welcome, Principal & Staff
                          </h4>
                          <p className="text-xs text-slate-subtle">
                            Broadsheets and results will reflect your chosen color scheme.
                          </p>
                          <button
                            type="button"
                            className="px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
                            style={{ backgroundColor: accentColor }}
                          >
                            Sample Primary Action
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CLASSES & SUBJECTS */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-display font-black text-charcoal-dark tracking-tight">
                        Step 3 — Classes & Subjects
                      </h2>
                      <p className="text-sm text-slate-subtle leading-relaxed">
                        Configure the classes and core curriculum subjects taught at your school.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Sparkles className="w-4 h-4 text-gold-brand" />}
                      onClick={loadNigerianStarterTemplate}
                    >
                      Load a starter template
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                    {/* Classes Repeatable List */}
                    <div className="space-y-3 bg-cream-base/30 p-5 rounded-2xl border border-cream-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-brand" />
                          Classes ({classes.length})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                          onClick={() => setClasses([...classes, `Class ${classes.length + 1}`])}
                        >
                          Add Class
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {classes.map((cls, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cls}
                              onChange={(e) => {
                                const next = [...classes]
                                next[index] = e.target.value
                                setClasses(next)
                              }}
                              className="w-full bg-white text-charcoal-dark text-sm rounded-xl py-2 px-3.5 border border-gray-200 focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                              placeholder="e.g. JSS1 Diamond"
                            />
                            <button
                              type="button"
                              onClick={() => setClasses(classes.filter((_, i) => i !== index))}
                              className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                              aria-label="Delete class"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subjects Repeatable List */}
                    <div className="space-y-3 bg-cream-base/30 p-5 rounded-2xl border border-cream-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-gold-brand" />
                          Subjects ({subjects.length})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                          onClick={() => setSubjects([...subjects, `Subject ${subjects.length + 1}`])}
                        >
                          Add Subject
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {subjects.map((sub, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={sub}
                              onChange={(e) => {
                                const next = [...subjects]
                                next[index] = e.target.value
                                setSubjects(next)
                              }}
                              className="w-full bg-white text-charcoal-dark text-sm rounded-xl py-2 px-3.5 border border-gray-200 focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                              placeholder="e.g. Mathematics"
                            />
                            <button
                              type="button"
                              onClick={() => setSubjects(subjects.filter((_, i) => i !== index))}
                              className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                              aria-label="Delete subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DYNAMIC SCORING SYSTEM */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-black text-charcoal-dark tracking-tight">
                      Set up how your school calculates results
                    </h2>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Add each component of your assessment (for example, Exam, Tests, Assignments) and assign a weight to each. Your weights must add up to 100.
                    </p>
                  </div>

                  {/* Pre-fill editable callout notice */}
                  <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-sans">
                    <Sliders className="w-4 h-4 text-gold-brand shrink-0 mt-0.5" />
                    <span>
                      <strong>Editable Example Default:</strong> The pre-filled components below (Exam 60, Welcome Back Test 20, Final Test 20) are standard examples. Feel free to rename, re-weight, or add/delete components to match your school's exact continuous assessment policy.
                    </span>
                  </div>

                  {/* Repeatable Scoring Components List */}
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-12 gap-3 text-xs font-display font-bold uppercase tracking-wider text-slate-subtle px-2">
                      <span className="col-span-7 sm:col-span-8">Assessment Component Name</span>
                      <span className="col-span-3 sm:col-span-3">Weight (%)</span>
                      <span className="col-span-2 sm:col-span-1 text-center">Action</span>
                    </div>

                    <div className="space-y-2.5">
                      {scoreComponents.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-12 gap-3 items-center bg-cream-base/30 p-2.5 rounded-xl border border-cream-border/60"
                        >
                          <div className="col-span-7 sm:col-span-8">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateComponent(item.id, 'name', e.target.value)}
                              className="w-full bg-white text-charcoal-dark text-sm rounded-lg py-2 px-3 border border-gray-200 focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                              placeholder="e.g. Mid-term Assessment"
                            />
                          </div>

                          <div className="col-span-3 sm:col-span-3">
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.weight}
                                onChange={(e) => handleUpdateComponent(item.id, 'weight', e.target.value)}
                                className="w-full bg-white text-charcoal-dark text-sm font-mono font-bold rounded-lg py-2 pl-3 pr-8 border border-gray-200 focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand focus:outline-none"
                              />
                              <span className="absolute right-3 text-xs text-slate-400 font-mono pointer-events-none">
                                %
                              </span>
                            </div>
                          </div>

                          <div className="col-span-2 sm:col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(item.id)}
                              disabled={scoreComponents.length <= 1}
                              className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              aria-label="Delete component"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={handleAddComponent}
                      >
                        Add Component
                      </Button>

                      {/* Running Total Indicator */}
                      <div
                        className={`px-4 py-2 rounded-full font-display font-bold text-sm flex items-center gap-2 border ${
                          isWeightValid
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <Calculator className="w-4 h-4" />
                        <span>Total: {totalWeight} / 100%</span>
                        {isWeightValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
                        ) : (
                          <span className="text-xs font-normal text-rose-600 font-sans">
                            (Must equal 100)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & FINISH */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-black text-charcoal-dark tracking-tight">
                      Step 5 — Review & Finish
                    </h2>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Verify your school's configuration before provisioning your academic portal.
                    </p>
                  </div>

                  <div className="space-y-6 pt-2">
                    {/* Details Summary Card */}
                    <div className="bg-cream-base/40 p-6 rounded-2xl border border-cream-border/70 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-cream-border">
                        <div className="flex items-center gap-3">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="w-10 h-10 object-contain rounded-xl border border-gray-200 bg-white"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: accentColor }}
                            >
                              {schoolAbbr.slice(0, 2) || 'SC'}
                            </div>
                          )}
                          <div>
                            <h3 className="font-display font-bold text-base text-charcoal-dark">
                              {schoolName}
                            </h3>
                            <p className="text-xs text-slate-subtle">
                              Abbreviation: <strong className="text-charcoal-dark">{schoolAbbr}</strong> · Enrollment:{' '}
                              <strong className="text-charcoal-dark">{studentRange}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 inline-block shadow-xs"
                            style={{ backgroundColor: accentColor }}
                            title="Accent Color"
                          />
                          <Badge variant="primary" size="sm">
                            Ready
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-slate-subtle">
                        <span className="font-semibold text-charcoal-dark">Campus Address:</span> {schoolAddress}
                      </div>
                    </div>

                    {/* Classes & Subjects Count */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-black/[0.04] shadow-xs space-y-2">
                        <span className="text-xs font-display font-bold uppercase text-slate-subtle block">
                          Configured Classes ({classes.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {classes.slice(0, 6).map((c) => (
                            <span
                              key={c}
                              className="px-2.5 py-0.5 rounded-md bg-cream-base text-[11px] font-medium text-charcoal-dark"
                            >
                              {c}
                            </span>
                          ))}
                          {classes.length > 6 && (
                            <span className="text-[11px] text-slate-subtle self-center">
                              +{classes.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-black/[0.04] shadow-xs space-y-2">
                        <span className="text-xs font-display font-bold uppercase text-slate-subtle block">
                          Core Subjects ({subjects.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subjects.slice(0, 5).map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-0.5 rounded-md bg-indigo-light text-[11px] font-medium text-indigo-brand"
                            >
                              {s}
                            </span>
                          ))}
                          {subjects.length > 5 && (
                            <span className="text-[11px] text-slate-subtle self-center">
                              +{subjects.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scoring Breakdown List */}
                    <div className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase text-charcoal-dark">
                          Continuous Assessment & Exam Scoring Weights
                        </span>
                        <Badge variant="success" size="sm">
                          100% Total
                        </Badge>
                      </div>

                      <div className="divide-y divide-gray-100 text-xs">
                        {scoreComponents.map((item) => (
                          <div key={item.id} className="py-2 flex items-center justify-between">
                            <span className="font-semibold text-charcoal-dark">{item.name}</span>
                            <span className="font-mono font-bold text-indigo-brand">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS BAR AT BOTTOM OF CARD */}
              <div className="pt-8 mt-8 border-t border-cream-border/60 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="text-xs sm:text-sm font-semibold text-slate-subtle hover:text-charcoal-dark flex items-center gap-1.5 transition-colors focus:outline-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onNavigateToHome}
                    className="text-xs sm:text-sm font-semibold text-slate-subtle hover:text-charcoal-dark flex items-center gap-1.5 transition-colors focus:outline-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <Button
                    variant="primary"
                    size="md"
                    disabled={!canContinue()}
                    onClick={() => setCurrentStep((s) => s + 1)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setCreatedSuccess(true)}
                    rightIcon={<Check className="w-4 h-4 stroke-[3]" />}
                    className="shadow-lg shadow-indigo-900/15"
                  >
                    Create My School
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer Minimal */}
      <div className="text-center py-4 text-xs text-gray-400">
        <p>© 2026 ScholeOS. Next-generation school operating platform for Nigeria.</p>
      </div>
    </div>
  )
}
