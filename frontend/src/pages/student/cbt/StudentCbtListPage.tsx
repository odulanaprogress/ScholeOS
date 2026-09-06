import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Laptop,
  Clock,
  Calendar,
  Play,
  HelpCircle,
  Award,
  ArrowRight,
} from 'lucide-react'
import { type CbtTest, type StudentCbtSubmission } from '@/pages/cbt'

export interface StudentCbtListPageProps {
  tests: CbtTest[]
  studentSubmissions: StudentCbtSubmission[]
  currentStudentAdmissionNo: string
  onStartTest: (test: CbtTest) => void
  onViewResult: (test: CbtTest, submission: StudentCbtSubmission) => void
}

export const StudentCbtListPage: React.FC<StudentCbtListPageProps> = ({
  tests,
  studentSubmissions,
  currentStudentAdmissionNo,
  onStartTest,
  onViewResult,
}) => {
  // Helper to determine student status for a test
  const getStudentTestStatus = (test: CbtTest) => {
    const sub = studentSubmissions.find(
      (s) => s.testId === test.id && s.admissionNo === currentStudentAdmissionNo
    )
    if (sub && sub.status === 'completed') {
      return { status: 'completed' as const, submission: sub }
    }
    if (test.status === 'live') {
      return { status: 'live' as const, submission: sub }
    }
    if (test.status === 'scheduled') {
      return { status: 'scheduled' as const, submission: sub }
    }
    // If the test was completed or past window and student did not submit
    return { status: 'missed' as const, submission: sub }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-cream-surface p-6 rounded-2xl border border-cream-border/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-brand font-semibold text-xs tracking-wider uppercase mb-1">
            <Laptop className="w-4 h-4" />
            Computer-Based Testing Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
            My Online Assessments & CBT Exams
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
            View scheduled tests, participate in active live examination sessions, and review your graded results.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-cream-base/60 p-3 rounded-xl border border-cream-border/60">
          <div className="w-10 h-10 rounded-lg bg-indigo-brand/10 flex items-center justify-center text-indigo-brand">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-charcoal-muted">Candidate ID</div>
            <div className="text-sm font-bold text-charcoal-dark font-mono">
              {currentStudentAdmissionNo}
            </div>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-cream-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-charcoal-dark font-display flex items-center gap-2">
            <span>Assigned Examination Papers</span>
            <span className="text-xs font-normal text-charcoal-muted">
              ({tests.length} Total)
            </span>
          </h2>
          <span className="text-xs text-charcoal-muted">
            Ensure stable internet before starting any live paper
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Assessment & Subject</TableHead>
              <TableHead className="w-[18%]">Schedule Window</TableHead>
              <TableHead className="w-[14%]">Duration</TableHead>
              <TableHead className="w-[16%]">Status</TableHead>
              <TableHead className="w-[20%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-charcoal-muted text-sm">
                  No CBT examinations are currently assigned to your class.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => {
                const { status: studentStatus, submission } = getStudentTestStatus(test)

                return (
                  <TableRow key={test.id} className="hover:bg-cream-base/30 transition-colors">
                    {/* Test Title & Subject */}
                    <TableCell>
                      <div className="font-semibold text-charcoal-dark text-sm">
                        {test.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-0.5">
                        <span className="font-medium text-indigo-brand">{test.subject}</span>
                        <span>•</span>
                        <span>{test.questions.length} Questions</span>
                        <span>•</span>
                        <span>{test.totalPoints} Total Points</span>
                      </div>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                        <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>{test.scheduledDate}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-muted mt-0.5">
                        {test.scheduledStartTime}
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                        <Clock className="w-3.5 h-3.5 text-indigo-brand" />
                        <span>{test.durationMinutes} minutes</span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {studentStatus === 'live' ? (
                        <Badge variant="success" size="sm" showDot>
                          Live Now
                        </Badge>
                      ) : studentStatus === 'completed' ? (
                        <Badge variant="neutral" size="sm">
                          Completed
                        </Badge>
                      ) : studentStatus === 'scheduled' ? (
                        <Badge variant="primary" size="sm">
                          Scheduled
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Missed
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="text-right">
                      {studentStatus === 'live' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onStartTest(test)}
                          className="h-8 px-3.5 text-xs font-semibold shadow-xs hover:shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          Start Test
                        </Button>
                      ) : studentStatus === 'completed' && submission ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewResult(test, submission)}
                          className="h-8 px-3 text-xs font-medium"
                        >
                          View Results
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      ) : studentStatus === 'scheduled' ? (
                        <div className="inline-flex flex-col items-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            className="h-8 px-3 text-xs opacity-60 cursor-not-allowed bg-cream-base border-cream-border text-charcoal-muted"
                            title={`Available on ${test.scheduledDate} at ${test.scheduledStartTime}`}
                          >
                            Not Started
                          </Button>
                          <span className="text-[10px] text-charcoal-muted mt-0.5">
                            Starts {test.scheduledStartTime}
                          </span>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="h-8 px-3 text-xs text-rose-500 opacity-60 cursor-not-allowed"
                        >
                          Session Closed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* CBT Candidate Guidelines Card */}
      <Card className="p-5 border border-cream-border bg-cream-base/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-brand" />
          Instructions for Candidates
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-muted leading-relaxed">
          <li className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand mt-1.5 shrink-0" />
            <span>The countdown timer starts immediately once you click <strong>Start Test</strong>.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand mt-1.5 shrink-0" />
            <span>Answers are saved automatically as you select each radio option.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand mt-1.5 shrink-0" />
            <span>Use the <strong>Question Navigator</strong> at the top to jump between questions.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand mt-1.5 shrink-0" />
            <span>When the timer reaches 00:00, your exam will be submitted automatically.</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
