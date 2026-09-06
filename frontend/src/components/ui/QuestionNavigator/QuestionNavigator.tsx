import React from 'react'
import { cn } from '@/utils/cn'

export interface QuestionNavigatorProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  onSelectQuestion: (index: number) => void
  accentColor?: string
  className?: string
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentIndex,
  answeredIndices,
  onSelectQuestion,
  accentColor = '#4338CA',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1',
        className
      )}
      role="navigation"
      aria-label="Question Navigation"
    >
      {Array.from({ length: totalQuestions }).map((_, idx) => {
        const isCurrent = idx === currentIndex
        const isAnswered = answeredIndices.includes(idx)

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            className={cn(
              'w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all duration-150 shrink-0 shadow-2xs select-none',
              isCurrent && 'ring-2 ring-offset-2 ring-gold-brand scale-105 z-10 font-bold',
              isAnswered && !isCurrent
                ? 'text-white font-bold'
                : !isAnswered && !isCurrent
                ? 'bg-white border border-cream-border text-charcoal-dark hover:border-indigo-300'
                : 'text-white'
            )}
            style={{
              backgroundColor: isAnswered || isCurrent ? accentColor : undefined,
            }}
            title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {idx + 1}
          </button>
        )
      })}
    </div>
  )
}
