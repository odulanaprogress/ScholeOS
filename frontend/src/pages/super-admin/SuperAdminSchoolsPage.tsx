import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SelectableCard } from '@/components/ui/SelectableCard'
import {
  type LicensedSchool,
  type SchoolPlan,
  PLAN_DETAILS,
} from './superAdminData'
import {
  Building2,
  Search,
  Plus,
  Eye,
  SlidersHorizontal,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  History,
  Phone,
  Mail,
  User,
  Sparkles,
} from 'lucide-react'

export interface SuperAdminSchoolsPageProps {
  schools: LicensedSchool[]
  onAddSchool: (newSchool: Omit<LicensedSchool, 'id' | 'createdAt' | 'licenseHistory'>) => void
  onSuspendSchool: (schoolId: string) => void
  onReactivateSchool: (schoolId: string) => void
  onChangePlan: (schoolId: string, newPlan: SchoolPlan) => void
  selectedSchoolForDetail?: LicensedSchool | null
  onCloseDetailModal?: () => void
}

export const SuperAdminSchoolsPage: React.FC<SuperAdminSchoolsPageProps> = ({
  schools,
  onAddSchool,
  onSuspendSchool,
  onReactivateSchool,
  onChangePlan,
  selectedSchoolForDetail: externalSelectedSchool,
  onCloseDetailModal,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')

  // Modals State
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false)
  const [schoolToView, setSchoolToView] = useState<LicensedSchool | null>(
    externalSelectedSchool || null
  )
  const [schoolToSuspend, setSchoolToSuspend] = useState<LicensedSchool | null>(null)
  const [schoolToChangePlan, setSchoolToChangePlan] = useState<LicensedSchool | null>(null)
  const [targetNewPlan, setTargetNewPlan] = useState<SchoolPlan>('premium')

  // Add School Form State
  const [newSchoolName, setNewSchoolName] = useState('')
  const [newShortName, setNewShortName] = useState('')
  const [newContactEmail, setNewContactEmail] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newStudentCount, setNewStudentCount] = useState('250')
  const [newPlan, setNewPlan] = useState<SchoolPlan>('basic')
  const [addError, setAddError] = useState<string | null>(null)

  // Sync external school selection from parent (e.g. Overview click)
  React.useEffect(() => {
    if (externalSelectedSchool) {
      setSchoolToView(externalSelectedSchool)
    }
  }, [externalSelectedSchool])

  // Filtered schools
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.shortName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || school.status === statusFilter

    const matchesPlan =
      planFilter === 'all' || school.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  // Handle Create School Submit
  const handleCreateSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSchoolName.trim() || !newContactEmail.trim()) {
      setAddError('School Name and Contact Email are required.')
      return
    }

    const count = parseInt(newStudentCount) || 100
    onAddSchool({
      name: newSchoolName.trim(),
      shortName: newShortName.trim() || newSchoolName.substring(0, 3).toUpperCase(),
      contactEmail: newContactEmail.trim(),
      contactPhone: newContactPhone.trim() || '+234 800 000 0000',
      adminName: newAdminName.trim() || 'School Administrator',
      plan: newPlan,
      status: 'active',
      studentCount: count,
      trialEndsDate: null,
      daysRemaining: null,
      renewalDate: 'Dec 31, 2026',
    })

    // Reset Form
    setNewSchoolName('')
    setNewShortName('')
    setNewContactEmail('')
    setNewContactPhone('')
    setNewAdminName('')
    setNewStudentCount('250')
    setNewPlan('basic')
    setAddError(null)
    setIsAddSchoolModalOpen(false)
  }

  // Handle Suspend Confirmation
  const handleConfirmSuspend = () => {
    if (schoolToSuspend) {
      onSuspendSchool(schoolToSuspend.id)
      setSchoolToSuspend(null)
      // Also update view modal if open
      if (schoolToView?.id === schoolToSuspend.id) {
        setSchoolToView((prev) => (prev ? { ...prev, status: 'suspended' } : null))
      }
    }
  }

  // Handle Plan Change Submit
  const handleConfirmChangePlan = () => {
    if (schoolToChangePlan) {
      onChangePlan(schoolToChangePlan.id, targetNewPlan)
      setSchoolToChangePlan(null)
      if (schoolToView?.id === schoolToChangePlan.id) {
        setSchoolToView((prev) =>
          prev ? { ...prev, plan: targetNewPlan } : null
        )
      }
    }
  }

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
      {/* 1. Header with Title and Add School Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-charcoal-dark tracking-tight">
            Licensed Schools Directory
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Global management of school tenancies, subscription tiers, seat limits, and lifecycle states.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setAddError(null)
            setIsAddSchoolModalOpen(true)
          }}
          className="shadow-sm font-semibold shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add School
        </Button>
      </div>

      {/* 2. Search & Filters Bar */}
      <Card className="p-4 border border-cream-border shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search school name, principal, short code, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream-base/40 border border-cream-border rounded-xl text-sm text-charcoal-dark placeholder:text-charcoal-muted focus:outline-hidden focus:ring-2 focus:ring-indigo-brand/20 focus:border-indigo-brand"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by school status"
                className="px-2.5 py-1.5 bg-white border border-cream-border rounded-lg text-xs font-medium text-charcoal-dark focus:outline-hidden focus:border-indigo-brand"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="grace_period">Grace Period</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
              <span>Plan:</span>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                aria-label="Filter by subscription plan"
                className="px-2.5 py-1.5 bg-white border border-cream-border rounded-lg text-xs font-medium text-charcoal-dark focus:outline-hidden focus:border-indigo-brand"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic (200 limit)</option>
                <option value="premium">Premium (600 limit)</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Schools Table */}
      <Card className="border border-cream-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-cream-border bg-white flex items-center justify-between text-xs text-charcoal-muted">
          <span>
            Showing <strong className="text-charcoal-dark">{filteredSchools.length}</strong> of {schools.length} registered institutions
          </span>
          {statusFilter !== 'all' || planFilter !== 'all' || searchTerm ? (
            <button
              onClick={() => {
                setStatusFilter('all')
                setPlanFilter('all')
                setSearchTerm('')
              }}
              className="text-indigo-brand font-semibold hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-border bg-cream-base/50 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">School Name</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Trial / Renewal Date</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border text-sm">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-muted">
                    No schools matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => {
                  const isSuspended = school.status === 'suspended'
                  const planInfo = PLAN_DETAILS[school.plan]

                  return (
                    <tr
                      key={school.id}
                      className="hover:bg-cream-surface/60 transition-colors group cursor-pointer"
                      onClick={() => setSchoolToView(school)}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-light text-indigo-brand flex items-center justify-center font-display font-bold text-sm shrink-0 border border-indigo-200">
                            {school.shortName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-charcoal-dark text-sm flex items-center gap-2">
                              <span>{school.name}</span>
                              <span className="text-[11px] font-normal px-1.5 py-0.5 rounded-sm bg-cream-border text-charcoal-muted">
                                {school.shortName}
                              </span>
                            </div>
                            <div className="text-xs text-charcoal-muted flex items-center gap-2 mt-0.5">
                              <span>{school.adminName}</span>
                              <span>•</span>
                              <span>{school.contactEmail}</span>
                            </div>
                          </div>
                        </div>
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
                        {getStatusBadge(school.status)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-charcoal-dark">
                          {school.studentCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-charcoal-muted ml-1">students</span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-charcoal-dark">
                        {school.status === 'trial' ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-blue-700">
                              Ends {school.trialEndsDate || 'Soon'}
                            </span>
                            {school.daysRemaining !== null && (
                              <div className="text-[11px] text-charcoal-muted">
                                ({school.daysRemaining} days remaining)
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="font-medium text-charcoal-dark">
                              {school.renewalDate}
                            </span>
                            {school.status === 'grace_period' && (
                              <div className="text-[11px] text-amber-600 font-semibold">
                                Grace expires in {school.daysRemaining}d
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td
                        className="py-3.5 px-4 sm:px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSchoolToView(school)}
                            title="View School Details"
                            className="p-1.5 text-charcoal-muted hover:text-indigo-brand"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSchoolToChangePlan(school)
                              setTargetNewPlan(school.plan)
                            }}
                            title="Change Subscription Plan"
                            className="p-1.5 text-charcoal-muted hover:text-indigo-brand"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </Button>

                          {isSuspended ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onReactivateSchool(school.id)}
                              title="Reactivate School Access"
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSchoolToSuspend(school)}
                              title="Suspend School Access"
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* MODAL 1: ADD SCHOOL (Sales-Assisted Manual Onboarding)   */}
      {/* ======================================================== */}
      <Modal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
        title="Manual School Onboarding"
      >
        <form onSubmit={handleCreateSchoolSubmit} className="space-y-4 pt-1">
          <p className="text-xs text-charcoal-muted">
            Create a licensed tenant workspace for sales-assisted signups or direct enterprise partner onboarding.
          </p>

          {addError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
              {addError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Official School Name"
              placeholder="e.g. Corona Secondary School"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              required
            />
            <Input
              label="Short Name / Code"
              placeholder="e.g. CSS"
              value={newShortName}
              onChange={(e) => setNewShortName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Primary Contact Email"
              type="email"
              placeholder="admin@school.edu.ng"
              value={newContactEmail}
              onChange={(e) => setNewContactEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+234 802 000 0000"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Principal / Admin Name"
              placeholder="e.g. Alhaji M. Bello"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
            />
            <Input
              label="Estimated Student Count"
              type="number"
              placeholder="250"
              value={newStudentCount}
              onChange={(e) => setNewStudentCount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Select Initial License Plan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['basic', 'premium', 'unlimited'] as SchoolPlan[]).map((planKey) => {
                const isSelected = newPlan === planKey
                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => setNewPlan(planKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-brand bg-indigo-50/50 ring-2 ring-indigo-brand/20'
                        : 'border-cream-border hover:bg-cream-base/50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-charcoal-dark capitalize">
                      {planKey}
                    </div>
                    <div className="text-[11px] text-indigo-brand font-bold mt-0.5">
                      {PLAN_DETAILS[planKey].priceFormatted}
                    </div>
                    <div className="text-[10px] text-charcoal-muted truncate">
                      {PLAN_DETAILS[planKey].studentLimit}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-border">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsAddSchoolModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-semibold px-4">
              Create School Workspace
            </Button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: SCHOOL DETAIL VIEW & LICENSE HISTORY TIMELINE   */}
      {/* ======================================================== */}
      {schoolToView && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSchoolToView(null)
            if (onCloseDetailModal) onCloseDetailModal()
          }}
          title={schoolToView.name}
        >
          <div className="space-y-5 pt-1">
            {/* Top Metadata Header */}
            <div className="p-4 rounded-2xl bg-cream-base/50 border border-cream-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-brand text-white flex items-center justify-center font-display font-bold text-lg shadow-sm shrink-0">
                  {schoolToView.shortName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-display font-bold text-charcoal-dark">
                      {schoolToView.name}
                    </h3>
                    <span className="text-xs px-1.5 py-0.5 rounded-sm bg-white border border-cream-border text-charcoal-muted">
                      {schoolToView.shortName}
                    </span>
                  </div>
                  <div className="text-xs text-charcoal-muted flex items-center gap-2 mt-0.5">
                    <span>ID: {schoolToView.id}</span>
                    <span>•</span>
                    <span>Registered {schoolToView.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(schoolToView.status)}
                <Badge variant={PLAN_DETAILS[schoolToView.plan].badgeVariant} className="capitalize">
                  {PLAN_DETAILS[schoolToView.plan].name}
                </Badge>
              </div>
            </div>

            {/* Quick Contact & Quota Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-cream-border bg-white space-y-2">
                <div className="font-semibold text-charcoal-dark flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-brand" />
                  Administrator Info
                </div>
                <div className="text-charcoal-muted space-y-1">
                  <div>Head: <strong className="text-charcoal-dark">{schoolToView.adminName}</strong></div>
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span>{schoolToView.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{schoolToView.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-cream-border bg-white space-y-2">
                <div className="font-semibold text-charcoal-dark flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold-brand" />
                  Subscription & Capacity
                </div>
                <div className="text-charcoal-muted space-y-1">
                  <div>Capacity: <strong className="text-charcoal-dark">{schoolToView.studentCount} students enrolled</strong></div>
                  <div>Tier Allowance: <span className="text-charcoal-dark font-medium">{PLAN_DETAILS[schoolToView.plan].studentLimit}</span></div>
                  <div>Next Renewal: <strong className="text-charcoal-dark">{schoolToView.renewalDate}</strong></div>
                </div>
              </div>
            </div>

            {/* License History Timeline */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-dark">
                <History className="w-3.5 h-3.5 text-indigo-brand" />
                <span>Subscription & License Audit Trail</span>
              </div>

              <div className="border border-cream-border rounded-xl bg-white p-3 space-y-3 max-h-48 overflow-y-auto">
                {schoolToView.licenseHistory.length === 0 ? (
                  <div className="text-xs text-charcoal-muted text-center py-4">
                    No historical changes recorded.
                  </div>
                ) : (
                  schoolToView.licenseHistory.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-brand mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-charcoal-dark">{item.event}</strong>
                          <span className="text-[11px] text-charcoal-muted shrink-0">{item.date}</span>
                        </div>
                        {item.note && (
                          <div className="text-charcoal-muted text-[11px] mt-0.5">
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Footer inside Details */}
            <div className="flex items-center justify-between pt-3 border-t border-cream-border">
              <div className="flex items-center gap-2">
                {schoolToView.status === 'suspended' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onReactivateSchool(schoolToView.id)
                      setSchoolToView((prev) => (prev ? { ...prev, status: 'active' } : null))
                    }}
                    className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                  >
                    <PlayCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Reactivate Access
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSchoolToSuspend(schoolToView)
                    }}
                    className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <PauseCircle className="w-3.5 h-3.5 mr-1" />
                    Suspend School
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSchoolToChangePlan(schoolToView)
                    setTargetNewPlan(schoolToView.plan)
                  }}
                  className="text-xs text-indigo-brand border-indigo-200 hover:bg-indigo-50"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                  Change Plan
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSchoolToView(null)
                  if (onCloseDetailModal) onCloseDetailModal()
                }}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: SUSPEND CONFIRMATION SAFETY MODAL               */}
      {/* ======================================================== */}
      {schoolToSuspend && (
        <Modal
          isOpen={true}
          onClose={() => setSchoolToSuspend(null)}
          title="Confirm School Suspension"
        >
          <div className="space-y-4 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-display font-bold text-charcoal-dark">
                Suspend {schoolToSuspend.name}?
              </h3>
              <p className="text-xs text-charcoal-muted leading-relaxed max-w-md mx-auto">
                They will lose access immediately. Their data will be retained and can be reactivated at any time from this dashboard.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <span>Impact Assessment:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700">
                <li>Teachers and admins will be prevented from logging in.</li>
                <li>Parent and student portals will enter a temporary suspension hold.</li>
                <li>Scheduled announcements and automated fee reminders will be paused.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSchoolToSuspend(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSuspend}
                className="bg-rose-600 hover:bg-rose-700 text-white border-none font-semibold px-4"
              >
                Confirm Suspension
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CHANGE PLAN (Reusing SelectableCard from Wave 12)*/}
      {/* ======================================================== */}
      {schoolToChangePlan && (
        <Modal
          isOpen={true}
          onClose={() => setSchoolToChangePlan(null)}
          title={`Update Plan — ${schoolToChangePlan.name}`}
        >
          <div className="space-y-4 pt-1">
            <p className="text-xs text-charcoal-muted">
              Select a new commercial tier for this school. Changes take effect immediately.
            </p>

            <div className="space-y-2.5">
              <SelectableCard
                selected={targetNewPlan === 'basic'}
                onSelect={() => setTargetNewPlan('basic')}
                className="p-3.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-charcoal-dark">
                      Basic School Plan
                    </div>
                    <div className="text-xs text-charcoal-muted mt-0.5">
                      Up to 200 enrolled students • Standard gradebook & broadsheets
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-brand">₦35,000</span>
                    <span className="text-[11px] text-charcoal-muted block">/ term</span>
                  </div>
                </div>
              </SelectableCard>

              <SelectableCard
                selected={targetNewPlan === 'premium'}
                onSelect={() => setTargetNewPlan('premium')}
                className="p-3.5 border-indigo-brand/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-sm text-charcoal-dark">
                        Professional / Premium
                      </span>
                      <span className="text-[10px] bg-indigo-light text-indigo-brand font-semibold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div className="text-xs text-charcoal-muted mt-0.5">
                      Up to 600 enrolled students • Full CBT examination room & parent fees
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-brand">₦65,000</span>
                    <span className="text-[11px] text-charcoal-muted block">/ term</span>
                  </div>
                </div>
              </SelectableCard>

              <SelectableCard
                selected={targetNewPlan === 'unlimited'}
                onSelect={() => setTargetNewPlan('unlimited')}
                className="p-3.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-sm text-charcoal-dark">
                        Enterprise Unlimited
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
                    </div>
                    <div className="text-xs text-charcoal-muted mt-0.5">
                      Unlimited students & staff • Priority WhatsApp gateway & dedicated SLA
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-brand">₦120,000</span>
                    <span className="text-[11px] text-charcoal-muted block">/ term</span>
                  </div>
                </div>
              </SelectableCard>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSchoolToChangePlan(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmChangePlan}
                className="font-semibold px-4"
              >
                Confirm Plan Change
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
