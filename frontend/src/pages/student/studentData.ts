export interface StudentAssignment {
  id: string
  subject: string
  title: string
  teacherName: string
  dueDate: string
  dueTimestamp: string
  status: 'not_submitted' | 'submitted' | 'overdue'
  description: string
  attachedFileName?: string
  attachedFileSize?: string
  submittedAt?: string
  submissionFileName?: string
  score?: string
}

export interface TimetableSlot {
  period: number
  timeRange: string
  monday: { subject: string; teacher: string; room: string; type?: 'break' | 'core' | 'lab' }
  tuesday: { subject: string; teacher: string; room: string; type?: 'break' | 'core' | 'lab' }
  wednesday: { subject: string; teacher: string; room: string; type?: 'break' | 'core' | 'lab' }
  thursday: { subject: string; teacher: string; room: string; type?: 'break' | 'core' | 'lab' }
  friday: { subject: string; teacher: string; room: string; type?: 'break' | 'core' | 'lab' }
}

export const STUDENT_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: 'asg-1',
    subject: 'Mathematics',
    title: 'Quadratic Equations & Problem Solving Worksheet',
    teacherName: 'Mrs. Bola Adeyemi',
    dueDate: 'Sep 12, 2026',
    dueTimestamp: 'In 3 days',
    status: 'not_submitted',
    description: 'Solve questions 1 through 20 from Chapter 4 of the New General Mathematics textbook. Show all workings clearly for the quadratic formula method and factorization.',
    attachedFileName: 'Quadratic_Equations_Practice_Sheet.pdf',
    attachedFileSize: '1.2 MB',
  },
  {
    id: 'asg-2',
    subject: 'Basic Science',
    title: 'Digestive System Biology Lab Report',
    teacherName: 'Mr. Tunde Alabi',
    dueDate: 'Sep 15, 2026',
    dueTimestamp: 'In 6 days',
    status: 'not_submitted',
    description: 'Complete the laboratory observations report from Wednesday’s practical session on enzyme action in saliva. Include hand-drawn labeled diagrams of the alimentary canal.',
    attachedFileName: 'Biology_Lab_Worksheet_04.pdf',
    attachedFileSize: '850 KB',
  },
  {
    id: 'asg-3',
    subject: 'English Language',
    title: 'Essay: The Impact of Modern Technology on Youth',
    teacherName: 'Mrs. Fatima Okafor',
    dueDate: 'Sep 04, 2026',
    dueTimestamp: 'Submitted',
    status: 'submitted',
    description: 'Write a persuasive essay of not less than 350 words discussing how mobile devices and digital platforms impact study habits in Nigerian secondary schools.',
    attachedFileName: 'Essay_Writing_Rubric.pdf',
    attachedFileSize: '540 KB',
    submittedAt: 'Sep 03, 2026 at 4:30 PM',
    submissionFileName: 'Fatima_Bello_English_Essay.pdf',
    score: '18 / 20',
  },
  {
    id: 'asg-4',
    subject: 'Social Studies',
    title: 'Civic Responsibilities & Electoral Processes in Nigeria',
    teacherName: 'Mr. Emmanuel Danladi',
    dueDate: 'Aug 30, 2026',
    dueTimestamp: 'Submitted',
    status: 'submitted',
    description: 'Outline the roles of the three tiers of government in ensuring free, fair, and credible elections under the 1999 Constitution.',
    attachedFileName: 'Social_Studies_Term2_Project.pdf',
    attachedFileSize: '2.1 MB',
    submittedAt: 'Aug 29, 2026 at 11:15 AM',
    submissionFileName: 'Civic_Project_Fatima_Bello.docx',
    score: '19 / 20',
  },
  {
    id: 'asg-5',
    subject: 'French Language',
    title: 'Dialogue de Présentation et Vocabulaire Familial',
    teacherName: 'Madame C. Dupont',
    dueDate: 'Sep 02, 2026',
    dueTimestamp: 'Overdue',
    status: 'overdue',
    description: 'Write and record a 2-minute dialogue introducing your family members in French using present tense verbs.',
    attachedFileName: 'French_Audio_Script_Guide.pdf',
    attachedFileSize: '620 KB',
  },
]

