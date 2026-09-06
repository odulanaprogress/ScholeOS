import React from 'react'
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
  Plus,
  Edit2,
  BarChart3,
  Trash2,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react'
import { type CbtTest } from '@/pages/cbt'

export interface TeacherCbtListPageProps {
  tests: CbtTest[]
  onCreateTest: () => void
  onEditTest: (test: CbtTest) => void
  onViewResults: (test: CbtTest) => void
  onDeleteTest: (testId: string) => void
}

export const TeacherCbtListPage: React.FC<TeacherCbtListPageProps> = ({
  tests,
  onCreateTest,
  onEditTest,
  onViewResults,
  onDeleteTest,
}) => {
  const getStatusBadge = (status: CbtTest['status']) => {
    switch (status) {
      case 'live':
        return (
          <Badge variant="success" size="sm" showDot>
            Live Now
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge variant="primary" size="sm">
            Scheduled
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="neutral" size="sm">
            Completed
          </Badge>
        )
      case 'draft':
      default:
        return (
          <Badge variant="neutral" size="sm">
            Draft
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-surface p-5 rounded-2xl border border-cream-border/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-brand" />
            Computer-Based Testing (CBT) Question Banks
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Create, schedule, and grade timed computer-based assessments and mock examinations for your classes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onCreateTest}
          className="shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Test
        </Button>
      </div>

      {/* Tests Table */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Test Title & Subject</TableHead>
              <TableHead className="w-[14%]">Class Arm</TableHead>
              <TableHead className="w-[14%]">Status</TableHead>
              <TableHead className="w-[18%]">Scheduled Window</TableHead>
              <TableHead className="w-[10%]">Duration</TableHead>
              <TableHead className="w-[12%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id} className="hover:bg-cream-base/30 transition-colors">
                {/* Title & Subject */}
                <TableCell>
                  <div className="font-semibold text-charcoal-dark text-sm">
                    {test.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
                    <span>{test.subject}</span>
                    <span>•</span>
                    <span>{test.questions.length} Questions</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-brand">{test.totalPoints} pts</span>
                  </div>
                </TableCell>

                {/* Class */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-cream-base border border-cream-border text-charcoal-dark">
                    {test.className}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusBadge(test.status)}
                </TableCell>

                {/* Scheduled Date */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                    <span>{test.scheduledDate}</span>
                  </div>
                  <div className="text-[11px] text-charcoal-muted mt-0.5">
                    Starts at {test.scheduledStartTime}
                  </div>
                </TableCell>

                {/* Duration */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-brand" />
                    <span>{test.durationMinutes} mins</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {test.status === 'completed' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewResults(test)}
                        className="h-8 px-2.5 text-xs font-semibold"
                        title="View Class Results"
                      >
                        <BarChart3 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Results
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTest(test)}
                        className="h-8 px-2.5 hover:bg-indigo-50 hover:text-indigo-brand text-xs font-medium"
                        title="Edit Test Builder"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTest(test.id)}
                      className="h-8 w-8 p-0 text-charcoal-muted hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
