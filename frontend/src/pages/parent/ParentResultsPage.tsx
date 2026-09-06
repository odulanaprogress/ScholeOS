import React, { useState } from 'react'
import {
  Award,
  ChevronRight,
  Download,
  CheckCircle2,
  Sparkles,
  Lock,
  Printer,
  Calendar,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ChildSwitcher } from './ChildSwitcher'
import {
  type ChildProfile,
  type TermResultRecord,
  CHILD_RESULTS_RECORDS,
} from './parentData'

export interface ParentResultsPageProps {
  childrenList?: ChildProfile[]
  selectedChildId: string
  onSelectChild?: (childId: string) => void
  showChildSwitcher?: boolean
  studentName?: string
  classNameTitle?: string
  admissionNumber?: string
}

export const ParentResultsPage: React.FC<ParentResultsPageProps> = ({
  childrenList = [],
  selectedChildId,
  onSelectChild = () => {},
  showChildSwitcher = true,
  studentName,
  classNameTitle,
  admissionNumber,
}) => {
  const activeChild = childrenList.find((c) => c.id === selectedChildId)
  const displayName = studentName || activeChild?.fullName || 'Student'
  const displayClass = classNameTitle || activeChild?.className || 'JSS 2A'
  const displayAdm = admissionNumber || activeChild?.admissionNo || 'JSS2/003'

  const termResults: TermResultRecord[] =
    CHILD_RESULTS_RECORDS[selectedChildId] || CHILD_RESULTS_RECORDS['child-1'] || []

  const [selectedTermResult, setSelectedTermResult] = useState<TermResultRecord | null>(null)
  const [downloadToast, setDownloadToast] = useState<string | null>(null)

  const handleDownloadPDF = (term: TermResultRecord) => {
    setDownloadToast(`Preparing ${displayName} — ${term.termName} ${term.session} Official Report Card PDF...`)
    setTimeout(() => {
      setDownloadToast(`Report Card PDF downloaded successfully!`)
      setTimeout(() => setDownloadToast(null), 3000)
    }, 1200)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. CHILD SWITCHER (Parent portal mode) */}
      {showChildSwitcher && childrenList.length > 1 && (
        <section className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-cream-border shadow-xs">
          <ChildSwitcher
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={onSelectChild}
          />
        </section>
      )}

      {/* 2. PAGE HEADER BANNER */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {displayClass}
            </Badge>
            <span className="text-xs font-mono text-charcoal-muted">
              Adm: {displayAdm}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-charcoal-dark">
            Academic Performance & Report Cards
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Official terminal broadsheets and cumulative continuous assessment reports for {displayName}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-charcoal-muted bg-cream-base/50 p-2.5 rounded-xl border border-cream-border">
          <Calendar className="w-4 h-4 text-indigo-brand" />
          <span>2025/2026 Academic Session</span>
        </div>
      </div>

      {/* 3. LIST OF TERMS (Card rows) */}
      <div className="space-y-3">
        <h4 className="text-xs font-display font-bold text-charcoal-dark uppercase tracking-wider px-1">
          Term Reports & Result Archive
        </h4>

        {termResults.map((term) => {
          const isPublished = term.status === 'published'

          return (
            <Card
              key={term.id}
              className={`p-4 sm:p-5 transition-all duration-200 border-cream-border ${
                isPublished
                  ? 'hover:border-indigo-300 hover:shadow-md cursor-pointer'
                  : 'bg-cream-base/20 opacity-80 cursor-default'
              }`}
              onClick={() => {
                if (isPublished) {
                  setSelectedTermResult(term)
                }
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPublished
                        ? 'bg-indigo-50 text-indigo-brand border border-indigo-200'
                        : 'bg-charcoal-light/10 text-charcoal-muted border border-charcoal-border'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-display font-bold text-base text-charcoal-dark">
                        {term.termName} • {term.session}
                      </h5>
                      <Badge
                        variant={isPublished ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {isPublished ? 'Published' : 'Not Yet Published'}
                      </Badge>
                    </div>

                    {isPublished && term.average ? (
                      <p className="text-xs text-charcoal-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          Class Standing:{' '}
                          <strong className="text-indigo-brand font-bold">
                            {term.position} of {term.totalStudents}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Average:{' '}
                          <strong className="text-emerald-700 font-bold">
                            {term.average}%
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Total Marks:{' '}
                          <strong className="text-charcoal-dark font-mono">
                            {term.overallTotal} / {term.maxTotal}
                          </strong>
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-charcoal-muted">
                        Examinations and continuous assessment compilations are currently underway.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isPublished ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTermResult(term)
                      }}
                    >
                      <span>View Report Card</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  ) : (
                    <span className="text-xs text-charcoal-muted font-mono flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* 4. READ-ONLY REPORT CARD MODAL */}
      <Modal
        isOpen={Boolean(selectedTermResult)}
        onClose={() => setSelectedTermResult(null)}
        title={
          selectedTermResult
            ? `${displayName} — ${selectedTermResult.termName} Official Report Card`
            : 'Report Card'
        }
        description={`Crown Academy Lagos • ${displayClass} • ${selectedTermResult?.session || '2025/2026'}`}
        size="xl"
      >
        {selectedTermResult && (
          <div className="space-y-6">
            {/* Toast notification inside modal */}
            {downloadToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadToast}</span>
              </div>
            )}

            {/* Student Biodata & Terminal Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-cream-base/50 rounded-2xl border border-cream-border text-xs">
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">
                  Admission Number
                </span>
                <p className="font-mono font-bold text-charcoal-dark text-sm">
                  {displayAdm}
                </p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">
                  Class Standing
                </span>
                <p className="font-display font-bold text-indigo-brand text-sm flex items-center gap-1">
                  {selectedTermResult.position} of {selectedTermResult.totalStudents}
                  <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
                </p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">
                  Grand Total
                </span>
                <p className="font-display font-bold text-charcoal-dark text-sm">
                  {selectedTermResult.overallTotal} / {selectedTermResult.maxTotal}
                </p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[10px] uppercase font-bold">
                  Term Average
                </span>
                <p className="font-display font-bold text-emerald-700 text-sm">
                  {selectedTermResult.average}%
                </p>
              </div>
            </div>

            {/* Subject Assessment Breakdown Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
                  Curriculum Assessment Breakdown
                </h4>
                <span className="text-[11px] text-charcoal-muted">
                  WAEC Standard Format (100 Marks Max)
                </span>
              </div>

              <div className="border border-cream-border rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-base/60 text-charcoal-muted font-display font-bold border-b border-cream-border">
                    <tr>
                      <th className="p-2.5 pl-4">Subject</th>
                      <th className="p-2.5 text-center">1st CA (20)</th>
                      <th className="p-2.5 text-center">2nd CA (20)</th>
                      <th className="p-2.5 text-center">Exam (60)</th>
                      <th className="p-2.5 text-center bg-indigo-50/50 text-indigo-brand">Total (100)</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5 pr-4 text-right">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border/60">
                    {selectedTermResult.subjects?.map((sub) => (
                      <tr key={sub.subjectId} className="hover:bg-cream-base/20">
                        <td className="p-2.5 pl-4 font-semibold text-charcoal-dark">
                          {sub.subjectName}
                        </td>
                        <td className="p-2.5 text-center font-mono text-charcoal-muted">
                          {sub.ca1}
                        </td>
                        <td className="p-2.5 text-center font-mono text-charcoal-muted">
                          {sub.ca2}
                        </td>
                        <td className="p-2.5 text-center font-mono text-charcoal-dark font-medium">
                          {sub.exam}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold bg-indigo-50/40 text-indigo-brand">
                          {sub.total}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="p-2.5 pr-4 text-right text-charcoal-muted font-medium">
                          {sub.remark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Qualitative Remarks Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Form Master's Comment */}
              <div className="p-4 bg-cream-base/30 rounded-xl border border-cream-border space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-brand block">
                  Form Master's Remark
                </span>
                <p className="text-charcoal-dark leading-relaxed italic">
                  "{selectedTermResult.teacherComment || 'Commendable academic effort throughout this session.'}"
                </p>
                <span className="text-[10px] text-charcoal-muted block pt-1">
                  — Mrs. Bola Adeyemi (Class Teacher)
                </span>
              </div>

              {/* Principal's Remark */}
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                  Principal's Approval
                </span>
                <p className="text-indigo-950 leading-relaxed italic">
                  "{selectedTermResult.principalRemark || 'Promoted with honors to the next class level.'}"
                </p>
                <span className="text-[10px] text-indigo-700 block pt-1">
                  — Alhaji Dr. S. Bello (Principal)
                </span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-cream-border">
              <span className="text-[11px] text-charcoal-muted">
                Official document certified by Crown Academy Lagos examination committee.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedTermResult(null)}
                  className="flex-1 sm:flex-none"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownloadPDF(selectedTermResult)}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  className="hidden sm:inline-flex text-charcoal-muted"
                  title="Print Report Card"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
