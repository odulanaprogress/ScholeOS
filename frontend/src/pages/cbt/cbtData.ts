export interface CbtQuestion {
  id: string
  number: number
  text: string
  imageUrl?: string
  options: string[]
  correctOptionIndex: number // 0: A, 1: B, 2: C, 3: D
  points: number
}

export interface CbtTest {
  id: string
  title: string
  classId: string
  className: string
  subject: string
  durationMinutes: number
  scheduledDate: string
  scheduledStartTime: string
  status: 'draft' | 'scheduled' | 'live' | 'completed'
  totalPoints: number
  questions: CbtQuestion[]
  createdAt: string
  isPublished?: boolean
}

export interface StudentCbtSubmission {
  id: string
  testId: string
  studentName: string
  admissionNo: string
  score: number
  totalPoints: number
  timeTakenMinutes: number
  status: 'completed' | 'incomplete' | 'not_started'
  answers: Record<number, number> // questionIndex -> selectedOptionIndex
  submittedAt?: string
}

export const INITIAL_CBT_TESTS: CbtTest[] = [
  {
    id: 'cbt-math-jss2',
    title: 'JSS 2A Mid-Term Mathematics CBT',
    classId: 'jss2a',
    className: 'JSS 2A',
    subject: 'Mathematics',
    durationMinutes: 15,
    scheduledDate: '2026-09-06',
    scheduledStartTime: '09:00 AM',
    status: 'live',
    totalPoints: 10,
    createdAt: '2026-09-05',
    isPublished: true,
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Solve for x in the linear algebraic equation: 3x - 7 = 14',
        options: ['x = 5', 'x = 7', 'x = 6', 'x = 8'],
        correctOptionIndex: 1, // B (x = 7)
        points: 2,
      },
      {
        id: 'q2',
        number: 2,
        text: 'Expand the algebraic expression: 4(3y + 5)',
        options: ['12y + 9', '7y + 20', '12y + 20', '12y + 5'],
        correctOptionIndex: 2, // C (12y + 20)
        points: 2,
      },
      {
        id: 'q3',
        number: 3,
        text: 'What is the sum of interior angles of any regular triangle?',
        options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
        correctOptionIndex: 1, // B (180 degrees)
        points: 1,
      },
      {
        id: 'q4',
        number: 4,
        text: 'Evaluate the fraction expression: (3/4) + (2/5)',
        options: ['23/20', '5/9', '6/20', '15/20'],
        correctOptionIndex: 0, // A (23/20)
        points: 2,
      },
      {
        id: 'q5',
        number: 5,
        text: 'If a car travels a distance of 180 km in 3 hours, what is its average speed?',
        options: ['50 km/h', '60 km/h', '70 km/h', '90 km/h'],
        correctOptionIndex: 1, // B (60 km/h)
        points: 2,
      },
      {
        id: 'q6',
        number: 6,
        text: 'Factorise the expression completely: 6ab - 9ac',
        options: ['3a(2b - 3c)', '3(2ab - 3ac)', 'a(6b - 9c)', '3ab(2 - 3c)'],
        correctOptionIndex: 0, // A (3a(2b - 3c))
        points: 1,
      },
    ],
  },
  {
    id: 'cbt-physics-sss1',
    title: 'SSS 1 Physics Continuous Assessment Test',
    classId: 'sss1-sci',
    className: 'SSS 1 Science',
    subject: 'Physics',
    durationMinutes: 30,
    scheduledDate: '2026-09-12',
    scheduledStartTime: '11:00 AM',
    status: 'scheduled',
    totalPoints: 20,
    createdAt: '2026-09-04',
    isPublished: true,
    questions: [
      {
        id: 'qp1',
        number: 1,
        text: 'Which of the following is a fundamental physical quantity in the S.I. metric system?',
        options: ['Velocity', 'Luminous Intensity', 'Force', 'Density'],
        correctOptionIndex: 1,
        points: 2,
      },
      {
        id: 'qp2',
        number: 2,
        text: 'A body accelerates uniformly from rest at 4 m/s² for 5 seconds. Calculate its final velocity.',
        options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
        correctOptionIndex: 2,
        points: 3,
      },
    ],
  },
  {
    id: 'cbt-science-jss2',
    title: 'JSS 2 Basic Science Diagnostic Examination',
    classId: 'jss2a',
    className: 'JSS 2A',
    subject: 'Basic Science',
    durationMinutes: 20,
    scheduledDate: '2026-08-28',
    scheduledStartTime: '10:00 AM',
    status: 'completed',
    totalPoints: 20,
    createdAt: '2026-08-25',
    isPublished: true,
    questions: [
      {
        id: 'qs1',
        number: 1,
        text: 'Which organelle is universally known as the powerhouse of the biological cell?',
        options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Nucleus'],
        correctOptionIndex: 1,
        points: 2,
      },
      {
        id: 'qs2',
        number: 2,
        text: 'What chemical state transition occurs during evaporation?',
        options: ['Solid to Liquid', 'Liquid to Gas', 'Gas to Solid', 'Solid to Gas'],
        correctOptionIndex: 1,
        points: 2,
      },
    ],
  },
]

export const INITIAL_CBT_RESULTS: StudentCbtSubmission[] = [
  {
    id: 'sub-1',
    testId: 'cbt-science-jss2',
    studentName: 'Fatima Bello',
    admissionNo: 'JSS2/003',
    score: 18,
    totalPoints: 20,
    timeTakenMinutes: 14,
    status: 'completed',
    answers: { 0: 1, 1: 1 },
    submittedAt: '28 Aug 2026, 10:14 AM',
  },
  {
    id: 'sub-2',
    testId: 'cbt-science-jss2',
    studentName: 'Chinedu Okafor',
    admissionNo: 'JSS2/012',
    score: 16,
    totalPoints: 20,
    timeTakenMinutes: 17,
    status: 'completed',
    answers: { 0: 1, 1: 0 },
    submittedAt: '28 Aug 2026, 10:17 AM',
  },
  {
    id: 'sub-3',
    testId: 'cbt-science-jss2',
    studentName: 'Adaeze Obi',
    admissionNo: 'JSS2/001',
    score: 20,
    totalPoints: 20,
    timeTakenMinutes: 12,
    status: 'completed',
    answers: { 0: 1, 1: 1 },
    submittedAt: '28 Aug 2026, 10:12 AM',
  },
  {
    id: 'sub-4',
    testId: 'cbt-science-jss2',
    studentName: 'Oluwaseun Bakare',
    admissionNo: 'JSS2/024',
    score: 14,
    totalPoints: 20,
    timeTakenMinutes: 19,
    status: 'completed',
    answers: { 0: 0, 1: 1 },
    submittedAt: '28 Aug 2026, 10:19 AM',
  },
  {
    id: 'sub-5',
    testId: 'cbt-science-jss2',
    studentName: 'Ibrahim Musa',
    admissionNo: 'JSS2/018',
    score: 12,
    totalPoints: 20,
    timeTakenMinutes: 20,
    status: 'completed',
    answers: { 0: 3, 1: 1 },
    submittedAt: '28 Aug 2026, 10:20 AM',
  },
  {
    id: 'sub-6',
    testId: 'cbt-science-jss2',
    studentName: 'Zainab Aliyu',
    admissionNo: 'JSS2/035',
    score: 0,
    totalPoints: 20,
    timeTakenMinutes: 0,
    status: 'not_started',
    answers: {},
  },
]
