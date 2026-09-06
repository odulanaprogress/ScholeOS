import React from 'react'
import { Button } from '@/components/ui/Button'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { type CbtTest, type StudentCbtSubmission } from '@/pages/cbt'

export interface StudentCbtResultsPageProps {
  test: CbtTest
  submission: StudentCbtSubmission
  onBack: () => void
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export const StudentCbtResultsPage: React.FC<StudentCbtResultsPageProps> = ({
  test,
  submission,
  onBack,
}) => {
  const percentage =
    test.totalPoints > 0
      ? Math.round((submission.score / test.totalPoints) * 100)
      : 0

  const getPerformanceRemark = (pct: number) => {
    if (pct >= 80) return { label: 'Distinction (A)', tone: 'emerald', desc: 'Outstanding mastery of the subject matter!' }
    if (pct >= 65) return { label: 'Credit (B)', tone: 'indigo', desc: 'Strong understanding with minor areas for review.' }
    if (pct >= 50) return { label: 'Pass (C)', tone: 'amber', desc: 'Satisfactory performance, practice recommended.' }
    return { label: 'Needs Improvement', tone: 'rose', desc: 'Requires remedial review with subject teacher.' }
  }

  const remark = getPerformanceRemark(percentage)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar with Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-cream-base text-charcoal-dark border border-cream-border px-3 py-1.5 rounded-xl text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to CBT Tests
        </Button>

        <span className="text-xs text-charcoal-muted">
          Assessment submitted on {submission.submittedAt || 'Today'}
        </span>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Decorative Backdrop */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-indigo-brand/5 pointer-events-none blur-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left: Overall Score Circle / Numbers */}
          <div className="flex items-center gap-5 border-b md:border-b-0 md:border-r border-cream-border pb-5 md:pb-0 md:pr-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-brand/20 flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-display font-black text-indigo-brand">
                {percentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider mt-0.5">
                Score
              </span>
            </div>

            <div>
              <div className="text-xs text-charcoal-muted font-medium">Earned Points</div>
              <div className="text-2xl font-display font-bold text-charcoal-dark mt-0.5">
                {submission.score}{' '}
                <span className="text-sm font-normal text-charcoal-muted">
                  / {test.totalPoints} pts
                </span>
              </div>
              <div className="mt-1.5">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    percentage >= 70
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : percentage >= 50
                      ? 'bg-indigo-50 text-indigo-brand border border-indigo-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {remark.label}
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Test Metadata & Feedback */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">
              {test.className} • {test.subject}
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
              {test.title}
            </h1>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {remark.desc}
            </p>
          </div>

          {/* Right: Candidate & Timing stats */}
          <div className="bg-cream-base/50 p-4 rounded-xl border border-cream-border/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted">Candidate:</span>
              <span className="font-semibold text-charcoal-dark">{submission.studentName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted">Admission No:</span>
              <span className="font-mono font-medium text-charcoal-dark">{submission.admissionNo}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-cream-border/60">
              <span className="text-charcoal-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-brand" />
                Time Spent:
              </span>
              <span className="font-semibold text-charcoal-dark">
                {submission.timeTakenMinutes} minutes (of {test.durationMinutes}m)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-Question Review Breakdown */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border shadow-xs overflow-hidden">
        <div className="p-5 border-b border-cream-border flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-display font-bold text-charcoal-dark flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-brand" />
              Question-by-Question Performance Review
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Review your responses against the official answer key and points allocated.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-base border border-cream-border text-charcoal-dark">
            {test.questions.length} Questions
          </span>
        </div>

        <div className="divide-y divide-cream-border">
          {test.questions.map((q, idx) => {
            const studentChoiceIdx = submission.answers[idx]
            const isAnswered = studentChoiceIdx !== undefined
            const isCorrect = isAnswered && studentChoiceIdx === q.correctOptionIndex
            const pointsEarned = isCorrect ? q.points : 0

            return (
              <div key={q.id} className="p-5 sm:p-6 space-y-4 hover:bg-cream-base/20 transition-colors">
                {/* Question Top Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-cream-base text-charcoal-dark font-bold text-xs flex items-center justify-center border border-cream-border">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-charcoal-muted">
                      {q.points} {q.points === 1 ? 'Point' : 'Points'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {!isAnswered ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Unanswered (0 pts)
                      </span>
                    ) : isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct (+{pointsEarned} pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Incorrect (0 pts)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="text-sm sm:text-base font-medium text-charcoal-dark pl-9">
                  {q.text}
                </div>

                {/* Optional Diagram */}
                {q.imageUrl && (
                  <div className="ml-9 max-w-sm rounded-xl overflow-hidden border border-cream-border">
                    <img src={q.imageUrl} alt={`Question ${idx + 1}`} className="w-full object-contain max-h-48 bg-cream-base/20" />
                  </div>
                )}

                {/* Options Comparison Table */}
                <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((optText, optIdx) => {
                    const isCandidateChoice = studentChoiceIdx === optIdx
                    const isCorrectAnswer = q.correctOptionIndex === optIdx

                    let cardStyle = 'bg-white border-cream-border text-charcoal-dark'
                    let labelStyle = 'bg-cream-base text-charcoal-dark'

                    if (isCorrectAnswer) {
                      cardStyle = 'bg-emerald-50/50 border-emerald-400 text-emerald-950 font-medium'
                      labelStyle = 'bg-emerald-600 text-white font-bold'
                    } else if (isCandidateChoice && !isCorrectAnswer) {
                      cardStyle = 'bg-rose-50/50 border-rose-300 text-rose-950 line-through'
                      labelStyle = 'bg-rose-600 text-white font-bold'
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm ${cardStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 ${labelStyle}`}>
                          {OPTION_LETTERS[optIdx]}
                        </span>
                        <span className="flex-1">{optText}</span>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded">
                            Correct Answer
                          </span>
                        )}
                        {isCandidateChoice && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-100/80 px-2 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
