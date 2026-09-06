import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Timer } from '@/components/ui/Timer'
import { QuestionNavigator } from '@/components/ui/QuestionNavigator'
import { SelectableCard } from '@/components/ui/SelectableCard'
import {
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { type CbtTest } from '@/pages/cbt'

export interface StudentCbtExamViewProps {
  test: CbtTest
  studentName: string
  admissionNo: string
  onSubmit: (answers: Record<number, number>, timeTakenMinutes: number) => void
  onExit?: () => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export const StudentCbtExamView: React.FC<StudentCbtExamViewProps> = ({
  test,
  studentName,
  admissionNo,
  onSubmit,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)

  // Track start time to calculate total time taken
  const startTimeRef = useRef(Date.now())

  const totalQuestions = test.questions.length
  const currentQuestion = test.questions[currentIndex]

  // Indices of questions that have been answered
  const answeredIndices = useMemo(() => {
    return Object.keys(answers).map(Number)
  }, [answers])

  const answeredCount = answeredIndices.length
  const unansweredCount = Math.max(0, totalQuestions - answeredCount)

  // Calculate time spent in minutes
  const calculateTimeTaken = () => {
    const elapsedMs = Date.now() - startTimeRef.current
    const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000))
    return Math.min(elapsedMinutes, test.durationMinutes)
  }

  // Answer selection handler
  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }))
  }

  // Auto-submit when timer reaches 00:00
  const handleTimerExpire = () => {
    setIsAutoSubmitting(true)
    setTimeout(() => {
      const timeTaken = test.durationMinutes
      onSubmit(answers, timeTaken)
    }, 1500)
  }

  // Manual submission confirmation
  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false)
    const timeTaken = calculateTimeTaken()
    onSubmit(answers, timeTaken)
  }

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal is open
      if (isConfirmModalOpen) return

      if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1
        if (optIdx < (currentQuestion?.options.length || 0)) {
          handleSelectOption(optIdx)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, totalQuestions, currentQuestion, isConfirmModalOpen])

  return (
    <div className="min-h-screen bg-[#FBF0E1]/50 text-charcoal-dark flex flex-col font-sans select-none antialiased">
      {/* 1. Sticky Examination Header (Calm, distraction-free) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-border px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Test info & candidate */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-brand border border-indigo-100">
                {test.className} • {test.subject}
              </span>
              <span className="hidden sm:inline text-xs text-charcoal-muted">
                Candidate: <strong className="text-charcoal-dark">{studentName}</strong> ({admissionNo})
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-display font-bold text-charcoal-dark truncate mt-0.5">
              {test.title}
            </h1>
          </div>

          {/* Right: Timer & Submit Button */}
          <div className="flex items-center gap-3 shrink-0">
            {onExit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to exit the exam? Unsubmitted answers will be lost.')) {
                    onExit()
                  }
                }}
                className="text-xs text-charcoal-muted hover:text-rose-600 hover:bg-rose-50"
              >
                Exit
              </Button>
            )}

            <Timer
              initialSeconds={test.durationMinutes * 60}
              onExpire={handleTimerExpire}
              size="md"
            />

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Sticky Question Navigator Row */}
      <div className="sticky top-[69px] z-30 bg-white/90 backdrop-blur-sm border-b border-cream-border/80 px-4 sm:px-8 py-2.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answeredIndices={answeredIndices}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              accentColor="#4338CA"
            />
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-charcoal-muted shrink-0 pl-3 border-l border-cream-border">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-brand shrink-0" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border border-cream-border bg-white shrink-0" />
              <span>Pending ({unansweredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Examination Canvas (Focus Area) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Header Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-display font-bold text-charcoal-dark">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cream-base text-charcoal-muted border border-cream-border font-medium">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'Point' : 'Points'}
              </span>
            </div>

            {answers[currentIndex] !== undefined ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Answer recorded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted bg-cream-base px-2.5 py-1 rounded-full border border-cream-border">
                Unanswered
              </span>
            )}
          </div>

          {/* Question Prompt Body */}
          <Card className="p-6 sm:p-8 bg-white border border-cream-border shadow-xs rounded-2xl">
            <div className="text-base sm:text-lg text-charcoal-dark font-medium leading-relaxed">
              {currentQuestion.text}
            </div>

            {/* Optional Diagram / Image */}
            {currentQuestion.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-cream-border max-w-md mx-auto">
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentIndex + 1} Diagram`}
                  className="w-full object-contain max-h-60 bg-cream-base/30"
                />
              </div>
            )}
          </Card>

          {/* Options Grid (Radio SelectableCards) */}
          <div className="space-y-3 pt-1">
            <div className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted mb-1 px-1">
              Select One Option:
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((optionText, optIndex) => {
                const isSelected = answers[currentIndex] === optIndex

                return (
                  <SelectableCard
                    key={optIndex}
                    label={OPTION_LABELS[optIndex]}
                    selected={isSelected}
                    onSelect={() => handleSelectOption(optIndex)}
                    accentColor="#4338CA"
                    className="hover:shadow-xs transition-all"
                  >
                    <div className="text-sm sm:text-base font-normal text-charcoal-dark pt-0.5">
                      {optionText}
                    </div>
                  </SelectableCard>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4. Bottom Navigation Controls */}
        <div className="pt-8 pb-4 border-t border-cream-border/70 mt-8 flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="md"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 text-xs sm:text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="text-xs text-charcoal-muted text-center hidden sm:block">
            {answeredCount} of {totalQuestions} questions completed
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-5 py-2 text-xs sm:text-sm font-semibold shadow-xs"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-5 py-2 text-xs sm:text-sm font-semibold shadow-xs bg-emerald-700 hover:bg-emerald-800"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Finish & Submit
            </Button>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Submit Examination Paper?"
        description="Please review your progress before finalizing your submission."
        size="md"
      >
        <div className="space-y-4 pt-2">
          {/* Status summary box */}
          <div className="bg-cream-base/60 p-4 rounded-xl border border-cream-border space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-charcoal-muted">Total Questions:</span>
              <span className="font-bold text-charcoal-dark">{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-emerald-700 font-medium">Answered:</span>
              <span className="font-bold text-emerald-700">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-amber-700 font-medium">Unanswered:</span>
              <span className="font-bold text-amber-700">{unansweredCount}</span>
            </div>
          </div>

          {unansweredCount > 0 ? (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> You have {unansweredCount} unanswered{' '}
                {unansweredCount === 1 ? 'question' : 'questions'}. Unanswered questions will receive
                zero points.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Great job!</strong> You have answered all {totalQuestions} questions on this
                paper.
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-xs font-medium"
            >
              Go Back & Review
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmSubmit}
              className="text-xs font-semibold px-4"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Auto Submitting Overlay (Triggered when time expires) */}
      {isAutoSubmitting && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-xl border border-cream-border">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-charcoal-dark">
              Time Has Expired!
            </h3>
            <p className="text-xs text-charcoal-muted">
              The allotted test duration has ended. Your answers are being recorded and submitted automatically...
            </p>
            <div className="w-8 h-8 border-2 border-indigo-brand border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}
    </div>
  )
}
