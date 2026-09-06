import React, { useState, useMemo } from 'react'
import {
  Lock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MessageSquare,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/utils/cn'

export interface StudentSubjectScore {
  subjectId: string
  subjectName: string
  caTotal: number // e.g. 40
  examScore: number // e.g. 60
  total: number // out of 100
  grade: string
  remark: string
}

export interface BroadsheetStudent {
  studentId: string
  admissionNo: string
  fullName: string
  gender: 'M' | 'F'
  subjectScores: Record<string, number> // subjectId -> total (0-100)
  detailedScores: StudentSubjectScore[]
  teacherComment?: string
}

export interface RankedBroadsheetStudent extends BroadsheetStudent {
  overallTotal: number
  average: number
  positionNumber: number
  positionLabel: string
}

const BROADSHEET_SUBJECTS = [
  { id: 'math', name: 'Mathematics', abbr: 'MATH' },
  { id: 'eng', name: 'English Language', abbr: 'ENG' },
  { id: 'sci', name: 'Basic Science', abbr: 'SCI' },
  { id: 'soc', name: 'Social Studies', abbr: 'SOC' },
  { id: 'agri', name: 'Agricultural Science', abbr: 'AGRI' },
  { id: 'bus', name: 'Business Studies', abbr: 'BUS' },
  { id: 'civ', name: 'Civic Education', abbr: 'CIV' },
  { id: 'fre', name: 'French Language', abbr: 'FRE' },
]

const INITIAL_BROADSHEET_STUDENTS: BroadsheetStudent[] = [
  {
    studentId: 's1',
    admissionNo: 'JSS2/001',
    fullName: 'Adeleke Kehinde',
    gender: 'M',
    subjectScores: { math: 87, eng: 82, sci: 85, soc: 79, agri: 88, bus: 84, civ: 90, fre: 78 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 35, examScore: 52, total: 87, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 34, examScore: 48, total: 82, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 37, examScore: 48, total: 85, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 31, examScore: 48, total: 79, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 36, examScore: 52, total: 88, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 34, examScore: 50, total: 84, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 38, examScore: 52, total: 90, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 32, examScore: 46, total: 78, grade: 'A1', remark: 'Distinction' },
    ],
    teacherComment: 'An outstanding student with exceptional intellectual curiosity and leadership skills.',
  },
  {
    studentId: 's2',
    admissionNo: 'JSS2/002',
    fullName: 'Nwosu Somtochukwu',
    gender: 'M',
    subjectScores: { math: 98, eng: 74, sci: 92, soc: 75, agri: 82, bus: 80, civ: 86, fre: 73 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 39, examScore: 59, total: 98, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 30, examScore: 44, total: 74, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 38, examScore: 54, total: 92, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 29, examScore: 46, total: 75, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 34, examScore: 48, total: 82, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 32, examScore: 48, total: 80, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 36, examScore: 50, total: 86, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 29, examScore: 44, total: 73, grade: 'B2', remark: 'Very Good' },
    ],
    teacherComment: 'Gifted problem solver with top honors in quantitative sciences. Commendable effort.',
  },
  {
    studentId: 's3',
    admissionNo: 'JSS2/003',
    fullName: 'Bello Fatima',
    gender: 'F',
    subjectScores: { math: 97, eng: 86, sci: 88, soc: 82, agri: 79, bus: 88, civ: 85, fre: 81 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 39, examScore: 58, total: 97, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 36, examScore: 50, total: 86, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 36, examScore: 52, total: 88, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 34, examScore: 48, total: 82, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 31, examScore: 48, total: 79, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 38, examScore: 50, total: 88, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 35, examScore: 50, total: 85, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 33, examScore: 48, total: 81, grade: 'A1', remark: 'Distinction' },
    ],
    teacherComment: 'Very diligent and consistent across both humanities and sciences. Keep it up!',
  },
  {
    studentId: 's4',
    admissionNo: 'JSS2/004',
    fullName: 'Eze Chioma',
    gender: 'F',
    subjectScores: { math: 91, eng: 80, sci: 84, soc: 76, agri: 82, bus: 81, civ: 80, fre: 75 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 37, examScore: 54, total: 91, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 32, examScore: 48, total: 80, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 34, examScore: 50, total: 84, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 30, examScore: 46, total: 76, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 34, examScore: 48, total: 82, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 33, examScore: 48, total: 81, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 32, examScore: 48, total: 80, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 31, examScore: 44, total: 75, grade: 'A1', remark: 'Distinction' },
    ],
    teacherComment: 'Excellent academic performance and exemplary personal discipline.',
  },
  {
    studentId: 's5',
    admissionNo: 'JSS2/005',
    fullName: 'Adesina Oluwaseun',
    gender: 'M',
    subjectScores: { math: 83, eng: 76, sci: 78, soc: 72, agri: 75, bus: 77, civ: 81, fre: 70 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 35, examScore: 48, total: 83, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 30, examScore: 46, total: 76, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 32, examScore: 46, total: 78, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 28, examScore: 44, total: 72, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 31, examScore: 44, total: 75, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 31, examScore: 46, total: 77, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 33, examScore: 48, total: 81, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 28, examScore: 42, total: 70, grade: 'B2', remark: 'Very Good' },
    ],
    teacherComment: 'Good performance. More focus on Social Studies will elevate overall standing.',
  },
  {
    studentId: 's6',
    admissionNo: 'JSS2/006',
    fullName: 'Ibrahim Zainab',
    gender: 'F',
    subjectScores: { math: 77, eng: 75, sci: 72, soc: 70, agri: 74, bus: 76, civ: 78, fre: 68 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 31, examScore: 46, total: 77, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 31, examScore: 44, total: 75, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 28, examScore: 44, total: 72, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 28, examScore: 42, total: 70, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 30, examScore: 44, total: 74, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 30, examScore: 46, total: 76, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 32, examScore: 46, total: 78, grade: 'A1', remark: 'Distinction' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 26, examScore: 42, total: 68, grade: 'B3', remark: 'Good' },
    ],
    teacherComment: 'Satisfactory term output. Capable of higher achievements with sustained effort.',
  },
  {
    studentId: 's7',
    admissionNo: 'JSS2/007',
    fullName: 'Chinedu Emeka',
    gender: 'M',
    subjectScores: { math: 70, eng: 68, sci: 69, soc: 66, agri: 70, bus: 65, civ: 72, fre: 62 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 29, examScore: 41, total: 70, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 26, examScore: 42, total: 68, grade: 'B3', remark: 'Good' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 27, examScore: 42, total: 69, grade: 'B3', remark: 'Good' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 26, examScore: 40, total: 66, grade: 'B3', remark: 'Good' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 28, examScore: 42, total: 70, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 25, examScore: 40, total: 65, grade: 'B3', remark: 'Good' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 28, examScore: 44, total: 72, grade: 'B2', remark: 'Very Good' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 24, examScore: 38, total: 62, grade: 'C4', remark: 'Credit' },
    ],
    teacherComment: 'Good overall standing. Encouraged to participate more actively during language drills.',
  },
  {
    studentId: 's8',
    admissionNo: 'JSS2/008',
    fullName: 'Danladi Musa',
    gender: 'M',
    subjectScores: { math: 61, eng: 62, sci: 64, soc: 60, agri: 65, bus: 61, civ: 66, fre: 58 },
    detailedScores: [
      { subjectId: 'math', subjectName: 'Mathematics', caTotal: 26, examScore: 35, total: 61, grade: 'C4', remark: 'Credit' },
      { subjectId: 'eng', subjectName: 'English Language', caTotal: 26, examScore: 36, total: 62, grade: 'C4', remark: 'Credit' },
      { subjectId: 'sci', subjectName: 'Basic Science', caTotal: 26, examScore: 38, total: 64, grade: 'C4', remark: 'Credit' },
      { subjectId: 'soc', subjectName: 'Social Studies', caTotal: 24, examScore: 36, total: 60, grade: 'C4', remark: 'Credit' },
      { subjectId: 'agri', subjectName: 'Agricultural Science', caTotal: 27, examScore: 38, total: 65, grade: 'B3', remark: 'Good' },
      { subjectId: 'bus', subjectName: 'Business Studies', caTotal: 25, examScore: 36, total: 61, grade: 'C4', remark: 'Credit' },
      { subjectId: 'civ', subjectName: 'Civic Education', caTotal: 28, examScore: 38, total: 66, grade: 'B3', remark: 'Good' },
      { subjectId: 'fre', subjectName: 'French Language', caTotal: 24, examScore: 34, total: 58, grade: 'C5', remark: 'Credit' },
    ],
    teacherComment: 'Average performance across board. Needs additional tutoring in Mathematics fundamentals.',
  },
]

