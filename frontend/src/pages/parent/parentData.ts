export interface ChildProfile {
  id: string
  fullName: string
  shortName: string
  className: string
  admissionNo: string
  avatarInitial: string
  attendanceSummary: {
    present: number
    absent: number
    late: number
    percentage: number
  }
  feeSummary: {
    totalInvoiced: number
    totalPaid: number
    balanceRemaining: number
  }
  latestResult: {
    term: string
    session: string
    status: 'published' | 'not_published'
    average: number
    position: string
  }
}

export interface AttendanceRecord {
  id: string
  date: string
  dayOfWeek: string
  timeIn: string
  status: 'present' | 'absent' | 'late'
  note?: string
}

export interface SubjectAssessmentScore {
  subjectId: string
  subjectName: string
  ca1: number // out of 20
  ca2: number // out of 20
  exam: number // out of 60
  total: number // out of 100
  grade: string
  remark: string
}

export interface TermResultRecord {
  id: string
  termName: string
  session: string
  status: 'published' | 'not_published'
  overallTotal?: number // e.g. 734 / 800
  maxTotal?: number
  average?: number
  position?: string
  totalStudents?: number
  teacherComment?: string
  principalRemark?: string
  subjects?: SubjectAssessmentScore[]
}

export interface FeeInvoiceItem {
  id: string
  feeType: string
  term: string
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'overdue' | 'pending_verification'
  paidAt?: string
  paymentMethod?: string
  referenceNo?: string
}

export interface SchoolAnnouncement {
  id: string
  title: string
  content: string
  author: string
  date: string
  priority: 'normal' | 'high'
}

export const PARENT_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1',
    fullName: 'Fatima Bello',
    shortName: 'Fatima',
    className: 'JSS 2A',
    admissionNo: 'JSS2/003',
    avatarInitial: 'FB',
    attendanceSummary: {
      present: 42,
      absent: 3,
      late: 1,
      percentage: 91.3,
    },
    feeSummary: {
      totalInvoiced: 185000,
      totalPaid: 140000,
      balanceRemaining: 45000,
    },
    latestResult: {
      term: '2nd Term',
      session: '2025/2026',
      status: 'published',
      average: 91.8,
      position: '1st of 38',
    },
  },
  {
    id: 'child-2',
    fullName: 'Farouk Bello',
    shortName: 'Farouk',
    className: 'Primary 4B',
    admissionNo: 'PR4/028',
    avatarInitial: 'FB',
    attendanceSummary: {
      present: 44,
      absent: 1,
      late: 1,
      percentage: 95.6,
    },
    feeSummary: {
      totalInvoiced: 145000,
      totalPaid: 145000,
      balanceRemaining: 0,
    },
    latestResult: {
      term: '2nd Term',
      session: '2025/2026',
      status: 'published',
      average: 86.4,
      position: '4th of 32',
    },
  },
]

export const CHILD_ATTENDANCE_RECORDS: Record<string, AttendanceRecord[]> = {
  'child-1': [
    { id: 'att-1', date: '2026-09-05', dayOfWeek: 'Friday', timeIn: '07:44 AM', status: 'present' },
    { id: 'att-2', date: '2026-09-04', dayOfWeek: 'Thursday', timeIn: '07:49 AM', status: 'present' },
    { id: 'att-3', date: '2026-09-03', dayOfWeek: 'Wednesday', timeIn: '08:12 AM', status: 'late', note: 'Heavy school bus route delay' },
    { id: 'att-4', date: '2026-09-02', dayOfWeek: 'Tuesday', timeIn: '07:40 AM', status: 'present' },
    { id: 'att-5', date: '2026-09-01', dayOfWeek: 'Monday', timeIn: '07:35 AM', status: 'present' },
    { id: 'att-6', date: '2026-08-29', dayOfWeek: 'Friday', timeIn: '—', status: 'absent', note: 'Authorized medical checkup' },
    { id: 'att-7', date: '2026-08-28', dayOfWeek: 'Thursday', timeIn: '07:42 AM', status: 'present' },
    { id: 'att-8', date: '2026-08-27', dayOfWeek: 'Wednesday', timeIn: '07:45 AM', status: 'present' },
    { id: 'att-9', date: '2026-08-26', dayOfWeek: 'Tuesday', timeIn: '07:38 AM', status: 'present' },
    { id: 'att-10', date: '2026-08-25', dayOfWeek: 'Monday', timeIn: '07:40 AM', status: 'present' },
    { id: 'att-11', date: '2026-08-22', dayOfWeek: 'Friday', timeIn: '07:50 AM', status: 'present' },
    { id: 'att-12', date: '2026-08-21', dayOfWeek: 'Thursday', timeIn: '07:44 AM', status: 'present' },
  ],
  'child-2': [
    { id: 'att-201', date: '2026-09-05', dayOfWeek: 'Friday', timeIn: '07:38 AM', status: 'present' },
    { id: 'att-202', date: '2026-09-04', dayOfWeek: 'Thursday', timeIn: '07:40 AM', status: 'present' },
    { id: 'att-203', date: '2026-09-03', dayOfWeek: 'Wednesday', timeIn: '07:45 AM', status: 'present' },
    { id: 'att-204', date: '2026-09-02', dayOfWeek: 'Tuesday', timeIn: '08:05 AM', status: 'late', note: 'Clinic visit in the morning' },
    { id: 'att-205', date: '2026-09-01', dayOfWeek: 'Monday', timeIn: '07:32 AM', status: 'present' },
    { id: 'att-206', date: '2026-08-29', dayOfWeek: 'Friday', timeIn: '07:41 AM', status: 'present' },
    { id: 'att-207', date: '2026-08-28', dayOfWeek: 'Thursday', timeIn: '07:45 AM', status: 'present' },
  ],
}

