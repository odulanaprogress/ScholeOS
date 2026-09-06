export type SchoolPlan = 'basic' | 'premium' | 'unlimited'
export type SchoolStatus = 'trial' | 'active' | 'grace_period' | 'suspended'

export interface LicenseHistoryItem {
  id: string
  event: string
  date: string
  note?: string
}

export interface LicensedSchool {
  id: string
  name: string
  shortName: string
  contactEmail: string
  contactPhone: string
  adminName: string
  plan: SchoolPlan
  status: SchoolStatus
  studentCount: number
  trialEndsDate: string | null
  daysRemaining: number | null
  renewalDate: string
  createdAt: string
  licenseHistory: LicenseHistoryItem[]
}

export interface PlatformBillingRecord {
  id: string
  schoolId: string
  schoolName: string
  amount: number
  date: string
  plan: SchoolPlan
  status: 'paid' | 'failed' | 'pending'
  reference: string
  paymentMethod: string
}

export const INITIAL_LICENSED_SCHOOLS: LicensedSchool[] = [
  {
    id: 'sch-001',
    name: 'Crown Academy Lagos',
    shortName: 'CAL',
    contactEmail: 'principal@crownacademy.ng',
    contactPhone: '+234 803 241 8899',
    adminName: 'Dr. Alhaji S. Bello',
    plan: 'premium',
    status: 'active',
    studentCount: 340,
    trialEndsDate: null,
    daysRemaining: null,
    renewalDate: 'Dec 15, 2026',
    createdAt: 'Sep 10, 2025',
    licenseHistory: [
      {
        id: 'lh-1',
        event: 'Upgraded to Premium',
        date: 'March 2026',
        note: 'Expanded student capacity to 600 seats for 2nd term.',
      },
      {
        id: 'lh-2',
        event: 'Annual License Renewed',
        date: 'January 2026',
        note: 'Paid ₦65,000 via direct corporate transfer.',
      },
      {
        id: 'lh-3',
        event: 'Trial Converted to Paid',
        date: 'October 2025',
        note: 'Onboarded by ScholeOS regional partner team.',
      },
    ],
  },
  {
    id: 'sch-002',
    name: 'Kings College Annex Ibadan',
    shortName: 'KCA',
    contactEmail: 'admin@kingscollegeibadan.edu.ng',
    contactPhone: '+234 802 112 3344',
    adminName: 'Mrs. Folashade Adebayo',
    plan: 'unlimited',
    status: 'active',
    studentCount: 940,
    trialEndsDate: null,
    daysRemaining: null,
    renewalDate: 'Jan 20, 2027',
    createdAt: 'Jan 15, 2025',
    licenseHistory: [
      {
        id: 'lh-4',
        event: 'Upgraded to Unlimited Enterprise',
        date: 'September 2025',
        note: 'Unlimited students with custom CBT server allocation.',
      },
      {
        id: 'lh-5',
        event: 'Trial Started',
        date: 'January 2025',
        note: 'Initial trial onboarded via web demo request.',
      },
    ],
  },
  {
    id: 'sch-003',
    name: 'Bright Stars Academy Abuja',
    shortName: 'BSA',
    contactEmail: 'info@brightstarsabuja.com',
    contactPhone: '+234 809 555 4321',
    adminName: 'Pastor Emmanuel Okon',
    plan: 'basic',
    status: 'trial',
    studentCount: 185,
    trialEndsDate: 'Sep 9, 2026',
    daysRemaining: 2,
    renewalDate: 'Sep 9, 2026',
    createdAt: 'Aug 26, 2026',
    licenseHistory: [
      {
        id: 'lh-6',
        event: '14-Day Free Trial Started',
        date: 'August 26, 2026',
        note: 'Sales-assisted setup by Northern Nigeria rep.',
      },
    ],
  },
  {
    id: 'sch-004',
    name: 'Gracefield Christian School Enugu',
    shortName: 'GCS',
    contactEmail: 'bursar@gracefieldenugu.org',
    contactPhone: '+234 805 778 9900',
    adminName: 'Sister Mary Okoli',
    plan: 'premium',
    status: 'grace_period',
    studentCount: 420,
    trialEndsDate: null,
    daysRemaining: 4,
    renewalDate: 'Aug 31, 2026',
    createdAt: 'Feb 1, 2025',
    licenseHistory: [
      {
        id: 'lh-7',
        event: 'Entered 7-Day Grace Period',
        date: 'September 1, 2026',
        note: 'Term renewal invoice past due; automatic warning email sent.',
      },
      {
        id: 'lh-8',
        event: 'License Renewed',
        date: 'February 2025',
        note: '1st term fee payment logged.',
      },
    ],
  },
  {
    id: 'sch-005',
    name: "St. Jude's International Port Harcourt",
    shortName: 'SJI',
    contactEmail: 'headmaster@stjudesph.sch.ng',
    contactPhone: '+234 807 432 1098',
    adminName: 'Dr. Kenneth Briggs',
    plan: 'premium',
    status: 'active',
    studentCount: 510,
    trialEndsDate: null,
    daysRemaining: null,
    renewalDate: 'Nov 30, 2026',
    createdAt: 'Nov 12, 2025',
    licenseHistory: [
      {
        id: 'lh-9',
        event: 'Annual License Renewed',
        date: 'November 2025',
        note: 'Premium tier renewed for 2025/2026 session.',
      },
    ],
  },
  {
    id: 'sch-006',
    name: 'Pacesetter High School Abeokuta',
    shortName: 'PHS',
    contactEmail: 'director@pacesetterschools.ng',
    contactPhone: '+234 813 654 3210',
    adminName: 'Chief Olumide Shonubi',
    plan: 'basic',
    status: 'trial',
    studentCount: 160,
    trialEndsDate: 'Sep 8, 2026',
    daysRemaining: 1,
    renewalDate: 'Sep 8, 2026',
    createdAt: 'Aug 25, 2026',
    licenseHistory: [
      {
        id: 'lh-10',
        event: '14-Day Free Trial Started',
        date: 'August 25, 2026',
        note: 'Direct registration from marketing landing page.',
      },
    ],
  },
  {
    id: 'sch-007',
    name: 'Heritage Model College Kano',
    shortName: 'HMC',
    contactEmail: 'admin@heritagemodelkano.com',
    contactPhone: '+234 802 888 7766',
    adminName: 'Mallam Ibrahim Dantata',
    plan: 'unlimited',
    status: 'active',
    studentCount: 860,
    trialEndsDate: null,
    daysRemaining: null,
    renewalDate: 'Oct 14, 2026',
    createdAt: 'Oct 10, 2024',
    licenseHistory: [
      {
        id: 'lh-11',
        event: 'Enterprise SLA Activated',
        date: 'October 2025',
        note: 'Dedicated school database container provisioned.',
      },
    ],
  },
  {
    id: 'sch-008',
    name: 'Royal Palm Academy Calabar',
    shortName: 'RPA',
    contactEmail: 'office@royalpalmacademy.edu.ng',
    contactPhone: '+234 818 900 1234',
    adminName: 'Mrs. Patience Henshaw',
    plan: 'basic',
    status: 'suspended',
    studentCount: 195,
    trialEndsDate: null,
    daysRemaining: null,
    renewalDate: 'Jul 10, 2026',
    createdAt: 'Jan 10, 2025',
    licenseHistory: [
      {
        id: 'lh-12',
        event: 'Access Suspended',
        date: 'July 25, 2026',
        note: 'Account suspended after 14-day grace period lapsed with unpaid invoice.',
      },
      {
        id: 'lh-13',
        event: 'Entered Grace Period',
        date: 'July 11, 2026',
        note: 'Subscription renewal past due.',
      },
    ],
  },
]

