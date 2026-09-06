import React, { useState } from 'react'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { FeeStructureTab } from './FeeStructureTab'
import { ArrearsTab } from './ArrearsTab'
import { PaymentVerificationTab } from './PaymentVerificationTab'
import {
  INITIAL_FEE_TYPES,
  INITIAL_ARREARS_RECORDS,
  INITIAL_PAYMENT_VERIFICATIONS,
  type FeeType,
  type ArrearsRecord,
  type PaymentVerification,
} from './feesData'
import {
  Receipt,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react'

interface ToastMessage {
  id: string
  type: 'success' | 'warning' | 'info'
  message: string
}

interface AdminFeesPageProps {
  initialTab?: 'fee-structure' | 'arrears' | 'verification'
}

export const AdminFeesPage: React.FC<AdminFeesPageProps> = ({
  initialTab = 'fee-structure',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  // Local mutable state
  const [feeTypes, setFeeTypes] = useState<FeeType[]>(INITIAL_FEE_TYPES)
  const [arrears, setArrears] = useState<ArrearsRecord[]>(INITIAL_ARREARS_RECORDS)
  const [verifications, setVerifications] = useState<PaymentVerification[]>(
    INITIAL_PAYMENT_VERIFICATIONS
  )

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'warning' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // --- Handlers for Fee Structure ---
  const handleSaveFeeType = (savedFee: FeeType) => {
    setFeeTypes((prev) => {
      const exists = prev.some((f) => f.id === savedFee.id)
      if (exists) {
        return prev.map((f) => (f.id === savedFee.id ? savedFee : f))
      } else {
        return [savedFee, ...prev]
      }
    })
    addToast('success', `Fee type "${savedFee.name}" saved successfully.`)
  }

  // --- Handlers for Arrears ---
  const handleSendReminder = (recordId: string) => {
    setArrears((prev) =>
      prev.map((rec) =>
        rec.id === recordId
          ? { ...rec, reminderSent: true, reminderSentAt: 'Just now' }
          : rec
      )
    )
    const target = arrears.find((r) => r.id === recordId)
    const name = target ? target.studentName : 'Student'
    addToast('success', `Reminder sent to guardian for ${name}.`)
  }

  // --- Handlers for Payment Verification ---
  const handleApproveVerification = (item: PaymentVerification) => {
    // Remove from verification queue
    setVerifications((prev) => prev.filter((v) => v.id !== item.id))

    // Also deduct or clear from arrears if present
    setArrears((prev) =>
      prev.filter(
        (arr) =>
          !(arr.studentName.toLowerCase() === item.studentName.toLowerCase() &&
            arr.amountOwed <= item.amountClaimed)
      ).map((arr) => {
        if (arr.studentName.toLowerCase() === item.studentName.toLowerCase()) {
          return {
            ...arr,
            amountOwed: Math.max(0, arr.amountOwed - item.amountClaimed),
            lastPaymentDate: 'Today',
          }
        }
        return arr
      })
    )

    addToast(
      'success',
      `Payment of ₦${item.amountClaimed.toLocaleString()} for ${item.studentName} approved and marked as Paid.`
    )
  }

  const handleRejectVerification = (item: PaymentVerification, reason: string) => {
    // Remove from verification queue
    setVerifications((prev) => prev.filter((v) => v.id !== item.id))

    addToast(
      'warning',
      `Payment proof for ${item.studentName} rejected. Parent notified: "${reason}".`
    )
  }

  // Define Tabs config
  const tabs: TabItem[] = [
    {
      id: 'fee-structure',
      label: 'Fee Structure',
      icon: Receipt,
    },
    {
      id: 'arrears',
      label: 'Arrears & Debtors',
      icon: AlertTriangle,
    },
    {
      id: 'verification',
      label: 'Payment Verification',
      icon: Clock,
      badge: verifications.length > 0 ? verifications.length : undefined,
      badgeVariant: 'warning',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Master Tabs Row */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 p-2 shadow-2xs">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          variant="pills"
          accentColor="#4338CA"
        />
      </div>

      {/* 2. Sub-views */}
      {activeTab === 'fee-structure' && (
        <FeeStructureTab
          feeTypes={feeTypes}
          onSaveFeeType={handleSaveFeeType}
        />
      )}

      {activeTab === 'arrears' && (
        <ArrearsTab
          arrears={arrears}
          onSendReminder={handleSendReminder}
        />
      )}

      {activeTab === 'verification' && (
        <PaymentVerificationTab
          verifications={verifications}
          onApprove={handleApproveVerification}
          onReject={handleRejectVerification}
        />
      )}

      {/* 3. Toast Notifications Dock */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-900/90 text-white border-emerald-700'
                  : toast.type === 'warning'
                  ? 'bg-amber-900/90 text-white border-amber-700'
                  : 'bg-charcoal-dark/95 text-white border-charcoal-muted'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium pr-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    toast.type === 'success'
                      ? 'text-emerald-300'
                      : toast.type === 'warning'
                      ? 'text-amber-300'
                      : 'text-indigo-300'
                  }`}
                />
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-white/70 hover:text-white shrink-0 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
