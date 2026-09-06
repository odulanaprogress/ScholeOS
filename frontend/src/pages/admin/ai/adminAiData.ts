export const ADMIN_SUGGESTED_PROMPTS = [
  'Which parents are 2+ terms behind on fees?',
  "Compare this term's JSS2 average to last term",
  'How many classes have fully submitted results?',
  "Summarize today's attendance across the school",
]

export function getAdminAiResponse(prompt: string): string {
  const lower = prompt.toLowerCase()

  if (lower.includes('behind on fees') || lower.includes('arrears') || lower.includes('debtor') || lower.includes('fee')) {
    return `Based on live Bursary records for 2nd Term 2025/2026:

• **3 parents** have cumulative arrears spanning 2+ terms:
  1. **Chief A. Adeleke** — ₦210,000 (David Adeleke • SSS 3) — 1st & 2nd Term
  2. **Col. T. Musa (Rtd)** — ₦125,000 (Ibrahim Musa • SSS 2)
  3. **Barrister E. Okafor** — ₦85,000 (Chinedu Okafor • JSS 2A)

Total school arrears currently stand at **₦660,000** across 8 debtors. Would you like me to generate an SMS payment reminder or export their debt ledger to Excel?`
  }

  if (lower.includes('jss2') || lower.includes('jss 2') || (lower.includes('average') && lower.includes('compare'))) {
    return `Here is the term-over-term academic performance analysis for **JSS 2**:

• **2nd Term Cumulative Average:** **74.8%**
• **1st Term Cumulative Average:** **71.2%**
• **Net Improvement:** **+3.6%**

**Key Subject Highlights:**
• **Mathematics:** +5.1% improvement (Average: 76.4%) following the Welcome Back diagnostic remedial classes.
• **English Language:** +2.8% (Average: 73.1%).
• **Basic Science:** Steady at 75.0%.
• **Top Performing Arm:** **JSS 2A** (Average: 76.9% • Form Master: Mrs. Bola Adeyemi).

All continuous assessments have been verified and sealed on the master broadsheet.`
  }

  if (lower.includes('submitted') || lower.includes('classes have fully') || lower.includes('results')) {
    return `Status of Score Submissions across Crown Academy Lagos:

• **Fully Submitted Classes (6 / 10):**
  - JSS 2A (Published & Locked • Form Master: Mrs. Bola Adeyemi)
  - JSS 2B (8 / 8 Submitted)
  - JSS 3 (8 / 8 Submitted)
  - SSS 1 Science (Published & Locked)
  - SSS 1 Arts (8 / 8 Submitted)
  - SSS 3 (8 / 8 Submitted)

• **Pending Submissions (4 / 10):**
  - **SSS 2:** 2 subjects remaining (Further Mathematics & Economics)
  - **JSS 1:** 1 subject remaining (French Language)
  - **Primary 5 & 6:** Awaiting terminal practical grades.

The deadline for terminal broadsheet sealing is **Friday, 18th September**.`
  }

  if (lower.includes('attendance') || lower.includes('today')) {
    return `Morning Attendance Register Summary for **Today**:

• **Overall School Attendance Rate:** **94.2%**
• **Total Learners Present:** **1,206 / 1,280**
• **Recorded Absences:** 62 students (18 verified medical/excused)
• **Lateness Roll:** 12 students

**Arm Breakdown Highlights:**
• **Highest Attendance:** **JSS 2A** (97.4% • 37 present, 1 late)
• **Secondary Average:** 95.1%
• **Primary Average:** 92.8% (Primary 4B had 3 recorded absences)

Parent SMS absence notifications were automatically dispatched at 08:30 AM.`
  }

  // Generic contextual fallback
  return `Thank you for your query. I have analyzed Crown Academy Lagos's database:

Currently, the school has **1,280 enrolled learners** across 10 arms, **48 active educators**, an institutional fee collection rate of **84.6%**, and overall attendance averaging **94.2%**.

If you need specific student biodata, broadsheet breakdowns, or fee reconciliation summaries, please let me know!`
}

// Student options for Report Card Comments
export const REPORT_CARD_STUDENTS = [
  { id: 'ada', name: 'Adaeze Obi', class: 'JSS 2A' },
  { id: 'fatima', name: 'Fatima Bello', class: 'JSS 2A' },
  { id: 'chinedu', name: 'Chinedu Okafor', class: 'JSS 2A' },
  { id: 'ibrahim', name: 'Ibrahim Musa', class: 'SSS 2' },
  { id: 'zainab', name: 'Zainab Aliyu', class: 'SSS 1 Science' },
]

export const REPORT_CARD_SUBJECTS = [
  'Overall Form Master Comment',
  'Mathematics',
  'English Language',
  'Basic Science & Technology',
  'Social Studies',
  'Civic Education',
  'Physics',
  'Agricultural Science',
]

export const REPORT_CARD_TONES = [
  'Academic Excellence (A1/B2)',
  'Steady Progress & Improvement',
  'Needs Academic Encouragement',
  'Exemplary Leadership & Conduct',
]

// Generate Report Card Comment variants
export function generateReportCardComment(
  studentName: string,
  subject: string,
  _tone: string,
  iteration: number = 0
): string {
  const firstName = studentName.split(' ')[0]
  const isOverall = subject.includes('Overall')

  if (isOverall) {
    const comments = [
      `${firstName} has demonstrated outstanding academic discipline and intellectual curiosity throughout this term. Their leadership in class discussions and consistent term average reflect exemplary dedication. Recommended for academic commendation.`,
      `A commendable term for ${firstName}. They have shown steady improvement across core subjects, exhibiting commendable resilience and positive social interaction with peers. Encouraged to maintain this disciplined study momentum next term.`,
      `${firstName} shows substantial innate potential and active participation in class. With increased concentration during independent study and consistent revision in calculations, higher terminal attainment is well within reach.`,
    ]
    return comments[iteration % comments.length]
  }

  // Subject-specific
  const comments = [
    `${firstName} has shown consistent improvement in ${subject} this term, particularly in analytical problem-solving speed and assignment diligence. Class attendance and practical participation remain excellent.`,
    `${firstName} exhibits a strong conceptual grasp of ${subject}. Practical lab performance and continuous assessments have been thoroughly commendable. A very dependable learner in the classroom.`,
    `${firstName} participates enthusiastically during ${subject} lectures. Demonstrates solid grasp of foundational principles, though further precision in terminal exam calculations will yield top-tier distinction.`,
  ]

  return comments[iteration % comments.length]
}
