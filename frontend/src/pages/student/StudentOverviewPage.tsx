import React from 'react'
import {
  CalendarCheck,
  BookOpen,
  Award,
  Calendar,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { STUDENT_ASSIGNMENTS, WEEKLY_TIMETABLE_SLOTS } from './studentData'

export interface StudentOverviewPageProps {
  studentName?: string
  classNameTitle?: string
  admissionNumber?: string
  onNavigateToResults: () => void
  onNavigateToAssignments: () => void
  onNavigateToTimetable: () => void
  onNavigateToAttendance: () => void
}

export const StudentOverviewPage: React.FC<StudentOverviewPageProps> = ({
  studentName = 'Fatima Bello',
  classNameTitle = 'JSS 2A',
  admissionNumber = 'JSS2/003',
  onNavigateToResults,
  onNavigateToAssignments,
  onNavigateToTimetable,
  onNavigateToAttendance,
}) => {
  const pendingAssignments = STUDENT_ASSIGNMENTS.filter((a) => a.status === 'not_submitted')
  const upcomingAssignments = STUDENT_ASSIGNMENTS.slice(0, 3)

  // Today's classes preview (e.g. Monday schedule)
  const todaysClasses = WEEKLY_TIMETABLE_SLOTS.slice(0, 4)

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. STUDENT WELCOME BANNER */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                {classNameTitle}
              </span>
              <span className="text-xs font-mono text-indigo-200">
                Adm: {admissionNumber}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              Welcome back, {studentName.split(' ')[0]}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-lg">
              Term 2 • 2025/2026 Academic Session. You have {pendingAssignments.length} pending assignments due this week.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateToAssignments}
              className="bg-gold-brand hover:bg-gold-hover text-charcoal-dark font-bold border-none shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-1.5 text-charcoal-dark" />
              View Tasks ({pendingAssignments.length})
            </Button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* 2. STATCARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Attendance This Term */}
        <StatCard
          label="Attendance This Term"
          value="91.3%"
          subtext="42 Present · 3 Absent · 1 Late"
          icon={CalendarCheck}
          tone="success"
          onClick={onNavigateToAttendance}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />

        {/* Pending Assignments */}
        <StatCard
          label="Pending Assignments"
          value={`${pendingAssignments.length} Tasks`}
          subtext="Due over the next 7 days"
          icon={BookOpen}
          tone={pendingAssignments.length > 0 ? 'warning' : 'success'}
          onClick={onNavigateToAssignments}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />

        {/* Latest Average */}
        <StatCard
          label="Latest Average"
          value="91.8%"
          subtext="2nd Term • Ranked 1st of 38"
          icon={Award}
          tone="primary"
          onClick={onNavigateToResults}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />
      </section>

      {/* 3. UPCOMING ASSIGNMENTS & DAILY TIMETABLE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Assignments Card */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 sm:p-6 border-cream-border">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-brand flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm text-charcoal-dark">
                  Upcoming Coursework & Deadlines
                </h4>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToAssignments}
                className="text-xs text-indigo-brand hover:text-indigo-hover"
              >
                <span>All Assignments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingAssignments.map((asg) => {
                const isSubmitted = asg.status === 'submitted'
                const isOverdue = asg.status === 'overdue'

                return (
                  <div
                    key={asg.id}
                    onClick={onNavigateToAssignments}
                    className="p-4 rounded-xl bg-cream-base/30 hover:bg-cream-base/70 border border-cream-border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-brand">
                          {asg.subject}
                        </span>
                        <span className="text-xs text-charcoal-muted">• {asg.teacherName}</span>
                      </div>
                      <h5 className="font-display font-bold text-sm text-charcoal-dark">
                        {asg.title}
                      </h5>
                      <p className="text-xs text-charcoal-muted line-clamp-1">
                        {asg.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <span className="text-xs font-mono text-charcoal-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-charcoal-muted" />
                        Due {asg.dueDate}
                      </span>
                      <Badge
                        variant={isSubmitted ? 'success' : isOverdue ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : asg.dueTimestamp}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Today's Schedule Mini Preview */}
        <div className="lg:col-span-1">
          <Card className="p-5 sm:p-6 space-y-4 h-full flex flex-col border-cream-border">
            <div className="flex items-center justify-between pb-3 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-brand flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm text-charcoal-dark">
                  Today's Schedule
                </h4>
              </div>
              <Badge variant="primary" size="sm">
                Monday
              </Badge>
            </div>

            <div className="space-y-2.5 flex-1">
              {todaysClasses.map((slot) => (
                <div
                  key={slot.period}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    slot.monday.type === 'break'
                      ? 'bg-amber-50/50 border-amber-200/70 text-amber-950'
                      : 'bg-white border-cream-border text-charcoal-dark'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-display font-bold block">
                      {slot.monday.subject}
                    </span>
                    <span className="text-[11px] text-charcoal-muted">
                      {slot.monday.room} {slot.monday.teacher !== '—' && `• ${slot.monday.teacher}`}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-charcoal-muted font-medium">
                    {slot.timeRange}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={onNavigateToTimetable}
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                <span>View Full Timetable</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
