import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Modal } from '@/components/ui/Modal'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Megaphone,
  Plus,
  Send,
  Users,
  Search,
  Eye,
  Edit2,
  Clock,
  Smartphone,
  MessageSquare,
  Bell,
} from 'lucide-react'
import {
  type AdminAnnouncement,
  type AnnouncementChannel,
} from './announcementsData'

export interface AdminAnnouncementsListPageProps {
  announcements: AdminAnnouncement[]
  onNewAnnouncement: () => void
  onEditDraft?: (announcement: AdminAnnouncement) => void
}

export const AdminAnnouncementsListPage: React.FC<AdminAnnouncementsListPageProps> = ({
  announcements,
  onNewAnnouncement,
  onEditDraft,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'scheduled' | 'draft'>('all')
  const [previewItem, setPreviewItem] = useState<AdminAnnouncement | null>(null)

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.audienceLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [announcements, searchQuery, statusFilter])

  // Summary Metrics
  const totalSent = useMemo(
    () => announcements.filter((a) => a.status === 'sent').length,
    [announcements]
  )
  const totalScheduled = useMemo(
    () => announcements.filter((a) => a.status === 'scheduled').length,
    [announcements]
  )
  const totalAudienceReach = useMemo(
    () =>
      announcements
        .filter((a) => a.status === 'sent')
        .reduce((sum, a) => sum + a.recipientCount, 0),
    [announcements]
  )

  const renderChannelBadge = (channel: AnnouncementChannel) => {
    switch (channel) {
      case 'in_app':
        return (
          <span
            key="in_app"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
            title="In-App Notification"
          >
            <Bell className="w-3 h-3" />
            In-App
          </span>
        )
      case 'sms':
        return (
          <span
            key="sms"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
            title="Direct SMS"
          >
            <Smartphone className="w-3 h-3" />
            SMS
          </span>
        )
      case 'whatsapp':
        return (
          <span
            key="whatsapp"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            title="WhatsApp Business API"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </span>
        )
      default:
        return null
    }
  }

  const renderStatusBadge = (status: AdminAnnouncement['status']) => {
    switch (status) {
      case 'sent':
        return (
          <Badge variant="success" size="sm" showDot>
            Sent
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge variant="primary" size="sm" showDot>
            Scheduled
          </Badge>
        )
      case 'draft':
      default:
        return (
          <Badge variant="neutral" size="sm">
            Draft
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-surface p-5 sm:p-6 rounded-2xl border border-cream-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-brand font-semibold text-xs tracking-wider uppercase mb-1">
            <Megaphone className="w-4 h-4" />
            Communication & Broadcast Center
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
            School Announcements & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5 max-w-2xl">
            Create, schedule, and broadcast institutional notices across In-App feeds, SMS, and WhatsApp channels to parents, students, and teaching staff.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewAnnouncement}
          className="shrink-0 self-start sm:self-auto shadow-sm px-4 py-2 text-xs sm:text-sm font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Announcement
        </Button>
      </div>

      {/* StatCards Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Delivered Broadcasts"
          value={totalSent}
          subtext="Sent across active channels"
          icon={Send}
          tone="primary"
        />

        <StatCard
          label="Cumulative Reach"
          value={totalAudienceReach.toLocaleString()}
          subtext="Parent & student touchpoints"
          icon={Users}
          tone="success"
        />

        <StatCard
          label="Scheduled Outgoing"
          value={totalScheduled}
          subtext="Queued for automated delivery"
          icon={Clock}
          tone="gold"
        />

        <StatCard
          label="Active Channels"
          value="3 Delivery Modes"
          subtext="In-App • SMS • WhatsApp"
          icon={Smartphone}
          tone="default"
        />
      </div>

      {/* Table Container */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden">
        {/* Toolbar with Search and Status Filter */}
        <div className="p-4 border-b border-cream-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-cream-base/50 border border-cream-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-brand/20 focus:border-indigo-brand text-charcoal-dark"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              All ({announcements.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('sent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === 'sent'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              Sent ({announcements.filter((a) => a.status === 'sent').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === 'scheduled'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              Scheduled ({announcements.filter((a) => a.status === 'scheduled').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === 'draft'
                  ? 'bg-indigo-brand text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-dark bg-cream-base/40'
              }`}
            >
              Drafts ({announcements.filter((a) => a.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Announcements Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Title & Sender</TableHead>
              <TableHead className="w-[16%]">Audience</TableHead>
              <TableHead className="w-[20%]">Delivery Channels</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[12%]">Date / Schedule</TableHead>
              <TableHead className="w-[8%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnouncements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-charcoal-muted text-xs">
                  No announcements match the selected search query or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredAnnouncements.map((item) => (
                <TableRow key={item.id} className="hover:bg-cream-base/30 transition-colors">
                  {/* Title & Author */}
                  <TableCell>
                    <div className="font-semibold text-charcoal-dark text-sm leading-snug">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
                      <span>Source: <strong className="text-charcoal-dark font-medium">{item.author}</strong></span>
                      <span>•</span>
                      <span>~{item.recipientCount.toLocaleString()} recipients</span>
                    </div>
                  </TableCell>

                  {/* Audience */}
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-cream-base border border-cream-border text-charcoal-dark">
                      {item.audienceLabel}
                    </span>
                  </TableCell>

                  {/* Channels */}
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.channels.map(renderChannelBadge)}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {renderStatusBadge(item.status)}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <div className="text-xs text-charcoal-dark font-medium leading-tight">
                      {item.date}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === 'draft' && onEditDraft ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditDraft(item)}
                          className="h-8 w-8 p-0 text-charcoal-muted hover:text-indigo-brand hover:bg-indigo-50"
                          title="Edit Draft"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      ) : null}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewItem(item)}
                        className="h-8 w-8 p-0 text-charcoal-muted hover:text-indigo-brand hover:bg-indigo-50"
                        title="View Notice Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quick View Notice Details Modal */}
      {previewItem && (
        <Modal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title="Announcement Details"
          size="md"
        >
          <div className="space-y-4 pt-1">
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream-base border border-cream-border text-charcoal-dark">
                  Audience: {previewItem.audienceLabel}
                </span>
                {renderStatusBadge(previewItem.status)}
              </div>
              <span className="text-xs font-mono text-charcoal-muted">
                {previewItem.date}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-base font-bold font-display text-charcoal-dark mb-2">
                {previewItem.title}
              </h3>
              <div className="p-4 rounded-xl bg-cream-base/40 border border-cream-border text-xs sm:text-sm text-charcoal-dark leading-relaxed whitespace-pre-wrap">
                {previewItem.content}
              </div>
            </div>

            {/* Channels & Metadata footer */}
            <div className="bg-cream-base/60 p-3.5 rounded-xl border border-cream-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Delivered via:</span>
                <div className="flex items-center gap-1.5">
                  {previewItem.channels.map(renderChannelBadge)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Author / Origin:</span>
                <span className="font-semibold text-charcoal-dark">{previewItem.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Estimated Audience:</span>
                <span className="font-semibold text-indigo-brand">
                  ~{previewItem.recipientCount.toLocaleString()} recipients
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-cream-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewItem(null)}
                className="text-xs font-medium px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
