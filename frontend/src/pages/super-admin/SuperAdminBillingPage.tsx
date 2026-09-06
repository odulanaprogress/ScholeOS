import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { Modal } from '@/components/ui/Modal'
import {
  type PlatformBillingRecord,
  type LicensedSchool,
  PLAN_DETAILS,
} from './superAdminData'
import {
  CreditCard,
  AlertTriangle,
  UserX,
  Search,
  Download,
  Clock,
  Receipt,
} from 'lucide-react'

export interface SuperAdminBillingPageProps {
  billingRecords: PlatformBillingRecord[]
  schools: LicensedSchool[]
}

export const SuperAdminBillingPage: React.FC<SuperAdminBillingPageProps> = ({
  billingRecords,
  schools,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'paid' | 'pending' | 'failed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecordForReceipt, setSelectedRecordForReceipt] = useState<PlatformBillingRecord | null>(null)

  // Calculations
  const revenueThisMonth = billingRecords
    .filter((b) => b.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const overdueRenewalsCount = schools.filter(
    (s) => s.status === 'grace_period'
  ).length

  const churnedSchoolsCount = schools.filter(
    (s) => s.status === 'suspended'
  ).length

  // Filtered records
  const filteredRecords = billingRecords.filter((record) => {
    const matchesTab =
      activeStatusTab === 'all' || record.status === activeStatusTab

    const matchesSearch =
      record.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesSearch
  })

  const getStatusBadge = (status: PlatformBillingRecord['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'failed':
        return <Badge variant="danger">Failed</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-charcoal-dark tracking-tight">
          Platform SaaS Billing & Revenue
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Centralized ledger of institutional license subscriptions, direct B2B payments, and overdue renewals.
        </p>
      </div>

      {/* 2. Top Row StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Revenue This Month"
          value={`₦${revenueThisMonth.toLocaleString()}`}
          subtext="Net SaaS recurring collections"
          icon={CreditCard}
          trend={{ value: '18.4%', isPositive: true }}
          tone="default"
        />
        <StatCard
          label="Overdue Renewals"
          value={overdueRenewalsCount}
          subtext="Schools currently in Grace Period"
          icon={AlertTriangle}
          tone={overdueRenewalsCount > 0 ? 'gold' : 'default'}
        />
        <StatCard
          label="Churned Schools This Month"
          value={churnedSchoolsCount}
          subtext="Suspended or inactive institutions"
          icon={UserX}
          tone="default"
        />
      </div>

      {/* 3. Search and Filter Bar */}
      <Card className="p-4 border border-cream-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-cream-base/60 rounded-xl border border-cream-border self-start">
            {(['all', 'paid', 'pending', 'failed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeStatusTab === tab
                    ? 'bg-white text-indigo-brand shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal-dark'
                }`}
              >
                {tab === 'all' ? 'All Transactions' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search school or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-cream-base/40 border border-cream-border rounded-xl text-xs text-charcoal-dark placeholder:text-charcoal-muted focus:outline-hidden focus:ring-2 focus:ring-indigo-brand/20 focus:border-indigo-brand"
            />
          </div>
        </div>
      </Card>

      {/* 4. Billing Table */}
      <Card className="border border-cream-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-cream-border bg-white flex items-center justify-between text-xs text-charcoal-muted">
          <span>
            Showing <strong className="text-charcoal-dark">{filteredRecords.length}</strong> transactions
          </span>
          <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
            <Clock className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>Refreshed realtime</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-border bg-cream-base/50 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">School Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 sm:px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border text-sm">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    No billing transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const planInfo = PLAN_DETAILS[record.plan]
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-cream-surface/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-charcoal-dark text-sm">
                          {record.schoolName}
                        </div>
                        <div className="text-xs text-charcoal-muted font-mono mt-0.5">
                          {record.reference}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-display font-bold text-charcoal-dark">
                          ₦{record.amount.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-charcoal-dark">
                        {record.date}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={planInfo.badgeVariant}
                          className="capitalize text-xs font-semibold"
                        >
                          {planInfo.name.split(' ')[0]}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(record.status)}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-charcoal-muted">
                        {record.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedRecordForReceipt(record)}
                          className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-cream-base"
                        >
                          <Receipt className="w-3.5 h-3.5 mr-1 text-charcoal-muted group-hover:text-indigo-brand" />
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Details Modal */}
      {selectedRecordForReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecordForReceipt(null)}
          title="Platform SaaS Receipt"
        >
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-2xl bg-cream-base/60 border border-cream-border space-y-3">
              <div className="flex items-center justify-between border-b border-cream-border pb-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                    Billed Institution
                  </div>
                  <div className="font-display font-bold text-sm text-charcoal-dark">
                    {selectedRecordForReceipt.schoolName}
                  </div>
                </div>
                <div>{getStatusBadge(selectedRecordForReceipt.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-charcoal-muted block">Transaction Ref:</span>
                  <span className="font-mono font-medium text-charcoal-dark">
                    {selectedRecordForReceipt.reference}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Payment Date:</span>
                  <span className="font-medium text-charcoal-dark">
                    {selectedRecordForReceipt.date}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Subscription Tier:</span>
                  <span className="font-medium text-charcoal-dark capitalize">
                    {PLAN_DETAILS[selectedRecordForReceipt.plan].name}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Amount Paid:</span>
                  <span className="font-display font-bold text-indigo-brand text-sm">
                    ₦{selectedRecordForReceipt.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-cream-border text-xs text-charcoal-muted">
                Channel: <strong className="text-charcoal-dark">{selectedRecordForReceipt.paymentMethod}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Downloading electronic receipt for ${selectedRecordForReceipt.reference}...`)
                  setSelectedRecordForReceipt(null)
                }}
                className="text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF Receipt
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRecordForReceipt(null)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