export const WEEKLY_TIMETABLE_SLOTS: TimetableSlot[] = [
  {
    period: 1,
    timeRange: '08:00 – 08:45',
    monday: { subject: 'Mathematics', teacher: 'Mrs. Adeyemi', room: 'Hall 2A', type: 'core' },
    tuesday: { subject: 'English Language', teacher: 'Mrs. Okafor', room: 'Hall 2A', type: 'core' },
    wednesday: { subject: 'Basic Science', teacher: 'Mr. Alabi', room: 'Lab 1', type: 'lab' },
    thursday: { subject: 'Social Studies', teacher: 'Mr. Danladi', room: 'Hall 2A', type: 'core' },
    friday: { subject: 'Mathematics', teacher: 'Mrs. Adeyemi', room: 'Hall 2A', type: 'core' },
  },
  {
    period: 2,
    timeRange: '08:45 – 09:30',
    monday: { subject: 'Mathematics', teacher: 'Mrs. Adeyemi', room: 'Hall 2A', type: 'core' },
    tuesday: { subject: 'English Language', teacher: 'Mrs. Okafor', room: 'Hall 2A', type: 'core' },
    wednesday: { subject: 'Basic Science', teacher: 'Mr. Alabi', room: 'Lab 1', type: 'lab' },
    thursday: { subject: 'Business Studies', teacher: 'Mrs. Ibrahim', room: 'Hall 2A', type: 'core' },
    friday: { subject: 'Civic Education', teacher: 'Mr. Balogun', room: 'Hall 2A', type: 'core' },
  },
  {
    period: 3,
    timeRange: '09:30 – 10:15',
    monday: { subject: 'Basic Technology', teacher: 'Engr. Obi', room: 'Tech Lab', type: 'lab' },
    tuesday: { subject: 'Agricultural Science', teacher: 'Dr. Babatunde', room: 'Hall 2A', type: 'core' },
    wednesday: { subject: 'Mathematics', teacher: 'Mrs. Adeyemi', room: 'Hall 2A', type: 'core' },
    thursday: { subject: 'French Language', teacher: 'Mme. Dupont', room: 'Lang Lab', type: 'lab' },
    friday: { subject: 'English Language', teacher: 'Mrs. Okafor', room: 'Hall 2A', type: 'core' },
  },
  {
    period: 4,
    timeRange: '10:15 – 10:45',
    monday: { subject: 'Morning Break', teacher: '—', room: 'Cafeteria', type: 'break' },
    tuesday: { subject: 'Morning Break', teacher: '—', room: 'Cafeteria', type: 'break' },
    wednesday: { subject: 'Morning Break', teacher: '—', room: 'Cafeteria', type: 'break' },
    thursday: { subject: 'Morning Break', teacher: '—', room: 'Cafeteria', type: 'break' },
    friday: { subject: 'Morning Break', teacher: '—', room: 'Cafeteria', type: 'break' },
  },
  {
    period: 5,
    timeRange: '10:45 – 11:30',
    monday: { subject: 'English Language', teacher: 'Mrs. Okafor', room: 'Hall 2A', type: 'core' },
    tuesday: { subject: 'Social Studies', teacher: 'Mr. Danladi', room: 'Hall 2A', type: 'core' },
    wednesday: { subject: 'Computer Studies', teacher: 'Mr. Kalu', room: 'ICT Center', type: 'lab' },
    thursday: { subject: 'Basic Science', teacher: 'Mr. Alabi', room: 'Hall 2A', type: 'core' },
    friday: { subject: 'Physical Education', teacher: 'Coach Adams', room: 'Sports Field', type: 'core' },
  },
  {
    period: 6,
    timeRange: '11:30 – 12:15',
    monday: { subject: 'Civic Education', teacher: 'Mr. Balogun', room: 'Hall 2A', type: 'core' },
    tuesday: { subject: 'Business Studies', teacher: 'Mrs. Ibrahim', room: 'Hall 2A', type: 'core' },
    wednesday: { subject: 'Computer Studies', teacher: 'Mr. Kalu', room: 'ICT Center', type: 'lab' },
    thursday: { subject: 'Mathematics', teacher: 'Mrs. Adeyemi', room: 'Hall 2A', type: 'core' },
    friday: { subject: 'French Language', teacher: 'Mme. Dupont', room: 'Hall 2A', type: 'core' },
  },
  {
    period: 7,
    timeRange: '12:15 – 01:00',
    monday: { subject: 'French Language', teacher: 'Mme. Dupont', room: 'Hall 2A', type: 'core' },
    tuesday: { subject: 'Agricultural Science', teacher: 'Dr. Babatunde', room: 'School Farm', type: 'lab' },
    wednesday: { subject: 'Literature in English', teacher: 'Mrs. Okafor', room: 'Library', type: 'core' },
    thursday: { subject: 'Physical Education', teacher: 'Coach Adams', room: 'Field', type: 'core' },
    friday: { subject: 'Club Activities & Prep', teacher: 'Faculty', room: 'Auditorium', type: 'core' },
  },
]
