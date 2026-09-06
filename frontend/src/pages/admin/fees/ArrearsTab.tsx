import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
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
  AlertTriangle,
  Users,
  Percent,
  Send,
  Check,
  ArrowUpDown,
  Filter,
  Phone,
  Calendar,
  Search,
} from 'lucide-react'
import { type ArrearsRecord, SCHOOL_CLASSES } from './feesData'

interface ArrearsTabProps {
  arrears: ArrearsRecord[]
  onSendReminder: (recordId: string) => void
}

export const ArrearsTab: React.FC<ArrearsTabProps> = ({
  arrears,
  onSendReminder,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  // Compute summary metrics
  const totalArrearsAmount = useMemo(() => {
    return arrears.reduce((acc, curr) => acc + curr.amountOwed, 0)
  }, [arrears])

  const totalDebtorsCount = arrears.length

  // Realistic collection rate calculation (e.g. ₦18.4M collected out of ₦21.8M total billed)
  const collectionRate = 84.6

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    return arrears
      .filter((rec) => {
        const matchesClass =
          selectedClass === 'all' || rec.class.toLowerCase() === selectedClass.toLowerCase()
        const matchesSearch =
          searchQuery === '' ||
          rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.class.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesClass && matchesSearch
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.amountOwed - a.amountOwed
        } else {
          return a.amountOwed - b.amountOwed
        }
      })
  }, [arrears, selectedClass, sortOrder, searchQuery])

  return (
    <div className="space-y-6">
      {/* 1. StatCards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Arrears"
          value={`₦${totalArrearsAmount.toLocaleString()}`}
          icon={AlertTriangle}
          tone="warning"
          subtext="Outstanding term-end fee balances"
          trend={{ value: '-8.4%', isPositive: true, label: 'vs last month' }}
        />

        <StatCard
          label="Students in Arrears"
          value={totalDebtorsCount}
          icon={Users}
          tone="danger"
          subtext="Across 8 secondary & primary arms"
        />

        <StatCard
          label="Collection Rate"
          value={`${collectionRate}%`}
          icon={Percent}
          tone="success"
          subtext="₦18.4M collected of ₦21.8M billed"
          trend={{ value: '+4.2%', isPositive: true, label: 'vs last term' }}
        />
      </div>

      {/* 2. Filter & Sort Bar */}
      <div className="bg-cream-surface p-4 rounded-2xl border border-cream-border/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search & Class Select */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student or parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-muted shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 px-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
            >
              <option value="all">All Classes</option>
              {SCHOOL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Owed Sort Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-charcoal-muted font-medium">Sort Amount:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="h-9 text-xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
            {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
          </Button>
        </div>
      </div>

      {/* 3. Arrears Table */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]">Student & Guardian</TableHead>
              <TableHead className="w-[14%]">Class Arm</TableHead>
              <TableHead className="w-[18%]">Amount Owed</TableHead>
              <TableHead className="w-[18%]">Academic Term</TableHead>
              <TableHead className="w-[12%]">Last Payment</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-charcoal-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-charcoal-muted/50" />
                    <p className="text-sm font-medium">No students match the current filter criteria.</p>
                    {selectedClass !== 'all' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClass('all')}
                        className="text-indigo-brand text-xs"
                      >
                        Reset Class Filter
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((rec) => (
                <TableRow key={rec.id} className="hover:bg-cream-base/30 transition-colors">
                  {/* Student & Guardian */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 border border-rose-200">
                        {rec.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-dark text-sm">
                          {rec.studentName}
                        </div>
                        <div className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                          <span>{rec.parentName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            {rec.parentPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Class */}
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-cream-base border border-cream-border text-charcoal-dark">
                      {rec.class}
                    </span>
                  </TableCell>

                  {/* Amount Owed */}
                  <TableCell>
                    <div className="font-display font-bold text-rose-600 text-sm sm:text-base">
                      ₦{rec.amountOwed.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-charcoal-muted">
                      Outstanding Arrears
                    </span>
                  </TableCell>

                  {/* Term */}
                  <TableCell>
                    <div className="text-xs text-charcoal-dark font-medium">
                      {rec.term}
                    </div>
                    <span className="text-[11px] text-amber-700 font-medium">
                      Past Due
                    </span>
                  </TableCell>

                  {/* Last Payment */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-dark">
                      <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>{rec.lastPaymentDate}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {rec.reminderSent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Sent ✓
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSendReminder(rec.id)}
                        className="h-8 px-2.5 hover:border-indigo-brand hover:text-indigo-brand text-xs shadow-2xs"
                      >
                        <Send className="w-3 h-3 mr-1 text-indigo-brand" />
                        Send Reminder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
