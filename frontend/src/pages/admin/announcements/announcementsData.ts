export type AnnouncementAudience =
  | 'everyone'
  | 'parents'
  | 'students'
  | 'staff'
  | 'specific_class'

export type AnnouncementChannel = 'in_app' | 'sms' | 'whatsapp'

export type AnnouncementStatus = 'sent' | 'scheduled' | 'draft'

export interface AdminAnnouncement {
  id: string
  title: string
  content: string
  audience: AnnouncementAudience
  audienceLabel: string
  specificClasses?: string[]
  channels: AnnouncementChannel[]
  status: AnnouncementStatus
  author: string
  date: string // Display date e.g. "Today at 10:15 AM", "18 Sep 2026, 10:00 AM"
  scheduledDate?: string
  scheduledTime?: string
  recipientCount: number
  createdAt: string
}

export const AVAILABLE_CLASSES = [
  'JSS 1',
  'JSS 2A',
  'JSS 2B',
  'JSS 3',
  'SSS 1 Science',
  'SSS 1 Arts',
  'SSS 2',
  'SSS 3',
]

/**
 * Helper to estimate recipient reach dynamically
 */
export function estimateRecipientCount(
  audience: AnnouncementAudience,
  selectedClasses: string[] = []
): number {
  switch (audience) {
    case 'everyone':
      return 1250 // Total school community: students, parents, staff
    case 'parents':
      return 620 // Registered parents and guardians
    case 'students':
      return 580 // Secondary school students
    case 'staff':
      return 48 // Academic and administrative faculty
    case 'specific_class':
      // Average 38-40 students/parents per class arm
      return selectedClasses.length > 0 ? selectedClasses.length * 39 : 0
    default:
      return 0
  }
}

export const INITIAL_ADMIN_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'PTA General Consultative Forum & Open Day',
    content:
      'All parents and guardians are cordially invited to the Mid-Term Parents-Teachers Consultative Forum on Friday, September 18, 2026 at 10:00 AM in the School Multi-Purpose Auditorium. Academic reports and school development milestones will be presented.',
    audience: 'parents',
    audienceLabel: 'All Parents',
    channels: ['in_app', 'sms', 'whatsapp'],
    status: 'sent',
    author: "Principal's Office",
    date: 'Yesterday at 2:15 PM',
    recipientCount: 620,
    createdAt: '2026-09-05',
  },
  {
    id: 'ann-2',
    title: 'Term 2 Continuous Assessment Score Upload Deadline',
    content:
      'Dear Teaching Faculty, please ensure all continuous assessments (1st CA and 2nd CA) and practical scores for JSS 1–3 and SSS 1–3 are finalized and locked by Friday, September 11, ahead of the Form Masters broadsheet compilation meeting.',
    audience: 'staff',
    audienceLabel: 'Staff Only',
    channels: ['in_app', 'whatsapp'],
    status: 'sent',
    author: 'Vice Principal (Academic)',
    date: 'Sep 03, 2026, 09:00 AM',
    recipientCount: 48,
    createdAt: '2026-09-03',
  },
  {
    id: 'ann-3',
    title: 'JSS 2 Educational Science & Heritage Excursion',
    content:
      'Notice to parents of JSS 2A and JSS 2B students: The annual educational excursion to the National Science & Technology Heritage Center is scheduled for Thursday, September 24. Please ensure consent slips are returned by Monday.',
    audience: 'specific_class',
    audienceLabel: 'JSS 2A, JSS 2B',
    specificClasses: ['JSS 2A', 'JSS 2B'],
    channels: ['in_app', 'sms'],
    status: 'sent',
    author: 'Dean of Student Affairs',
    date: 'Sep 01, 2026, 11:30 AM',
    recipientCount: 78,
    createdAt: '2026-09-01',
  },
  {
    id: 'ann-4',
    title: 'National Independence Day Celebration & Mid-Term Break Schedule',
    content:
      'The school will observe the public holiday and mid-term break starting Wednesday, September 30, with academic resumption on Monday, October 5, 2026. Boarding facilities will remain open for senior examination candidates.',
    audience: 'everyone',
    audienceLabel: 'Everyone',
    channels: ['in_app', 'sms', 'whatsapp'],
    status: 'scheduled',
    author: "Principal's Office",
    date: 'Scheduled for 25 Sep 2026, 08:00 AM',
    scheduledDate: '2026-09-25',
    scheduledTime: '08:00 AM',
    recipientCount: 1250,
    createdAt: '2026-09-06',
  },
  {
    id: 'ann-5',
    title: 'Notice on Final Outstanding Tuition & Examination Fees Clearance',
    content:
      'Parents with outstanding second-term fees balance are advised to complete payment or upload proof of bank transfer before the commencement of terminal examinations on October 12.',
    audience: 'parents',
    audienceLabel: 'All Parents',
    channels: ['in_app', 'sms'],
    status: 'draft',
    author: 'Bursary Department',
    date: 'Draft created today',
    recipientCount: 620,
    createdAt: '2026-09-06',
  },
]
