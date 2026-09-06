import React, { useState } from 'react'
import {
  CheckCircle2,
  Check,
  X,
  Clock,
  Save,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { cn } from '@/utils/cn'

export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface AttendanceStudentRow {
  studentId: string
  admissionNo: string
  fullName: string
  status: AttendanceStatus
}

const INITIAL_ATTENDANCE_STUDENTS: AttendanceStudentRow[] = [
  { studentId: 's1', admissionNo: 'JSS2/001', fullName: 'Adeleke Kehinde', status: 'present' },
  { studentId: 's2', admissionNo: 'JSS2/002', fullName: 'Adesina Oluwaseun', status: 'present' },
  { studentId: 's3', admissionNo: 'JSS2/003', fullName: 'Bello Fatima', status: 'present' },
  { studentId: 's4', admissionNo: 'JSS2/004', fullName: 'Chinedu Emeka', status: 'late' },
  { studentId: 's5', admissionNo: 'JSS2/005', fullName: 'Danladi Musa', status: 'present' },
  { studentId: 's6', admissionNo: 'JSS2/006', fullName: 'Eze Chioma', status: 'present' },
  { studentId: 's7', admissionNo: 'JSS2/007', fullName: 'Ibrahim Zainab', status: 'present' },
  { studentId: 's8', admissionNo: 'JSS2/008', fullName: 'Nwosu Somtochukwu', status: 'present' },
  { studentId: 's9', admissionNo: 'JSS2/009', fullName: 'Okafor Nnamdi', status: 'absent' },
  { studentId: 's10', admissionNo: 'JSS2/010', fullName: 'Oladipo Temitope', status: 'present' },
  { studentId: 's11', admissionNo: 'JSS2/011', fullName: 'Oni Oluwatosin', status: 'present' },
  { studentId: 's12', admissionNo: 'JSS2/012', fullName: 'Suleiman Farouk', status: 'present' },
]

export const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-06')
  const [students, setStudents] = useState<AttendanceStudentRow[]>(INITIAL_ATTENDANCE_STUDENTS)
  const [savedBanner, setSavedBanner] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Handle single student status toggle
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    )
  }

  // "Mark All Present" shortcut
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })))
  }

  // Save Attendance
  const handleSaveAttendance = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      const presentCount = students.filter((s) => s.status === 'present').length
      const absentCount = students.filter((s) => s.status === 'absent').length
      const lateCount = students.filter((s) => s.status === 'late').length

      setSavedBanner(
        `Attendance saved for ${selectedDate} (${presentCount} Present, ${absentCount} Absent, ${lateCount} Late). Automated SMS sent to absent parents.`
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 600)
  }

  const presentCount = students.filter((s) => s.status === 'present').length
  const absentCount = students.filter((s) => s.status === 'absent').length
  const lateCount = students.filter((s) => s.status === 'late').length
  const attendanceRate = Math.round((presentCount / students.length) * 100)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SUCCESS CONFIRMATION BANNER */}
      {savedBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold">{savedBanner}</p>
          </div>
          <button
            type="button"
            onClick={() => setSavedBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP CONTROLS CARD: DATEPICKER & SUMMARY */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* DatePicker */}
            <div className="w-full sm:w-56">
              <DatePicker
                label="Attendance Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="hidden sm:block h-10 w-px bg-cream-border" />

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="block text-[10px] font-bold uppercase text-emerald-700">Present</span>
                <span className="font-display font-bold text-sm">{presentCount}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <span className="block text-[10px] font-bold uppercase text-rose-700">Absent</span>
                <span className="font-display font-bold text-sm">{absentCount}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="block text-[10px] font-bold uppercase text-amber-700">Late</span>
                <span className="font-display font-bold text-sm">{lateCount}</span>
              </div>
              <div className="hidden lg:block px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-charcoal-dark">
                <span className="block text-[10px] font-bold uppercase text-charcoal-muted">Attendance Rate</span>
                <span className="font-display font-bold text-sm">{attendanceRate}%</span>
              </div>
            </div>
          </div>

          {/* Mark All Present Shortcut */}
          <div className="flex items-center gap-2 self-start md:self-auto pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAllPresent}
            >
              <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
              Mark All Present
            </Button>
          </div>
        </div>
      </Card>

      {/* ATTENDANCE ROSTER TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Student Name & ID</TableHead>
            <TableHead className="w-[280px] text-right">Daily Attendance Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, idx) => (
            <TableRow key={student.studentId}>
              {/* Index */}
              <TableCell className="text-charcoal-muted/60 font-bold text-xs">
                {idx + 1}
              </TableCell>

              {/* Name and Admission Number */}
              <TableCell>
                <div>
                  <p className="font-bold text-charcoal-dark text-sm leading-tight">
                    {student.fullName}
                  </p>
                  <p className="text-[11px] text-charcoal-muted/70 font-mono mt-0.5">
                    {student.admissionNo}
                  </p>
                </div>
              </TableCell>

              {/* Status Pill Toggle Group */}
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1.5 p-1 bg-cream-base/50 rounded-full border border-cream-border">
                  {/* Present Option */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.studentId, 'present')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold transition-all select-none flex items-center gap-1',
                      student.status === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-charcoal-muted hover:text-charcoal-dark hover:bg-white/60 border border-transparent'
                    )}
                  >
                    <Check className="w-3 h-3" />
                    <span>Present</span>
                  </button>

                  {/* Late Option */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.studentId, 'late')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold transition-all select-none flex items-center gap-1',
                      student.status === 'late'
                        ? 'bg-amber-500 text-white shadow-xs font-bold'
                        : 'text-charcoal-muted hover:text-charcoal-dark hover:bg-white/60 border border-transparent'
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Late</span>
                  </button>

                  {/* Absent Option */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.studentId, 'absent')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold transition-all select-none flex items-center gap-1',
                      student.status === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs font-bold'
                        : 'text-charcoal-muted hover:text-charcoal-dark hover:bg-white/60 border border-transparent'
                    )}
                  >
                    <X className="w-3 h-3" />
                    <span>Absent</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* BOTTOM ACTION BAR */}
      <div className="p-4 sm:p-6 bg-cream-surface rounded-2xl border border-cream-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-charcoal-muted text-center sm:text-left">
          <span>
            Marking absences triggers automatic end-of-day parent SMS notification based on school policy.
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={handleSaveAttendance}
          className="w-full sm:w-auto shadow-md"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Attendance
        </Button>
      </div>
    </div>
  )
}
