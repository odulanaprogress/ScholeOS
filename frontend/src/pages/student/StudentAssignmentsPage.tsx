import React, { useState } from 'react'
import {
  Clock,
  Download,
  Upload,
  CheckCircle2,
  FileText,
  Paperclip,
  Check,
  Send,
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
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import {
  type StudentAssignment,
  STUDENT_ASSIGNMENTS,
} from './studentData'

export interface StudentAssignmentsPageProps {
  classNameTitle?: string
}

export const StudentAssignmentsPage: React.FC<StudentAssignmentsPageProps> = ({
  classNameTitle = 'JSS 2A',
}) => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>(STUDENT_ASSIGNMENTS)
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null)
  const [attachedUpload, setAttachedUpload] = useState<string | null>(null)
  const [studentComment, setStudentComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Open assignment modal
  const handleOpenModal = (asg: StudentAssignment) => {
    setSelectedAssignment(asg)
    setAttachedUpload(null)
    setStudentComment('')
  }

  // Handle submit assignment
  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const updatedFileName = attachedUpload || 'Fatima_Bello_Solution_Homework.pdf'

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                status: 'submitted',
                submittedAt: 'Just now',
                submissionFileName: updatedFileName,
              }
            : a
        )
      )

      showToast(`Assignment "${selectedAssignment.title}" submitted successfully!`)
      setSelectedAssignment(null)
    }, 1000)
  }

  const pendingCount = assignments.filter((a) => a.status === 'not_submitted').length
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER SUMMARY */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {classNameTitle}
            </Badge>
            <span className="text-xs font-semibold text-charcoal-muted">
              Term 2 Coursework Roster
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-charcoal-dark">
            Assignments & Project Homework
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Submit coursework, download teacher worksheets, and track grade feedback.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-cream-base/60 px-4 py-2.5 rounded-xl border border-cream-border text-xs shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
              Status Summary
            </span>
            <span className="font-display font-bold text-indigo-brand">
              {pendingCount} Pending · {submittedCount} Submitted
            </span>
          </div>
        </div>
      </div>

      {/* 2. ASSIGNMENTS TABLE */}
      <Card className="overflow-hidden border-cream-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Subject</TableHead>
                <TableHead>Assignment Title & Details</TableHead>
                <TableHead className="w-36">Teacher</TableHead>
                <TableHead className="w-32">Due Date</TableHead>
                <TableHead className="w-36">Status</TableHead>
                <TableHead className="w-28 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((asg) => {
                let badgeVariant: 'neutral' | 'success' | 'danger' = 'neutral'
                let badgeText = 'Not Submitted'

                if (asg.status === 'submitted') {
                  badgeVariant = 'success'
                  badgeText = 'Submitted'
                } else if (asg.status === 'overdue') {
                  badgeVariant = 'danger'
                  badgeText = 'Overdue'
                }

                return (
                  <TableRow
                    key={asg.id}
                    onClick={() => handleOpenModal(asg)}
                    className="hover:bg-cream-base/30 cursor-pointer"
                  >
                    <TableCell className="font-display font-bold text-xs text-indigo-brand">
                      {asg.subject}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-charcoal-dark">
                        {asg.title}
                      </div>
                      <div className="text-[11px] text-charcoal-muted line-clamp-1 max-w-md">
                        {asg.description}
                      </div>
                      {asg.attachedFileName && (
                        <div className="text-[10px] font-mono text-indigo-700 flex items-center gap-1 mt-0.5">
                          <Paperclip className="w-3 h-3" />
                          <span>{asg.attachedFileName}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-charcoal-muted">
                      {asg.teacherName}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-charcoal-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-charcoal-muted shrink-0" />
                        <span>{asg.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant} size="sm">
                        {badgeText}
                      </Badge>
                      {asg.score && (
                        <span className="block text-[10px] font-bold text-emerald-700 font-mono mt-0.5">
                          Score: {asg.score}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={asg.status === 'submitted' ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenModal(asg)
                        }}
                      >
                        {asg.status === 'submitted' ? 'View' : 'Open'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 3. ASSIGNMENT DETAIL & SUBMISSION MODAL */}
      <Modal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => {
          if (!isSubmitting) setSelectedAssignment(null)
        }}
        title={selectedAssignment ? selectedAssignment.title : 'Assignment Details'}
        description={`${selectedAssignment?.subject} • Teacher: ${selectedAssignment?.teacherName} • Due: ${selectedAssignment?.dueDate}`}
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-5">
            {/* Header Callout & Status */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider block">
                  Course Subject
                </span>
                <span className="font-display font-bold text-base text-indigo-brand">
                  {selectedAssignment.subject}
                </span>
              </div>
              <Badge
                variant={
                  selectedAssignment.status === 'submitted'
                    ? 'success'
                    : selectedAssignment.status === 'overdue'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              >
                {selectedAssignment.status === 'submitted'
                  ? 'Submitted'
                  : selectedAssignment.status === 'overdue'
                  ? 'Overdue'
                  : 'Pending Submission'}
              </Badge>
            </div>

            {/* Assignment Full Instructions */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                Instructions from Teacher
              </h4>
              <div className="p-4 rounded-xl bg-cream-base/40 border border-cream-border text-xs text-charcoal-dark leading-relaxed">
                {selectedAssignment.description}
              </div>
            </div>

            {/* Attached Materials / Worksheets */}
            {selectedAssignment.attachedFileName && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                  Teacher Attached Materials
                </h4>
                <div className="p-3 bg-white border border-cream-border rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-xs text-charcoal-dark">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block font-mono text-[11px]">
                        {selectedAssignment.attachedFileName}
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        PDF Document • {selectedAssignment.attachedFileSize}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      showToast(`Downloading ${selectedAssignment.attachedFileName}...`)
                    }
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Submission Section */}
            {selectedAssignment.status === 'submitted' ? (
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Work Submitted on {selectedAssignment.submittedAt}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  File on record: <strong className="font-mono">{selectedAssignment.submissionFileName}</strong>
                </p>
                {selectedAssignment.score && (
                  <div className="pt-2 text-xs font-bold text-emerald-950">
                    Teacher Score: {selectedAssignment.score}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                  Your Submission
                </h4>

                {/* File Dropzone */}
                <div
                  onClick={() => setAttachedUpload('Fatima_Bello_Math_Worksheet_Ch4.pdf')}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    attachedUpload
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-cream-border hover:border-indigo-300 bg-cream-base/20'
                  }`}
                >
                  <Upload className={`w-6 h-6 mx-auto mb-1.5 ${attachedUpload ? 'text-emerald-600' : 'text-charcoal-muted'}`} />
                  {attachedUpload ? (
                    <div>
                      <span className="font-semibold text-xs text-emerald-800 block">
                        File attached: {attachedUpload}
                      </span>
                      <span className="text-[11px] text-emerald-600">
                        Click to change attachment
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-xs text-charcoal-dark block">
                        Click or drag files here to attach your solution
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        PDF, DOCX, JPG, PNG up to 10MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Optional Student Comment Textarea */}
                <Textarea
                  rows={2}
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  placeholder="Optional note for your teacher (e.g. 'Completed questions 1-20, question 18 was challenging')..."
                />

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAssignment(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={handleSubmitAssignment}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    <span>Submit Assignment</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
