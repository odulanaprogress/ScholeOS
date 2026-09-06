import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DatePicker } from '@/components/ui/DatePicker'
import { Textarea } from '@/components/ui/Textarea'
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  ArrowLeft,
  Clock,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { type CbtTest, type CbtQuestion } from '@/pages/cbt'

export interface TeacherCbtBuilderPageProps {
  initialTest?: CbtTest | null
  onSaveTest: (test: CbtTest, publish: boolean) => void
  onCancel: () => void
}

const DEFAULT_CLASSES = ['JSS 1', 'JSS 2A', 'JSS 2B', 'JSS 3', 'SSS 1 Science', 'SSS 1 Arts', 'SSS 2', 'SSS 3']
const DEFAULT_SUBJECTS = ['Mathematics', 'English Language', 'Basic Science', 'Physics', 'Social Studies', 'Agricultural Science']

export const TeacherCbtBuilderPage: React.FC<TeacherCbtBuilderPageProps> = ({
  initialTest,
  onSaveTest,
  onCancel,
}) => {
  // Top Form Metadata
  const [title, setTitle] = useState(initialTest?.title || '')
  const [className, setClassName] = useState(initialTest?.className || 'JSS 2A')
  const [subject, setSubject] = useState(initialTest?.subject || 'Mathematics')
  const [durationMinutes, setDurationMinutes] = useState(initialTest?.durationMinutes?.toString() || '15')
  const [scheduledDate, setScheduledDate] = useState(initialTest?.scheduledDate || new Date().toISOString().split('T')[0])
  const [scheduledStartTime, setScheduledStartTime] = useState(initialTest?.scheduledStartTime || '09:00 AM')

  // Repeatable Questions
  const [questions, setQuestions] = useState<CbtQuestion[]>(
    initialTest?.questions && initialTest.questions.length > 0
      ? initialTest.questions
      : [
          {
            id: 'q-1',
            number: 1,
            text: '',
            options: ['', '', '', ''],
            correctOptionIndex: 0,
            points: 1,
          },
        ]
  )

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-calculated total points
  const totalPoints = useMemo(() => {
    return questions.reduce((sum, q) => sum + (Number(q.points) || 1), 0)
  }, [questions])

  // Handlers for Question Editing
  const handleAddQuestion = () => {
    const newQ: CbtQuestion = {
      id: `q-${Date.now()}`,
      number: questions.length + 1,
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      points: 1,
    }
    setQuestions([...questions, newQ])
  }

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) return
    const updated = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, number: i + 1 }))
    setQuestions(updated)
  }

  const handleUpdateQuestionText = (index: number, text: string) => {
    const updated = [...questions]
    updated[index].text = text
    setQuestions(updated)
  }

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    const newOptions = [...updated[qIndex].options]
    newOptions[optIndex] = value
    updated[qIndex].options = newOptions
    setQuestions(updated)
  }

  const handleSelectCorrectOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions]
    updated[qIndex].correctOptionIndex = optIndex
    setQuestions(updated)
  }

  const handleUpdatePoints = (index: number, points: number) => {
    const updated = [...questions]
    updated[index].points = Math.max(1, points)
    setQuestions(updated)
  }

  const handleSimulateImageUpload = (index: number) => {
    const updated = [...questions]
    updated[index].imageUrl = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60'
    setQuestions(updated)
  }

  const handleRemoveImage = (index: number) => {
    const updated = [...questions]
    delete updated[index].imageUrl
    setQuestions(updated)
  }

  // Validate form
  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Test Title is required'
    const dur = parseInt(durationMinutes, 10)
    if (isNaN(dur) || dur <= 0) errs.duration = 'Valid duration is required'
    if (!scheduledDate) errs.scheduledDate = 'Scheduled date is required'

    // Question validation
    questions.forEach((q, idx) => {
      if (!q.text.trim()) {
        errs[`q_${idx}`] = `Question ${idx + 1} text cannot be empty`
      }
      const hasEmptyOpt = q.options.some((opt) => !opt.trim())
      if (hasEmptyOpt) {
        errs[`q_opt_${idx}`] = `Question ${idx + 1} must have all 4 options filled`
      }
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveDraft = () => {
    if (!validateForm()) return
    const savedTest: CbtTest = {
      id: initialTest?.id || `cbt-${Date.now()}`,
      title: title.trim(),
      classId: className.toLowerCase().replace(/\s+/g, '-'),
      className,
      subject,
      durationMinutes: parseInt(durationMinutes, 10) || 15,
      scheduledDate,
      scheduledStartTime,
      status: 'draft',
      totalPoints,
      questions,
      createdAt: initialTest?.createdAt || new Date().toISOString().split('T')[0],
      isPublished: false,
    }
    onSaveTest(savedTest, false)
  }

  const handleConfirmPublish = () => {
    const savedTest: CbtTest = {
      id: initialTest?.id || `cbt-${Date.now()}`,
      title: title.trim(),
      classId: className.toLowerCase().replace(/\s+/g, '-'),
      className,
      subject,
      durationMinutes: parseInt(durationMinutes, 10) || 15,
      scheduledDate,
      scheduledStartTime,
      status: 'scheduled',
      totalPoints,
      questions,
      createdAt: initialTest?.createdAt || new Date().toISOString().split('T')[0],
      isPublished: true,
    }
    onSaveTest(savedTest, true)
    setIsPublishModalOpen(false)
  }

  const handlePublishClick = () => {
    if (!validateForm()) return
    setIsPublishModalOpen(true)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={onCancel}
          className="text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Tests
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Total Marks: {totalPoints} Points
          </Badge>
          <Badge variant="neutral" size="sm">
            {questions.length} Questions
          </Badge>
        </div>
      </div>

      {/* Test Metadata Card */}
      <Card className="p-6 bg-cream-surface border border-cream-border/80 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-display font-bold text-charcoal-dark">
            {initialTest ? 'Edit CBT Question Bank' : 'Create New CBT Assessment'}
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Configure test parameters, target class arm, examination window, and auto-summed points.
          </p>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Title */}
          <div className="sm:col-span-2">
            <Input
              label="Test Title"
              placeholder="e.g. JSS 2A Mid-Term Mathematics Examination"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
              Duration (Minutes)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-bold"
              />
            </div>
            {errors.duration && <p className="text-xs text-rose-600 font-medium mt-1">{errors.duration}</p>}
          </div>

          {/* Class Arm */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
              Target Class Arm
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
              >
                {DEFAULT_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
              Subject
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
              >
                {DEFAULT_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <DatePicker
              label="Scheduled Date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              error={errors.scheduledDate}
            />
          </div>

          {/* Scheduled Start Time */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
              Start Time
            </label>
            <select
              value={scheduledStartTime}
              onChange={(e) => setScheduledStartTime(e.target.value)}
              className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
            >
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Repeatable Question List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-display font-bold text-charcoal-dark">
            Question Bank ({questions.length})
          </h3>
          <span className="text-xs text-charcoal-muted">
            Select the radio next to each option to set the correct answer
          </span>
        </div>

        {questions.map((q, qIndex) => (
          <Card
            key={q.id}
            className="p-5 bg-cream-surface border border-cream-border/80 shadow-xs space-y-4 relative overflow-hidden"
          >
            {/* Question Top Header */}
            <div className="flex items-center justify-between border-b border-cream-border/60 pb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-charcoal-muted/60 cursor-grab" />
                <span className="font-display font-bold text-sm text-charcoal-dark">
                  Question {qIndex + 1}
                </span>
                <span className="text-xs text-charcoal-muted">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-charcoal-muted font-medium">Points:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={q.points}
                    onChange={(e) => handleUpdatePoints(qIndex, parseInt(e.target.value, 10) || 1)}
                    className="w-12 text-center text-xs font-bold py-1 bg-cream-base rounded-lg border border-cream-border focus:outline-none focus:ring-1 focus:border-indigo-brand"
                  />
                </div>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(qIndex)}
                  className="text-charcoal-muted hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Question Text Area */}
            <div>
              <Textarea
                label={`Question ${qIndex + 1} Text`}
                placeholder="Type your question prompt or problem statement here..."
                value={q.text}
                onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                rows={2}
                error={errors[`q_${qIndex}`]}
              />
            </div>

            {/* Optional Image Dropzone / Preview */}
            <div>
              {q.imageUrl ? (
                <div className="relative inline-block rounded-xl overflow-hidden border border-cream-border bg-cream-base/50 p-1">
                  <img
                    src={q.imageUrl}
                    alt={`Question ${qIndex + 1} Diagram`}
                    className="max-h-36 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(qIndex)}
                    className="absolute top-2 right-2 bg-charcoal-dark/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSimulateImageUpload(qIndex)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-cream-border text-xs text-charcoal-muted hover:text-indigo-brand hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-indigo-brand" />
                  <span>+ Attach optional diagram / illustration</span>
                </button>
              )}
            </div>

            {/* 4 Options (A - D) */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                Options & Correct Answer
              </label>

              {errors[`q_opt_${qIndex}`] && (
                <p className="text-xs text-rose-600 font-medium">{errors[`q_opt_${qIndex}`]}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter, optIndex) => {
                  const isCorrect = q.correctOptionIndex === optIndex
                  return (
                    <div
                      key={letter}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                        isCorrect
                          ? 'border-indigo-brand bg-indigo-50/40'
                          : 'border-cream-border bg-white hover:border-indigo-200'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`q-${qIndex}-opt-${optIndex}`}
                        name={`correct-opt-${qIndex}`}
                        checked={isCorrect}
                        onChange={() => handleSelectCorrectOption(qIndex, optIndex)}
                        className="w-4 h-4 text-indigo-brand focus:ring-indigo-brand accent-indigo-brand cursor-pointer"
                      />
                      <span className="w-6 text-xs font-bold text-charcoal-dark shrink-0">
                        {letter}:
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${letter} text...`}
                        value={q.options[optIndex]}
                        onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                        className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-charcoal-dark font-medium"
                      />
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-brand shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        ))}

        {/* Add Question Button */}
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddQuestion}
            className="w-full py-3 border-dashed border-2 hover:border-indigo-brand hover:text-indigo-brand text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Another Question
          </Button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-cream-surface p-4 rounded-2xl border border-cream-border/80 shadow-xs">
        <Button
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishClick}
            className="shadow-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Publish Test
          </Button>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publish CBT Test?"
        description="Publishing will schedule this examination for student test-taking during the specified window."
        confirmLabel="Confirm & Publish"
        cancelLabel="Cancel"
        onConfirm={handleConfirmPublish}
      >
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs sm:text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-charcoal-muted">Test Title:</span>
            <span className="font-bold text-charcoal-dark">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted">Target Class:</span>
            <span className="font-semibold text-indigo-brand">{className} • {subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted">Examination Window:</span>
            <span className="font-medium text-charcoal-dark">{scheduledDate} at {scheduledStartTime} ({durationMinutes} mins)</span>
          </div>
          <div className="flex justify-between border-t border-indigo-200/60 pt-2 font-bold">
            <span className="text-charcoal-dark">Total Marks:</span>
            <span className="text-indigo-brand">{totalPoints} Points ({questions.length} Questions)</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}
