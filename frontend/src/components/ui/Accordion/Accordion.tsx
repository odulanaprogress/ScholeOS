import React, { createContext, useContext, useState, forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  allowMultiple?: boolean
  defaultOpenIds?: string[]
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, allowMultiple = false, defaultOpenIds = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpenIds)

    const toggleItem = (id: string) => {
      setOpenItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return allowMultiple ? [...prev, id] : [id]
      })
    }

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem }}>
        <div ref={ref} className={cn('space-y-4 font-sans', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, id, children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    const isOpen = context?.openItems.includes(id) ?? false

    return (
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'bg-cream-surface rounded-2xl transition-all duration-200 border border-black/[0.04] schole-card-shadow overflow-hidden',
          isOpen && 'border-indigo-border/60 ring-1 ring-indigo-500/10',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ id?: string; isOpen?: boolean }>, {
              id,
              isOpen,
            })
          }
          return child
        })}
      </div>
    )
  }
)
AccordionItem.displayName = 'AccordionItem'

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string
  isOpen?: boolean
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, id, isOpen, children, ...props }, ref) => {
    const context = useContext(AccordionContext)

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => id && context?.toggleItem(id)}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between py-5 px-6 text-left transition-colors font-display font-bold text-base sm:text-lg text-charcoal-dark select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-brand/50',
          isOpen ? 'text-indigo-brand' : 'hover:text-indigo-brand',
          className
        )}
        {...props}
      >
        <span className="pr-4 leading-snug">{children}</span>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
            isOpen ? 'rotate-180 bg-indigo-light text-indigo-brand' : 'bg-cream-hover text-slate-500'
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  isOpen?: boolean
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, isOpen, children, ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={cn(
          'px-6 pb-6 pt-1 text-slate-subtle text-sm sm:text-base leading-relaxed font-sans border-t border-cream-border/40 animate-in fade-in slide-in-from-top-1 duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'
