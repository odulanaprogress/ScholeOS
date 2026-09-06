import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  Download,
  Users,
} from 'lucide-react'
import { type CbtTest, type StudentCbtSubmission } from '@/pages/cbt'

export interface TeacherCbtResultsPageProps {
  test: CbtTest
  results: StudentCbtSubmission[]
  onBack: () => void
}

export const TeacherCbtResultsPage: React.FC<TeacherCbtResultsPageProps> = ({
  test,
  results,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not_started'>('all')

  // Filter results for this specific test
  const testSubmissions = useMemo(() => {
    return results.filter((r) => r.testId === test.id)
  }, [results, test.id])

  // Analytics Metrics
  const completedSubs = useMemo(() => {
    return testSubmissions.filter((r) => r.status === 'completed')
  }, [testSubmissions])

  const averageScore = useMemo(() => {
    if (completedSubs.length === 0) return 0
    const sum = completedSubs.reduce((acc, curr) => acc + curr.score, 0)
    return Math.round((sum / completedSubs.length) * 10) / 10
  }, [completedSubs])

  const averagePercent = useMemo(() => {
    if (!test.totalPoints || test.totalPoints === 0) return 0
    return Math.round((averageScore / test.totalPoints) * 100)
  }, [averageScore, test.totalPoints])

  const highestScore = useMemo(() => {
    if (completedSubs.length === 0) return 0
    return Math.max(...completedSubs.map((r) => r.score))
  }, [completedSubs])

  const completionRateText = useMemo(() => {
    return `${completedSubs.length} / ${testSubmissions.length || 1}`
  }, [completedSubs.length, testSubmissions.length])

  const completionPercent = useMemo(() => {
    if (testSubmissions.length === 0) return 0
    return Math.round((completedSubs.length / testSubmissions.length) * 100)
  }, [completedSubs.length, testSubmissions.length])

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return testSubmissions.filter((sub) => {
      const matchesSearch =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ? true : sub.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [testSubmissions, searchQuery, statusFilter])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-surface p-5 rounded-2xl border border-cream-border/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 rounded-xl hover:bg-cream-base text-charcoal-dark border border-cream-border"
            title="Back to Tests List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-brand border border-indigo-100">
                {test.className} • {test.subject}
              </span>
              <Badge variant="neutral" size="sm">
                {test.status === 'completed' ? 'Exam Concluded' : 'Assessment'}
              </Badge>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark mt-1">
              {test.title} — Results & Analytics
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              alert('Exporting CBT Results to CSV / BroadSheet...')
            }}
            className="text-xs font-medium"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Average Score"
          value={`${averageScore} / ${test.totalPoints}`}
          subtext={`${averagePercent}% class average`}
          icon={TrendingUp}
          tone="primary"
        />

        <StatCard
          label="Highest Score"
          value={`${highestScore} / ${test.totalPoints}`}
          subtext={
            test.totalPoints > 0
              ? `${Math.round((highestScore / test.totalPoints) * 100)}% top score`
              : 'Top performance'
          }
          icon={Award}
          tone="gold"
        />

        <StatCard
          label="Completion Rate"
          value={completionRateText}
          subtext={`${completionPercent}% participated`}
          icon={CheckCircle2}
          tone="success"
        />

        <StatCard
          label="Class Candidates"
          value={testSubmissions.length}
          subtext={`Duration: ${test.durationMinutes} minutes`}
          icon={Users}
          tone="default"
        />
      </div>

      {/* Submissions Table with Search and Filters */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-cream-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or admission no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-cream-base/50 border border-cream-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-brand/20 focus:border-indigo-brand text-charcoal-dark"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              All ({testSubmissions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              Completed ({completedSubs.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('not_started')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'not_started'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              Not Started ({testSubmissions.length - completedSubs.length})
            </button>
          </div>
        </div>

        {/* Candidate Submissions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Student Candidate</TableHead>
              <TableHead className="w-[18%]">Admission No.</TableHead>
              <TableHead className="w-[16%]">Status</TableHead>
              <TableHead className="w-[18%]">Score / Total</TableHead>
              <TableHead className="w-[18%] text-right">Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-charcoal-muted text-xs">
                  No candidate submissions match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((sub) => {
                const percent =
                  test.totalPoints > 0
                    ? Math.round((sub.score / test.totalPoints) * 100)
                    : 0
                return (
                  <TableRow key={sub.id} className="hover:bg-cream-base/30 transition-colors">
                    {/* Student Name */}
                    <TableCell>
                      <div className="font-semibold text-charcoal-dark text-sm">
                        {sub.studentName}
                      </div>
                      {sub.submittedAt && (
                        <div className="text-[11px] text-charcoal-muted mt-0.5">
                          Submitted on {sub.submittedAt}
                        </div>
                      )}
                    </TableCell>

                    {/* Admission Number */}
                    <TableCell>
                      <span className="font-mono text-xs text-charcoal-dark font-medium bg-cream-base px-2 py-0.5 rounded border border-cream-border">
                        {sub.admissionNo}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {sub.status === 'completed' ? (
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      ) : sub.status === 'incomplete' ? (
                        <Badge variant="warning" size="sm">
                          Incomplete
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          Not Started
                        </Badge>
                      )}
                    </TableCell>

                    {/* Score */}
                    <TableCell>
                      {sub.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-display font-bold text-sm ${
                              percent >= 70
                                ? 'text-emerald-700'
                                : percent >= 50
                                ? 'text-indigo-brand'
                                : 'text-rose-600'
                            }`}
                          >
                            {sub.score} / {test.totalPoints} pts
                          </span>
                          <span className="text-xs text-charcoal-muted">
                            ({percent}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-charcoal-muted">—</span>
                      )}
                    </TableCell>

                    {/* Time Spent */}
                    <TableCell className="text-right">
                      {sub.status === 'completed' ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                          <Clock className="w-3.5 h-3.5 text-charcoal-muted" />
                          <span>{sub.timeTakenMinutes} mins</span>
                        </div>
                      ) : (
                        <span className="text-xs text-charcoal-muted">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
