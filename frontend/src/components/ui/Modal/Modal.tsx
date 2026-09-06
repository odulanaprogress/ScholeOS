import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  confirmVariant?: 'primary' | 'secondary' | 'ghost'
  confirmLoading?: boolean
  confirmDisabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showCloseButton?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  confirmLoading = false,
  confirmDisabled = false,
  size = 'md',
  className,
  showCloseButton = true,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-dark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full bg-cream-surface rounded-2xl sm:rounded-3xl shadow-2xl border border-cream-border z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-200 animate-scaleUp',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-cream-border/70">
            <div className="space-y-1 pr-6">
              {title && (
                <h3 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-charcoal-muted/80">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-charcoal-muted/60 hover:text-charcoal-dark hover:bg-cream-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-brand/30"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer !== undefined ? (
          footer
        ) : onConfirm || onClose ? (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-3 border-t border-cream-border/70 bg-cream-base/30">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={confirmLoading}
            >
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="sm"
                onClick={onConfirm}
                isLoading={confirmLoading}
                disabled={confirmDisabled}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
