import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  Building2,
  Calendar,
  Hash,
  AlertTriangle,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { type PaymentVerification } from './feesData'

interface PaymentVerificationTabProps {
  verifications: PaymentVerification[]
  onApprove: (item: PaymentVerification) => void
  onReject: (item: PaymentVerification, reason: string) => void
}

export const PaymentVerificationTab: React.FC<PaymentVerificationTabProps> = ({
  verifications,
  onApprove,
  onReject,
}) => {
  // Active Modals state
  const [viewingProof, setViewingProof] = useState<PaymentVerification | null>(null)
  const [approvingItem, setApprovingItem] = useState<PaymentVerification | null>(null)
  const [rejectingItem, setRejectingItem] = useState<PaymentVerification | null>(null)

  // Rejection reason form state
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')

  // Quick phrase suggestions for rejection
  const REJECTION_PRESETS = [
    'Amount paid does not match invoice billing',
    'Bank transfer receipt image is blurred/illegible',
    'Transaction reference not yet credited to school account',
    'Duplicate payment submission already processed',
  ]

  const handleOpenReject = (item: PaymentVerification) => {
    setRejectingItem(item)
    setRejectionReason('')
    setRejectionError('')
  }

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError('A rejection reason is required to notify the parent.')
      return
    }
    if (rejectingItem) {
      onReject(rejectingItem, rejectionReason.trim())
      setRejectingItem(null)
      setRejectionReason('')
    }
  }

  const handleConfirmApprove = () => {
    if (approvingItem) {
      onApprove(approvingItem)
      setApprovingItem(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Informational Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-bold text-amber-950">
              Pending Bank Transfer Reconciliations ({verifications.length})
            </h3>
            <p className="text-xs text-amber-800/90 mt-0.5">
              Review parent-uploaded bank receipts. Approving will automatically mark the student's invoice as Paid.
            </p>
          </div>
        </div>

        <Badge variant="warning" size="sm" className="self-start sm:self-auto shrink-0 font-bold">
          Manual Reconciliation Queue
        </Badge>
      </div>

      {/* Submissions Table */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[26%]">Student & Class</TableHead>
              <TableHead className="w-[22%]">Fee Type</TableHead>
              <TableHead className="w-[16%]">Amount Claimed</TableHead>
              <TableHead className="w-[14%]">Date Submitted</TableHead>
              <TableHead className="w-[10%] text-center">Receipt</TableHead>
              <TableHead className="w-[12%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-charcoal-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    <p className="text-sm font-semibold text-charcoal-dark">
                      All Payments Reconciled!
                    </p>
                    <p className="text-xs text-charcoal-muted max-w-sm">
                      There are currently no pending proof-of-payment submissions awaiting admin verification.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((item) => (
                <TableRow key={item.id} className="hover:bg-cream-base/30 transition-colors">
                  {/* Student & Class */}
                  <TableCell>
                    <div className="font-semibold text-charcoal-dark text-sm">
                      {item.studentName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cream-base border border-cream-border text-charcoal-dark">
                        {item.class}
                      </span>
                      <span className="text-[11px] text-charcoal-muted line-clamp-1">
                        • {item.senderAccount.split('•')[0]}
                      </span>
                    </div>
                  </TableCell>

                  {/* Fee Type */}
                  <TableCell>
                    <div className="font-medium text-charcoal-dark text-xs sm:text-sm">
                      {item.feeType}
                    </div>
                    <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {item.bankName}
                    </span>
                  </TableCell>

                  {/* Amount Claimed */}
                  <TableCell>
                    <div className="font-display font-bold text-charcoal-dark text-sm sm:text-base">
                      ₦{item.amountClaimed.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <Hash className="w-2.5 h-2.5" />
                      {item.receiptRef.slice(0, 14)}...
                    </span>
                  </TableCell>

                  {/* Date Submitted */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-dark font-medium">
                      <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>{item.dateSubmitted}</span>
                    </div>
                    <Badge variant="warning" size="sm" className="mt-1 text-[10px]">
                      Pending Verification
                    </Badge>
                  </TableCell>

                  {/* Proof Link */}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingProof(item)}
                      className="h-8 px-2.5 text-indigo-brand hover:bg-indigo-50 text-xs font-semibold"
                      title="View Proof of Payment"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Proof
                    </Button>
                  </TableCell>

                  {/* Actions Column: Approve & Reject */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setApprovingItem(item)}
                        className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-2xs font-semibold"
                        title="Approve and mark invoice as Paid"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReject(item)}
                        className="h-8 px-2.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 text-xs font-semibold"
                        title="Reject submission and notify parent"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 1. VIEW PROOF MODAL (Full-Size Receipt Simulation) */}
      <Modal
        isOpen={Boolean(viewingProof)}
        onClose={() => setViewingProof(null)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-brand flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Payment Receipt / Proof of Transfer</span>
          </div>
        }
        description={
          viewingProof
            ? `Submission by ${viewingProof.studentName} (${viewingProof.class}) for ${viewingProof.feeType}`
            : ''
        }
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-charcoal-muted">
              Reference: <span className="font-mono font-bold text-charcoal-dark">{viewingProof?.receiptRef}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setViewingProof(null)}
              >
                Close
              </Button>
              {viewingProof && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const current = viewingProof
                    setViewingProof(null)
                    setApprovingItem(current)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Proceed to Approve
                </Button>
              )}
            </div>
          </div>
        }
      >
        {viewingProof && (
          <div className="space-y-4 pt-1">
            {/* Visual Bank Slip Container */}
            <div className="bg-gradient-to-b from-white to-cream-base/30 p-5 rounded-2xl border-2 border-dashed border-cream-border shadow-xs max-w-md mx-auto relative overflow-hidden">
              {/* Receipt Header Banner */}
              <div className="border-b border-cream-border/80 pb-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-muted">
                  <Building2 className="w-4 h-4 text-indigo-brand" />
                  <span>{viewingProof.bankName}</span>
                </div>
                <div className="text-lg font-display font-bold text-charcoal-dark mt-1">
                  Transaction Receipt
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 mt-1">
                  <Check className="w-3 h-3" />
                  TRANSFER SUCCESSFUL
                </div>
              </div>

              {/* Amount Display */}
              <div className="text-center py-4 border-b border-cream-border/80">
                <div className="text-xs text-charcoal-muted uppercase tracking-wider font-semibold">
                  Amount Transferred
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark mt-1">
                  ₦{viewingProof.amountClaimed.toLocaleString()}
                </div>
              </div>

              {/* Transaction Key Details Grid */}
              <div className="py-3 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Beneficiary:</span>
                  <span className="font-semibold text-charcoal-dark">Crown Academy Lagos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Beneficiary Bank:</span>
                  <span className="font-semibold text-charcoal-dark">Wema Bank (0123456789)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Sender Details:</span>
                  <span className="font-semibold text-charcoal-dark">{viewingProof.senderAccount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Student Name:</span>
                  <span className="font-semibold text-indigo-brand">{viewingProof.studentName} ({viewingProof.class})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Payment Purpose:</span>
                  <span className="font-medium text-charcoal-dark">{viewingProof.feeType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Date & Time:</span>
                  <span className="font-medium text-charcoal-dark">{viewingProof.dateSubmitted}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-cream-border/60">
                  <span className="text-charcoal-muted">Session Reference:</span>
                  <span className="font-mono text-[11px] font-bold text-charcoal-dark">{viewingProof.receiptRef}</span>
                </div>
              </div>

              {/* Notes if any */}
              {viewingProof.notes && (
                <div className="bg-cream-base/60 p-2.5 rounded-xl text-[11px] text-charcoal-muted border border-cream-border mt-2">
                  <span className="font-semibold text-charcoal-dark">Parent Remark: </span>
                  {viewingProof.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 2. APPROVE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(approvingItem)}
        onClose={() => setApprovingItem(null)}
        title={
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Confirm Payment Approval</span>
          </div>
        }
        description="Verify and permanently record this bank transfer payment."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setApprovingItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Confirm & Mark as Paid
            </Button>
          </div>
        }
      >
        {approvingItem && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs sm:text-sm">
              <p className="text-charcoal-dark">
                Confirm payment of{' '}
                <strong className="text-emerald-800 font-bold">
                  ₦{approvingItem.amountClaimed.toLocaleString()}
                </strong>{' '}
                for <strong className="font-bold">{approvingItem.studentName}</strong> (
                {approvingItem.class})?
              </p>
              <p className="text-charcoal-muted text-xs">
                This will mark the student's <strong>{approvingItem.feeType}</strong> invoice as{' '}
                <span className="text-emerald-700 font-semibold">Paid</span>, update the parent's portal
                balance, and issue an official receipt.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* 3. REJECT MODAL (Required Reason Textarea) */}
      <Modal
        isOpen={Boolean(rejectingItem)}
        onClose={() => {
          setRejectingItem(null)
          setRejectionReason('')
          setRejectionError('')
        }}
        title={
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Reject Payment Submission</span>
          </div>
        }
        description={
          rejectingItem
            ? `State the specific reason for rejecting the payment claim for ${rejectingItem.studentName}.`
            : ''
        }
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setRejectingItem(null)
                setRejectionReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmReject}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Reject & Notify Parent
            </Button>
          </div>
        }
      >
        {rejectingItem && (
          <div className="space-y-4 pt-2">
            <div className="text-xs text-charcoal-muted">
              Claimed Amount: <strong className="text-charcoal-dark">₦{rejectingItem.amountClaimed.toLocaleString()}</strong> • Fee: <strong className="text-charcoal-dark">{rejectingItem.feeType}</strong>
            </div>

            {/* Quick preset suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase">
                Quick Reason Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REJECTION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setRejectionReason(preset)
                      if (rejectionError) setRejectionError('')
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-cream-base border border-cream-border text-charcoal-dark hover:border-rose-300 hover:bg-rose-50/50 transition-colors text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Reason Textarea */}
            <div>
              <Textarea
                label="Rejection Reason (Required)"
                placeholder="Explain why this proof of payment could not be verified..."
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value)
                  if (rejectionError) setRejectionError('')
                }}
                rows={3}
                error={rejectionError}
                helperText="This explanation will be delivered directly to the parent's portal and SMS alert."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
