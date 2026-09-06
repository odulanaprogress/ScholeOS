import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DatePicker } from '@/components/ui/DatePicker'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Plus,
  Edit2,
  Receipt,
  Calendar,
  Check,
} from 'lucide-react'
import { type FeeType, SCHOOL_CLASSES } from './feesData'

interface FeeStructureTabProps {
  feeTypes: FeeType[]
  onSaveFeeType: (feeType: FeeType) => void
  onDeleteFeeType?: (id: string) => void
}

export const FeeStructureTab: React.FC<FeeStructureTabProps> = ({
  feeTypes,
  onSaveFeeType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFee, setEditingFee] = useState<FeeType | null>(null)

  // Modal Form State
  const [formName, setFormName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formAppliesToType, setFormAppliesToType] = useState<'all' | 'specific'>('all')
  const [formClasses, setFormClasses] = useState<string[]>([])
  const [formDueDate, setFormDueDate] = useState('')
  const [formRecurringType, setFormRecurringType] = useState<'per-term' | 'one-time'>('per-term')
  const [formDescription, setFormDescription] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Open modal for new fee
  const handleOpenAdd = () => {
    setEditingFee(null)
    setFormName('')
    setFormAmount('')
    setFormAppliesToType('all')
    setFormClasses([])
    setFormDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    setFormRecurringType('per-term')
    setFormDescription('')
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Open modal for editing existing fee
  const handleOpenEdit = (fee: FeeType) => {
    setEditingFee(fee)
    setFormName(fee.name)
    setFormAmount(fee.amount.toString())
    setFormAppliesToType(fee.appliesToType)
    setFormClasses(fee.appliesToType === 'specific' ? [...fee.applicableClasses] : [])
    setFormDueDate(fee.dueDate)
    setFormRecurringType(fee.recurringType)
    setFormDescription(fee.description || '')
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Toggle class selection for specific class option
  const toggleClass = (cls: string) => {
    if (formClasses.includes(cls)) {
      setFormClasses(formClasses.filter((c) => c !== cls))
    } else {
      setFormClasses([...formClasses, cls])
    }
  }

  const selectAllClasses = () => {
    setFormClasses([...SCHOOL_CLASSES])
  }

  const clearClasses = () => {
    setFormClasses([])
  }

  // Validate and submit
  const handleSave = () => {
    const errors: Record<string, string> = {}
    if (!formName.trim()) {
      errors.name = 'Fee name is required'
    }
    const numAmount = parseFloat(formAmount.replace(/,/g, ''))
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0'
    }
    if (!formDueDate) {
      errors.dueDate = 'Due date is required'
    }
    if (formAppliesToType === 'specific' && formClasses.length === 0) {
      errors.classes = 'Please select at least one class arm'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const savedFee: FeeType = {
      id: editingFee ? editingFee.id : `fee-${Date.now()}`,
      name: formName.trim(),
      amount: numAmount,
      appliesToType: formAppliesToType,
      applicableClasses: formAppliesToType === 'all' ? ['All Classes'] : formClasses,
      dueDate: formDueDate,
      recurringType: formRecurringType,
      description: formDescription.trim() || undefined,
      activeStudentsCount: editingFee?.activeStudentsCount || (formAppliesToType === 'all' ? 1280 : formClasses.length * 35),
    }

    onSaveFeeType(savedFee)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-surface p-5 rounded-2xl border border-cream-border/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-brand" />
            Configured Fee Structure & Levies
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Configure institutional charges, term levies, and class-specific fee schedules for the 2025/2026 session.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Fee Type
        </Button>
      </div>

      {/* Fee Types Table */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Fee Name & Description</TableHead>
              <TableHead className="w-[18%]">Amount (₦)</TableHead>
              <TableHead className="w-[24%]">Applies To</TableHead>
              <TableHead className="w-[14%]">Due Date</TableHead>
              <TableHead className="w-[14%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeTypes.map((fee) => (
              <TableRow key={fee.id} className="hover:bg-cream-base/30 transition-colors">
                {/* Fee Name */}
                <TableCell>
                  <div className="font-semibold text-charcoal-dark text-sm">
                    {fee.name}
                  </div>
                  {fee.description && (
                    <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">
                      {fee.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge
                      variant={fee.recurringType === 'per-term' ? 'primary' : 'gold'}
                      size="sm"
                    >
                      {fee.recurringType === 'per-term' ? 'Per-Term Recurring' : 'One-Time Fee'}
                    </Badge>
                    {fee.activeStudentsCount && (
                      <span className="text-[11px] text-charcoal-muted">
                        • {fee.activeStudentsCount} students enrolled
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell>
                  <div className="font-display font-bold text-charcoal-dark text-sm sm:text-base">
                    ₦{fee.amount.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-charcoal-muted">
                    {fee.recurringType === 'per-term' ? 'per enrolled term' : 'single session charge'}
                  </span>
                </TableCell>

                {/* Applies To */}
                <TableCell>
                  {fee.appliesToType === 'all' ? (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="success" size="sm">
                        All Classes
                      </Badge>
                      <span className="text-xs text-charcoal-muted">(Nursery – SSS 3)</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {fee.applicableClasses.slice(0, 3).map((cls) => (
                        <span
                          key={cls}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-base border border-cream-border text-charcoal-dark"
                        >
                          {cls}
                        </span>
                      ))}
                      {fee.applicableClasses.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-brand">
                          +{fee.applicableClasses.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                    {new Date(fee.dueDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(fee)}
                    className="h-8 px-2.5 hover:bg-indigo-50 hover:text-indigo-brand text-charcoal-muted"
                    title="Edit Fee Type"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Fee Type Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-brand">
              <Receipt className="w-4 h-4" />
            </div>
            <span>{editingFee ? 'Edit Fee Type' : 'Configure New Fee Type'}</span>
          </div>
        }
        description="Set billing parameters, target student classes, payment cycles, and statutory due dates."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
            >
              {editingFee ? 'Update Fee Type' : 'Save Fee Type'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          {/* Fee Name */}
          <div>
            <Input
              label="Fee Name"
              placeholder="e.g. Tuition Fee, PTA Levy, Transport"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value)
                if (formErrors.name) setFormErrors({ ...formErrors, name: '' })
              }}
              error={formErrors.name}
            />
          </div>

          {/* Amount and Frequency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
                Amount (₦)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-bold text-charcoal-muted pointer-events-none">
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={formAmount}
                  onChange={(e) => {
                    setFormAmount(e.target.value)
                    if (formErrors.amount) setFormErrors({ ...formErrors, amount: '' })
                  }}
                  className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-4 border border-cream-border transition-all duration-200 shadow-2xs font-body focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20"
                />
              </div>
              {formErrors.amount && (
                <p className="text-xs text-rose-600 font-medium mt-1">{formErrors.amount}</p>
              )}
            </div>

            {/* Recurring / One-time Frequency */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
                Billing Cycle
              </label>
              <select
                value={formRecurringType}
                onChange={(e) => setFormRecurringType(e.target.value as 'per-term' | 'one-time')}
                className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-cream-border transition-all duration-200 shadow-2xs font-body focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20"
              >
                <option value="per-term">Per-Term Recurring (Termly Invoice)</option>
                <option value="one-time">One-Time Fee (Annual / Session Charge)</option>
              </select>
            </div>
          </div>

          {/* Applies To Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
              Applies To
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormAppliesToType('all')
                  setFormClasses([])
                  if (formErrors.classes) setFormErrors({ ...formErrors, classes: '' })
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                  formAppliesToType === 'all'
                    ? 'border-indigo-brand bg-indigo-50/50 text-indigo-brand font-semibold shadow-2xs'
                    : 'border-cream-border bg-cream-surface hover:bg-cream-base/50 text-charcoal-dark'
                }`}
              >
                <div>
                  <div className="font-semibold">All Classes</div>
                  <div className="text-[11px] text-charcoal-muted mt-0.5">Applies across the whole school</div>
                </div>
                {formAppliesToType === 'all' && <Check className="w-4 h-4 text-indigo-brand" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormAppliesToType('specific')
                  if (formClasses.length === 0) setFormClasses(['SSS 1 Science', 'SSS 1 Arts'])
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                  formAppliesToType === 'specific'
                    ? 'border-indigo-brand bg-indigo-50/50 text-indigo-brand font-semibold shadow-2xs'
                    : 'border-cream-border bg-cream-surface hover:bg-cream-base/50 text-charcoal-dark'
                }`}
              >
                <div>
                  <div className="font-semibold">Specific Classes</div>
                  <div className="text-[11px] text-charcoal-muted mt-0.5">Select class arms & streams</div>
                </div>
                {formAppliesToType === 'specific' && <Check className="w-4 h-4 text-indigo-brand" />}
              </button>
            </div>

            {/* Revealed Multi-Select Class Pills if 'specific' is active */}
            {formAppliesToType === 'specific' && (
              <div className="p-3 bg-cream-base/40 rounded-xl border border-cream-border space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal-dark">
                    Select Class Arms ({formClasses.length} selected):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllClasses}
                      className="text-[11px] text-indigo-brand hover:underline font-medium"
                    >
                      Select All
                    </button>
                    <span className="text-charcoal-muted">•</span>
                    <button
                      type="button"
                      onClick={clearClasses}
                      className="text-[11px] text-charcoal-muted hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SCHOOL_CLASSES.map((cls) => {
                    const isSelected = formClasses.includes(cls)
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          toggleClass(cls)
                          if (formErrors.classes) setFormErrors({ ...formErrors, classes: '' })
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-brand text-white shadow-2xs font-semibold'
                            : 'bg-cream-surface border border-cream-border text-charcoal-dark hover:border-indigo-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {cls}
                      </button>
                    )
                  })}
                </div>

                {formErrors.classes && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.classes}</p>
                )}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <DatePicker
              label="Statutory Due Date"
              value={formDueDate}
              onChange={(e) => {
                setFormDueDate(e.target.value)
                if (formErrors.dueDate) setFormErrors({ ...formErrors, dueDate: '' })
              }}
              error={formErrors.dueDate}
              helperText="Students with unpaid balances past this date will appear on the Arrears register."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display mb-1.5">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Includes laboratory workbook and science practical consumables"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 px-3 border border-cream-border transition-all duration-200 shadow-2xs font-body focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
