import React, { useState, useRef, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  Plus,
  Mail,
  Shield,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/Card'

export interface TeachingAssignment {
  id: string
  className: string
  subject: string
}

export interface StaffMember {
  id: string
  fullName: string
  email: string
  role: 'Subject Teacher' | 'Class Teacher'
  primaryClass?: string // For Class Teachers (the class they own)
  assignments: TeachingAssignment[]
  status: 'Active' | 'Suspended'
  avatarColor?: string
}

const AVAILABLE_CLASSES = [
  'JSS 1A',
  'JSS 1B',
  'JSS 2A',
  'JSS 2B',
  'JSS 3A',
  'JSS 3B',
  'SSS 1 Science',
  'SSS 1 Arts',
  'SSS 2 Science',
  'SSS 2 Commercial',
  'SSS 3 Science',
  'SSS 3 Arts',
]

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Social Studies',
  'Agricultural Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Financial Accounting',
  'Literature in English',
  'Civic Education',
]

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    fullName: 'Mrs. Bola Adeyemi',
    email: 'b.adeyemi@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'JSS 2A',
    assignments: [
      { id: 'a1', className: 'JSS 2A', subject: 'Mathematics' },
      { id: 'a2', className: 'JSS 2B', subject: 'Mathematics' },
    ],
    status: 'Active',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'staff-2',
    fullName: 'Mr. Chinedu Nwosu',
    email: 'c.nwosu@crownacademy.ng',
    role: 'Subject Teacher',
    assignments: [
      { id: 'a3', className: 'SSS 1 Science', subject: 'Physics' },
      { id: 'a4', className: 'SSS 2 Science', subject: 'Physics' },
      { id: 'a5', className: 'SSS 2 Science', subject: 'Mathematics' },
    ],
    status: 'Active',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'staff-3',
    fullName: 'Mrs. Fatima Okafor',
    email: 'f.okafor@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'JSS 1A',
    assignments: [
      { id: 'a6', className: 'JSS 1A', subject: 'English Language' },
      { id: 'a7', className: 'JSS 1B', subject: 'English Language' },
    ],
    status: 'Active',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'staff-4',
    fullName: 'Mr. Tunde Alabi',
    email: 't.alabi@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'JSS 1B',
    assignments: [
      { id: 'a8', className: 'JSS 1A', subject: 'Basic Science' },
      { id: 'a9', className: 'JSS 1B', subject: 'Basic Science' },
    ],
    status: 'Active',
    avatarColor: 'bg-sky-600',
  },
  {
    id: 'staff-5',
    fullName: 'Mrs. Halima Ibrahim',
    email: 'h.ibrahim@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'SSS 2 Commercial',
    assignments: [
      { id: 'a10', className: 'SSS 2 Commercial', subject: 'Financial Accounting' },
      { id: 'a11', className: 'SSS 3 Arts', subject: 'Economics' },
    ],
    status: 'Active',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'staff-6',
    fullName: 'Mr. Emmanuel Danladi',
    email: 'e.danladi@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'JSS 2B',
    assignments: [
      { id: 'a12', className: 'JSS 2A', subject: 'Social Studies' },
      { id: 'a13', className: 'JSS 2B', subject: 'Social Studies' },
    ],
    status: 'Suspended',
    avatarColor: 'bg-gray-500',
  },
  {
    id: 'staff-7',
    fullName: 'Dr. Kehinde Babatunde',
    email: 'k.babatunde@crownacademy.ng',
    role: 'Class Teacher',
    primaryClass: 'JSS 3A',
    assignments: [
      { id: 'a14', className: 'JSS 3A', subject: 'Agricultural Science' },
      { id: 'a15', className: 'JSS 3B', subject: 'Agricultural Science' },
    ],
    status: 'Active',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'staff-8',
    fullName: 'Mrs. Ngozi Eze',
    email: 'n.eze@crownacademy.ng',
    role: 'Subject Teacher',
    assignments: [
      { id: 'a16', className: 'SSS 1 Science', subject: 'Biology' },
      { id: 'a17', className: 'SSS 2 Science', subject: 'Biology' },
    ],
    status: 'Active',
    avatarColor: 'bg-rose-600',
  },
]

export interface StaffManagementPageProps {
  isAddStaffOpen?: boolean
  onAddStaffOpenChange?: (open: boolean) => void
}

