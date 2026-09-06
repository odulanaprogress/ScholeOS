import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { IconBadge } from '@/components/ui/IconBadge'
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  active?: boolean
  badge?: string
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string
  tagline?: string
  navItems?: NavItem[]
  ctaText?: string
  secondaryCtaText?: string
  onCtaClick?: () => void
  onSecondaryCtaClick?: () => void
  onItemClick?: (item: NavItem) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  className,
  brandName = 'ScholeOS',
  tagline,
  navItems = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  ctaText = 'Book a Demo',
  secondaryCtaText = 'Log In',
  onCtaClick,
  onSecondaryCtaClick,
  onItemClick,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b border-cream-border/60 glass-cream',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3 cursor-pointer select-none group">
            <IconBadge size="md" icon={<GraduationCap className="w-5 h-5 text-white" />} />
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tight text-indigo-brand leading-none group-hover:opacity-90 transition-opacity">
                {brandName}
              </span>
              {tagline && (
                <span className="text-[11px] font-sans font-medium text-slate-subtle mt-0.5">
                  {tagline}
                </span>
              )}
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (onItemClick) {
                    e.preventDefault()
                    onItemClick(item)
                  }
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none font-sans',
                  item.active
                    ? 'text-indigo-brand bg-indigo-light/80 font-semibold shadow-xs'
                    : 'text-charcoal-dark/80 hover:text-indigo-brand hover:bg-cream-hover/70'
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-brand text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Desktop Right-aligned Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSecondaryCtaClick}
            >
              {secondaryCtaText}
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-dark hover:text-indigo-brand hover:bg-cream-hover transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-brand"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-border/60 bg-cream-surface/98 backdrop-blur-xl px-4 pt-4 pb-6 shadow-xl transition-all animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  if (onItemClick) {
                    e.preventDefault()
                    onItemClick(item)
                  }
                }}
                className={cn(
                  'px-4 py-3 rounded-xl text-base font-medium transition-colors select-none flex items-center justify-between',
                  item.active
                    ? 'bg-indigo-light text-indigo-brand font-semibold'
                    : 'text-charcoal-dark hover:bg-cream-hover hover:text-indigo-brand'
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gold-brand text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3">
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false)
                onSecondaryCtaClick?.()
              }}
            >
              {secondaryCtaText}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false)
                onCtaClick?.()
              }}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
