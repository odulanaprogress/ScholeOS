import React, { useState } from 'react'
import {
  Download,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  User,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { WEEKLY_TIMETABLE_SLOTS } from './studentData'

export interface StudentTimetablePageProps {
  classNameTitle?: string
}

export const StudentTimetablePage: React.FC<StudentTimetablePageProps> = ({
  classNameTitle = 'JSS 2A',
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleDownloadTimetable = () => {
    setToastMessage(`Downloading ${classNameTitle} Weekly Academic Timetable PDF...`)
    setTimeout(() => {
      setToastMessage('Timetable PDF downloaded successfully!')
      setTimeout(() => setToastMessage(null), 3500)
    }, 1200)
  }

  const renderSlotCell = (slotInfo: {
    subject: string
    teacher: string
    room: string
    type?: 'break' | 'core' | 'lab'
  }) => {
    if (slotInfo.type === 'break') {
      return (
        <div className="h-full p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center flex flex-col items-center justify-center">
          <span className="font-display font-bold text-xs text-amber-900">
            {slotInfo.subject}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">
            {slotInfo.room}
          </span>
        </div>
      )
    }

    const isLab = slotInfo.type === 'lab'

    return (
      <div
        className={`h-full p-2.5 rounded-xl border transition-all text-left space-y-1 ${
          isLab
            ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 hover:border-emerald-300'
            : 'bg-indigo-50/70 border-indigo-200/70 text-indigo-950 hover:border-indigo-300'
        }`}
      >
        <span className="font-display font-bold text-xs block leading-tight">
          {slotInfo.subject}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-charcoal-muted">
          <MapPin className="w-3 h-3 text-indigo-brand shrink-0" />
          <span>{slotInfo.room}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-charcoal-muted">
          <User className="w-3 h-3 text-charcoal-muted shrink-0" />
          <span>{slotInfo.teacher}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER WITH ACTIONS */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {classNameTitle}
            </Badge>
            <span className="text-xs font-semibold text-charcoal-muted">
              Term 2 • 2025/2026 Academic Session
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-charcoal-dark">
            Weekly Class Timetable
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Official class schedule and classroom laboratory allocations for Crown Academy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="hidden sm:inline-flex"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Print</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadTimetable}
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 px-2 text-xs text-charcoal-muted font-medium">
        <span className="font-semibold text-charcoal-dark">Schedule Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-indigo-100 border border-indigo-300" />
          <span>Core Classroom Subject</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
          <span>Laboratory / Practical Session</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
          <span>Break / Co-Curricular Prep</span>
        </div>
      </div>

      {/* 2. TIMETABLE GRID MATRIX */}
      <Card className="overflow-hidden border-cream-border p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-cream-border text-charcoal-dark font-display font-bold">
                <th className="p-3 w-32 text-left bg-cream-base/50 rounded-tl-xl">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-brand" />
                    <span>Period & Time</span>
                  </div>
                </th>
                <th className="p-3 w-44 text-center bg-cream-base/30">Monday</th>
                <th className="p-3 w-44 text-center bg-cream-base/30">Tuesday</th>
                <th className="p-3 w-44 text-center bg-cream-base/30">Wednesday</th>
                <th className="p-3 w-44 text-center bg-cream-base/30">Thursday</th>
                <th className="p-3 w-44 text-center bg-cream-base/30 rounded-tr-xl">Friday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border/60">
              {WEEKLY_TIMETABLE_SLOTS.map((slot) => (
                <tr key={slot.period} className="hover:bg-cream-base/10">
                  {/* Period & Time header */}
                  <td className="p-2.5 font-mono text-xs bg-cream-base/30 text-charcoal-dark">
                    <div className="font-bold text-indigo-brand font-display">
                      Period {slot.period}
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      {slot.timeRange}
                    </div>
                  </td>

                  {/* Monday */}
                  <td className="p-2 align-top">{renderSlotCell(slot.monday)}</td>

                  {/* Tuesday */}
                  <td className="p-2 align-top">{renderSlotCell(slot.tuesday)}</td>

                  {/* Wednesday */}
                  <td className="p-2 align-top">{renderSlotCell(slot.wednesday)}</td>

                  {/* Thursday */}
                  <td className="p-2 align-top">{renderSlotCell(slot.thursday)}</td>

                  {/* Friday */}
                  <td className="p-2 align-top">{renderSlotCell(slot.friday)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
