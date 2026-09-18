/**
 * CBT (Computer-Based Testing) Types & DTOs (Wave 10)
 */

export type CbtTestStatus = "draft" | "scheduled" | "live" | "completed";
export type CbtSubmissionStatus = "not_started" | "in_progress" | "completed" | "auto_submitted";

export interface CbtQuestionInput {
  id?: string;
  questionText: string;
  imageUrl?: string | null;
  options: string[]; // 4 options
  correctOptionIndex: number; // 0..3
  points?: number;
  displayOrder?: number;
}

export interface CreateCbtTestDTO {
  classId: string;
  subjectId: string;
  termId: string;
  title: string;
  durationMinutes: number;
  scheduledAt: string; // ISO string
  questions: CbtQuestionInput[];
}

export interface UpdateCbtTestDTO {
  title?: string;
  durationMinutes?: number;
  scheduledAt?: string;
  questions?: CbtQuestionInput[];
}

/**
 * Question view returned to student during test taking.
 * SECURITY INVARIANT: correctOptionIndex is strictly excluded!
 */
export interface CbtQuestionStudentViewDTO {
  id: string;
  testId: string;
  questionText: string;
  imageUrl?: string | null;
  options: string[];
  points: number;
  displayOrder: number;
}

export interface StudentCbtTestCardDTO {
  id: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  termId: string;
  durationMinutes: number;
  scheduledAt: string;
  totalPoints: number;
  computedStatus: "not_yet_live" | "live_now" | "completed" | "missed";
  submissionId?: string;
  score?: number | null;
  percentage?: number | null;
}

export interface StartCbtTestResponseDTO {
  submissionId: string;
  testId: string;
  title: string;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  questions: CbtQuestionStudentViewDTO[];
  savedAnswers: Record<string, number>;
}

export interface SaveAnswerDTO {
  questionId: string;
  selectedOptionIndex: number;
}

export interface SubmitCbtResponseDTO {
  submissionId: string;
  testId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTakenSeconds: number;
  status: CbtSubmissionStatus;
  submittedAt: string;
}

export interface CbtQuestionResultDTO {
  id: string;
  questionText: string;
  imageUrl?: string | null;
  options: string[];
  selectedOptionIndex: number | null;
  correctOptionIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
}

export interface CbtSubmissionResultDTO {
  submissionId: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTakenSeconds: number;
  status: CbtSubmissionStatus;
  startedAt: string;
  submittedAt: string;
  questions: CbtQuestionResultDTO[];
}

export interface CbtTestResultsSummaryDTO {
  testId: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  durationMinutes: number;
  scheduledAt: string;
  totalPoints: number;
  totalStudents: number;
  submittedCount: number;
  completionRatePercentage: string;
  averageScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  submissions: Array<{
    submissionId: string;
    studentId: string;
    studentName: string;
    admissionNumber?: string;
    score: number;
    totalPoints: number;
    percentage: number;
    timeTakenSeconds: number;
    status: CbtSubmissionStatus;
    submittedAt: string;
  }>;
}

export interface ImportCbtToGradebookDTO {
  componentId: string; // Target assessment component (e.g. CBT/Exam)
}
