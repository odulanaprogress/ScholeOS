import React from 'react'
import { Sparkles, Bot, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export interface AiComingSoonPageProps {
  title?: string
  subtitle?: string
  role?: 'parent' | 'student'
  onBack?: () => void
}

export const AiComingSoonPage: React.FC<AiComingSoonPageProps> = ({
  title = 'ScholeOS AI Assistant',
  subtitle = 'Intelligent conversational assistant and automated school insights.',
  role = 'student',
  onBack,
}) => {
  const isStudent = role === 'student'

  const features = isStudent
    ? [
        'Personalized homework guidance and step-by-step problem explanations.',
        'WAEC and BECE past questions practice with instant instant feedback.',
        'Study schedule recommendations tailored to your term examination dates.',
        'Interactive vocabulary and STEM concept breakdown.',
      ]
    : [
        'Instant natural language answers regarding school fees, calendars, and schedules.',
        'Term-end performance narratives and personalized learner growth insights.',
        'Direct automated inquiry routing to Form Masters and School Bursary.',
        'Multi-lingual support in English, Yoruba, Igbo, and Hausa.',
      ]

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-6 animate-fadeIn">
      <Card className="p-8 sm:p-10 text-center relative overflow-hidden border-indigo-200 bg-gradient-to-b from-white via-cream-base/30 to-indigo-50/40">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-brand flex items-center justify-center mx-auto shadow-sm">
          {isStudent ? <Bot className="w-8 h-8 text-indigo-brand" /> : <Sparkles className="w-8 h-8 text-gold-brand" />}
        </div>

        <div className="space-y-2 mt-5">
          <Badge variant="gold" size="sm" className="gap-1 mx-auto">
            <Sparkles className="w-3 h-3 text-gold-brand" />
            <span>Scheduled for Wave 9</span>
          </Badge>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 p-5 bg-white rounded-xl border border-cream-border text-left space-y-3 shadow-2xs">
          <h4 className="text-xs font-display font-bold uppercase tracking-wider text-charcoal-dark">
            Planned Wave 9 Capabilities
          </h4>
          <ul className="space-y-2.5 text-xs text-charcoal-muted">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {onBack && (
          <div className="pt-6">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Return to Overview</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
