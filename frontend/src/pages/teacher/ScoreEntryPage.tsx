import React, { useState } from 'react'
import {
  Save,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Info,
} from 'lucide-react'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

export interface AssessmentComponent {
  id: string
  name: string
  maxWeight: number
}

export interface StudentScoreRow {
  studentId: string
  admissionNo: string
  fullName: string
  scores: Record<string, number | ''>
}

export interface ClassScoreSheet {
  id: string
  className: string
  subject: string
  status: 'draft' | 'submitted' | 'locked'
  components: AssessmentComponent[]
  students: StudentScoreRow[]
}

const DEFAULT_ASSESSMENT_COMPONENTS: AssessmentComponent[] = [
  { id: 'exam', name: 'Exam', maxWeight: 60 },
  { id: 'test1', name: 'Welcome Back Test', maxWeight: 20 },
  { id: 'test2', name: 'Final CA Test', maxWeight: 20 },
]

const INITIAL_CLASSES: ClassScoreSheet[] = [
  {
    id: 'jss2a-math',
    className: 'JSS 2A',
    subject: 'Mathematics',
    status: 'draft',
    components: DEFAULT_ASSESSMENT_COMPONENTS,
    students: [
      {
        studentId: 's1',
        admissionNo: 'JSS2/001',
        fullName: 'Adeleke Kehinde',
        scores: { exam: 52, test1: 18, test2: 17 },
      },
      {
        studentId: 's2',
        admissionNo: 'JSS2/002',
        fullName: 'Adesina Oluwaseun',
        scores: { exam: 48, test1: 16, test2: 19 },
      },
      {
        studentId: 's3',
        admissionNo: 'JSS2/003',
        fullName: 'Bello Fatima',
        scores: { exam: 58, test1: 19, test2: 20 },
      },
      {
        studentId: 's4',
        admissionNo: 'JSS2/004',
        fullName: 'Chinedu Emeka',
        scores: { exam: 41, test1: 14, test2: 15 },
      },
      {
        studentId: 's5',
        admissionNo: 'JSS2/005',
        fullName: 'Danladi Musa',
        scores: { exam: 35, test1: 12, test2: 14 },
      },
      {
        studentId: 's6',
        admissionNo: 'JSS2/006',
        fullName: 'Eze Chioma',
        scores: { exam: 54, test1: 19, test2: 18 },
      },
      {
        studentId: 's7',
        admissionNo: 'JSS2/007',
        fullName: 'Ibrahim Zainab',
        scores: { exam: 46, test1: 15, test2: 16 },
      },
      {
        studentId: 's8',
        admissionNo: 'JSS2/008',
        fullName: 'Nwosu Somtochukwu',
        scores: { exam: 60, test1: 20, test2: 19 },
      },
      {
        studentId: 's9',
        admissionNo: 'JSS2/009',
        fullName: 'Okafor Nnamdi',
        scores: { exam: 39, test1: 11, test2: 13 },
      },
      {
        studentId: 's10',
        admissionNo: 'JSS2/010',
        fullName: 'Oladipo Temitope',
        scores: { exam: '', test1: 17, test2: 18 },
      },
    ],
  },
  {
    id: 'jss2b-math',
    className: 'JSS 2B',
    subject: 'Mathematics',
    status: 'submitted',
    components: DEFAULT_ASSESSMENT_COMPONENTS,
    students: [
      {
        studentId: 'sb1',
        admissionNo: 'JSS2/041',
        fullName: 'Abubakar Usman',
        scores: { exam: 51, test1: 17, test2: 16 },
      },
      {
        studentId: 'sb2',
        admissionNo: 'JSS2/042',
        fullName: 'Ajayi Morayo',
        scores: { exam: 56, test1: 19, test2: 19 },
      },
      {
        studentId: 'sb3',
        admissionNo: 'JSS2/043',
        fullName: 'Babatunde Folarin',
        scores: { exam: 45, test1: 15, test2: 14 },
      },
      {
        studentId: 'sb4',
        admissionNo: 'JSS2/044',
        fullName: 'Lawal Rasheedat',
        scores: { exam: 58, test1: 20, test2: 19 },
      },
      {
        studentId: 'sb5',
        admissionNo: 'JSS2/045',
        fullName: 'Okeke Tochukwu',
        scores: { exam: 42, test1: 14, test2: 15 },
      },
    ],
  },
  {
    id: 'sss1-physics',
    className: 'SSS 1 Science',
    subject: 'Physics',
    status: 'locked',
    components: [
      { id: 'exam', name: 'Exam', maxWeight: 60 },
      { id: 'practical', name: 'Lab Practical', maxWeight: 20 },
      { id: 'test1', name: 'Theory CA', maxWeight: 20 },
    ],
    students: [
      {
        studentId: 'ss1',
        admissionNo: 'SSS1/101',
        fullName: 'Balogun Titilayo',
        scores: { exam: 55, practical: 19, test1: 18 },
      },
      {
        studentId: 'ss2',
        admissionNo: 'SSS1/102',
        fullName: 'David Chukwuebuka',
        scores: { exam: 52, practical: 17, test1: 16 },
      },
      {
        studentId: 'ss3',
        admissionNo: 'SSS1/103',
        fullName: 'Kolawole Ifeoluwa',
        scores: { exam: 49, practical: 18, test1: 15 },
      },
      {
        studentId: 'ss4',
        admissionNo: 'SSS1/104',
        fullName: 'Yakubu Amina',
        scores: { exam: 57, practical: 20, test1: 19 },
      },
    ],
  },
]

