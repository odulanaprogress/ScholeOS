import React from 'react'
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
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
import { Badge } from '@/components/ui/Badge'
import { ChildSwitcher } from './ChildSwitcher'
import {
  type ChildProfile,
  CHILD_ATTENDANCE_RECORDS,
} from './parentData'

export interface ParentAttendancePageProps {
  childrenList?: ChildProfile[]
  selectedChildId: string
  onSelectChild?: (childId: string) => void
  showChildSwitcher?: boolean
  studentName?: string
  classNameTitle?: string
}

export const ParentAttendancePage: React.FC<ParentAttendancePageProps> = ({
  childrenList = [],
  selectedChildId,
  onSelectChild = () => {},
  showChildSwitcher = true,
  studentName,
  classNameTitle,
}) => {
  const activeChild = childrenList.find((c) => c.id === selectedChildId)
  const displayName = studentName || activeChild?.fullName || 'Student'
  const displayClass = classNameTitle || activeChild?.className || 'JSS 2A'

  const attendanceRecords = CHILD_ATTENDANCE_RECORDS[selectedChildId] || CHILD_ATTENDANCE_RECORDS['child-1'] || []
  const summary = activeChild?.attendanceSummary || {
    present: 42,
    absent: 3,
    late: 1,
    percentage: 91.3,
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. CHILD SWITCHER (When used in parent portal) */}
      {showChildSwitcher && childrenList.length > 1 && (
        <section className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-cream-border shadow-xs">
          <ChildSwitcher
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={onSelectChild}
          />
        </section>
      )}

      {/* 2. ATTENDANCE SUMMARY BANNER */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {displayClass}
            </Badge>
            <span className="text-xs font-semibold text-charcoal-muted">
              Term 2 • 2025/2026 Academic Session
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-charcoal-dark">
            {displayName}'s Attendance Record
          </h3>
          <p className="text-xs sm:text-sm font-medium text-charcoal-muted">
            <span className="text-emerald-700 font-bold">{summary.present} Present</span>
            {' · '}
            <span className="text-rose-700 font-bold">{summary.absent} Absent</span>
            {' · '}
            <span className="text-amber-700 font-bold">{summary.late} Late</span>
            {' this term'}
          </p>
        </div>

        {/* Overall Percentage Badge */}
        <div className="flex items-center gap-3 bg-cream-base/60 px-4 py-2.5 rounded-xl border border-cream-border shrink-0">
          <CalendarCheck className="w-5 h-5 text-indigo-brand" />
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
              Cumulative Rate
            </span>
            <span className="text-base font-display font-bold text-indigo-brand">
              {summary.percentage}%
            </span>
          </div>
          <Badge
            variant={summary.percentage >= 90 ? 'success' : 'warning'}
            size="sm"
            className="ml-2"
          >
            {summary.percentage >= 90 ? 'Good Standing' : 'Attention'}
          </Badge>
        </div>
      </div>

      {/* 3. ATTENDANCE TABLE */}
      <Card className="overflow-hidden border-cream-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Date</TableHead>
                <TableHead className="w-32">Day</TableHead>
                <TableHead className="w-28">Time In</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead>Teacher Note / Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => {
                let badgeVariant: 'success' | 'danger' | 'warning' = 'success'
                let StatusIcon = CheckCircle2
                let label = 'Present'

                if (record.status === 'absent') {
                  badgeVariant = 'danger'
                  StatusIcon = XCircle
                  label = 'Absent'
                } else if (record.status === 'late') {
                  badgeVariant = 'warning'
                  StatusIcon = Clock
                  label = 'Late'
                }

                return (
                  <TableRow key={record.id} className="hover:bg-cream-base/30">
                    <TableCell className="font-mono text-xs font-semibold text-charcoal-dark">
                      {record.date}
                    </TableCell>
                    <TableCell className="text-xs text-charcoal-dark">
                      {record.dayOfWeek}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-charcoal-muted">
                      {record.timeIn}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant} size="sm" className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        <span>{label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-charcoal-muted">
                      {record.note ? (
                        <span className="flex items-center gap-1.5 text-charcoal-dark">
                          <Info className="w-3.5 h-3.5 text-indigo-brand shrink-0" />
                          <span>{record.note}</span>
                        </span>
                      ) : (
                        <span className="text-charcoal-muted/60">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
