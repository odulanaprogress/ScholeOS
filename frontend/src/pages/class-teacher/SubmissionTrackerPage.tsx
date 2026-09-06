import React, { useState } from 'react'
import {
  Send,
  CheckCircle2,
  Clock,
  Bell,
  CheckCheck,
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
import { Button } from '@/components/ui/Button'

export interface SubjectTrackerItem {
  id: string
  subject: string
  teacherName: string
  teacherPhone?: string
  status: 'draft' | 'submitted' | 'locked'
  lastUpdated: string
}

const INITIAL_SUBJECT_TRACKER: SubjectTrackerItem[] = [
  {
    id: 'sub-1',
    subject: 'Mathematics',
    teacherName: 'Mrs. Bola Adeyemi',
    status: 'draft',
    lastUpdated: '10 mins ago (You)',
  },
  {
    id: 'sub-2',
    subject: 'English Language',
    teacherName: 'Mrs. Fatima Okafor',
    status: 'submitted',
    lastUpdated: 'Yesterday at 3:45 PM',
  },
  {
    id: 'sub-3',
    subject: 'Basic Science',
    teacherName: 'Mr. Tunde Alabi',
    status: 'submitted',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'sub-4',
    subject: 'Social Studies',
    teacherName: 'Mr. Emmanuel Danladi',
    status: 'draft',
    lastUpdated: '3 days ago',
  },
  {
    id: 'sub-5',
    subject: 'Agricultural Science',
    teacherName: 'Dr. Kehinde Babatunde',
    status: 'submitted',
    lastUpdated: 'Sep 4, 2026',
  },
  {
    id: 'sub-6',
    subject: 'Business Studies',
    teacherName: 'Mrs. Halima Ibrahim',
    status: 'submitted',
    lastUpdated: 'Sep 3, 2026',
  },
  {
    id: 'sub-7',
    subject: 'Civic Education',
    teacherName: 'Mr. Babatunde Balogun',
    status: 'draft',
    lastUpdated: 'Sep 1, 2026',
  },
  {
    id: 'sub-8',
    subject: 'French Language',
    teacherName: 'Madame C. Dupont',
    status: 'submitted',
    lastUpdated: 'Sep 5, 2026',
  },
]

export interface SubmissionTrackerPageProps {
  className?: string
  onNavigateToBroadsheet?: () => void
}

export const SubmissionTrackerPage: React.FC<SubmissionTrackerPageProps> = ({
  className = 'JSS 2A',
  onNavigateToBroadsheet,
}) => {
  const [subjects] = useState<SubjectTrackerItem[]>(INITIAL_SUBJECT_TRACKER)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set())

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSendReminder = (subjectItem: SubjectTrackerItem) => {
    setRemindedIds((prev) => new Set(prev).add(subjectItem.id))
    showToast(
      `Reminder sent to ${subjectItem.teacherName} for ${className} ${subjectItem.subject} via SMS & Portal!`
    )
  }

  const handleRemindAllDrafts = () => {
    const drafts = subjects.filter((s) => s.status === 'draft')
    setRemindedIds(new Set(drafts.map((d) => d.id)))
    showToast(`Instant reminders dispatched to all ${drafts.length} pending subject teachers!`)
  }

  const submittedCount = subjects.filter((s) => s.status === 'submitted' || s.status === 'locked').length
  const totalCount = subjects.length
  const ratioPercent = Math.round((submittedCount / totalCount) * 100)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. SUMMARY PROGRESS BANNER */}
      <Card className="p-5 sm:p-6 bg-cream-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-charcoal-dark">
                {className} Continuous Assessment & Exam Tracker
              </h2>
              <Badge variant={submittedCount === totalCount ? 'success' : 'primary'} size="sm">
                {submittedCount} of {totalCount} Submitted
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Terminal submission status across all subjects taught in this class arm.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {submittedCount < totalCount && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemindAllDrafts}
              >
                <Bell className="w-4 h-4 mr-1.5 text-indigo-brand" />
                Remind All Pending
              </Button>
            )}
            {onNavigateToBroadsheet && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigateToBroadsheet}
              >
                Open Broadsheet →
              </Button>
            )}
          </div>
        </div>

        {/* Accent Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-dark">
            <span>Overall Score Submission Progress</span>
            <span className="font-display font-bold text-indigo-brand">{ratioPercent}% Complete</span>
          </div>
          <div className="w-full bg-cream-base h-2.5 rounded-full overflow-hidden border border-cream-border">
            <div
              className="bg-indigo-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${ratioPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 2. SUBJECTS TRACKER TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Subject</TableHead>
            <TableHead className="w-[240px]">Subject Teacher</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[180px]">Last Activity</TableHead>
            <TableHead className="w-[160px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((item) => {
            const hasBeenReminded = remindedIds.has(item.id)

            return (
              <TableRow key={item.id}>
                {/* Subject Name */}
                <TableCell>
                  <span className="font-bold text-charcoal-dark text-sm">
                    {item.subject}
                  </span>
                </TableCell>

                {/* Teacher */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-light text-indigo-brand font-display font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                      {item.teacherName.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('')}
                    </div>
                    <span className="text-charcoal-dark font-medium text-xs sm:text-sm">
                      {item.teacherName}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {item.status === 'draft' && (
                    <Badge variant="neutral" size="sm">
                      Draft • Pending
                    </Badge>
                  )}
                  {item.status === 'submitted' && (
                    <Badge variant="success" size="sm">
                      Submitted
                    </Badge>
                  )}
                  {item.status === 'locked' && (
                    <Badge variant="primary" size="sm">
                      Locked
                    </Badge>
                  )}
                </TableCell>

                {/* Last Updated */}
                <TableCell>
                  <span className="text-xs text-charcoal-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-charcoal-muted/60 shrink-0" />
                    {item.lastUpdated}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  {item.status === 'draft' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendReminder(item)}
                      disabled={hasBeenReminded}
                    >
                      {hasBeenReminded ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Reminded
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1 text-indigo-brand" />
                          Send Reminder
                        </>
                      )}
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
