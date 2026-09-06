import React from 'react'
import {
  BookOpen,
  Clock,
  Users,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'

export interface TeacherAssignment {
  id: string
  className: string
  subject: string
  studentsCount: number
  status: 'draft' | 'submitted' | 'locked'
  lastUpdated: string
}

export interface TeacherOverviewPageProps {
  assignments: TeacherAssignment[]
  onNavigateToScoreEntry: (assignmentId: string) => void
  onNavigateToAssignments?: () => void
}

export const TeacherOverviewPage: React.FC<TeacherOverviewPageProps> = ({
  assignments,
  onNavigateToScoreEntry,
}) => {
  const totalClasses = assignments.length
  const pendingSubmissions = assignments.filter((a) => a.status === 'draft').length
  const totalStudents = assignments.reduce((acc, curr) => acc + curr.studentsCount, 0)

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. STAT CARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* My Classes */}
        <StatCard
          label="My Classes"
          value={totalClasses}
          icon={BookOpen}
          trend={{ value: '3 Active', isPositive: true, label: 'Secondary Class Arms' }}
        />

        {/* Pending Submissions */}
        <StatCard
          label="Pending Submissions"
          value={pendingSubmissions}
          icon={Clock}
          tone={pendingSubmissions > 0 ? 'warning' : 'success'}
          trend={{
            value: pendingSubmissions > 0 ? 'Action Required' : 'All Complete',
            isPositive: pendingSubmissions === 0,
            label: `${pendingSubmissions} class draft pending submit`,
          }}
        />

        {/* Students Taught */}
        <StatCard
          label="Students Taught"
          value={totalStudents}
          icon={Users}
          subtext="Total across all assigned classes"
        />
      </section>

      {/* 2. NOTICE BANNER IF PENDING */}
      {pendingSubmissions > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Continuous Assessment Deadline in 3 Days</p>
              <p className="text-xs text-amber-800">
                You have 1 draft score sheet (JSS 2A — Mathematics) awaiting score completion and final submission.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToScoreEntry('jss2a-math')}
            className="shrink-0"
          >
            Complete Scores
          </Button>
        </div>
      )}

      {/* 3. ASSIGNMENTS TABLE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
              My Teaching Assignments
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Classes and subjects allocated to you for Term 2 2025/2026.
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[140px]">Students</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[200px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-light text-indigo-brand font-display font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                      {row.className.split(' ')[0]}
                    </div>
                    <span className="font-bold text-charcoal-dark">{row.className}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-charcoal-dark">{row.subject}</span>
                </TableCell>
                <TableCell>
                  <span className="text-charcoal-muted text-xs font-medium">
                    {row.studentsCount} enrolled
                  </span>
                </TableCell>
                <TableCell>
                  {row.status === 'draft' && (
                    <Badge variant="neutral" size="sm">
                      Draft
                    </Badge>
                  )}
                  {row.status === 'submitted' && (
                    <Badge variant="success" size="sm">
                      Submitted
                    </Badge>
                  )}
                  {row.status === 'locked' && (
                    <Badge variant="primary" size="sm">
                      Locked
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={row.status === 'draft' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => onNavigateToScoreEntry(row.id)}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                    Go to Score Entry
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