export const INITIAL_PLATFORM_BILLING: PlatformBillingRecord[] = [
  {
    id: 'bill-101',
    schoolId: 'sch-001',
    schoolName: 'Crown Academy Lagos',
    amount: 65000,
    date: 'Sep 02, 2026',
    plan: 'premium',
    status: 'paid',
    reference: 'SCH-SUB-2026-091',
    paymentMethod: 'Paystack Automated Card',
  },
  {
    id: 'bill-102',
    schoolId: 'sch-002',
    schoolName: 'Kings College Annex Ibadan',
    amount: 120000,
    date: 'Aug 28, 2026',
    plan: 'unlimited',
    status: 'paid',
    reference: 'SCH-SUB-2026-088',
    paymentMethod: 'Direct Bank Transfer (Reconciled)',
  },
  {
    id: 'bill-103',
    schoolId: 'sch-005',
    schoolName: "St. Jude's International Port Harcourt",
    amount: 65000,
    date: 'Aug 20, 2026',
    plan: 'premium',
    status: 'paid',
    reference: 'SCH-SUB-2026-082',
    paymentMethod: 'Flutterwave Online Checkout',
  },
  {
    id: 'bill-104',
    schoolId: 'sch-007',
    schoolName: 'Heritage Model College Kano',
    amount: 120000,
    date: 'Aug 14, 2026',
    plan: 'unlimited',
    status: 'paid',
    reference: 'SCH-SUB-2026-079',
    paymentMethod: 'Direct Bank Transfer (Reconciled)',
  },
  {
    id: 'bill-105',
    schoolId: 'sch-004',
    schoolName: 'Gracefield Christian School Enugu',
    amount: 65000,
    date: 'Aug 31, 2026',
    plan: 'premium',
    status: 'pending',
    reference: 'SCH-SUB-2026-090',
    paymentMethod: 'Direct Bank Transfer (Awaiting Proof)',
  },
  {
    id: 'bill-106',
    schoolId: 'sch-008',
    schoolName: 'Royal Palm Academy Calabar',
    amount: 35000,
    date: 'Jul 10, 2026',
    plan: 'basic',
    status: 'failed',
    reference: 'SCH-SUB-2026-064',
    paymentMethod: 'Paystack Automated Card (Insufficient Funds)',
  },
]

export const PLAN_DETAILS: Record<
  SchoolPlan,
  { name: string; price: number; priceFormatted: string; studentLimit: string; badgeVariant: 'neutral' | 'primary' | 'gold' }
> = {
  basic: {
    name: 'Basic School Plan',
    price: 35000,
    priceFormatted: '₦35,000',
    studentLimit: 'Up to 200 Students',
    badgeVariant: 'neutral',
  },
  premium: {
    name: 'Professional / Premium Plan',
    price: 65000,
    priceFormatted: '₦65,000',
    studentLimit: 'Up to 600 Students',
    badgeVariant: 'primary',
  },
  unlimited: {
    name: 'Enterprise Unlimited',
    price: 120000,
    priceFormatted: '₦120,000',
    studentLimit: 'Unlimited Students',
    badgeVariant: 'gold',
  },
}
