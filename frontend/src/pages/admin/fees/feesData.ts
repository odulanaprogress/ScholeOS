export interface FeeType {
  id: string
  name: string
  amount: number
  appliesToType: 'all' | 'specific'
  applicableClasses: string[]
  dueDate: string
  recurringType: 'per-term' | 'one-time'
  description?: string
  activeStudentsCount?: number
}

export interface ArrearsRecord {
  id: string
  studentName: string
  class: string
  amountOwed: number
  term: string
  lastPaymentDate: string
  parentName: string
  parentPhone: string
  reminderSent?: boolean
  reminderSentAt?: string
}

export interface PaymentVerification {
  id: string
  studentName: string
  class: string
  feeType: string
  amountClaimed: number
  dateSubmitted: string
  bankName: string
  senderAccount: string
  receiptRef: string
  proofImageUrl: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
}

export const SCHOOL_CLASSES = [
  'JSS 1',
  'JSS 2A',
  'JSS 2B',
  'JSS 3',
  'SSS 1 Science',
  'SSS 1 Arts',
  'SSS 2',
  'SSS 3',
  'Primary 4B',
  'Primary 5',
  'Primary 6',
]

export const INITIAL_FEE_TYPES: FeeType[] = [
  {
    id: 'fee-tuition',
    name: 'Tuition Fee (Senior Secondary)',
    amount: 180000,
    appliesToType: 'specific',
    applicableClasses: ['SSS 1 Science', 'SSS 1 Arts', 'SSS 2', 'SSS 3'],
    dueDate: '2026-10-15',
    recurringType: 'per-term',
    description: 'Standard senior secondary term tuition and academic instruction.',
    activeStudentsCount: 384,
  },
  {
    id: 'fee-tuition-jss',
    name: 'Tuition Fee (Junior Secondary)',
    amount: 145000,
    appliesToType: 'specific',
    applicableClasses: ['JSS 1', 'JSS 2A', 'JSS 2B', 'JSS 3'],
    dueDate: '2026-10-15',
    recurringType: 'per-term',
    description: 'Junior secondary curriculum instruction and continuous assessment.',
    activeStudentsCount: 420,
  },
  {
    id: 'fee-pta',
    name: 'PTA Development Levy',
    amount: 15000,
    appliesToType: 'all',
    applicableClasses: ['All Classes'],
    dueDate: '2026-10-01',
    recurringType: 'per-term',
    description: 'Parent-Teacher Association fund for campus maintenance & security infrastructure.',
    activeStudentsCount: 1280,
  },
  {
    id: 'fee-science-lab',
    name: 'Science & STEM Lab Practical Fee',
    amount: 25000,
    appliesToType: 'specific',
    applicableClasses: ['SSS 1 Science', 'SSS 2', 'SSS 3'],
    dueDate: '2026-10-20',
    recurringType: 'per-term',
    description: 'Reagents, glassware, specimen dissection kits, and physics apparatus.',
    activeStudentsCount: 195,
  },
  {
    id: 'fee-transport',
    name: 'School Bus Transit (Optional / Route B)',
    amount: 45000,
    appliesToType: 'all',
    applicableClasses: ['All Classes'],
    dueDate: '2026-10-05',
    recurringType: 'per-term',
    description: 'Lekki-Ajah-Victoria Island daily two-way student transport bus service.',
    activeStudentsCount: 142,
  },
  {
    id: 'fee-uniform',
    name: 'New Session Uniform & Sports Kit',
    amount: 35000,
    appliesToType: 'specific',
    applicableClasses: ['JSS 1', 'SSS 1 Science', 'SSS 1 Arts'],
    dueDate: '2026-09-30',
    recurringType: 'one-time',
    description: '2 sets of tailored day uniform, sportswear, school tie, and blazer crest.',
    activeStudentsCount: 220,
  },
]

