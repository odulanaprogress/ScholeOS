import React, { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface TimerProps {
  initialSeconds: number
  onExpire?: () => void
  isPaused?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  onExpire,
  isPaused = false,
  className,
  size = 'md',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (onExpire) onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, secondsLeft, onExpire])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const isWarning = secondsLeft <= 120 && secondsLeft > 60 // Under 2 minutes
  const isCritical = secondsLeft <= 60 // Under 1 minute

  const sizeClasses = {
    sm: 'text-sm px-2.5 py-1',
    md: 'text-base sm:text-lg px-3.5 py-1.5',
    lg: 'text-xl sm:text-2xl px-5 py-2.5',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl font-mono font-bold border transition-colors select-none shadow-2xs',
        sizeClasses[size],
        isCritical
          ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
          : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-600'
          : 'bg-white border-cream-border text-charcoal-dark',
        className
      )}
      role="timer"
      aria-live="polite"
    >
      {isCritical || isWarning ? (
        <AlertTriangle className={cn('shrink-0', size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      ) : (
        <Clock className={cn('shrink-0 text-charcoal-muted', size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      )}
      <span>{formattedTime}</span>
      {isCritical && <span className="text-[10px] font-sans font-semibold uppercase tracking-wider hidden sm:inline">Ending Soon</span>}
    </div>
  )
}
