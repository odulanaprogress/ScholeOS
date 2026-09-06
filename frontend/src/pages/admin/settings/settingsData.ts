export interface SchoolInfoSettings {
  schoolName: string
  schoolAbbr: string
  schoolAddress: string
  studentRange: string
  contactEmail: string
  contactPhone: string
}

export interface ScoreComponent {
  id: string
  name: string
  weight: number
}

export interface ClassItem {
  id: string
  name: string
  studentCount: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  tagline: string
  pricePerTerm: number
  priceFormatted: string
  studentLimit: number
  isCurrent?: boolean
  features: string[]
}

export interface BillingTransaction {
  id: string
  date: string
  description: string
  amount: number
  amountFormatted: string
  status: 'paid' | 'failed'
  invoiceRef: string
}

export const PRESET_COLORS = [
  { name: 'Royal Indigo', hex: '#4338CA' },
  { name: 'Forest Emerald', hex: '#059669' },
  { name: 'Deep Navy', hex: '#1E3A8A' },
  { name: 'Crimson Maroon', hex: '#991B1B' },
  { name: 'Warm Gold', hex: '#D4A017' },
  { name: 'Regal Purple', hex: '#7C3AED' },
]

export const INITIAL_SCHOOL_INFO: SchoolInfoSettings = {
  schoolName: 'Crown Academy Lagos',
  schoolAbbr: 'CAL',
  schoolAddress: 'Plot 12, Commercial Avenue, Yaba, Lagos State',
  studentRange: '200-500',
  contactEmail: 'admin@crownacademy.sch.ng',
  contactPhone: '+234 (0) 803 123 4567',
}

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'c1', name: 'JSS 1', studentCount: 34 },
  { id: 'c2', name: 'JSS 2A', studentCount: 38 },
  { id: 'c3', name: 'JSS 2B', studentCount: 40 },
  { id: 'c4', name: 'JSS 3', studentCount: 36 },
  { id: 'c5', name: 'SSS 1 Science', studentCount: 36 },
  { id: 'c6', name: 'SSS 1 Arts', studentCount: 32 },
  { id: 'c7', name: 'SSS 2', studentCount: 35 },
  { id: 'c8', name: 'SSS 3', studentCount: 38 },
]

export const INITIAL_SUBJECTS: string[] = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Biology',
  'Chemistry',
  'Physics',
  'Economics',
  'Civic Education',
  'Agricultural Science',
]

export const INITIAL_SCORE_COMPONENTS: ScoreComponent[] = [
  { id: '1', name: 'Terminal Examination', weight: 60 },
  { id: '2', name: '1st Continuous Assessment', weight: 20 },
  { id: '3', name: '2nd Continuous Assessment', weight: 20 },
]

export const AVAILABLE_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    tagline: 'Core records for growing private primary & secondary schools',
    pricePerTerm: 35000,
    priceFormatted: '₦35,000 / term',
    studentLimit: 250,
    features: [
      'Up to 250 registered students',
      'Continuous assessment & gradebook',
      'Daily attendance tracking',
      'Master broadsheets & report cards',
      'Parent & student portal access',
    ],
  },
  {
    id: 'premium',
    name: 'Professional / Premium Plan',
    tagline: 'Comprehensive operating system with AI, CBT, and custom branding',
    pricePerTerm: 65000,
    priceFormatted: '₦65,000 / term',
    studentLimit: 500,
    isCurrent: true,
    features: [
      'Up to 500 registered students',
      'All Basic features included',
      'ScholeOS AI Assistant & automated report card comments',
      'Computer-Based Testing (CBT) question banks & timed exams',
      'Multi-channel broadcasts (In-App, SMS, WhatsApp)',
      'Fees invoicing & bank transfer proof reconciliation',
      'Custom school crest & color branding',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited Enterprise',
    tagline: 'Uncapped capacity for leading multi-campus academies',
    pricePerTerm: 120000,
    priceFormatted: '₦120,000 / term',
    studentLimit: 99999,
    features: [
      'Unlimited enrolled students & campuses',
      'All Professional features included',
      'Custom school subdomain (e.g. portal.crownacademy.sch.ng)',
      'Dedicated account manager & priority 24/7 SLA',
      'Unlimited AI assistant queries & CBT assessments',
      'Bulk automated parent SMS & WhatsApp delivery gateway',
    ],
  },
]

export const INITIAL_BILLING_TRANSACTIONS: BillingTransaction[] = [
  {
    id: 'inv-001',
    date: '15 May 2026',
    description: 'ScholeOS Professional Plan — 2nd Term 2025/2026 Subscription',
    amount: 65000,
    amountFormatted: '₦65,000',
    status: 'paid',
    invoiceRef: 'SCH-INV-2026-0515',
  },
  {
    id: 'inv-002',
    date: '10 Jan 2026',
    description: 'ScholeOS Professional Plan — 1st Term 2025/2026 Subscription',
    amount: 65000,
    amountFormatted: '₦65,000',
    status: 'paid',
    invoiceRef: 'SCH-INV-2026-0110',
  },
  {
    id: 'inv-003',
    date: '15 Sep 2025',
    description: 'ScholeOS Onboarding & Term 3 2024/2025 Initial Setup',
    amount: 50000,
    amountFormatted: '₦50,000',
    status: 'paid',
    invoiceRef: 'SCH-INV-2025-0915',
  },
]