export interface ScoreEntryPageProps {
  initialAssignmentId?: string
}

export const ScoreEntryPage: React.FC<ScoreEntryPageProps> = ({
  initialAssignmentId = 'jss2a-math',
}) => {
  const [classesData, setClassesData] = useState<ClassScoreSheet[]>(INITIAL_CLASSES)
  const [activeClassId, setActiveClassId] = useState<string>(initialAssignmentId)

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false)
  const [reopenReason, setReopenReason] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Active sheet
  const activeSheet = classesData.find((c) => c.id === activeClassId) || classesData[0]

  // Tab items for classes
  const tabItems: TabItem[] = classesData.map((c) => ({
    id: c.id,
    label: `${c.className} — ${c.subject}`,
    badge: c.status === 'draft' ? 'Draft' : c.status === 'submitted' ? 'Submitted' : 'Locked',
  }))

  // Handle Score Input Change
  const handleScoreChange = (
    studentId: string,
    componentId: string,
    rawVal: string
  ) => {
    if (activeSheet.status !== 'draft') return

    let numVal: number | '' = ''
    if (rawVal.trim() !== '') {
      const parsed = parseFloat(rawVal)
      if (!isNaN(parsed)) {
        numVal = parsed
      }
    }

    setClassesData((prev) =>
      prev.map((sheet) => {
        if (sheet.id !== activeSheet.id) return sheet
        return {
          ...sheet,
          students: sheet.students.map((student) => {
            if (student.studentId !== studentId) return student
            return {
              ...student,
              scores: {
                ...student.scores,
                [componentId]: numVal,
              },
            }
          }),
        }
      })
    )
  }

  // Calculate Row Total
  const calculateTotal = (scores: Record<string, number | ''>): number => {
    return Object.values(scores).reduce<number>((sum, val) => {
      if (typeof val === 'number' && !isNaN(val)) {
        return sum + val
      }
      return sum
    }, 0)
  }

  // WAEC Grade standard calculation
  const getGrade = (total: number): { label: string; tone: string } => {
    if (total >= 75) return { label: 'A1', tone: 'bg-emerald-100 text-emerald-800' }
    if (total >= 70) return { label: 'B2', tone: 'bg-emerald-50 text-emerald-700' }
    if (total >= 65) return { label: 'B3', tone: 'bg-sky-100 text-sky-800' }
    if (total >= 60) return { label: 'C4', tone: 'bg-sky-50 text-sky-700' }
    if (total >= 55) return { label: 'C5', tone: 'bg-indigo-50 text-indigo-700' }
    if (total >= 50) return { label: 'C6', tone: 'bg-amber-50 text-amber-700' }
    if (total >= 45) return { label: 'D7', tone: 'bg-amber-100 text-amber-800' }
    if (total >= 40) return { label: 'E8', tone: 'bg-rose-50 text-rose-700' }
    return { label: 'F9', tone: 'bg-rose-100 text-rose-800' }
  }

  // Check if any student has an error (score > maxWeight)
  const hasValidationErrors = activeSheet.students.some((student) =>
    activeSheet.components.some((comp) => {
      const val = student.scores[comp.id]
      return typeof val === 'number' && (val < 0 || val > comp.maxWeight)
    })
  )

  // Save Draft Action
  const handleSaveDraft = () => {
    showToast('Draft scores saved successfully! Changes are preserved.')
  }

  // Confirm Submit Action
  const handleConfirmSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setClassesData((prev) =>
        prev.map((c) => (c.id === activeSheet.id ? { ...c, status: 'submitted' } : c))
      )
      setIsSubmitting(false)
      setIsSubmitModalOpen(false)
      showToast(
        `Scores for ${activeSheet.className} (${activeSheet.subject}) submitted for Principal approval!`
      )
    }, 700)
  }

  // Send Reopen Request
  const handleSendReopenRequest = () => {
    if (!reopenReason.trim()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsReopenModalOpen(false)
      setReopenReason('')
      showToast('Correction request sent to the School Principal & Class Teacher.')
    }, 600)
  }

  // Computations for quick statistics
  const totals = activeSheet.students.map((s) => calculateTotal(s.scores))
  const avgScore =
    totals.length > 0
      ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)
      : '0.0'
  const highestScore = totals.length > 0 ? Math.max(...totals) : 0
  const lowestScore = totals.length > 0 ? Math.min(...totals) : 0

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast alert message */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP TABS ROW (SWITCH BETWEEN ASSIGNED CLASSES) */}
      <div className="bg-cream-surface rounded-2xl p-2 sm:p-3 border border-cream-border shadow-xs">
        <Tabs
          tabs={tabItems}
          activeTab={activeClassId}
          onChange={(id) => setActiveClassId(id)}
          variant="underline"
        />
      </div>

      {/* 2. SUBMISSION STATUS & QUICK STATS BAR */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cream-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-brand text-white flex items-center justify-center font-display font-bold text-sm shadow-xs">
              {activeSheet.className.split(' ')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-charcoal-dark">
                  {activeSheet.className} — {activeSheet.subject}
                </h2>
                {activeSheet.status === 'draft' && (
                  <Badge variant="neutral" size="sm">
                    Draft • Editable
                  </Badge>
                )}
                {activeSheet.status === 'submitted' && (
                  <Badge variant="success" size="sm">
                    Submitted • Read-Only
                  </Badge>
                )}
                {activeSheet.status === 'locked' && (
                  <Badge variant="primary" size="sm">
                    Locked • Approved
                  </Badge>
                )}
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Term 2 Continuous Assessment & Examination Grade Roster ({activeSheet.students.length} students)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-charcoal-muted">
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
              <span className="block text-[10px] font-bold text-charcoal-muted uppercase">Class Average</span>
              <span className="font-display font-bold text-charcoal-dark text-sm">{avgScore} / 100</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
              <span className="block text-[10px] font-bold text-charcoal-muted uppercase">Highest Score</span>
              <span className="font-display font-bold text-emerald-700 text-sm">{highestScore}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
              <span className="block text-[10px] font-bold text-charcoal-muted uppercase">Lowest Score</span>
              <span className="font-display font-bold text-amber-800 text-sm">{lowestScore}</span>
            </div>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-charcoal-muted">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-brand shrink-0" />
            <span>
              {activeSheet.status === 'draft'
                ? 'Enter marks for each configured assessment. Totals update live.'
                : 'This score sheet has been submitted for official broadsheet calculation and cannot be edited directly.'}
            </span>
          </span>
          {hasValidationErrors && (
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              One or more marks exceed the allowed maximum!
            </span>
          )}
        </div>
      </Card>

      {/* 3. DYNAMIC SCORE ENTRY TABLE */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[750px]">
            {/* Header with dynamic assessment weights */}
            <thead>
              <tr className="bg-cream-base/50 text-charcoal-muted border-b border-cream-border">
                <th className="sticky left-0 bg-cream-base/95 backdrop-blur-xs z-10 px-4 sm:px-6 py-3.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark border-r border-cream-border min-w-[200px]">
                  Student Name
                </th>
                {activeSheet.components.map((comp) => (
                  <th
                    key={comp.id}
                    className="px-4 py-3.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark text-center min-w-[130px]"
                  >
                    <div>{comp.name}</div>
                    <div className="text-[10px] font-semibold text-indigo-brand lowercase">
                      (max {comp.maxWeight})
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark text-center min-w-[110px]">
                  Total (100)
                </th>
                <th className="px-4 py-3.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark text-center min-w-[90px]">
                  Grade
                </th>
              </tr>
            </thead>

            {/* Body rows with sticky Student Name column */}
            <tbody className="divide-y divide-cream-border/60">
              {activeSheet.students.map((student, sIdx) => {
                const total = calculateTotal(student.scores)
                const grade = getGrade(total)

                return (
                  <tr
                    key={student.studentId}
                    className="hover:bg-cream-base/30 transition-colors group"
                  >
                    {/* Sticky Student Name & ID */}
                    <td className="sticky left-0 bg-cream-surface group-hover:bg-cream-base/40 transition-colors z-10 px-4 sm:px-6 py-3 border-r border-cream-border">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-charcoal-muted/50 w-5 shrink-0">
                          {sIdx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-charcoal-dark text-sm leading-snug">
                            {student.fullName}
                          </p>
                          <p className="text-[11px] text-charcoal-muted/70 font-mono">
                            {student.admissionNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Dynamic Assessment Score Cells */}
                    {activeSheet.components.map((comp) => {
                      const val = student.scores[comp.id]
                      const isOverMax =
                        typeof val === 'number' && (val < 0 || val > comp.maxWeight)

                      return (
                        <td key={comp.id} className="px-4 py-2.5 text-center">
                          {activeSheet.status === 'draft' ? (
                            <div className="flex flex-col items-center">
                              <input
                                type="number"
                                min="0"
                                max={comp.maxWeight}
                                step="0.5"
                                value={val}
                                onChange={(e) =>
                                  handleScoreChange(
                                    student.studentId,
                                    comp.id,
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className={cn(
                                  'w-20 px-2.5 py-1.5 text-center text-sm font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2',
                                  isOverMax
                                    ? 'border-rose-500 bg-rose-50/80 text-rose-800 focus:ring-rose-400'
                                    : 'border-cream-border bg-white text-charcoal-dark focus:border-indigo-brand focus:ring-indigo-brand/20'
                                )}
                              />
                              {isOverMax && (
                                <span className="text-[10px] text-rose-600 font-bold mt-0.5">
                                  Exceeds {comp.maxWeight}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="font-semibold text-charcoal-dark text-sm">
                              {val !== '' ? val : '—'}
                            </span>
                          )}
                        </td>
                      )
                    })}

                    {/* Total (auto-calculated & read-only) */}
                    <td className="px-4 py-2.5 text-center font-display font-bold text-charcoal-dark">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-cream-base/60 text-xs sm:text-sm">
                        {total}
                      </span>
                    </td>

                    {/* Nigerian WAEC Grade Preview */}
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center font-display font-bold text-xs px-2 py-0.5 rounded-md shadow-2xs',
                          grade.tone
                        )}
                      >
                        {grade.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER ACTIONS */}
        <div className="p-4 sm:p-6 bg-cream-base/30 border-t border-cream-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-charcoal-muted text-center sm:text-left">
            {activeSheet.status === 'draft' ? (
              <span>
                Tip: Save drafts as often as needed. Submitting will lock scores for review by the Form Master.
              </span>
            ) : (
              <span>
                Scores submitted on Sep 4, 2026. Only the Principal or Class Teacher can reopen this sheet.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeSheet.status === 'draft' ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={hasValidationErrors}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Draft
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(true)}
                  disabled={hasValidationErrors}
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit for Review
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsReopenModalOpen(true)}
              >
                <RotateCcw className="w-4 h-4 mr-1.5 text-indigo-brand" />
                Request to Reopen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL: SUBMIT FOR REVIEW */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit Scores: ${activeSheet.className} — ${activeSheet.subject}?`}
        description="Please confirm that all continuous assessment tests and exam results are accurate."
        confirmLabel="Confirm & Submit"
        confirmLoading={isSubmitting}
        onConfirm={handleConfirmSubmit}
        size="md"
      >
        <div className="space-y-3">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Official Submission Lock</p>
              <p className="mt-0.5">
                Once submitted, you won't be able to edit these scores unless the class teacher or admin reopens them for you.
              </p>
            </div>
          </div>

          <div className="border border-cream-border rounded-xl p-3 bg-cream-base/30 text-xs space-y-1.5">
            <div className="flex justify-between text-charcoal-muted">
              <span>Total Students Scored:</span>
              <span className="font-bold text-charcoal-dark">{activeSheet.students.length}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Class Average Total:</span>
              <span className="font-bold text-charcoal-dark">{avgScore} / 100</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Broadsheet Destination:</span>
              <span className="font-bold text-charcoal-dark">{activeSheet.className} Master Broadsheet</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL: REQUEST TO REOPEN */}
      <Modal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        title="Request Score Correction / Reopen"
        description={`Provide a reason to the Principal to unlock ${activeSheet.className} (${activeSheet.subject}) scores.`}
        confirmLabel="Send Request"
        confirmLoading={isSubmitting}
        onConfirm={handleSendReopenRequest}
        confirmDisabled={!reopenReason.trim()}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Reason for Correction
            </label>
            <textarea
              rows={4}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. A recount of Adeleke Kehinde's paper showed an omission of 4 marks in question 3..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-surface text-charcoal-dark placeholder:text-charcoal-muted/50 rounded-xl border border-cream-border focus:border-indigo-brand focus:outline-none focus:ring-2 focus:ring-indigo-brand/20 transition-all resize-none"
            />
          </div>

          <div className="p-3 bg-cream-base/50 rounded-xl border border-cream-border text-xs text-charcoal-muted">
            The School Principal (Alhaji Dr. S. Bello) will receive an instant notification and can approve the unlock.
          </div>
        </div>
      </Modal>
    </div>
  )
}