export const INITIAL_ARREARS_RECORDS: ArrearsRecord[] = [
  {
    id: 'arr-1',
    studentName: 'Farouk Bello',
    class: 'Primary 4B',
    amountOwed: 45000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '14 Jan 2026',
    parentName: 'Alhaji Dr. S. Bello',
    parentPhone: '+234 803 456 7890',
    reminderSent: false,
  },
  {
    id: 'arr-2',
    studentName: 'Ibrahim Musa',
    class: 'SSS 2',
    amountOwed: 125000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '08 Nov 2025',
    parentName: 'Col. T. Musa (Rtd)',
    parentPhone: '+234 802 334 5566',
    reminderSent: false,
  },
  {
    id: 'arr-3',
    studentName: 'Chinedu Okafor',
    class: 'JSS 2A',
    amountOwed: 85000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '28 Jan 2026',
    parentName: 'Barrister E. Okafor',
    parentPhone: '+234 805 112 2334',
    reminderSent: false,
  },
  {
    id: 'arr-4',
    studentName: 'Amina Mohammed',
    class: 'JSS 1',
    amountOwed: 60000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '02 Dec 2025',
    parentName: 'Hajia Aisha Mohammed',
    parentPhone: '+234 814 998 8776',
    reminderSent: false,
  },
  {
    id: 'arr-5',
    studentName: 'David Adeleke',
    class: 'SSS 3',
    amountOwed: 210000,
    term: '1st & 2nd Term 2025/2026',
    lastPaymentDate: '15 Sep 2025',
    parentName: 'Chief A. Adeleke',
    parentPhone: '+234 803 777 8899',
    reminderSent: false,
  },
  {
    id: 'arr-6',
    studentName: 'Zainab Aliyu',
    class: 'SSS 1 Science',
    amountOwed: 35000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '19 Feb 2026',
    parentName: 'Dr. Kabir Aliyu',
    parentPhone: '+234 807 443 2211',
    reminderSent: false,
  },
  {
    id: 'arr-7',
    studentName: 'Blessing Okon',
    class: 'Primary 5',
    amountOwed: 25000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '05 Feb 2026',
    parentName: 'Mrs. Patience Okon',
    parentPhone: '+234 812 667 8890',
    reminderSent: false,
  },
  {
    id: 'arr-8',
    studentName: 'Oluwaseun Bakare',
    class: 'JSS 2B',
    amountOwed: 75000,
    term: '2nd Term 2025/2026',
    lastPaymentDate: '18 Jan 2026',
    parentName: 'Engr. F. Bakare',
    parentPhone: '+234 806 554 4332',
    reminderSent: false,
  },
]

export const INITIAL_PAYMENT_VERIFICATIONS: PaymentVerification[] = [
  {
    id: 'verif-1',
    studentName: 'Fatima Bello',
    class: 'JSS 2A',
    feeType: '2nd Term Tuition & PTA Levy',
    amountClaimed: 45000,
    dateSubmitted: 'Today at 10:45 AM',
    bankName: 'Zenith Bank Mobile Transfer',
    senderAccount: 'Alhaji Dr. S. Bello • 2087654321',
    receiptRef: 'ZEN-NIP-20260906-883921',
    proofImageUrl: '',
    notes: 'Paid via Zenith Mobile App to Crown Academy Wema Bank account.',
    status: 'pending',
  },
  {
    id: 'verif-2',
    studentName: 'Emeka Nwosu',
    class: 'SSS 1 Science',
    feeType: 'Science Lab Practical Fee',
    amountClaimed: 25000,
    dateSubmitted: 'Today at 08:30 AM',
    bankName: 'GTBank Internet Banking',
    senderAccount: 'Dr. C. Nwosu • 0123984756',
    receiptRef: 'GTB-TRF-20260906-119284',
    proofImageUrl: '',
    notes: 'Payment for 2nd term physics and chemistry practical reagent kit.',
    status: 'pending',
  },
  {
    id: 'verif-3',
    studentName: 'Aisha Abubakar',
    class: 'JSS 3',
    feeType: 'Tuition Fee (Junior Secondary)',
    amountClaimed: 145000,
    dateSubmitted: 'Yesterday at 4:15 PM',
    bankName: 'Access Bank NIP Transfer',
    senderAccount: 'Mal. Garba Abubakar • 0691238475',
    receiptRef: 'ACC-NIP-20260905-992384',
    proofImageUrl: '',
    notes: 'Full second term tuition payment via Access More mobile app.',
    status: 'pending',
  },
  {
    id: 'verif-4',
    studentName: 'Tunde Fashola',
    class: 'SSS 2',
    feeType: 'School Bus Transit (Route B)',
    amountClaimed: 45000,
    dateSubmitted: '04 Sep 2026 at 11:20 AM',
    bankName: 'OPay Digital Services',
    senderAccount: 'Mrs. Y. Fashola • 8031234567',
    receiptRef: 'OPAY-WAL-20260904-771928',
    proofImageUrl: '',
    notes: 'Route B bus transit fee for 2nd term.',
    status: 'pending',
  },
]
