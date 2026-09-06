import React from 'react'
import { cn } from '@/utils/cn'
import { IconBadge } from '@/components/ui/IconBadge'
import { GraduationCap, Mail, Globe, MessageSquare, Share2 } from 'lucide-react'

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string
  tagline?: string
  columns?: FooterColumn[]
  copyrightText?: string
}

export const Footer: React.FC<FooterProps> = ({
  className,
  brandName = 'ScholeOS',
  tagline = 'The unified operating system and intelligence layer for modern schools, academies, and multi-campus institutions.',
  columns = [
    {
      title: 'About',
      links: [
        { label: 'About ScholeOS', href: '#about' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'Features',
      links: [
        { label: 'Results & Broadsheets', href: '#features' },
        { label: 'Fees', href: '#features' },
        { label: 'Attendance', href: '#features' },
        { label: 'AI Assistant', href: '#features' },
        { label: 'LMS & CBT', href: '#features' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQs', href: '#faq' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Book a Demo', href: '#demo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Data Protection', href: '#data-protection' },
      ],
    },
  ],
  copyrightText = 'Copyright © 2026 ScholeOS. All Rights Reserved.',
  ...props
}) => {
  return (
    <footer
      className={cn(
        'bg-charcoal-dark text-white border-t border-charcoal-border pt-16 pb-12 font-sans',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Col (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <IconBadge size="md" icon={<GraduationCap className="w-5 h-5 text-white" />} />
              <span className="font-display font-black text-2xl tracking-tight text-white">
                {brandName}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#web"
                aria-label="Website"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-brand hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#community"
                aria-label="Community"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-brand hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#share"
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-brand hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-brand hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-gold-brand">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="flex items-center gap-1.5">
            {copyrightText}
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#data-protection" className="hover:text-white transition-colors">
              Data Protection
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
