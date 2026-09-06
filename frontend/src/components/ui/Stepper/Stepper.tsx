import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

export interface StepItem {
  id?: string | number
  title: string
  description?: string
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  currentStep: number // 1-based index (e.g. 1 to 5)
  onStepClick?: (stepIndex: number) => void
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, onStepClick, ...props }, ref) => {
    const totalSteps = steps.length

    return (
      <div ref={ref} className={cn('w-full font-sans', className)} {...props}>
        {/* Mobile View: Collapses to "Step X of Y" with a clean progress bar */}
        <div className="block sm:hidden space-y-2 bg-white p-4 rounded-2xl schole-card-shadow border border-black/[0.04]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-display font-bold uppercase tracking-wider text-indigo-brand">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="font-semibold text-charcoal-dark truncate max-w-[200px]">
              {steps[currentStep - 1]?.title}
            </span>
          </div>

          {/* Mobile Progress Bar */}
          <div className="w-full bg-cream-border/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-brand h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop / Tablet View: Full Horizontal Stepper with numbered icons, titles & connectors */}
        <div className="hidden sm:block">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between w-full relative">
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isCompleted = stepNumber < currentStep
                const isCurrent = stepNumber === currentStep
                const isUpcoming = stepNumber > currentStep
                const isClickable = Boolean(onStepClick && stepNumber <= currentStep)

                return (
                  <li
                    key={step.title || index}
                    className={cn(
                      'relative flex-1 flex flex-col items-center group',
                      index !== steps.length - 1 && 'pr-4'
                    )}
                  >
                    {/* Connecting Bar to Next Step */}
                    {index !== steps.length - 1 && (
                      <div
                        className="absolute top-5 left-1/2 w-full h-0.5 -z-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            stepNumber < currentStep ? 'bg-indigo-brand' : 'bg-gray-200'
                          )}
                        />
                      </div>
                    )}

                    {/* Step Icon / Circle */}
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => onStepClick?.(stepNumber)}
                      className={cn(
                        'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-brand',
                        isCompleted &&
                          'bg-indigo-brand text-white shadow-sm hover:scale-105',
                        isCurrent &&
                          'bg-indigo-brand text-white ring-4 ring-indigo-brand/20 shadow-md scale-110',
                        isUpcoming &&
                          'bg-white text-gray-400 border-2 border-gray-200',
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      )}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <span>{stepNumber}</span>
                      )}
                    </button>

                    {/* Step Title Label */}
                    <div className="mt-2.5 text-center px-1">
                      <span
                        className={cn(
                          'block text-xs font-display font-semibold transition-colors leading-tight',
                          isCurrent && 'text-indigo-brand font-bold',
                          isCompleted && 'text-charcoal-dark font-medium',
                          isUpcoming && 'text-gray-400'
                        )}
                      >
                        {step.title}
                      </span>
                      {step.description && (
                        <span className="hidden lg:block text-[10px] text-slate-subtle mt-0.5">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'
