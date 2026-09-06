import React, { useState } from 'react'
import {
  Plus,
  Calendar,
  UploadCloud,
  Edit2,
  CheckCircle2,
  Paperclip,
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
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export interface AssignmentItem {
  id: string
  title: string
  description?: string
  className: string
  subject: string
  dueDate: string
  submittedCount: number
  totalStudents: number
  fileName?: string
}

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    title: 'Quadratic Equations & Parabola Curves Homework',
    description: 'Solve problems 1-15 on Chapter 4 of the New General Mathematics textbook.',
    className: 'JSS 2A',
    subject: 'Mathematics',
    dueDate: '2026-09-12',
    submittedCount: 28,
    totalStudents: 38,
    fileName: 'quadratic_exercises_week3.pdf',
  },
  {
    id: 'asg-2',
    title: 'Linear Inequalities Practice Worksheet',
    description: 'Graph the inequalities on the provided grid paper and find the integer solution set.',
    className: 'JSS 2B',
    subject: 'Mathematics',
    dueDate: '2026-09-15',
    submittedCount: 32,
    totalStudents: 40,
    fileName: 'inequalities_worksheet.pdf',
  },
  {
    id: 'asg-3',
    title: 'Vectors, Scalars & Motion Lab Report',
    description: 'Submit your formal laboratory report for the pendulum velocity experiment.',
    className: 'SSS 1 Science',
    subject: 'Physics',
    dueDate: '2026-09-18',
    submittedCount: 18,
    totalStudents: 36,
    fileName: 'physics_lab_template.docx',
  },
]

export interface TeacherAssignmentsPageProps {
  isAddModalOpen?: boolean
  onAddModalOpenChange?: (open: boolean) => void
}

