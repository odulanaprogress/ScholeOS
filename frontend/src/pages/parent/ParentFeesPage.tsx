import React, { useState } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Upload,
  Receipt,
  FileCheck,
  Building,
  Check,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { ChildSwitcher } from './ChildSwitcher'
import {
  type ChildProfile,
  type FeeInvoiceItem,
  CHILD_FEE_INVOICES,
} from './parentData'

export interface ParentFeesPageProps {
  childrenList: ChildProfile[]
  selectedChildId: string
  onSelectChild: (childId: string) => void
}

export const ParentFeesPage: React.FC<ParentFeesPageProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
}) => {
  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0]

  // Track invoice items in state to support live status update to "pending_verification"
  const [invoicesMap, setInvoicesMap] = useState<Record<string, FeeInvoiceItem[]>>({
    ...CHILD_FEE_INVOICES,
  })

  const currentInvoices = invoicesMap[selectedChildId] || invoicesMap['child-1'] || []

  // Derived summaries
  const totalInvoiced = currentInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = currentInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const balanceRemaining = totalInvoiced - totalPaid

  // Modal & Payment flow state
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoiceItem | null>(null)
  const [paymentMode, setPaymentMode] = useState<'card' | 'bank_transfer_proof' | null>(null)
  const [proofFile, setProofFile] = useState<string | null>(null)
  const [bankRef, setBankRef] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Open pay modal
  const handleOpenPayModal = (invoice: FeeInvoiceItem) => {
    setSelectedInvoice(invoice)
    setPaymentMode('card')
    setProofFile(null)
    setBankRef('')
  }

  // Simulate Instant Card Payment (Paystack/Flutterwave placeholder)
  const handleSimulateCardPayment = () => {
    if (!selectedInvoice) return
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      // Update this invoice to paid
      setInvoicesMap((prev) => ({
        ...prev,
        [selectedChildId]: prev[selectedChildId].map((inv) =>
          inv.id === selectedInvoice.id
            ? {
                ...inv,
                status: 'paid',
                paidAt: 'Just now',
                paymentMethod: 'Online Card (Paystack Simulated)',
                referenceNo: `PSTK-${Math.floor(100000 + Math.random() * 900000)}`,
              }
            : inv
        ),
      }))

      showToast(`Payment of ₦${selectedInvoice.amount.toLocaleString()} for ${selectedInvoice.feeType} confirmed!`)
      setSelectedInvoice(null)
      setPaymentMode(null)
    }, 1200)
  }

  // Submit Bank Transfer Proof
  const handleSubmitBankTransferProof = () => {
    if (!selectedInvoice) return
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      // Update invoice to 'pending_verification'
      setInvoicesMap((prev) => ({
        ...prev,
        [selectedChildId]: prev[selectedChildId].map((inv) =>
          inv.id === selectedInvoice.id
            ? {
                ...inv,
                status: 'pending_verification',
                referenceNo: bankRef || 'GTB-TRF-RECEIPT',
              }
            : inv
        ),
      }))

      showToast(
        `Transfer receipt submitted for ${selectedInvoice.feeType}! Status updated to Pending Verification.`
      )
      setSelectedInvoice(null)
      setPaymentMode(null)
      setProofFile(null)
      setBankRef('')
    }, 1000)
  }

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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. STATCARD-STYLE SUMMARY */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          label="Total Fees for Term"
          value={`₦${totalInvoiced.toLocaleString()}`}
          subtext={`Term 2 • 2025/2026 for ${activeChild.className}`}
          icon={Receipt}
          tone="default"
        />

        <StatCard
          label="Amount Paid"
          value={`₦${totalPaid.toLocaleString()}`}
          subtext={`${Math.round((totalPaid / (totalInvoiced || 1)) * 100)}% of total fees cleared`}
          icon={FileCheck}
          tone="primary"
        />

        <StatCard
          label="Balance Remaining"
          value={
            balanceRemaining > 0
              ? `₦${balanceRemaining.toLocaleString()}`
              : '₦0 (Cleared)'
          }
          subtext={
            balanceRemaining > 0
              ? 'Outstanding payment due to school bursary'
              : 'All term dues fully settled'
          }
          icon={CreditCard}
          tone={balanceRemaining > 0 ? 'warning' : 'success'}
        />
      </section>

      {/* 3. INVOICES TABLE */}
      <Card className="overflow-hidden border-cream-border">
        <div className="p-4 sm:p-5 border-b border-cream-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-base/20">
          <div>
            <h4 className="font-display font-bold text-base text-charcoal-dark">
              Term Invoices & Fee Breakdown
            </h4>
            <p className="text-xs text-charcoal-muted">
              Itemized charges for {activeChild.fullName} ({activeChild.className})
            </p>
          </div>

          <span className="text-xs font-mono text-charcoal-muted">
            Crown Academy Bursary Department
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Fee Description</TableHead>
                <TableHead className="w-36">Term</TableHead>
                <TableHead className="w-32 text-right">Amount (₦)</TableHead>
                <TableHead className="w-32">Due Date</TableHead>
                <TableHead className="w-40">Status</TableHead>
                <TableHead className="w-32 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.map((inv) => {
                let badgeVariant: 'success' | 'warning' | 'danger' | 'gold' = 'success'
                let badgeLabel = 'Paid'

                if (inv.status === 'overdue') {
                  badgeVariant = 'danger'
                  badgeLabel = 'Overdue'
                } else if (inv.status === 'pending') {
                  badgeVariant = 'warning'
                  badgeLabel = 'Pending'
                } else if (inv.status === 'pending_verification') {
                  badgeVariant = 'gold'
                  badgeLabel = 'Pending Verification'
                }

                const isUnpaid = inv.status === 'pending' || inv.status === 'overdue'

                return (
                  <TableRow key={inv.id} className="hover:bg-cream-base/20">
                    <TableCell className="font-semibold text-xs text-charcoal-dark">
                      <div>{inv.feeType}</div>
                      {inv.referenceNo && (
                        <div className="text-[10px] font-mono text-charcoal-muted">
                          Ref: {inv.referenceNo}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-charcoal-muted">
                      {inv.term}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-right text-charcoal-dark">
                      ₦{inv.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-charcoal-muted">
                      {inv.dueDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant} size="sm">
                        {badgeLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isUnpaid ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenPayModal(inv)}
                        >
                          Pay Now
                        </Button>
                      ) : inv.status === 'pending_verification' ? (
                        <span className="text-[11px] text-amber-700 font-semibold italic">
                          Under Review
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 4. PAYMENT MODAL */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => {
          if (!isProcessing) {
            setSelectedInvoice(null)
            setPaymentMode(null)
          }
        }}
        title={selectedInvoice ? `Pay ${selectedInvoice.feeType}` : 'Payment'}
        description={`Crown Academy Bursary • ${activeChild.fullName} (${activeChild.className}) • Amount: ₦${selectedInvoice?.amount.toLocaleString() || '0'}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Amount Callout */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-indigo-800 tracking-wider">
                  Total Payable
                </span>
                <p className="font-display font-bold text-2xl text-indigo-brand">
                  ₦{selectedInvoice.amount.toLocaleString()}
                </p>
              </div>
              <Badge variant="primary" size="sm">
                {selectedInvoice.term}
              </Badge>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-cream-base/60 rounded-xl border border-cream-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMode('card')}
                className={`py-2 px-3 rounded-lg transition-all text-center ${
                  paymentMode === 'card'
                    ? 'bg-white text-indigo-brand shadow-xs border border-cream-border font-bold'
                    : 'text-charcoal-muted hover:text-charcoal-dark'
                }`}
              >
                Online Card / Transfer
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('bank_transfer_proof')}
                className={`py-2 px-3 rounded-lg transition-all text-center ${
                  paymentMode === 'bank_transfer_proof'
                    ? 'bg-white text-indigo-brand shadow-xs border border-cream-border font-bold'
                    : 'text-charcoal-muted hover:text-charcoal-dark'
                }`}
              >
                I've Paid via Bank Transfer
              </button>
            </div>

            {/* OPTION 1: ONLINE CARD / INSTANT PAYMENT */}
            {paymentMode === 'card' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3.5 bg-cream-base/30 rounded-xl border border-cream-border text-xs text-charcoal-muted space-y-1">
                  <p className="font-semibold text-charcoal-dark">
                    Secured by Paystack / Flutterwave Gateway
                  </p>
                  <p>
                    Supports Visa, Mastercard, Verve, USSD, and direct bank account debit with instant receipt generation.
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Cardholder Full Name"
                    placeholder="e.g. Alhaji Dr. S. Bello"
                    defaultValue="Alhaji Dr. S. Bello"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Card Number"
                      placeholder="5399 •••• •••• 4021"
                      defaultValue="5399 4120 8892 4021"
                    />
                    <Input
                      label="Expiry Date / CVV"
                      placeholder="MM/YY • CVV"
                      defaultValue="11/28 • 392"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-md text-sm"
                    isLoading={isProcessing}
                    onClick={handleSimulateCardPayment}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Pay ₦{selectedInvoice.amount.toLocaleString()} with Card</span>
                  </Button>
                </div>
              </div>
            )}

            {/* OPTION 2: BANK TRANSFER PROOF UPLOAD */}
            {paymentMode === 'bank_transfer_proof' && (
              <div className="space-y-4 animate-fadeIn">
                {/* School Bank Account Details */}
                <div className="p-4 bg-cream-base/40 rounded-xl border border-cream-border space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-display font-bold text-charcoal-dark">
                    <Building className="w-4 h-4 text-indigo-brand" />
                    <span>Official School Bursary Bank Account</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-charcoal-muted block">Bank Name:</span>
                      <strong className="text-charcoal-dark">Guaranty Trust Bank (GTBank)</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block">Account Number:</span>
                      <strong className="text-charcoal-dark font-mono text-xs">0123456789</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-charcoal-muted block">Account Name:</span>
                      <strong className="text-charcoal-dark">Crown Academy Lagos School Fees</strong>
                    </div>
                  </div>
                </div>

                {/* Upload Drop Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-charcoal-dark block">
                    Upload Bank Transfer Receipt or Teller Screenshot
                  </label>
                  <div
                    onClick={() => setProofFile('gtbank_transfer_receipt_20260906.pdf')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      proofFile
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-cream-border hover:border-indigo-300 bg-cream-base/20'
                    }`}
                  >
                    <Upload className={`w-7 h-7 mx-auto mb-2 ${proofFile ? 'text-emerald-600' : 'text-charcoal-muted'}`} />
                    {proofFile ? (
                      <div className="space-y-1">
                        <span className="font-semibold text-xs text-emerald-800 block">
                          Receipt attached: {proofFile}
                        </span>
                        <span className="text-[11px] text-emerald-600">
                          Click to replace attachment
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="font-semibold text-xs text-charcoal-dark block">
                          Click to upload receipt image / PDF
                        </span>
                        <span className="text-[11px] text-charcoal-muted">
                          PNG, JPG, or PDF up to 5MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Input
                  label="Payment Reference / Session ID (Optional)"
                  placeholder="e.g. 0000132409060012948"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                />

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-md text-sm"
                    isLoading={isProcessing}
                    onClick={handleSubmitBankTransferProof}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Submit Receipt for Verification</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
