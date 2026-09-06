import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { IconBadge } from '@/components/ui/IconBadge'
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react'

export const DashboardMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* Decorative Warm Ambient Glow Behind Mockup */}
      <div className="absolute -top-6 -left-6 w-72 h-72 bg-gold-brand/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-80 h-80 bg-indigo-brand/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Elevated Browser Window Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl schole-card-shadow border border-black/[0.06] overflow-hidden transition-all duration-300 hover:schole-card-shadow-hover">
        {/* Browser Window Chrome */}
        <div className="bg-[#FAF5EE] px-4 py-3 border-b border-cream-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          </div>
          <div className="bg-white/90 border border-cream-border/60 rounded-full px-4 py-1 text-[11px] font-mono text-slate-subtle flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>app.scholeos.ng/admin/term-broadsheet</span>
          </div>
          <div className="text-[11px] text-slate-subtle font-sans font-medium hidden sm:block">
            Kings College, Lagos
          </div>
        </div>

        {/* Dashboard Canvas */}
        <div className="p-4 sm:p-6 bg-cream-base/30 space-y-4 font-sans">
          {/* Top Bar inside mockup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-black/[0.04] shadow-xs">
            <div className="flex items-center gap-3">
              <IconBadge size="sm" icon={<GraduationCap className="w-4 h-4 text-white" />} />
              <div>
                <p className="text-xs font-display font-bold text-charcoal-dark leading-tight">
                  SSS 3 Diamond — Term 1 Broadsheet
                </p>
                <p className="text-[11px] text-slate-subtle">
                  Curriculum: WAEC/NECO Standard · 42 Students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                CA & Exam Computed
              </Badge>
              <Badge variant="gold" size="sm">
                Rankings Ready
              </Badge>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-white p-3 rounded-xl border border-black/[0.03] shadow-xs">
              <span className="text-[10px] font-display font-semibold uppercase text-slate-subtle block">
                Class Average
              </span>
              <p className="text-base sm:text-lg font-display font-black text-charcoal-dark mt-0.5">
                81.4%
              </p>
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +4.2% vs midterm
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-black/[0.03] shadow-xs">
              <span className="text-[10px] font-display font-semibold uppercase text-slate-subtle block">
                Fee Clearance
              </span>
              <p className="text-base sm:text-lg font-display font-black text-indigo-brand mt-0.5">
                95.2%
              </p>
              <span className="text-[10px] text-slate-subtle">
                40/42 cleared
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-black/[0.03] shadow-xs">
              <span className="text-[10px] font-display font-semibold uppercase text-slate-subtle block">
                Attendance
              </span>
              <p className="text-base sm:text-lg font-display font-black text-charcoal-dark mt-0.5">
                98.8%
              </p>
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Zero unexcused
              </span>
            </div>
          </div>

          {/* Realistic Student Broadsheet Snippet */}
          <div className="bg-white rounded-xl border border-black/[0.04] shadow-xs overflow-hidden">
            <div className="px-3.5 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-xs font-display font-bold text-charcoal-dark">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-brand" />
                Live Automated Gradebook
              </span>
              <span className="text-[11px] font-sans font-normal text-slate-subtle">
                Auto-saved 2s ago
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {/* Row 1 */}
              <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-cream-base/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-gold-brand/20 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                    1st
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-charcoal-dark truncate">Folake Adeyemi</p>
                    <p className="text-[10px] text-slate-subtle">ID: KC-2024-001</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                  <span className="text-slate-subtle hidden sm:inline">MTH: 89</span>
                  <span className="text-slate-subtle hidden sm:inline">ENG: 94</span>
                  <span className="text-slate-subtle hidden sm:inline">PHY: 91</span>
                  <span className="font-bold text-indigo-brand bg-indigo-light px-2 py-0.5 rounded-full">
                    91.3% (A1)
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-cream-base/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    2nd
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-charcoal-dark truncate">Chinedu Okonkwo</p>
                    <p className="text-[10px] text-slate-subtle">ID: KC-2024-042</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                  <span className="text-slate-subtle hidden sm:inline">MTH: 84</span>
                  <span className="text-slate-subtle hidden sm:inline">ENG: 88</span>
                  <span className="text-slate-subtle hidden sm:inline">PHY: 86</span>
                  <span className="font-bold text-indigo-brand bg-indigo-light px-2 py-0.5 rounded-full">
                    86.0% (B2)
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-cream-base/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    3rd
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-charcoal-dark truncate">Ibrahim Bello</p>
                    <p className="text-[10px] text-slate-subtle">ID: KC-2024-019</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                  <span className="text-slate-subtle hidden sm:inline">MTH: 82</span>
                  <span className="text-slate-subtle hidden sm:inline">ENG: 80</span>
                  <span className="text-slate-subtle hidden sm:inline">PHY: 85</span>
                  <span className="font-bold text-indigo-brand bg-indigo-light px-2 py-0.5 rounded-full">
                    82.3% (B3)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating AI Notification Pill */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-charcoal-dark text-white rounded-full pl-3 pr-4 py-2 shadow-2xl border border-white/15 flex items-center gap-2.5 animate-bounce duration-1000">
          <div className="w-6 h-6 rounded-full bg-gold-brand text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold leading-tight text-gold-brand">ScholeOS Copilot</p>
            <p className="text-[10px] text-gray-300">Generated 42 report comments</p>
          </div>
        </div>
      </div>
    </div>
  )
}
