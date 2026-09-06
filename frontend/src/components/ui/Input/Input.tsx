import React, { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      icon,
      rightElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const hasError = Boolean(error)

    return (
      <div className="w-full space-y-1.5 text-left font-sans">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-slate-400">
              <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full bg-white text-charcoal-dark text-sm rounded-xl py-2.5 transition-all duration-200 shadow-sm placeholder:text-gray-400 font-sans',
              'border',
              icon ? 'pl-11' : 'pl-4',
              rightElement || hasError ? 'pr-11' : 'pr-4',
              hasError
                ? 'border-red-500 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-200 hover:border-gray-300 focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20',
              'focus:outline-none',
              disabled && 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed select-none',
              className
            )}
            {...props}
          />

          {hasError ? (
            <div className="absolute right-3.5 flex items-center justify-center pointer-events-none text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : rightElement ? (
            <div className="absolute right-3.5 flex items-center justify-center text-slate-400">
              {rightElement}
            </div>
          ) : null}
        </div>

        {hasError ? (
          <p id={`${inputId}-error`} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-slate-subtle mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
