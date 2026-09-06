import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { IconBadge } from '@/components/ui/IconBadge'
import { Badge } from '@/components/ui/Badge'
import {
  GraduationCap,
  X,
  School,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 900)
  }

  const handleReset = () => {
    setSubmitted(false)
    setSchoolName('')
    setEmail('')
    setPhone('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-dark/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-charcoal-dark shadow-lg flex items-center justify-center hover:bg-cream-hover transition-colors border border-gray-200 focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <Card className="p-6 sm:p-8 border border-white/20">
          {submitted ? (
            <div className="text-center py-6 space-y-4 font-sans">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <Badge variant="success" size="md">
                Demo Request Confirmed
              </Badge>
              <h3 className="text-2xl font-display font-black text-charcoal-dark">
                You're On The Schedule!
              </h3>
              <p className="text-sm text-slate-subtle max-w-sm mx-auto leading-relaxed">
                Thank you for your interest in ScholeOS. Our onboarding specialist will contact you at{' '}
                <span className="font-semibold text-charcoal-dark">{email || 'your email'}</span> within 2 hours to walk through your school's custom grading setup.
              </p>
              <div className="pt-3">
                <Button variant="primary" size="md" onClick={handleReset}>
                  Return to Homepage
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              <div className="flex items-center gap-3">
                <IconBadge size="md" icon={<GraduationCap className="w-5 h-5 text-white" />} />
                <div>
                  <h3 className="text-xl font-display font-black text-charcoal-dark leading-tight">
                    Book Your School Demo
                  </h3>
                  <p className="text-xs text-slate-subtle">
                    See ScholeOS configured for your school's unique CA & exam formula
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <Input
                  label="School Name"
                  placeholder="e.g. Corona Secondary School, Agbara"
                  icon={<School className="w-4 h-4" />}
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />

                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="principal@school.edu.ng"
                  icon={<Mail className="w-4 h-4" />}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Contact Phone / WhatsApp"
                  type="tel"
                  placeholder="0803 123 4567"
                  icon={<Phone className="w-4 h-4" />}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="bg-cream-base/50 p-3 rounded-xl border border-cream-border/60 flex items-start gap-2.5 text-xs text-slate-subtle">
                <Sparkles className="w-4 h-4 text-gold-brand shrink-0 mt-0.5" />
                <span>
                  No credit card required. Full 3-term assessment simulation included.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={loading}>
                  Schedule Free Demo
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
