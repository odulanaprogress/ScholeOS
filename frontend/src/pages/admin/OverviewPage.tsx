import React, { useState } from 'react'
import {
  GraduationCap,
  CreditCard,
  FileSpreadsheet,
  Users,
  UserPlus,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'

export interface OverviewPageProps {
  onNavigateToStaff: () => void
  onNavigateToFees?: () => void
  onNavigateToResults?: () => void
}

interface ClassSubmission {
  id: string
  name: string
  classTeacher: string
  submitted: number
  total: number
  status: 'complete' | 'in_progress' | 'not_started'
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToStaff,
  onNavigateToFees,
}) => {
  // Modal states for Quick Actions
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementSent, setAnnouncementSent] = useState(false)

  const [isArrearsModalOpen, setIsArrearsModalOpen] = useState(false)

  const classSubmissions: ClassSubmission[] = [
    {
      id: 'jss1a',
      name: 'JSS 1A',
      classTeacher: 'Mrs. F. Okafor',
      submitted: 10,
      total: 10,
      status: 'complete',
    },
    {
      id: 'jss1b',
      name: 'JSS 1B',
      classTeacher: 'Mr. T. Alabi',
      submitted: 10,
      total: 10,
      status: 'complete',
    },
    {
      id: 'jss2a',
      name: 'JSS 2A',
      classTeacher: 'Mrs. B. Adeyemi',
      submitted: 9,
      total: 10,
      status: 'in_progress',
    },
    {
      id: 'jss2b',
      name: 'JSS 2B',
      classTeacher: 'Mr. E. Danladi',
      submitted: 8,
      total: 10,
      status: 'in_progress',
    },
    {
      id: 'jss3a',
      name: 'JSS 3A',
      classTeacher: 'Mr. K. Babatunde',
      submitted: 10,
      total: 10,
      status: 'complete',
    },
    {
      id: 'sss1sci',
      name: 'SSS 1 Science',
      classTeacher: 'Dr. C. Nwosu',
      submitted: 7,
      total: 10,
      status: 'in_progress',
    },
    {
      id: 'sss2comm',
      name: 'SSS 2 Commercial',
      classTeacher: 'Mrs. H. Ibrahim',
      submitted: 10,
      total: 10,
      status: 'complete',
    },
    {
      id: 'sss3art',
      name: 'SSS 3 Art',
      classTeacher: 'Mr. A. Balogun',
      submitted: 0,
      total: 9,
      status: 'not_started',
    },
  ]

  const completedClassesCount = classSubmissions.filter((c) => c.status === 'complete').length
  const totalClassesCount = classSubmissions.length
  const completionRatio = `${completedClassesCount} / ${totalClassesCount}`
  const completionPercent = Math.round((completedClassesCount / totalClassesCount) * 100)

  // Status tone based on ratio
  const completionTone =
    completionPercent >= 80 ? 'success' : completionPercent >= 40 ? 'warning' : 'danger'

  const recentActivities = [
    {
      id: 1,
      title: 'Mathematics scores submitted for JSS 2A',
      actor: 'Mrs. Adeyemi',
      time: '2 hours ago',
      icon: FileSpreadsheet,
      badge: 'Academics',
    },
    {
      id: 2,
      title: 'Physics Continuous Assessment entry recorded for SSS 2 Science',
      actor: 'Mr. Chinedu Nwosu',
      time: '3 hours ago',
      icon: CheckCircle2,
      badge: 'Academics',
    },
    {
      id: 3,
      title: 'Bursary confirmed ₦180,000 tuition payment for K. Adeleke (JSS 1B)',
      actor: 'Bursar office',
      time: '4 hours ago',
      icon: DollarSign,
      badge: 'Finance',
    },
    {
      id: 4,
      title: 'Term 2 Mock Exam Broadsheets generated and approved by Principal',
      actor: 'Alhaji Dr. S. Bello',
      time: 'Yesterday at 4:15 PM',
      icon: FileText,
      badge: 'Broadsheets',
    },
    {
      id: 5,
      title: 'Daily Class Attendance marked for JSS 1A (38/40 present)',
      actor: 'Mrs. Okafor',
      time: 'Yesterday at 8:45 AM',
      icon: Users,
      badge: 'Attendance',
    },
  ]

  const handleSendAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementText.trim()) return
    setAnnouncementSent(true)
    setTimeout(() => {
      setAnnouncementSent(false)
      setIsAnnouncementModalOpen(false)
      setAnnouncementTitle('')
      setAnnouncementText('')
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. ROW OF STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students */}
        <StatCard
          label="Total Students"
          value="1,280"
          icon={GraduationCap}
          trend={{ value: '+14 this term', isPositive: true, label: 'Enrolled' }}
        />

        {/* Fee Arrears (red/amber tone) */}
        <StatCard
          label="Fee Arrears"
          value="₦3,420,000"
          icon={CreditCard}
          tone="warning"
          trend={{ value: '42 students', isPositive: false, label: 'with outstanding balance' }}
          onClick={() => setIsArrearsModalOpen(true)}
        />

        {/* Classes Fully Submitted (ratio & dynamic tone) */}
        <StatCard
          label="Classes Fully Submitted"
          value={completionRatio}
          icon={FileSpreadsheet}
          tone={completionTone}
          trend={{
            value: `${completionPercent}%`,
            isPositive: completionPercent >= 60,
            label: `${totalClassesCount - completedClassesCount} classes pending`,
          }}
        />

        {/* Active Staff */}
        <StatCard
          label="Active Staff"
          value="48"
          icon={Users}
          subtext="46 on duty today • 2 on approved leave"
          onClick={onNavigateToStaff}
        />
      </section>

      {/* 2. SUBMISSION STATUS CARD */}
      <section>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-cream-border">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
                  Class Score Submission Status
                </h2>
                <Badge variant="primary" size="sm">
                  {completedClassesCount} of {totalClassesCount} Done
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Term 2 Continuous Assessment & Exam score submissions across all academic classes.
              </p>
            </div>

            {/* Quick Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-36 bg-cream-base h-2.5 rounded-full overflow-hidden border border-cream-border">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-charcoal-dark font-display">
                {completionPercent}%
              </span>
            </div>
          </div>

          {/* Classes Submission List */}
          <div className="mt-4 divide-y divide-cream-border/60">
            {classSubmissions.map((item) => {
              const fractionText = `${item.submitted} / ${item.total} subjects`
              const classPercent = Math.round((item.submitted / item.total) * 100)

              return (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream-base/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="w-9 h-9 rounded-xl bg-indigo-light text-indigo-brand font-display font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                      {item.name.split(' ')[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal-dark leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-charcoal-muted/75">
                        Class Teacher: {item.classTeacher}
                      </p>
                    </div>
                  </div>

                  {/* Visual mini progress */}
                  <div className="flex items-center gap-4 flex-1 sm:max-w-xs">
                    <div className="w-full bg-cream-base h-2 rounded-full overflow-hidden border border-cream-border/70">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.status === 'complete'
                            ? 'bg-emerald-500'
                            : item.status === 'in_progress'
                            ? 'bg-amber-500'
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${classPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-charcoal-muted shrink-0 w-24 text-right">
                      {fractionText}
                    </span>
                  </div>

                  {/* Submission Status Badge */}
                  <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2">
                    {item.status === 'complete' && (
                      <Badge variant="success">
                        Complete
                      </Badge>
                    )}
                    {item.status === 'in_progress' && (
                      <Badge variant="warning">
                        In Progress
                      </Badge>
                    )}
                    {item.status === 'not_started' && (
                      <Badge variant="neutral">
                        Not Started
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* 3. LOWER SECTION: QUICK ACTIONS & RECENT ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-charcoal-dark mb-1">
              Quick Actions
            </h3>
            <p className="text-xs text-charcoal-muted mb-5">
              Common administrative tasks ready in one click.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start shadow-xs"
                onClick={onNavigateToStaff}
              >
                <UserPlus className="w-4 h-4 mr-2 text-indigo-light" />
                Add Staff Member
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start shadow-xs"
                onClick={() => setIsArrearsModalOpen(true)}
              >
                <CreditCard className="w-4 h-4 mr-2 text-amber-800" />
                View Arrears Summary
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start hover:bg-cream-base"
                onClick={() => setIsAnnouncementModalOpen(true)}
              >
                <Megaphone className="w-4 h-4 mr-2 text-indigo-brand" />
                Send Announcement
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-cream-border/70 text-xs text-charcoal-muted flex items-center justify-between">
            <span>Current Term:</span>
            <span className="font-semibold text-charcoal-dark">Term 2 (Mid-Term)</span>
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-cream-border mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-charcoal-dark">
                Recent School Activity
              </h3>
              <p className="text-xs text-charcoal-muted">
                Audit feed of recent teacher submissions, payments, and notices.
              </p>
            </div>
            <span className="text-xs text-charcoal-muted font-medium">Real-time log</span>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => {
              const Icon = act.icon
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-cream-base/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-light text-indigo-brand flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-charcoal-dark leading-snug">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-charcoal-muted">
                      <span>By {act.actor}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-charcoal-muted/60" />
                        {act.time}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-base text-charcoal-muted shrink-0 hidden sm:inline-block">
                    {act.badge}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* ARREARS BREAKDOWN MODAL */}
      <Modal
        isOpen={isArrearsModalOpen}
        onClose={() => setIsArrearsModalOpen(false)}
        title="Outstanding Fee Arrears Breakdown"
        description="Summary of overdue term tuition and boarding levies."
        confirmLabel="Export Arrears List"
        onConfirm={() => {
          setIsArrearsModalOpen(false)
          if (onNavigateToFees) onNavigateToFees()
        }}
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Total Outstanding: ₦3,420,000</p>
              <p className="text-xs text-amber-800 mt-0.5">
                42 students across 6 classes have pending balances for Term 2. Automated SMS reminders are scheduled for Friday.
              </p>
            </div>
          </div>

          <div className="border border-cream-border rounded-xl divide-y divide-cream-border overflow-hidden">
            <div className="p-3 bg-cream-base/50 flex justify-between font-semibold text-charcoal-muted text-xs">
              <span>Class</span>
              <span>Pending Count</span>
              <span>Total Amount</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-medium text-charcoal-dark">JSS 1 (A & B)</span>
              <span>12 students</span>
              <span className="font-bold text-charcoal-dark">₦940,000</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-medium text-charcoal-dark">JSS 2 (A & B)</span>
              <span>14 students</span>
              <span className="font-bold text-charcoal-dark">₦1,120,000</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-medium text-charcoal-dark">SSS 1 Science</span>
              <span>8 students</span>
              <span className="font-bold text-charcoal-dark">₦680,000</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-medium text-charcoal-dark">SSS 3 (Art & Comm)</span>
              <span>8 students</span>
              <span className="font-bold text-charcoal-dark">₦680,000</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* SEND ANNOUNCEMENT MODAL */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="Broadcast School Announcement"
        description="Publish an instant notice to all teachers and school staff."
        confirmLabel={announcementSent ? 'Announcement Sent!' : 'Send Notice'}
        confirmLoading={announcementSent}
        onConfirm={handleSendAnnouncement}
        confirmDisabled={!announcementTitle.trim() || !announcementText.trim()}
      >
        <div className="space-y-4">
          <Input
            label="Announcement Title"
            placeholder="e.g. Staff Meeting Tomorrow at 2:00 PM"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-charcoal-dark mb-1.5">
              Notice Content
            </label>
            <textarea
              rows={4}
              placeholder="Enter message details for teachers and administrative staff..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-surface text-charcoal-dark placeholder:text-charcoal-muted/50 rounded-xl border border-cream-border focus:border-indigo-brand focus:outline-none focus:ring-2 focus:ring-indigo-brand/20 transition-all resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-cream-base/50 border border-cream-border text-xs text-charcoal-muted flex items-center justify-between">
            <span>Recipient Audience:</span>
            <span className="font-semibold text-charcoal-dark">All Teaching & Non-teaching Staff (48)</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}
