import React from 'react'
import { User, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ChildProfile } from './parentData'

export interface ChildSwitcherProps {
  childrenList: ChildProfile[]
  selectedChildId: string
  onSelectChild: (childId: string) => void
  className?: string
}

export const ChildSwitcher: React.FC<ChildSwitcherProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  className,
}) => {
  if (childrenList.length <= 1) return null

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none max-w-full', className)}>
      <span className="text-xs font-display font-semibold text-charcoal-muted shrink-0 mr-1 flex items-center gap-1">
        <User className="w-3.5 h-3.5 text-indigo-brand" />
        <span>Child:</span>
      </span>

      <div className="flex items-center gap-2 shrink-0">
        {childrenList.map((child) => {
          const isSelected = child.id === selectedChildId
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => onSelectChild(child.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer select-none',
                isSelected
                  ? 'bg-indigo-brand text-white border-indigo-brand shadow-sm scale-100'
                  : 'bg-white hover:bg-cream-base text-charcoal-dark border-cream-border hover:border-indigo-300'
              )}
            >
              {/* Child avatar circle */}
              <span
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold uppercase',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-50 text-indigo-700'
                )}
              >
                {child.shortName.charAt(0)}
              </span>

              <span>{child.fullName}</span>

              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors',
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-cream-base text-charcoal-muted'
                )}
              >
                {child.className}
              </span>

              {child.latestResult.position === '1st of 38' && (
                <Sparkles className={cn('w-3 h-3', isSelected ? 'text-amber-300' : 'text-amber-500')} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
