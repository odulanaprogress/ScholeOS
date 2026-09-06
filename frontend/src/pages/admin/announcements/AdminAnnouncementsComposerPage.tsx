import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { DatePicker } from '@/components/ui/DatePicker'
import { Modal } from '@/components/ui/Modal'
import {
  ArrowLeft,
  Send,
  Clock,
  Smartphone,
  MessageSquare,
  Bell,
  Users,
  Check,
  Sparkles,
  Info,
} from 'lucide-react'
import {
  type AdminAnnouncement,
  type AnnouncementAudience,
  type AnnouncementChannel,
  AVAILABLE_CLASSES,
  estimateRecipientCount,
} from './announcementsData'

export interface AdminAnnouncementsComposerPageProps {
  initialAnnouncement?: AdminAnnouncement | null
  onSave: (announcement: AdminAnnouncement, status: 'sent' | 'scheduled' | 'draft') => void
  onCancel: () => void
}

export const AdminAnnouncementsComposerPage: React.FC<AdminAnnouncementsComposerPageProps> = ({
  initialAnnouncement,
  onSave,
  onCancel,
}) => {
  // Form State
  const [title, setTitle] = useState(initialAnnouncement?.title || '')
  const [content, setContent] = useState(initialAnnouncement?.content || '')
  const [audience, setAudience] = useState<AnnouncementAudience>(
    initialAnnouncement?.audience || 'parents'
  )
  const [selectedClasses, setSelectedClasses] = useState<string[]>(
    initialAnnouncement?.specificClasses || ['JSS 2A']
  )

  // Channels State: In-App is locked on (true)
  const [channelSms, setChannelSms] = useState(
    initialAnnouncement?.channels.includes('sms') ?? true
  )
  const [channelWhatsApp, setChannelWhatsApp] = useState(
    initialAnnouncement?.channels.includes('whatsapp') ?? false
  )

  // Timing State: 'now' vs 'schedule'
  const [timingMode, setTimingMode] = useState<'now' | 'schedule'>(
    initialAnnouncement?.status === 'scheduled' ? 'schedule' : 'now'
  )
  const [scheduledDate, setScheduledDate] = useState(
    initialAnnouncement?.scheduledDate ||
      new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  )
  const [scheduledTime, setScheduledTime] = useState(
    initialAnnouncement?.scheduledTime || '09:00 AM'
  )

  // Modals & Validation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Active channels list
  const activeChannels = useMemo<AnnouncementChannel[]>(() => {
    const list: AnnouncementChannel[] = ['in_app']
    if (channelSms) list.push('sms')
    if (channelWhatsApp) list.push('whatsapp')
    return list
  }, [channelSms, channelWhatsApp])

  // Computed Audience Label
  const audienceLabel = useMemo(() => {
    switch (audience) {
      case 'everyone':
        return 'Everyone'
      case 'parents':
        return 'All Parents'
      case 'students':
        return 'All Students'
      case 'staff':
        return 'Staff Only'
      case 'specific_class':
        return selectedClasses.length > 0
          ? selectedClasses.join(', ')
          : 'No class selected'
      default:
        return 'Selected Audience'
    }
  }, [audience, selectedClasses])

  // Computed Recipient Reach
  const estimatedReach = useMemo(() => {
    return estimateRecipientCount(audience, selectedClasses)
  }, [audience, selectedClasses])

  // Toggle class selection for "Specific Class"
  const handleToggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      if (selectedClasses.length > 1) {
        setSelectedClasses(selectedClasses.filter((c) => c !== cls))
      }
    } else {
      setSelectedClasses([...selectedClasses, cls])
    }
  }

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) {
      errs.title = 'Please provide an announcement title.'
    }
    if (!content.trim()) {
      errs.content = 'Please enter your announcement message content.'
    }
    if (audience === 'specific_class' && selectedClasses.length === 0) {
      errs.classes = 'Please select at least one class arm.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Handle Save as Draft
  const handleSaveDraft = () => {
    if (!title.trim()) {
      setErrors({ title: 'A title is required to save a draft.' })
      return
    }

    const draftAnnouncement: AdminAnnouncement = {
      id: initialAnnouncement?.id || `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim() || 'No content entered yet.',
      audience,
      audienceLabel,
      specificClasses: audience === 'specific_class' ? selectedClasses : undefined,
      channels: activeChannels,
      status: 'draft',
      author: "Principal's Office",
      date: 'Draft saved today',
      recipientCount: estimatedReach,
      createdAt: new Date().toISOString().split('T')[0],
    }

    onSave(draftAnnouncement, 'draft')
  }

  // Handle Trigger Submit (Opens Confirmation Modal)
  const handleOpenConfirmModal = () => {
    if (validateForm()) {
      setIsConfirmModalOpen(true)
    }
  }

  // Final confirmation dispatch
  const handleConfirmDispatch = () => {
    setIsConfirmModalOpen(false)

    const targetStatus = timingMode === 'now' ? 'sent' : 'scheduled'
    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const newAnnouncement: AdminAnnouncement = {
      id: initialAnnouncement?.id || `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      audience,
      audienceLabel,
      specificClasses: audience === 'specific_class' ? selectedClasses : undefined,
      channels: activeChannels,
      status: targetStatus,
      author: "Principal's Office",
      date:
        timingMode === 'now'
          ? `Today at ${nowTimeStr}`
          : `Scheduled for ${scheduledDate}, ${scheduledTime}`,
      scheduledDate: timingMode === 'schedule' ? scheduledDate : undefined,
      scheduledTime: timingMode === 'schedule' ? scheduledTime : undefined,
      recipientCount: estimatedReach,
      createdAt: new Date().toISOString().split('T')[0],
    }

    onSave(newAnnouncement, targetStatus)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-surface p-5 rounded-2xl border border-cream-border/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-9 w-9 p-0 rounded-xl hover:bg-cream-base text-charcoal-dark border border-cream-border"
            title="Return to Announcements List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-brand border border-indigo-100">
                School Broadcast System
              </span>
              <span className="text-xs text-charcoal-muted">
                Crown Academy Lagos
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark mt-0.5">
              {initialAnnouncement ? 'Edit Announcement' : 'Compose New Announcement'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs font-medium"
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenConfirmModal}
            className="text-xs font-semibold shadow-xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {timingMode === 'now' ? 'Send Announcement' : 'Schedule Announcement'}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Form, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Composer Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Title & Message Content */}
          <Card className="p-5 sm:p-6 bg-white border-cream-border shadow-xs rounded-2xl space-y-4">
            <h2 className="text-sm font-bold font-display text-charcoal-dark border-b border-cream-border pb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-brand font-bold text-xs flex items-center justify-center">
                1
              </span>
              Announcement Content
            </h2>

            <Input
              label="Announcement Title"
              placeholder="e.g. PTA General Consultative Forum & Open Day"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
              }}
              error={errors.title}
            />

            <Textarea
              label="Message Body"
              placeholder="Type your official announcement message here. State clear dates, times, venues, and actionable instructions for recipients..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (errors.content) setErrors((prev) => ({ ...prev, content: '' }))
              }}
              rows={7}
              error={errors.content}
              helperText="This message will be rendered formatted in recipient in-app feeds and sent via selected SMS/WhatsApp channels."
            />
          </Card>

          {/* Card 2: Audience Scope */}
          <Card className="p-5 sm:p-6 bg-white border-cream-border shadow-xs rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cream-border pb-2.5">
              <h2 className="text-sm font-bold font-display text-charcoal-dark flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-brand font-bold text-xs flex items-center justify-center">
                  2
                </span>
                Target Audience
              </h2>
              <span className="text-xs font-semibold text-indigo-brand">
                ~{estimatedReach.toLocaleString()} recipients
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'everyone', label: 'Everyone', desc: 'Students, Parents, Staff' },
                  { id: 'parents', label: 'All Parents', desc: 'Registered Guardians' },
                  { id: 'students', label: 'All Students', desc: 'Enrolled Pupils' },
                  { id: 'staff', label: 'Staff Only', desc: 'Teaching & Admin' },
                  { id: 'specific_class', label: 'Specific Class', desc: 'Select Class Arms' },
                ] as const
              ).map((opt) => {
                const isSelected = audience === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAudience(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all select-none ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-brand ring-2 ring-indigo-brand/10 shadow-2xs'
                        : 'bg-cream-base/20 border-cream-border hover:bg-cream-base/40 text-charcoal-dark'
                    }`}
                  >
                    <div className="font-semibold text-xs text-charcoal-dark flex items-center justify-between">
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-brand" />}
                    </div>
                    <div className="text-[11px] text-charcoal-muted mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Revealed Class Multi-select if "Specific Class" is chosen */}
            {audience === 'specific_class' && (
              <div className="pt-3 border-t border-cream-border space-y-2">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Select Target Class Arms:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isChecked = selectedClasses.includes(cls)
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-indigo-brand text-white shadow-2xs'
                            : 'bg-cream-base border border-cream-border text-charcoal-dark hover:border-indigo-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                        {cls}
                      </button>
                    )
                  })}
                </div>
                {errors.classes && (
                  <p className="text-xs text-rose-600 font-medium">{errors.classes}</p>
                )}
              </div>
            )}
          </Card>

          {/* Card 3: Delivery Channels */}
          <Card className="p-5 sm:p-6 bg-white border-cream-border shadow-xs rounded-2xl space-y-4">
            <h2 className="text-sm font-bold font-display text-charcoal-dark border-b border-cream-border pb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-brand font-bold text-xs flex items-center justify-center">
                3
              </span>
              Delivery Channels
            </h2>

            <div className="space-y-3">
              {/* In-App: Locked On */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50/40 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-brand text-white flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-charcoal-dark flex items-center gap-1.5">
                      <span>In-App Notification Feed</span>
                      <span className="text-[10px] uppercase font-bold text-indigo-brand bg-indigo-100/80 px-1.5 py-0.2 rounded">
                        Included Free
                      </span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Displayed immediately in the student and parent portal dashboards.
                    </div>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-md bg-indigo-brand text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* SMS: Toggle */}
              <div
                onClick={() => setChannelSms(!channelSms)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  channelSms
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-cream-border bg-white hover:bg-cream-base/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      channelSms ? 'bg-amber-600 text-white' : 'bg-cream-base text-charcoal-muted'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-charcoal-dark flex items-center gap-1.5">
                      <span>SMS Text Broadcast</span>
                      <span className="text-[10px] text-charcoal-muted font-normal">
                        (May incur additional messaging cost)
                      </span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Sends direct text message to registered mobile phone numbers.
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    channelSms
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-cream-border bg-white'
                  }`}
                >
                  {channelSms && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* WhatsApp: Toggle */}
              <div
                onClick={() => setChannelWhatsApp(!channelWhatsApp)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  channelWhatsApp
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-cream-border bg-white hover:bg-cream-base/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      channelWhatsApp
                        ? 'bg-emerald-600 text-white'
                        : 'bg-cream-base text-charcoal-muted'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-charcoal-dark flex items-center gap-1.5">
                      <span>WhatsApp Business Dispatch</span>
                      <span className="text-[10px] text-charcoal-muted font-normal">
                        (May incur additional messaging cost)
                      </span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Delivers an interactive message with school branding via WhatsApp.
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    channelWhatsApp
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-cream-border bg-white'
                  }`}
                >
                  {channelWhatsApp && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 4: Delivery Timing */}
          <Card className="p-5 sm:p-6 bg-white border-cream-border shadow-xs rounded-2xl space-y-4">
            <h2 className="text-sm font-bold font-display text-charcoal-dark border-b border-cream-border pb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-brand font-bold text-xs flex items-center justify-center">
                4
              </span>
              Delivery Timing
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTimingMode('now')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  timingMode === 'now'
                    ? 'bg-indigo-50/50 border-indigo-brand ring-2 ring-indigo-brand/10'
                    : 'bg-cream-base/20 border-cream-border hover:bg-cream-base/40'
                }`}
              >
                <div className="font-semibold text-xs text-charcoal-dark flex items-center justify-between">
                  <span>Send Immediately</span>
                  {timingMode === 'now' && <Check className="w-3.5 h-3.5 text-indigo-brand" />}
                </div>
                <div className="text-[11px] text-charcoal-muted mt-0.5">
                  Dispatches broadcast as soon as confirmed
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTimingMode('schedule')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  timingMode === 'schedule'
                    ? 'bg-indigo-50/50 border-indigo-brand ring-2 ring-indigo-brand/10'
                    : 'bg-cream-base/20 border-cream-border hover:bg-cream-base/40'
                }`}
              >
                <div className="font-semibold text-xs text-charcoal-dark flex items-center justify-between">
                  <span>Schedule for Later</span>
                  {timingMode === 'schedule' && <Check className="w-3.5 h-3.5 text-indigo-brand" />}
                </div>
                <div className="text-[11px] text-charcoal-muted mt-0.5">
                  Deliver on a designated date & time
                </div>
              </button>
            </div>

            {/* Revealed DatePicker + Time select if "Schedule for Later" */}
            {timingMode === 'schedule' && (
              <div className="pt-3 border-t border-cream-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  label="Scheduled Date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />

                <div className="space-y-1.5 text-left font-body">
                  <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                    Dispatch Time
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-charcoal-muted/60 pointer-events-none">
                      <Clock className="w-4 h-4" />
                    </div>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-10 pr-4 border border-cream-border focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all font-body"
                    >
                      <option value="07:00 AM">07:00 AM (Early Morning)</option>
                      <option value="08:00 AM">08:00 AM (School Start)</option>
                      <option value="09:00 AM">09:00 AM (Morning Assembly)</option>
                      <option value="12:00 PM">12:00 PM (Midday)</option>
                      <option value="02:00 PM">02:00 PM (Dismissal)</option>
                      <option value="05:00 PM">05:00 PM (Evening)</option>
                      <option value="07:00 PM">07:00 PM (Night Reminder)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-xs font-medium text-charcoal-muted hover:text-charcoal-dark"
            >
              Cancel & Discard
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveDraft}
                className="text-xs font-medium"
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenConfirmModal}
                className="text-xs font-semibold px-4 shadow-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {timingMode === 'now' ? 'Send Announcement' : 'Schedule Announcement'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview & Recipient Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted flex items-center gap-1.5 font-display">
              <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
              Recipient Live Preview
            </span>
            <span className="text-[11px] text-charcoal-muted">
              Parent & Student View
            </span>
          </div>

          {/* Card Preview (reusing exact Wave 7 Announcement Card styling) */}
          <div className="bg-cream-surface rounded-2xl border border-cream-border p-5 shadow-xs space-y-3 relative overflow-hidden">
            {/* Top Bar inside Card */}
            <div className="flex items-start justify-between gap-2 border-b border-cream-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-brand bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {audienceLabel}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-charcoal-dark mt-1.5 leading-snug">
                  {title.trim() || 'Untitled School Announcement'}
                </h3>
              </div>
              <span className="text-[11px] text-charcoal-muted font-mono shrink-0 whitespace-nowrap">
                {timingMode === 'now'
                  ? 'Today'
                  : `${scheduledDate}`}
              </span>
            </div>

            {/* Message Body inside Card */}
            <p className="text-xs sm:text-sm text-charcoal-dark/90 leading-relaxed whitespace-pre-wrap min-h-16">
              {content.trim() || (
                <span className="text-charcoal-muted italic">
                  Start typing in the composer on the left to see a live formatted preview of your announcement exactly as it will appear on recipient devices...
                </span>
              )}
            </p>

            {/* Footer inside Card */}
            <div className="pt-2 border-t border-cream-border/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-[11px] text-indigo-700 font-semibold">
                Source: Principal's Office • Crown Academy
              </div>

              {/* Active Channels pills */}
              <div className="flex items-center gap-1">
                {activeChannels.map((ch) => (
                  <span
                    key={ch}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cream-base border border-cream-border text-charcoal-dark"
                  >
                    {ch === 'in_app' ? 'In-App' : ch === 'sms' ? 'SMS' : 'WhatsApp'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Configuration Summary Card */}
          <Card className="p-4 bg-cream-base/40 border-cream-border text-xs space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-charcoal-muted flex items-center gap-1.5 font-display">
              <Info className="w-3.5 h-3.5 text-indigo-brand" />
              Broadcast Parameters
            </h4>

            <div className="flex items-center justify-between py-1 border-b border-cream-border/60">
              <span className="text-charcoal-muted">Target Audience:</span>
              <span className="font-semibold text-charcoal-dark">{audienceLabel}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cream-border/60">
              <span className="text-charcoal-muted">Estimated Reach:</span>
              <span className="font-bold text-indigo-brand">
                ~{estimatedReach.toLocaleString()} recipients
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cream-border/60">
              <span className="text-charcoal-muted">Active Channels:</span>
              <span className="font-medium text-charcoal-dark">
                {activeChannels
                  .map((c) => (c === 'in_app' ? 'In-App' : c.toUpperCase()))
                  .join(' + ')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-charcoal-muted">Execution Timing:</span>
              <span className="font-medium text-charcoal-dark">
                {timingMode === 'now'
                  ? 'Immediate Dispatch'
                  : `Queued for ${scheduledDate} (${scheduledTime})`}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch Safety Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={timingMode === 'now' ? 'Send Announcement Now?' : 'Schedule Announcement?'}
        description="Please confirm broadcast details before dispatching to recipients."
        size="md"
      >
        <div className="space-y-4 pt-2">
          {/* Main confirmation box */}
          <div className="bg-cream-base/60 p-4 rounded-xl border border-cream-border space-y-2 text-xs sm:text-sm text-charcoal-dark">
            <p className="leading-relaxed">
              Send this announcement to <strong>{audienceLabel}</strong> via{' '}
              <strong>
                {activeChannels
                  .map((c) => (c === 'in_app' ? 'In-App Notification' : c.toUpperCase()))
                  .join(', ')}
              </strong>
              ?
            </p>
            <div className="pt-2 text-xs text-charcoal-muted flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-brand shrink-0" />
              <span>
                This reaches approximately <strong>{estimatedReach.toLocaleString()}</strong> recipients.
              </span>
            </div>
          </div>

          {/* Channel breakdown advisory */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 text-indigo-950">
              <Bell className="w-4 h-4 text-indigo-brand shrink-0 mt-0.5" />
              <div>
                <strong>In-App:</strong> Immediate feed update on recipient portal accounts.
              </div>
            </div>

            {channelSms && (
              <div className="flex items-start gap-2 p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 text-amber-950">
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>SMS Gateway:</strong> Dispatches to carrier networks for verified guardian mobile contacts.
                </div>
              </div>
            )}

            {channelWhatsApp && (
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 text-emerald-950">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>WhatsApp API:</strong> Dispatches verified template message to active WhatsApp accounts.
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDispatch}
              className="text-xs font-semibold px-4"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {timingMode === 'now' ? 'Confirm & Send' : 'Confirm & Schedule'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
