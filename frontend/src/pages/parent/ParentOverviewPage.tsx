import React from 'react'
import {
  CalendarCheck,
  CreditCard,
  Award,
  Megaphone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChildSwitcher } from './ChildSwitcher'
import type { ChildProfile, SchoolAnnouncement } from './parentData'

export interface ParentOverviewPageProps {
  childrenList: ChildProfile[]
  selectedChildId: string
  onSelectChild: (childId: string) => void
  announcements: SchoolAnnouncement[]
  onNavigateToAttendance: () => void
  onNavigateToResults: () => void
  onNavigateToFees: () => void
}

export const ParentOverviewPage: React.FC<ParentOverviewPageProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  announcements,
  onNavigateToAttendance,
  onNavigateToResults,
  onNavigateToFees,
}) => {
  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0]

  const hasOutstandingFees = activeChild.feeSummary.balanceRemaining > 0
  const isResultPublished = activeChild.latestResult.status === 'published'

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. CHILD SWITCHER */}
      <section className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-cream-border shadow-xs">
        <ChildSwitcher
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={onSelectChild}
        />
      </section>

      {/* 2. STATCARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Attendance This Term */}
        <StatCard
          label="Attendance This Term"
          value={`${activeChild.attendanceSummary.percentage}%`}
          subtext={`${activeChild.attendanceSummary.present} Present · ${activeChild.attendanceSummary.absent} Absent · ${activeChild.attendanceSummary.late} Late`}
          icon={CalendarCheck}
          tone={activeChild.attendanceSummary.percentage >= 90 ? 'success' : 'warning'}
          onClick={onNavigateToAttendance}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />

        {/* Fee Balance */}
        <StatCard
          label="Fee Balance"
          value={
            hasOutstandingFees
              ? `₦${activeChild.feeSummary.balanceRemaining.toLocaleString()}`
              : '₦0 (Cleared)'
          }
          subtext={
            hasOutstandingFees
              ? `Paid ₦${activeChild.feeSummary.totalPaid.toLocaleString()} of ₦${activeChild.feeSummary.totalInvoiced.toLocaleString()}`
              : `All ₦${activeChild.feeSummary.totalInvoiced.toLocaleString()} fees fully settled`
          }
          icon={CreditCard}
          tone={hasOutstandingFees ? 'warning' : 'success'}
          onClick={onNavigateToFees}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />

        {/* Latest Result */}
        <StatCard
          label="Latest Result"
          value={isResultPublished ? `${activeChild.latestResult.average}% Average` : 'Not Released'}
          subtext={
            isResultPublished
              ? `${activeChild.latestResult.term} • Ranked ${activeChild.latestResult.position}`
              : `${activeChild.latestResult.term} computations underway`
          }
          icon={Award}
          tone={isResultPublished ? 'primary' : 'default'}
          onClick={onNavigateToResults}
          className="cursor-pointer hover:border-indigo-300 transition-all"
        />
      </section>

      {/* 3. HERO ACTION CALLOUT & ANNOUNCEMENTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Child Highlights & Direct Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-white via-cream-base/20 to-indigo-50/40 border-cream-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {activeChild.className}
                  </Badge>
                  <span className="text-xs font-mono text-charcoal-muted">
                    Adm: {activeChild.admissionNo}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
                  {activeChild.fullName}'s Academic Dashboard
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg leading-relaxed">
                  Terminal assessments, continuous attendance records, fee statements, and teacher remarks for Crown Academy Lagos.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <Button variant="primary" size="sm" onClick={onNavigateToResults}>
                  <Award className="w-4 h-4 mr-1.5" />
                  View Report Card
                </Button>
                {hasOutstandingFees && (
                  <Button variant="secondary" size="sm" onClick={onNavigateToFees}>
                    <CreditCard className="w-4 h-4 mr-1.5 text-amber-600" />
                    Pay Outstanding
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-cream-border/70 text-xs">
              <div>
                <span className="text-charcoal-muted block text-[11px]">Class Rank</span>
                <span className="font-display font-bold text-sm text-indigo-brand flex items-center gap-1">
                  {activeChild.latestResult.position}
                  <Sparkles className="w-3 h-3 text-gold-brand" />
                </span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[11px]">Attendance</span>
                <span className="font-display font-bold text-sm text-emerald-700">
                  {activeChild.attendanceSummary.percentage}%
                </span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[11px]">Term Status</span>
                <span className="font-display font-bold text-sm text-charcoal-dark">
                  {activeChild.latestResult.term}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Notice Banner if Fees pending */}
          {hasOutstandingFees && (
            <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-950 shadow-2xs">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Outstanding Balance Reminder</span>
                  <p className="text-xs text-amber-800">
                    A balance of ₦{activeChild.feeSummary.balanceRemaining.toLocaleString()} remains on {activeChild.shortName}'s account for {activeChild.className}.
                  </p>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={onNavigateToFees} className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
                Review Invoice →
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Recent Announcements Card */}
        <div className="lg:col-span-1">
          <Card className="p-5 sm:p-6 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-brand flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm text-charcoal-dark">
                  School Announcements
                </h4>
              </div>
              <Badge variant="gold" size="sm">
                Latest
              </Badge>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
              {announcements.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-cream-base/40 hover:bg-cream-base/70 border border-cream-border transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-brand">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-charcoal-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-charcoal-muted" />
                      {item.date}
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-xs text-charcoal-dark leading-snug">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-indigo-brand hover:text-indigo-hover justify-center"
                onClick={onNavigateToResults}
              >
                <span>Check Terminal Results</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
