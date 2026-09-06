import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SelectableCardProps {
  label?: string
  children: React.ReactNode
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  accentColor?: string
  className?: string
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  children,
  selected,
  onSelect,
  disabled = false,
  accentColor = '#4338CA',
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none text-left shadow-2xs',
        selected
          ? 'bg-indigo-50/40 border-indigo-brand shadow-xs'
          : 'bg-white border-cream-border hover:border-indigo-300 hover:bg-cream-base/20',
        disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
      style={selected ? { borderColor: accentColor } : undefined}
    >
      {/* Option Identifier Badge (e.g., A, B, C, D) */}
      {label && (
        <div
          className={cn(
            'w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-colors shadow-2xs',
            selected
              ? 'text-white'
              : 'bg-cream-base text-charcoal-dark border border-cream-border group-hover:bg-indigo-50 group-hover:text-indigo-brand'
          )}
          style={selected ? { backgroundColor: accentColor } : undefined}
        >
          {label}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 pt-1 text-sm font-medium text-charcoal-dark leading-relaxed">
        {children}
      </div>

      {/* Checkmark Indicator */}
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all duration-150 mt-1',
          selected
            ? 'text-white border-transparent'
            : 'border-cream-border bg-cream-base/50 text-transparent'
        )}
        style={selected ? { backgroundColor: accentColor } : undefined}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>
    </div>
  )
}