export const CHILD_RESULTS_RECORDS: Record<string, TermResultRecord[]> = {
  'child-1': [
    {
      id: 'res-2-2026',
      termName: '2nd Term',
      session: '2025/2026',
      status: 'published',
      overallTotal: 734,
      maxTotal: 800,
      average: 91.8,
      position: '1st',
      totalStudents: 38,
      teacherComment: 'An outstanding student with exceptional intellectual curiosity and leadership skills. Fatima consistently models disciplined academic conduct.',
      principalRemark: 'Exemplary scholarship and character. Highly recommended for the National Junior Olympiad competition.',
      subjects: [
        { subjectId: 'math', subjectName: 'Mathematics', ca1: 19, ca2: 20, exam: 58, total: 97, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'eng', subjectName: 'English Language', ca1: 18, ca2: 18, exam: 50, total: 86, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'sci', subjectName: 'Basic Science', ca1: 18, ca2: 18, exam: 52, total: 88, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'soc', subjectName: 'Social Studies', ca1: 17, ca2: 17, exam: 48, total: 82, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'agri', subjectName: 'Agricultural Science', ca1: 15, ca2: 16, exam: 48, total: 79, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'bus', subjectName: 'Business Studies', ca1: 19, ca2: 19, exam: 50, total: 88, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'civ', subjectName: 'Civic Education', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'fre', subjectName: 'French Language', ca1: 16, ca2: 17, exam: 48, total: 81, grade: 'A1', remark: 'Distinction' },
      ],
    },
    {
      id: 'res-1-2026',
      termName: '1st Term',
      session: '2025/2026',
      status: 'published',
      overallTotal: 712,
      maxTotal: 800,
      average: 89.0,
      position: '2nd',
      totalStudents: 38,
      teacherComment: 'Very focused and diligent pupil. Excellent analytical performance throughout continuous assessments.',
      principalRemark: 'A commendable term-end performance. Keep the momentum going!',
      subjects: [
        { subjectId: 'math', subjectName: 'Mathematics', ca1: 18, ca2: 18, exam: 56, total: 92, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'eng', subjectName: 'English Language', ca1: 17, ca2: 17, exam: 50, total: 84, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'sci', subjectName: 'Basic Science', ca1: 17, ca2: 18, exam: 51, total: 86, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'soc', subjectName: 'Social Studies', ca1: 16, ca2: 16, exam: 47, total: 79, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'agri', subjectName: 'Agricultural Science', ca1: 16, ca2: 15, exam: 47, total: 78, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'bus', subjectName: 'Business Studies', ca1: 18, ca2: 18, exam: 48, total: 84, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'civ', subjectName: 'Civic Education', ca1: 17, ca2: 17, exam: 49, total: 83, grade: 'A1', remark: 'Distinction' },
        { subjectId: 'fre', subjectName: 'French Language', ca1: 15, ca2: 15, exam: 46, total: 76, grade: 'A1', remark: 'Distinction' },
      ],
    },
    {
      id: 'res-3-2026',
      termName: '3rd Term',
      session: '2025/2026',
      status: 'not_published',
    },
  ],
  'child-2': [
    {
      id: 'res-2-pr4',
      termName: '2nd Term',
      session: '2025/2026',
      status: 'published',
      overallTotal: 518,
      maxTotal: 600,
      average: 86.4,
      position: '4th',
      totalStudents: 32,
      teacherComment: 'Farouk is an energetic learner who shows great enthusiasm for reading and elementary mathematics.',
      principalRemark: 'Great effort this term. Encourage him to practice handwriting over the holidays.',
      subjects: [
        { subjectId: 'math', subjectName: 'Mathematics', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A', remark: 'Excellent' },
        { subjectId: 'eng', subjectName: 'English Studies', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A', remark: 'Excellent' },
        { subjectId: 'sci', subjectName: 'Basic Science & Tech', ca1: 16, ca2: 17, exam: 51, total: 84, grade: 'A', remark: 'Excellent' },
        { subjectId: 'soc', subjectName: 'National Values Education', ca1: 18, ca2: 19, exam: 52, total: 89, grade: 'A', remark: 'Excellent' },
        { subjectId: 'lit', subjectName: 'Quantitative Reasoning', ca1: 17, ca2: 17, exam: 53, total: 87, grade: 'A', remark: 'Excellent' },
        { subjectId: 'crs', subjectName: 'Verbal Reasoning', ca1: 16, ca2: 16, exam: 48, total: 80, grade: 'A', remark: 'Excellent' },
      ],
    },
  ],
}

export const CHILD_FEE_INVOICES: Record<string, FeeInvoiceItem[]> = {
  'child-1': [
    {
      id: 'inv-101',
      feeType: 'Tuition Fee',
      term: '2nd Term 2025/2026',
      amount: 120000,
      dueDate: 'Sep 01, 2026',
      status: 'paid',
      paidAt: 'Aug 28, 2026',
      paymentMethod: 'Direct Bank Transfer',
      referenceNo: 'SCH-TRF-98214',
    },
    {
      id: 'inv-102',
      feeType: 'PTA & Development Levy',
      term: '2nd Term 2025/2026',
      amount: 20000,
      dueDate: 'Sep 01, 2026',
      status: 'paid',
      paidAt: 'Aug 28, 2026',
      paymentMethod: 'Card Payment (Paystack)',
      referenceNo: 'PSTK-442109',
    },
    {
      id: 'inv-103',
      feeType: 'Science & STEM Lab Levy',
      term: '2nd Term 2025/2026',
      amount: 25000,
      dueDate: 'Sep 15, 2026',
      status: 'pending',
    },
    {
      id: 'inv-104',
      feeType: 'School Bus Transportation (Zone B)',
      term: '2nd Term 2025/2026',
      amount: 20000,
      dueDate: 'Sep 05, 2026',
      status: 'overdue',
    },
  ],
  'child-2': [
    {
      id: 'inv-201',
      feeType: 'Primary Tuition Fee',
      term: '2nd Term 2025/2026',
      amount: 110000,
      dueDate: 'Sep 01, 2026',
      status: 'paid',
      paidAt: 'Aug 25, 2026',
      paymentMethod: 'Card Payment',
      referenceNo: 'PSTK-381023',
    },
    {
      id: 'inv-202',
      feeType: 'PTA Levy & Learning Resources',
      term: '2nd Term 2025/2026',
      amount: 20000,
      dueDate: 'Sep 01, 2026',
      status: 'paid',
      paidAt: 'Aug 25, 2026',
      paymentMethod: 'Card Payment',
      referenceNo: 'PSTK-381024',
    },
    {
      id: 'inv-203',
      feeType: 'Extra-Curricular Clubs & Sports',
      term: '2nd Term 2025/2026',
      amount: 15000,
      dueDate: 'Sep 05, 2026',
      status: 'paid',
      paidAt: 'Aug 25, 2026',
      paymentMethod: 'Card Payment',
      referenceNo: 'PSTK-381025',
    },
  ],
}

export const PARENT_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'PTA General Consultative Forum & Open Day',
    content: 'All parents are cordially invited to the Mid-Term Parents-Teachers Consultative Forum on Friday, September 18, 2026 at 10:00 AM in the School Multi-Purpose Auditorium.',
    author: "Principal's Office",
    date: 'Yesterday at 2:15 PM',
    priority: 'high',
  },
  {
    id: 'ann-2',
    title: 'School Bus Route Expansion (Zone C & Island Route)',
    content: 'Due to popular request from parents, Crown Academy has officially added two new morning pickup routes covering Lekki Phase 1 and Victoria Island axis.',
    author: 'Transport & Logistics Committee',
    date: 'Sep 03, 2026',
    priority: 'normal',
  },
  {
    id: 'ann-3',
    title: 'Second Term Co-Curricular & Club Registration Open',
    content: 'Registration for STEM Robotics, French Club, Chess League, and Debating Society for Junior and Senior secondary students is now open via the student desk.',
    author: 'Dean of Student Affairs',
    date: 'Aug 29, 2026',
    priority: 'normal',
  },
]
