import React from 'react'
import {
  Users,
  CalendarCheck,
  FileSpreadsheet,
  BookOpen,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export interface SubjectSubmissionItem {
  id: string
  subject: string
  teacherName: string
  status: 'draft' | 'submitted' | 'locked'
  lastUpdated: string
}

const DEFAULT_OVERVIEW_SUBJECTS: SubjectSubmissionItem[] = [
  { id: 'sub-1', subject: 'Mathematics', teacherName: 'Mrs. Bola Adeyemi', status: 'draft', lastUpdated: '10 mins ago (You)' },
  { id: 'sub-2', subject: 'English Language', teacherName: 'Mrs. Fatima Okafor', status: 'submitted', lastUpdated: 'Yesterday at 3:45 PM' },
  { id: 'sub-3', subject: 'Basic Science', teacherName: 'Mr. Tunde Alabi', status: 'submitted', lastUpdated: '2 hours ago' },
  { id: 'sub-4', subject: 'Social Studies', teacherName: 'Mr. Emmanuel Danladi', status: 'draft', lastUpdated: '3 days ago' },
  { id: 'sub-5', subject: 'Agricultural Science', teacherName: 'Dr. Kehinde Babatunde', status: 'submitted', lastUpdated: 'Sep 4, 2026' },
  { id: 'sub-6', subject: 'Business Studies', teacherName: 'Mrs. Halima Ibrahim', status: 'submitted', lastUpdated: 'Sep 3, 2026' },
  { id: 'sub-7', subject: 'Civic Education', teacherName: 'Mr. Babatunde Balogun', status: 'draft', lastUpdated: 'Sep 1, 2026' },
  { id: 'sub-8', subject: 'French Language', teacherName: 'Madame C. Dupont', status: 'submitted', lastUpdated: 'Sep 5, 2026' },
]

export interface ClassTeacherOverviewPageProps {
  className?: string
  totalStudents?: number
  attendanceStatus?: 'marked' | 'unmarked'
  presentCount?: number
  subjects?: SubjectSubmissionItem[]
  onNavigateToAttendance?: () => void
  onNavigateToTracker?: () => void
  onNavigateToBroadsheet?: () => void
  onNavigateToScores?: () => void
}

export const ClassTeacherOverviewPage: React.FC<ClassTeacherOverviewPageProps> = ({
  className = 'JSS 2A',
  totalStudents = 38,
  attendanceStatus = 'marked',
  presentCount = 36,
  subjects = DEFAULT_OVERVIEW_SUBJECTS,
  onNavigateToAttendance = () => {},
  onNavigateToTracker = () => {},
  onNavigateToBroadsheet = () => {},
  onNavigateToScores = () => {},
}) => {
  const submittedCount = subjects.filter((s) => s.status === 'submitted' || s.status === 'locked').length
  const totalSubjects = subjects.length
  const ratioText = `${submittedCount} / ${totalSubjects}`
  const ratioPercent = Math.round((submittedCount / totalSubjects) * 100)

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. STAT CARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* My Class */}
        <StatCard
          label="My Class"
          value={className}
          icon={BookOpen}
          trend={{ value: 'Form Master', isPositive: true, label: 'Room 12 • Gold Wing' }}
        />

        {/* Today's Attendance */}
        <StatCard
          label="Today's Attendance"
          value={attendanceStatus === 'marked' ? `${presentCount}/${totalStudents}` : 'Not Marked'}
          icon={CalendarCheck}
          tone={attendanceStatus === 'marked' ? 'success' : 'warning'}
          trend={{
            value: attendanceStatus === 'marked' ? 'Marked' : 'Pending',
            isPositive: attendanceStatus === 'marked',
            label: attendanceStatus === 'marked' ? 'Morning Roll Call Complete' : 'Roll call needed',
          }}
          onClick={onNavigateToAttendance}
        />

        {/* Subjects Submitted */}
        <StatCard
          label="Subjects Submitted"
          value={ratioText}
          icon={FileSpreadsheet}
          tone={ratioPercent === 100 ? 'success' : ratioPercent >= 50 ? 'warning' : 'danger'}
          trend={{
            value: `${ratioPercent}%`,
            isPositive: ratioPercent >= 60,
            label: `${totalSubjects - submittedCount} subjects pending`,
          }}
          onClick={onNavigateToTracker}
        />

        {/* Students in Class */}
        <StatCard
          label="Students in Class"
          value={totalStudents}
          icon={Users}
          subtext="20 Boys • 18 Girls enrolled"
          onClick={onNavigateToAttendance}
        />
      </section>

      {/* 2. NOTICE & BROADSHEET READY BANNER */}
      {submittedCount === totalSubjects ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm text-emerald-900 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">All Subject Scores Submitted!</p>
              <p className="text-xs text-emerald-800">
                All 8 subject teachers have finalized their marks. The master broadsheet and report cards are ready for publishing.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateToBroadsheet}
            className="shrink-0"
          >
            Review Broadsheet
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Broadsheet Compilation In Progress ({submittedCount} of {totalSubjects} In)</p>
              <p className="text-xs text-amber-800">
                You can view the provisional broadsheet, but publishing will remain locked until the remaining {totalSubjects - submittedCount} subjects submit.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateToTracker}
            className="shrink-0"
          >
            Remind Teachers
          </Button>
        </div>
      )}

      {/* 3. MAIN SECTION: SUBMISSION STATUS CARD & QUICK ACTIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Submission Status Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-cream-border mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-charcoal-dark">
                {className} Subject Score Submissions
              </h3>
              <p className="text-xs text-charcoal-muted">
                Status of teachers submitting Continuous Assessment & Exam marks for this class.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToTracker}
              className="text-xs font-bold text-indigo-brand hover:text-indigo-hover flex items-center gap-1 transition-colors"
            >
              <span>View Full Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-cream-border/60">
            {subjects.slice(0, 5).map((subj) => (
              <div
                key={subj.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-cream-base/20 px-2 rounded-xl transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-charcoal-dark leading-tight">
                    {subj.subject}
                  </p>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Teacher: {subj.teacherName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-charcoal-muted/70 hidden sm:inline">
                    {subj.lastUpdated}
                  </span>
                  {subj.status === 'draft' && (
                    <Badge variant="neutral" size="sm">
                      Draft
                    </Badge>
                  )}
                  {subj.status === 'submitted' && (
                    <Badge variant="success" size="sm">
                      Submitted
                    </Badge>
                  )}
                  {subj.status === 'locked' && (
                    <Badge variant="primary" size="sm">
                      Locked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-cream-border text-center">
            <button
              type="button"
              onClick={onNavigateToTracker}
              className="text-xs font-semibold text-charcoal-muted hover:text-charcoal-dark transition-colors"
            >
              + {totalSubjects - Math.min(5, totalSubjects)} more subjects in {className} (Click to see full submission log)
            </button>
          </div>
        </Card>

        {/* Class Teacher Quick Actions Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-charcoal-dark mb-1">
              Class Teacher Duties
            </h3>
            <p className="text-xs text-charcoal-muted mb-5">
              Daily routines and terminal compilation tasks.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start shadow-xs"
                onClick={onNavigateToAttendance}
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                Take Today's Attendance
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start shadow-xs"
                onClick={onNavigateToScores}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-indigo-brand" />
                My Subject Scores (Maths)
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start hover:bg-cream-base"
                onClick={onNavigateToBroadsheet}
              >
                <Award className="w-4 h-4 mr-2 text-amber-700" />
                Open Master Broadsheet
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-cream-border/70 text-xs text-charcoal-muted space-y-1">
            <div className="flex justify-between">
              <span>Form Master:</span>
              <span className="font-bold text-charcoal-dark">Mrs. Bola Adeyemi</span>
            </div>
            <div className="flex justify-between">
              <span>Academic Term:</span>
              <span className="font-bold text-charcoal-dark">2nd Term (Mid-Term)</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