// Helper for ordinal suffix (1st, 2nd, 3rd, 4th...)
const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export interface BroadsheetPageProps {
  className?: string
  allSubjectsSubmitted?: boolean
  onNavigateToTracker?: () => void
}

export const BroadsheetPage: React.FC<BroadsheetPageProps> = ({
  className = 'JSS 2A',
  allSubjectsSubmitted: initialAllSubmitted = false,
  onNavigateToTracker,
}) => {
  // Demonstration state toggle: allows reviewing both pending and all-submitted states!
  const [allSubmitted, setAllSubmitted] = useState<boolean>(initialAllSubmitted)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Report Card Modal state
  const [selectedStudent, setSelectedStudent] = useState<RankedBroadsheetStudent | null>(null)
  const [editingComment, setEditingComment] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculate Overall Totals, Averages, and mathematical Positions
  const rankedStudents = useMemo(() => {
    const scored = INITIAL_BROADSHEET_STUDENTS.map((st) => {
      const total = Object.values(st.subjectScores).reduce((sum, val) => sum + val, 0)
      const avg = Number((total / BROADSHEET_SUBJECTS.length).toFixed(1))
      return {
        ...st,
        overallTotal: total,
        average: avg,
      }
    })

    // Sort descending by overallTotal
    scored.sort((a, b) => b.overallTotal - a.overallTotal)

    // Assign positions with standard competitive ranking
    return scored.map((st, idx) => ({
      ...st,
      positionNumber: idx + 1,
      positionLabel: getOrdinal(idx + 1),
    }))
  }, [])

  // Open Report Card Modal
  const handleOpenReportCard = (student: typeof rankedStudents[0]) => {
    setSelectedStudent(student)
    setEditingComment(student.teacherComment || '')
  }

  // Save Teacher Comment
  const handleSaveComment = () => {
    if (!selectedStudent) return
    showToast(`Form Master remark saved for ${selectedStudent.fullName}!`)
    setSelectedStudent((prev) => (prev ? { ...prev, teacherComment: editingComment } : null))
  }

  // Publish and Lock Class
  const handleConfirmPublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsPublishModalOpen(false)
      setIsLocked(true)
      showToast(`Terminal report cards for ${className} have been published and locked!`)
    }, 700)
  }

  const quickPhrases = [
    'An exemplary student with outstanding academic diligence.',
    'Very good performance. More focus on quantitative sciences will yield distinction.',
    'Satisfactory term output. Capable of higher achievements with sustained effort.',
    'Well behaved and cooperative in class activities.',
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & STATUS Safeguard */}
      {!allSubmitted ? (
        <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-amber-950 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">3 subjects haven't submitted yet — publishing is disabled until all scores are in.</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Social Studies, Civic Education, and Mathematics are currently pending teacher finalization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToTracker && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToTracker}
              >
                View Submission Tracker →
              </Button>
            )}
            {/* Reviewer Simulation Shortcut */}
            <button
              type="button"
              onClick={() => setAllSubmitted(true)}
              className="text-[11px] font-bold text-indigo-brand bg-white border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors shadow-2xs"
              title="Test the complete 8/8 submission workflow"
            >
              Simulate All 8 Submitted
            </button>
          </div>
        </div>
      ) : isLocked ? (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm text-indigo-950 shadow-xs">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="font-bold">Broadsheet Published & Class Locked</p>
              <p className="text-xs text-indigo-800">
                Official report cards are sealed for Term 2. Any score changes require administrative reopen approval.
              </p>
            </div>
          </div>
          <Badge variant="primary" size="sm">
            Published & Locked
          </Badge>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-emerald-950 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">All 8 Subjects Submitted — Ready to Publish!</p>
              <p className="text-xs text-emerald-800">
                All subject scores have been received. Review position rankings below before publishing.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPublishModalOpen(true)}
            className="shadow-sm"
          >
            <Lock className="w-4 h-4 mr-1.5" />
            Publish & Lock Class
          </Button>
        </div>
      )}

      {/* 2. BROADSHEET SUMMARY STATS */}
      <Card className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
              {className} Master Broadsheet
            </h2>
            <Badge variant="gold" size="sm">
              Term 2 • 2025/2026
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Official compilation of all subject scores, grand totals, averages, and terminal class rankings.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-charcoal-muted">
          <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
            <span className="block text-[10px] font-bold uppercase text-charcoal-muted">Students</span>
            <span className="font-display font-bold text-charcoal-dark text-sm">{rankedStudents.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
            <span className="block text-[10px] font-bold uppercase text-charcoal-muted">Max Possible</span>
            <span className="font-display font-bold text-charcoal-dark text-sm">800 Marks</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-center">
            <span className="block text-[10px] font-bold uppercase text-charcoal-muted">Top Student</span>
            <span className="font-display font-bold text-emerald-700 text-sm">
              {rankedStudents[0]?.fullName.split(' ')[0]} ({rankedStudents[0]?.overallTotal})
            </span>
          </div>
        </div>
      </Card>

      {/* 3. HORIZONTALLY SCROLLABLE BROADSHEET TABLE WITH STICKY STUDENT COLUMN */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-cream-base/60 text-charcoal-muted border-b border-cream-border text-xs font-display font-bold uppercase tracking-wider">
                {/* Sticky Student Name Header */}
                <th className="sticky left-0 bg-cream-base/95 backdrop-blur-xs z-10 px-4 sm:px-6 py-3.5 text-charcoal-dark border-r border-cream-border min-w-[210px]">
                  Student Name
                </th>

                {/* 8 Dynamic Subject Columns */}
                {BROADSHEET_SUBJECTS.map((sub) => (
                  <th key={sub.id} className="px-3 py-3.5 text-center text-charcoal-dark min-w-[80px]">
                    <div>{sub.abbr}</div>
                    <div className="text-[10px] font-normal text-charcoal-muted/70">(100)</div>
                  </th>
                ))}

                {/* Cumulative Totals, Average, Position */}
                <th className="px-4 py-3.5 text-center text-charcoal-dark min-w-[100px] bg-indigo-50/50">
                  Total (800)
                </th>
                <th className="px-3 py-3.5 text-center text-charcoal-dark min-w-[80px] bg-indigo-50/50">
                  Average
                </th>
                <th className="px-4 py-3.5 text-center text-charcoal-dark min-w-[90px] bg-amber-50/60">
                  Position
                </th>
                <th className="px-4 py-3.5 text-right text-charcoal-dark min-w-[130px]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-cream-border/60">
              {rankedStudents.map((student) => {
                const isTop3 = student.positionNumber <= 3

                return (
                  <tr
                    key={student.studentId}
                    className="hover:bg-cream-base/30 transition-colors group"
                  >
                    {/* Sticky Student Column */}
                    <td className="sticky left-0 bg-cream-surface group-hover:bg-cream-base/40 transition-colors z-10 px-4 sm:px-6 py-3 border-r border-cream-border">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-charcoal-muted/50 w-5 shrink-0">
                          {student.positionNumber}
                        </span>
                        <div>
                          <p className="font-bold text-charcoal-dark text-sm leading-snug">
                            {student.fullName}
                          </p>
                          <p className="text-[11px] text-charcoal-muted/70 font-mono">
                            {student.admissionNo} • {student.gender === 'M' ? 'Male' : 'Female'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject Scores */}
                    {BROADSHEET_SUBJECTS.map((sub) => {
                      const val = student.subjectScores[sub.id] ?? 0
                      return (
                        <td key={sub.id} className="px-3 py-3 text-center text-xs sm:text-sm font-semibold text-charcoal-dark">
                          <span
                            className={cn(
                              'inline-block px-1.5 py-0.5 rounded',
                              val >= 75 ? 'text-emerald-800 font-bold' : val < 50 ? 'text-amber-800' : 'text-charcoal-dark'
                            )}
                          >
                            {val}
                          </span>
                        </td>
                      )
                    })}

                    {/* Overall Total */}
                    <td className="px-4 py-3 text-center font-display font-bold text-sm bg-indigo-50/30 text-indigo-brand">
                      {student.overallTotal}
                    </td>

                    {/* Average */}
                    <td className="px-3 py-3 text-center font-medium text-xs sm:text-sm bg-indigo-50/30 text-charcoal-dark">
                      {student.average}%
                    </td>

                    {/* Position Ranking */}
                    <td className="px-4 py-3 text-center bg-amber-50/40">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-display font-bold shadow-2xs',
                          isTop3
                            ? 'bg-amber-400 text-amber-950 border border-amber-500/30'
                            : 'bg-cream-base text-charcoal-dark'
                        )}
                      >
                        {student.positionLabel}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReportCard(student)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Report Card
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INDIVIDUAL REPORT CARD MODAL */}
      <Modal
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `${selectedStudent.fullName} — Official Report Card` : 'Report Card'}
        description={`ScholeOS Terminal Student Performance Evaluation • ${className} • Term 2 2025/2026`}
        size="xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Student Biodata & Terminal Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-cream-base/50 rounded-2xl border border-cream-border text-xs">
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">Admission Number</span>
                <p className="font-mono font-bold text-charcoal-dark text-sm">{selectedStudent.admissionNo}</p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">Class Standing</span>
                <p className="font-display font-bold text-indigo-brand text-sm">
                  {selectedStudent.positionLabel} out of {rankedStudents.length}
                </p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">Grand Total</span>
                <p className="font-display font-bold text-charcoal-dark text-sm">{selectedStudent.overallTotal} / 800</p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">Term Average</span>
                <p className="font-display font-bold text-emerald-700 text-sm">{selectedStudent.average}%</p>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div>
              <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark mb-2">
                Curriculum Assessment Breakdown
              </h4>

              <div className="border border-cream-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-base/60 text-charcoal-muted font-display font-bold border-b border-cream-border">
                    <tr>
                      <th className="p-2.5 pl-4">Subject</th>
                      <th className="p-2.5 text-center">CA Total (40)</th>
                      <th className="p-2.5 text-center">Exam (60)</th>
                      <th className="p-2.5 text-center">Total (100)</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5 pr-4 text-right">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border/60">
                    {selectedStudent.detailedScores.map((score) => (
                      <tr key={score.subjectId} className="hover:bg-cream-base/20">
                        <td className="p-2.5 pl-4 font-bold text-charcoal-dark">{score.subjectName}</td>
                        <td className="p-2.5 text-center text-charcoal-muted font-semibold">{score.caTotal}</td>
                        <td className="p-2.5 text-center text-charcoal-muted font-semibold">{score.examScore}</td>
                        <td className="p-2.5 text-center font-bold text-charcoal-dark">{score.total}</td>
                        <td className="p-2.5 text-center">
                          <span className="inline-block px-2 py-0.5 rounded font-display font-bold text-[11px] bg-indigo-50 text-indigo-brand">
                            {score.grade}
                          </span>
                        </td>
                        <td className="p-2.5 pr-4 text-right font-medium text-charcoal-muted">{score.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Class Teacher's Terminal Comment (Textarea) */}
            <div className="space-y-3 pt-2 border-t border-cream-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-display font-bold text-charcoal-dark uppercase tracking-wider">
                    Form Master's Terminal Comment
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    This qualitative comment appears on the official PDF report card sent to parents.
                  </p>
                </div>
              </div>

              {/* Quick comment chips */}
              <div className="flex flex-wrap gap-1.5">
                {quickPhrases.map((phrase, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setEditingComment(phrase)}
                    className="text-[11px] bg-cream-base hover:bg-cream-hover text-charcoal-dark px-2.5 py-1 rounded-lg border border-cream-border transition-colors text-left"
                  >
                    + {phrase.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <Textarea
                rows={3}
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                placeholder="Write an encouraging, specific observation for this learner..."
              />

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveComment}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Save Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 5. PUBLISH & LOCK CLASS CONFIRMATION MODAL */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title={`Publish Report Cards for ${className}?`}
        description="This seals Term 2 academic computations and generates parent portal report cards."
        confirmLabel="Confirm & Lock Class"
        confirmLoading={isPublishing}
        onConfirm={handleConfirmPublish}
        size="md"
      >
        <div className="space-y-3">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Permanent Terminal Lock</p>
              <p className="mt-0.5">
                Publishing will lock all subject scores for this class and this term. Subject teachers will need to request an administrative reopen for any further changes.
              </p>
            </div>
          </div>

          <div className="border border-cream-border rounded-xl p-3 bg-cream-base/30 text-xs space-y-1">
            <div className="flex justify-between text-charcoal-muted">
              <span>Enrolled Students:</span>
              <span className="font-bold text-charcoal-dark">{rankedStudents.length} Students</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Total Subjects Compiled:</span>
              <span className="font-bold text-charcoal-dark">8 Subjects</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Parent Notification:</span>
              <span className="font-bold text-charcoal-dark">SMS & Portal links ready to dispatch</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
