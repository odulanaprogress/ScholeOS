import React from 'react'
import { cn } from '@/utils/cn'

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-2xl border border-cream-border bg-cream-surface shadow-xs',
        wrapperClassName
      )}
    >
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm text-left border-collapse', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-cream-base/50 text-charcoal-muted border-b border-cream-border/80', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-cream-border/50 bg-cream-surface', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t border-cream-border bg-cream-base/40 font-medium text-charcoal-dark', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isHoverable?: boolean
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, isHoverable = true, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'transition-colors duration-150',
        isHoverable && 'hover:bg-cream-base/40',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-4 sm:px-6 text-left align-middle font-display text-xs font-semibold uppercase tracking-wider text-charcoal-muted/80',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 sm:px-6 align-middle text-charcoal-dark text-sm', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'