export const TeacherAssignmentsPage: React.FC<TeacherAssignmentsPageProps> = ({
  isAddModalOpen: externalIsAddOpen,
  onAddModalOpenChange,
}) => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS)
  const [internalIsAddOpen, setInternalIsAddOpen] = useState(false)
  const isAddOpen = externalIsAddOpen !== undefined ? externalIsAddOpen : internalIsAddOpen
  const setIsAddOpen = (open: boolean) => {
    setInternalIsAddOpen(open)
    if (onAddModalOpenChange) onAddModalOpenChange(open)
  }

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClassSubject, setSelectedClassSubject] = useState('JSS 2A — Mathematics')
  const [dueDate, setDueDate] = useState('2026-09-20')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    let file: File | null = null
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files?.[0] || null
    } else if (e.target.files) {
      file = e.target.files[0] || null
    }
    if (file) {
      setUploadedFileName(file.name)
    }
  }

  const handleCreateAssignment = () => {
    if (!title.trim()) return
    setIsSubmitting(true)

    setTimeout(() => {
      const parts = selectedClassSubject.split(' — ')
      const className = parts[0] || 'JSS 2A'
      const subject = parts[1] || 'Mathematics'

      const newAssignment: AssignmentItem = {
        id: `asg-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        className,
        subject,
        dueDate,
        submittedCount: 0,
        totalStudents: className === 'JSS 2A' ? 38 : className === 'JSS 2B' ? 40 : 36,
        fileName: uploadedFileName || undefined,
      }

      setAssignments([newAssignment, ...assignments])
      setIsSubmitting(false)
      setIsAddOpen(false)

      // Reset
      setTitle('')
      setDescription('')
      setUploadedFileName(null)
      showToast(`Assignment "${newAssignment.title}" successfully posted!`)
    }, 600)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SUMMARY CARD */}
      <Card className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
            Continuous Learning & Coursework
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Track student submissions, upload digital worksheets, and set submission deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Assignment
          </Button>
        </div>
      </Card>

      {/* ASSIGNMENTS TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[320px]">Title & Resource</TableHead>
            <TableHead className="w-[140px]">Class</TableHead>
            <TableHead className="w-[160px]">Subject</TableHead>
            <TableHead className="w-[140px]">Due Date</TableHead>
            <TableHead className="w-[150px]">Submissions</TableHead>
            <TableHead className="w-[80px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((item) => {
            const ratioPercent = Math.round((item.submittedCount / item.totalStudents) * 100)

            return (
              <TableRow key={item.id}>
                {/* Title */}
                <TableCell>
                  <div>
                    <p className="font-bold text-charcoal-dark text-sm leading-snug">
                      {item.title}
                    </p>
                    {item.fileName ? (
                      <p className="text-xs text-indigo-brand flex items-center gap-1 mt-1 font-medium">
                        <Paperclip className="w-3 h-3" />
                        <span>{item.fileName}</span>
                      </p>
                    ) : item.description ? (
                      <p className="text-xs text-charcoal-muted truncate max-w-sm mt-0.5">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </TableCell>

                {/* Class */}
                <TableCell>
                  <span className="font-semibold text-charcoal-dark text-xs sm:text-sm">
                    {item.className}
                  </span>
                </TableCell>

                {/* Subject */}
                <TableCell>
                  <span className="text-charcoal-muted text-xs sm:text-sm font-medium">
                    {item.subject}
                  </span>
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  <span className="text-xs font-semibold text-charcoal-dark flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-muted/70" />
                    {item.dueDate}
                  </span>
                </TableCell>

                {/* Submissions */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-charcoal-dark">
                        {item.submittedCount} / {item.totalStudents}
                      </span>
                      <span className="text-[11px] text-charcoal-muted">
                        {ratioPercent}%
                      </span>
                    </div>
                    <div className="w-24 bg-cream-base h-1.5 rounded-full overflow-hidden border border-cream-border/60">
                      <div
                        className="bg-indigo-brand h-full rounded-full"
                        style={{ width: `${ratioPercent}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => showToast(`Edit modal for "${item.title}" opening soon.`)}
                    className="p-1.5 rounded-lg text-charcoal-muted/60 hover:text-charcoal-dark hover:bg-cream-base transition-colors"
                    title="Edit assignment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* ADD ASSIGNMENT MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Post New Class Assignment"
        description="Share study materials, practice exercises, and deadlines with your students."
        confirmLabel="Post Assignment"
        confirmLoading={isSubmitting}
        onConfirm={handleCreateAssignment}
        confirmDisabled={!title.trim()}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Vectors and Scalars Lab Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Assignment Instructions / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, required question numbers, or instructions for students..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-surface text-charcoal-dark placeholder:text-charcoal-muted/50 rounded-xl border border-cream-border focus:border-indigo-brand focus:outline-none focus:ring-2 focus:ring-indigo-brand/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Class & Subject */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
                Target Class & Subject
              </label>
              <select
                value={selectedClassSubject}
                onChange={(e) => setSelectedClassSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-charcoal-dark rounded-xl border border-cream-border focus:outline-none focus:border-indigo-brand"
              >
                <option value="JSS 2A — Mathematics">JSS 2A — Mathematics</option>
                <option value="JSS 2B — Mathematics">JSS 2B — Mathematics</option>
                <option value="SSS 1 Science — Physics">SSS 1 Science — Physics</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
                Submission Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-charcoal-dark rounded-xl border border-cream-border focus:outline-none focus:border-indigo-brand"
              />
            </div>
          </div>

          {/* File/Material Upload Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Attach Resource / Worksheet (PDF, Word, or Image)
            </label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-cream-border hover:border-indigo-brand/60 bg-cream-base/30 hover:bg-cream-base/50 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer block"
            >
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileDrop}
              />
              <UploadCloud className="w-8 h-8 text-indigo-brand/70 mb-2" />
              {uploadedFileName ? (
                <div>
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Attached: {uploadedFileName}</span>
                  </p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    Click to replace this file.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-charcoal-dark">
                    Drag and drop file here, or{' '}
                    <span className="text-indigo-brand font-bold underline">browse</span>
                  </p>
                  <p className="text-[11px] text-charcoal-muted mt-1">
                    Supports PDF, DOCX, PNG up to 25MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