export const StaffManagementPage: React.FC<StaffManagementPageProps> = ({
  isAddStaffOpen: externalIsAddStaffOpen,
  onAddStaffOpenChange,
}) => {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Subject Teacher' | 'Class Teacher'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Suspended'>('ALL')

  // Modals state
  const [internalIsAddStaffOpen, setInternalIsAddStaffOpen] = useState(false)
  const isAddStaffOpen = externalIsAddStaffOpen !== undefined ? externalIsAddStaffOpen : internalIsAddStaffOpen
  const setIsAddStaffOpen = (open: boolean) => {
    setInternalIsAddStaffOpen(open)
    if (onAddStaffOpenChange) onAddStaffOpenChange(open)
  }

  const [staffToDeactivate, setStaffToDeactivate] = useState<StaffMember | null>(null)
  const [activeMenuStaffId, setActiveMenuStaffId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Add Staff Form State
  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'Subject Teacher' | 'Class Teacher'>('Subject Teacher')
  const [newPrimaryClass, setNewPrimaryClass] = useState<string>(AVAILABLE_CLASSES[0])
  const [newAssignments, setNewAssignments] = useState<TeachingAssignment[]>([
    { id: 'init-1', className: AVAILABLE_CLASSES[0], subject: AVAILABLE_SUBJECTS[0] },
  ])
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false)

  // Outside click listener for action menus
  const menuContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenuStaffId(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filtered staff records
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.assignments.some((a) =>
        a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.className.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesRole = roleFilter === 'ALL' || staff.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || staff.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Repeatable assignment handlers
  const handleAddAssignmentRow = () => {
    setNewAssignments((prev) => [
      ...prev,
      {
        id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        className: AVAILABLE_CLASSES[0],
        subject: AVAILABLE_SUBJECTS[0],
      },
    ])
  }

  const handleUpdateAssignment = (
    id: string,
    field: 'className' | 'subject',
    val: string
  ) => {
    setNewAssignments((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    )
  }

  const handleRemoveAssignment = (id: string) => {
    if (newAssignments.length > 1) {
      setNewAssignments((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const handleCreateStaff = () => {
    if (!newFullName.trim() || !newEmail.trim()) return

    setIsSubmittingAdd(true)
    setTimeout(() => {
      const createdStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        fullName: newFullName.trim(),
        email: newEmail.trim(),
        role: newRole,
        primaryClass: newRole === 'Class Teacher' ? newPrimaryClass : undefined,
        assignments: newAssignments,
        status: 'Active',
        avatarColor: 'bg-indigo-600',
      }

      setStaffList((prev) => [createdStaff, ...prev])
      setIsSubmittingAdd(false)
      setIsAddStaffOpen(false)

      // Reset form
      setNewFullName('')
      setNewEmail('')
      setNewRole('Subject Teacher')
      setNewAssignments([
        { id: 'init-1', className: AVAILABLE_CLASSES[0], subject: AVAILABLE_SUBJECTS[0] },
      ])
      showToast(`Invitation successfully sent to ${createdStaff.fullName}!`)
    }, 600)
  }

  // Confirm Deactivation
  const handleConfirmDeactivate = () => {
    if (!staffToDeactivate) return

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffToDeactivate.id ? { ...s, status: 'Suspended' } : s
      )
    )
    showToast(`${staffToDeactivate.fullName} has been deactivated.`)
    setStaffToDeactivate(null)
  }

  // Reactivate
  const handleReactivate = (staff: StaffMember) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: 'Active' } : s))
    )
    showToast(`${staff.fullName} has been reactivated.`)
    setActiveMenuStaffId(null)
  }

  return (
    <div className="space-y-6 animate-fadeIn" ref={menuContainerRef}>
      {/* Toast feedback banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, email, class or subject..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-cream-base/40 focus:bg-white text-charcoal-dark placeholder:text-charcoal-muted/50 rounded-xl border border-cream-border focus:border-indigo-brand focus:outline-none focus:ring-2 focus:ring-indigo-brand/20 transition-all"
            />
          </div>

          {/* Role and Status Filters */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-charcoal-muted font-medium hidden sm:inline">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as 'ALL' | 'Subject Teacher' | 'Class Teacher')
                }
                className="px-3 py-1.5 rounded-xl bg-cream-base/40 border border-cream-border text-xs text-charcoal-dark font-medium focus:outline-none focus:border-indigo-brand"
              >
                <option value="ALL">All Roles</option>
                <option value="Class Teacher">Class Teacher</option>
                <option value="Subject Teacher">Subject Teacher</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-charcoal-muted font-medium hidden sm:inline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'ALL' | 'Active' | 'Suspended')
                }
                className="px-3 py-1.5 rounded-xl bg-cream-base/40 border border-cream-border text-xs text-charcoal-dark font-medium focus:outline-none focus:border-indigo-brand"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Total count badge */}
            <span className="px-2.5 py-1 bg-cream-base rounded-lg text-xs font-semibold text-charcoal-muted shrink-0">
              {filteredStaff.length} {filteredStaff.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>
      </Card>

      {/* STAFF DATA TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Staff Member</TableHead>
            <TableHead className="w-[170px]">Role</TableHead>
            <TableHead>Assigned Class(es) & Subject(s)</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[90px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-charcoal-muted">
                <Users className="w-10 h-10 mx-auto text-charcoal-muted/40 mb-2" />
                <p className="font-semibold text-sm">No staff members found</p>
                <p className="text-xs text-charcoal-muted/70 mt-1">
                  Try adjusting your search keywords or filter options.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            filteredStaff.map((staff) => {
              const isMenuOpen = activeMenuStaffId === staff.id

              return (
                <TableRow key={staff.id} className="group">
                  {/* Name & Email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${
                          staff.avatarColor || 'bg-indigo-600'
                        } text-white flex items-center justify-center font-display font-bold text-xs shrink-0 shadow-xs`}
                      >
                        {staff.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-charcoal-dark truncate text-sm">
                          {staff.fullName}
                        </p>
                        <p className="text-xs text-charcoal-muted/70 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    {staff.role === 'Class Teacher' ? (
                      <Badge variant="gold" size="sm">
                        Class Teacher
                      </Badge>
                    ) : (
                      <Badge variant="primary" size="sm">
                        Subject Teacher
                      </Badge>
                    )}
                  </TableCell>

                  {/* Assigned Classes & Subjects */}
                  <TableCell>
                    <div className="space-y-1">
                      {staff.role === 'Class Teacher' && staff.primaryClass && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 mr-2 mb-1">
                          <Shield className="w-3 h-3 text-amber-600" />
                          <span>Class Head: {staff.primaryClass}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {staff.assignments.map((asg) => (
                          <span
                            key={asg.id}
                            className="inline-flex items-center gap-1 text-[11px] bg-cream-base text-charcoal-dark px-2 py-0.5 rounded-md border border-cream-border"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-charcoal-muted/70" />
                            <span className="font-semibold">{asg.subject}</span>
                            <span className="text-charcoal-muted/70">({asg.className})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {staff.status === 'Active' ? (
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Suspended
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions column */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Edit staff dialog for ${staff.fullName} opening soon.`)
                        }
                        className="p-1.5 rounded-lg text-charcoal-muted/60 hover:text-charcoal-dark hover:bg-cream-base transition-colors"
                        title="Edit Staff Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Dropdown "..." Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuStaffId(isMenuOpen ? null : staff.id)
                          }
                          className="p-1.5 rounded-lg text-charcoal-muted/60 hover:text-charcoal-dark hover:bg-cream-base transition-colors"
                          title="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-cream-border py-1 z-40 animate-fadeIn text-left text-xs font-medium">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuStaffId(null)
                                showToast(`Reassigning classes for ${staff.fullName}`)
                              }}
                              className="w-full px-3 py-2 text-charcoal-dark hover:bg-cream-base flex items-center gap-2 transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-charcoal-muted" />
                              <span>Reassign Classes</span>
                            </button>

                            {staff.status === 'Active' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuStaffId(null)
                                  setStaffToDeactivate(staff)
                                }}
                                className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                              >
                                <UserX className="w-3.5 h-3.5 text-rose-500" />
                                <span>Deactivate</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReactivate(staff)}
                                className="w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Activate</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* ADD STAFF MODAL */}
      <Modal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        title="Add New Staff Member"
        description="Invite a teacher or administrator to your school portal on ScholeOS."
        confirmLabel="Send Invite"
        confirmLoading={isSubmittingAdd}
        onConfirm={handleCreateStaff}
        confirmDisabled={!newFullName.trim() || !newEmail.trim()}
        size="lg"
      >
        <div className="space-y-5">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Mrs. Adeola Bakare"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. a.bakare@school.ng"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Staff Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewRole('Subject Teacher')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                  newRole === 'Subject Teacher'
                    ? 'border-indigo-brand bg-indigo-50/60 text-indigo-brand ring-1 ring-indigo-brand'
                    : 'border-cream-border bg-white text-charcoal-muted hover:border-cream-border'
                }`}
              >
                <p className="font-bold">Subject Teacher</p>
                <p className="text-[11px] font-normal text-charcoal-muted/80 mt-0.5">
                  Enters CA & Exam scores for assigned subjects.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setNewRole('Class Teacher')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                  newRole === 'Class Teacher'
                    ? 'border-gold-brand bg-amber-50/70 text-amber-900 ring-1 ring-gold-brand'
                    : 'border-cream-border bg-white text-charcoal-muted hover:border-cream-border'
                }`}
              >
                <p className="font-bold">Class Teacher (Form Master)</p>
                <p className="text-[11px] font-normal text-charcoal-muted/80 mt-0.5">
                  Owns attendance, conduct ratings & broadsheet compilation.
                </p>
              </button>
            </div>
          </div>

          {/* Single Class Ownership (if Class Teacher) */}
          {newRole === 'Class Teacher' && (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <label className="block text-xs font-bold text-amber-950">
                Assigned Class to Manage (Form Master Class)
              </label>
              <select
                value={newPrimaryClass}
                onChange={(e) => setNewPrimaryClass(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-charcoal-dark rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-gold-brand/40"
              >
                {AVAILABLE_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-800">
                This teacher will be accountable for submission tracking, attendance registers, and report cards for this class.
              </p>
            </div>
          )}

          {/* REPEATABLE ASSIGNMENTS SECTION */}
          <div className="space-y-3 pt-2 border-t border-cream-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-charcoal-dark uppercase tracking-wider">
                  Teaching Subject Assignments
                </h4>
                <p className="text-[11px] text-charcoal-muted">
                  Assign the classes and subjects this educator teaches.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAssignmentRow}
                className="text-xs font-semibold text-indigo-brand hover:text-indigo-hover flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another assignment
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {newAssignments.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-base/40 border border-cream-border"
                >
                  <span className="w-6 text-center text-xs font-bold text-charcoal-muted/60 shrink-0">
                    #{idx + 1}
                  </span>

                  {/* Class select */}
                  <select
                    value={row.className}
                    onChange={(e) =>
                      handleUpdateAssignment(row.id, 'className', e.target.value)
                    }
                    className="flex-1 px-3 py-1.5 text-xs bg-white text-charcoal-dark rounded-lg border border-cream-border focus:outline-none focus:border-indigo-brand"
                  >
                    {AVAILABLE_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>

                  {/* Subject select */}
                  <select
                    value={row.subject}
                    onChange={(e) =>
                      handleUpdateAssignment(row.id, 'subject', e.target.value)
                    }
                    className="flex-1 px-3 py-1.5 text-xs bg-white text-charcoal-dark rounded-lg border border-cream-border focus:outline-none focus:border-indigo-brand"
                  >
                    {AVAILABLE_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>

                  {/* Delete row button */}
                  {newAssignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignment(row.id)}
                      className="p-1.5 rounded-lg text-charcoal-muted/60 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                      title="Remove assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* DEACTIVATE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!staffToDeactivate}
        onClose={() => setStaffToDeactivate(null)}
        title={staffToDeactivate ? `Deactivate ${staffToDeactivate.fullName}?` : 'Deactivate Staff'}
        confirmLabel="Confirm Deactivation"
        confirmVariant="secondary"
        onConfirm={handleConfirmDeactivate}
        size="sm"
      >
        <div className="space-y-3">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <UserX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Immediate Access Revocation</p>
              <p className="mt-0.5">
                They will lose access immediately. Their past submitted records, score sheets, and attendance entries will be kept securely.
              </p>
            </div>
          </div>
          <p className="text-xs text-charcoal-muted">
            You can reactivate this staff member at any time from the actions menu.
          </p>
        </div>
      </Modal>

      {/* Floating Add Staff trigger for convenience if scrolled */}
      <div className="fixed bottom-20 right-6 md:hidden z-20">
        <Button
          variant="primary"
          className="shadow-xl rounded-full px-4 py-3"
          onClick={() => setIsAddStaffOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>
    </div>
  )
}
