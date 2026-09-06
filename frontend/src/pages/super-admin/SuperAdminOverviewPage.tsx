import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import {
  type LicensedSchool,
  type PlatformBillingRecord,
  PLAN_DETAILS,
} from './superAdminData'
import {
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  Clock,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Layers,
} from 'lucide-react'

export interface SuperAdminOverviewPageProps {
  schools: LicensedSchool[]
  billingRecords: PlatformBillingRecord[]
  onViewSchool: (school: LicensedSchool) => void
  onNavigateToSchools: () => void
  onNavigateToBilling: () => void
}

export const SuperAdminOverviewPage: React.FC<SuperAdminOverviewPageProps> = ({
  schools,
  billingRecords,
  onViewSchool,
  onNavigateToSchools,
  onNavigateToBilling,
}) => {
  // Aggregate Metrics
  const totalSchools = schools.length
  const activeTrials = schools.filter((s) => s.status === 'trial').length
  const activeSchools = schools.filter((s) => s.status === 'active').length
  const totalStudentsPlatformWide = schools.reduce(
    (acc, curr) => acc + curr.studentCount,
    0
  )

  // Calculate Monthly Revenue from billing records
  const monthlyRevenue = billingRecords
    .filter((b) => b.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0)

  // Needs Attention: Trial ending within 3 days OR Grace Period
  const needsAttentionSchools = schools.filter((school) => {
    if (school.status === 'grace_period') return true
    if (
      school.status === 'trial' &&
      school.daysRemaining !== null &&
      school.daysRemaining <= 3
    ) {
      return true
    }
    return false
  })

  // Plan Distribution Breakdown
  const basicCount = schools.filter((s) => s.plan === 'basic').length
  const premiumCount = schools.filter((s) => s.plan === 'premium').length
  const unlimitedCount = schools.filter((s) => s.plan === 'unlimited').length

  const getStatusBadge = (status: LicensedSchool['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'trial':
        return <Badge variant="primary">Trial</Badge>
      case 'grace_period':
        return <Badge variant="warning">Grace Period</Badge>
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-brand to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-brand/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-gold-light border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Platform Control Center • Multi-Tenant Overseer
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              Platform Super Admin
            </h1>
            <p className="text-sm text-indigo-100/90 max-w-2xl font-normal leading-relaxed">
              Global operational intelligence across all licensed schools, continuous tenant health, trial expirations, and SaaS recurring revenue.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onNavigateToSchools}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-medium"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Directory ({totalSchools})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onNavigateToBilling}
              className="bg-gold-brand text-charcoal-dark border-gold-brand hover:bg-gold-light text-xs font-semibold"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Billing Ledger
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Row StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Schools"
          value={totalSchools}
          subtext={`${activeSchools} active • ${activeTrials} in trial`}
          icon={Building2}
          tone="default"
        />
        <StatCard
          label="Active Trials"
          value={activeTrials}
          subtext={`${needsAttentionSchools.filter((s) => s.status === 'trial').length} expiring within 3 days`}
          icon={Clock}
          tone={activeTrials > 0 ? 'gold' : 'default'}
        />
        <StatCard
          label="Total Students Platform-Wide"
          value={totalStudentsPlatformWide.toLocaleString()}
          subtext="Enrolled across all institutions"
          icon={Users}
          tone="default"
        />
        <StatCard
          label="Monthly Revenue"
          value={`₦${monthlyRevenue.toLocaleString()}`}
          subtext="+18.4% from last month"
          icon={CreditCard}
          trend={{ value: '18.4%', isPositive: true }}
          tone="default"
        />
      </div>

      {/* 3. Platform Distribution Summary */}
      <Card className="p-4 sm:p-5 border border-cream-border shadow-xs bg-cream-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-light flex items-center justify-center text-indigo-brand shrink-0 border border-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-charcoal-dark">
                Subscription Tier Distribution
              </h3>
              <p className="text-xs text-charcoal-muted">
                Active tenant distribution across the 3 ScholeOS commercial packages
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="font-semibold text-charcoal-dark">Basic:</span>
              <span className="text-charcoal-muted">{basicCount} schools</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-brand" />
              <span className="font-semibold text-charcoal-dark">Premium:</span>
              <span className="text-charcoal-muted">{premiumCount} schools</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cream-base border border-cream-border text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-brand" />
              <span className="font-semibold text-charcoal-dark">Unlimited:</span>
              <span className="text-charcoal-muted">{unlimitedCount} schools</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Table: "Needs Attention" */}
      <Card className="border border-cream-border shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-cream-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-display font-bold text-charcoal-dark">
                  Needs Attention
                </h2>
                <Badge variant="warning" className="px-2 py-0.5 text-[11px]">
                  {needsAttentionSchools.length} requiring action
                </Badge>
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Schools whose trial ends within 3 days or whose license is in an active Grace Period.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToSchools}
            className="text-xs text-indigo-brand font-semibold hover:bg-indigo-light self-start sm:self-auto"
          >
            View All Schools
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {needsAttentionSchools.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-display font-bold text-charcoal-dark">
              All Systems Optimal
            </h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              No school licenses are expiring in the next 3 days or currently in grace period status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-border bg-cream-base/50 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">School Name</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Urgency / Days Remaining</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border text-sm">
                {needsAttentionSchools.map((school) => {
                  const isTrial = school.status === 'trial'
                  const isGrace = school.status === 'grace_period'
                  return (
                    <tr
                      key={school.id}
                      className="hover:bg-cream-surface/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-charcoal-dark text-sm">
                          {school.name}
                        </div>
                        <div className="text-xs text-charcoal-muted flex items-center gap-2 mt-0.5">
                          <span>{school.adminName}</span>
                          <span>•</span>
                          <span>{school.contactEmail}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={PLAN_DETAILS[school.plan].badgeVariant}
                          className="capitalize text-xs"
                        >
                          {PLAN_DETAILS[school.plan].name.split(' ')[0]}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(school.status)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isTrial && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>
                              {school.daysRemaining === 1
                                ? 'Trial ends tomorrow'
                                : `Trial ends in ${school.daysRemaining} days`}
                            </span>
                          </div>
                        )}
                        {isGrace && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span>
                              {school.daysRemaining !== null
                                ? `${school.daysRemaining} days left in grace`
                                : 'Grace period overdue'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewSchool(school)}
                          className="text-xs font-semibold px-3 py-1 bg-white hover:bg-cream-base"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-charcoal-muted group-hover:text-indigo-brand transition-colors" />
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
