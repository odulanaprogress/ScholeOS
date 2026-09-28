/**
 * ScholeOS Real-Time API Client & Bridge Layer
 *
 * Connects the React/Vite Frontend to the standalone Hono Node.js backend
 * engine running at http://localhost:4000 with real-time Supabase PostgreSQL,
 * Claude 3.5 AI Copilot, CBT auto-grading, and multi-channel notifications.
 */

import { getClerkSessionToken } from './clerk';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Active Seeded School ID in Supabase PostgreSQL (Apex International College)
export const DEFAULT_SCHOOL_ID = '2709a683-266f-4629-a294-f83bfcc59547';

let currentSchoolId = DEFAULT_SCHOOL_ID;
let currentUserRole = 'admin';

export function setActiveSchoolId(schoolId: string) {
  currentSchoolId = schoolId;
}

export function getActiveSchoolId(): string {
  return currentSchoolId;
}

export function setActiveUserRole(role: string) {
  currentUserRole = role;
}

export function getActiveUserRole(): string {
  return currentUserRole;
}

/* ========================================================================== */
/* REAL-TIME ACTIVITY EVENT BUS (Live Telemetry & Activity Drawer)            */
/* ========================================================================== */

export interface RealtimeActivityEvent {
  id: string;
  type:
    | 'ai'
    | 'announcement'
    | 'cbt'
    | 'staff'
    | 'score'
    | 'attendance'
    | 'fees'
    | 'licensing'
    | 'system';
  title: string;
  detail: string;
  status: 'success' | 'pending' | 'error';
  latencyMs?: number;
  timestamp: string;
}

const activityListeners = new Set<(event: RealtimeActivityEvent) => void>();
export const recentActivities: RealtimeActivityEvent[] = [];

export function subscribeToBackendActivity(
  callback: (event: RealtimeActivityEvent) => void
): () => void {
  activityListeners.add(callback);
  return () => {
    activityListeners.delete(callback);
  };
}

export function emitBackendActivity(
  event: Omit<RealtimeActivityEvent, 'id' | 'timestamp'>
) {
  const fullEvent: RealtimeActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
  recentActivities.unshift(fullEvent);
  if (recentActivities.length > 40) recentActivities.pop();
  activityListeners.forEach((cb) => {
    try {
      cb(fullEvent);
    } catch (err) {
      console.error('[ActivityBus Error]', err);
    }
  });
}

/**
 * Universal Authenticated & Namespaced API Fetch
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach multi-tenant & role identifiers
  if (!headers.has('x-school-id')) {
    headers.set('x-school-id', currentSchoolId);
  }
  if (!headers.has('x-user-role')) {
    headers.set('x-user-role', currentUserRole);
  }
  if (!headers.has('x-internal-service-secret')) {
    headers.set('x-internal-service-secret', 'scholeos_internal_secret_key');
  }

  // Attach Clerk JWT token if signed in, or use seamless demo test token
  const token = await getClerkSessionToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (!headers.has('Authorization')) {
    headers.set(
      'Authorization',
      `Bearer test_token_${currentUserRole || 'admin'}`
    );
    headers.set('x-test-user-id', `user_demo_${currentUserRole || 'admin'}_01`);
    headers.set('x-test-org-id', 'org_demo_apex_college_101');
  }

  const start = performance.now();
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      const error = new Error(
        errorData.message || `API request failed with HTTP ${response.status}`
      );
      (error as any).status = response.status;
      (error as any).data = errorData;

      emitBackendActivity({
        type: 'system',
        title: `HTTP ${response.status} on ${endpoint.split('?')[0]}`,
        detail: errorData.message || response.statusText,
        status: 'error',
        latencyMs,
      });

      throw error;
    }

    return response.json();
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    if (!err.status) {
      emitBackendActivity({
        type: 'system',
        title: `Connection Error on ${endpoint.split('?')[0]}`,
        detail: err.message || 'Cannot reach backend server',
        status: 'error',
        latencyMs,
      });
    }
    throw err;
  }
}

/* ========================================================================== */
/* REAL-TIME SYSTEM HEALTH & CONNECTION MONITOR                               */
/* ========================================================================== */

export interface SystemHealthResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  environment: string;
  port: number;
  database: {
    status: string;
    provider: string;
    database: string;
    dbTime: string;
  };
  microservices: string[];
  timestamp: string;
  latencyMs?: number;
}

export async function checkBackendHealth(): Promise<{
  isOnline: boolean;
  health: SystemHealthResponse | null;
  latencyMs: number;
  error?: string;
}> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    });
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      const data: SystemHealthResponse = await res.json();
      data.latencyMs = latencyMs;
      return { isOnline: true, health: data, latencyMs };
    }
    return {
      isOnline: false,
      health: null,
      latencyMs,
      error: `Server responded with HTTP ${res.status}`,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      isOnline: false,
      health: null,
      latencyMs,
      error: err.message || 'Cannot reach backend server',
    };
  }
}

/* ========================================================================== */
/* REAL-TIME AI COPILOT & SOCRATIC TUTOR                                      */
/* ========================================================================== */

export interface AiChatResult {
  response: string;
  tokensUsed?: number;
  model?: string;
  toolsInvoked?: string[];
  isSocratic?: boolean;
}

export async function sendAdminAiChat(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AiChatResult> {
  const start = performance.now();
  const res = await apiRequest<AiChatResult>('api/ai/admin/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationHistory: history,
    }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'ai',
    title: 'Admin AI Copilot (Claude 3.5)',
    detail: res.toolsInvoked?.length
      ? `Executed tools: ${res.toolsInvoked.join(', ')}`
      : 'Institutional intelligence query completed',
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function sendStudentAiChat(
  message: string,
  subject: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AiChatResult> {
  const start = performance.now();
  const res = await apiRequest<AiChatResult>('api/ai/student/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      subject,
      conversationHistory: history,
    }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'ai',
    title: `Socratic AI Tutor (${subject})`,
    detail: 'Child-safe guided explanation generated',
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function generateReportCardComment(params: {
  studentId: string;
  termId?: string;
  tone?: 'encouraging' | 'constructive' | 'strict' | 'balanced';
  customObservations?: string;
}): Promise<{
  comment: string;
  studentName?: string;
  attendanceRate?: string;
  topSubjects?: string[];
}> {
  const start = performance.now();
  const res = await apiRequest('api/ai/report-card-comment', {
    method: 'POST',
    body: JSON.stringify({
      studentId: params.studentId,
      termId: params.termId || 'term_1_demo',
      tone: params.tone || 'encouraging',
      customObservations: params.customObservations,
    }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'ai',
    title: 'Report Card AI Generator',
    detail: `Crafted remark for ${res.studentName || 'student'}`,
    status: 'success',
    latencyMs,
  });

  return res;
}

/* ========================================================================== */
/* REAL-TIME ANNOUNCEMENTS & NOTIFICATIONS                                    */
/* ========================================================================== */

export async function dispatchAnnouncement(announcementId: string): Promise<{
  status: string;
  announcementId: string;
  recipientCount: number;
  totalMessagesEnqueued: number;
}> {
  const start = performance.now();
  const res = await apiRequest(
    `api/notification/announcements/${announcementId}/send`,
    {
      method: 'POST',
    }
  );
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'announcement',
    title: 'Multi-Channel Broadcast Dispatched',
    detail: `Enqueued ${res.totalMessagesEnqueued} alerts to ${res.recipientCount} recipients (Termii + In-App)`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function sendDirectNotification(data: {
  channel: 'sms' | 'whatsapp' | 'in_app';
  recipientType: 'parent' | 'staff' | 'student';
  recipientId: string;
  templateKey: string;
  templateData?: Record<string, any>;
}): Promise<{
  status: string;
  messageId: string;
}> {
  const start = performance.now();
  const res = await apiRequest('api/notification/notify', {
    method: 'POST',
    body: JSON.stringify({
      schoolId: currentSchoolId,
      ...data,
    }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'announcement',
    title: `Direct Alert Sent (${data.channel.toUpperCase()})`,
    detail: `Queued to ${data.recipientType} (${data.recipientId})`,
    status: 'success',
    latencyMs,
  });

  return res;
}

/* ========================================================================== */
/* REAL-TIME CBT EXAMS & GRADING                                              */
/* ========================================================================== */

export async function startCbtSession(
  testId: string,
  studentId: string
): Promise<{
  submissionId: string;
  testId: string;
  title: string;
  durationMinutes: number;
  questions: any[];
  savedAnswers?: Record<string, number>;
  resumed?: boolean;
}> {
  const start = performance.now();
  const res = await apiRequest(`api/academic/cbt/tests/${testId}/start`, {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'cbt',
    title: 'CBT Exam Session Started',
    detail: `Exam: ${res.title} (${res.questions.length} questions loaded)`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function saveCbtAnswer(
  submissionId: string,
  questionId: string,
  selectedOptionIndex: number
): Promise<{
  submissionId: string;
  questionId: string;
  selectedOptionIndex: number;
  savedAnswerCount: number;
}> {
  const start = performance.now();
  const res = await apiRequest(
    `api/academic/cbt/submissions/${submissionId}/answer`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        questionId,
        selectedOptionIndex,
        selectedOption: selectedOptionIndex,
      }),
    }
  );
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'cbt',
    title: 'CBT Answer Synced',
    detail: `Question ${questionId} saved (${res.savedAnswerCount} total answered)`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function submitCbtSession(
  submissionId: string,
  timeTakenSeconds: number
): Promise<{
  submissionId: string;
  testId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: 'completed' | 'auto_submitted';
  submittedAt: string;
}> {
  const start = performance.now();
  const res = await apiRequest(
    `api/academic/cbt/submissions/${submissionId}/submit`,
    {
      method: 'POST',
      body: JSON.stringify({ timeTakenSeconds }),
    }
  );
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'cbt',
    title: 'CBT Exam Server-Graded',
    detail: `Score: ${res.score}/${res.totalPoints} (${res.percentage}%)`,
    status: 'success',
    latencyMs,
  });

  return res;
}

/* ========================================================================== */
/* REAL-TIME STAFF PROVISIONING & POSTGRESQL SYNC                             */
/* ========================================================================== */

export async function fetchSchoolStaff(schoolId?: string): Promise<{
  staff: Array<{
    id: string;
    fullName: string;
    email: string;
    role: 'Subject Teacher' | 'Class Teacher';
    primaryClass?: string;
    assignments: Array<{ id: string; className: string; subject: string }>;
    status: 'Active' | 'Suspended';
  }>;
}> {
  const start = performance.now();
  const query = schoolId ? `?schoolId=${schoolId}` : '';
  const res = await apiRequest(`api/identity/staff${query}`, { method: 'GET' });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'staff',
    title: 'Staff Roster Loaded',
    detail: `Retrieved ${res.staff?.length || 0} active members from Supabase`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function provisionStaffMember(data: {
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  assignments?: any[];
}): Promise<{ staff: any; message: string }> {
  const start = performance.now();
  const res = await apiRequest('api/identity/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'staff',
    title: 'Staff Member Provisioned',
    detail: `Created ${data.fullName} in PostgreSQL & sent Clerk invitation`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function updateStaffStatus(
  staffId: string,
  status: 'active' | 'suspended' | 'deactivated'
): Promise<{ message: string; staff: any }> {
  const start = performance.now();
  const res = await apiRequest(`api/identity/staff/${staffId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'staff',
    title: `Staff Status -> ${status.toUpperCase()}`,
    detail: `Updated membership and assignment flags in PostgreSQL`,
    status: 'success',
    latencyMs,
  });

  return res;
}

/* ========================================================================== */
/* REAL-TIME ACADEMIC SCORES & ATTENDANCE                                      */
/* ========================================================================== */

export async function saveDraftScores(
  classId: string,
  subjectId: string,
  termId: string,
  entries: Array<{
    studentId: string;
    componentScores: Record<string, number>;
    total: number;
  }>
): Promise<{
  message: string;
  count: number;
}> {
  const start = performance.now();
  const res = await apiRequest(
    `api/academic/scores/${classId}/${subjectId}/${termId}`,
    {
      method: 'POST',
      body: JSON.stringify({ entries }),
    }
  );
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'score',
    title: 'Draft Scores Persisted',
    detail: `Saved ${res.count} student grades for ${classId} (${subjectId})`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function submitScores(
  classId: string,
  subjectId: string,
  termId: string
): Promise<{
  message: string;
}> {
  const start = performance.now();
  const res = await apiRequest(
    `api/academic/scores/${classId}/${subjectId}/${termId}/submit`,
    {
      method: 'POST',
    }
  );
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'score',
    title: 'Scores Submitted to Principal',
    detail: `Gradesheets locked and sent for validation: ${classId}`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function saveDailyAttendance(
  classId: string,
  date: string,
  records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' }>
): Promise<{
  message: string;
  markedCount: number;
}> {
  const start = performance.now();
  const res = await apiRequest(`api/academic/attendance/${classId}/${date}`, {
    method: 'POST',
    body: JSON.stringify({ records }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'attendance',
    title: 'Daily Attendance Recorded',
    detail: `Logged ${res.markedCount} students for ${date} in ${classId}`,
    status: 'success',
    latencyMs,
  });

  return res;
}

/* ========================================================================== */
/* REAL-TIME FEES, STRUCTURES & LICENSING                                     */
/* ========================================================================== */

export async function fetchFeeStructures(schoolId: string = currentSchoolId) {
  const start = performance.now();
  const res = await apiRequest(`api/fees/fee-structures/${schoolId}`, {
    method: 'GET',
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'fees',
    title: 'Fee Structures Loaded',
    detail: `Queried institutional schedules from PostgreSQL`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function createFeeStructure(data: {
  feeType: string;
  amount: number | string;
  termId: string;
  classId?: string | null;
  dueDate: string;
  isRecurring?: boolean;
}) {
  const start = performance.now();
  const res = await apiRequest('api/fees/fee-structures', {
    method: 'POST',
    body: JSON.stringify({
      schoolId: currentSchoolId,
      ...data,
    }),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'fees',
    title: 'New Fee Schedule Created',
    detail: `${data.feeType} (₦${data.amount}) registered`,
    status: 'success',
    latencyMs,
  });

  return res;
}

export async function fetchSchoolLicense(schoolId: string = currentSchoolId) {
  return apiRequest(`api/licensing/licenses/${schoolId}`, {
    method: 'GET',
  });
}

export async function provisionSchoolLicense(data: {
  schoolId?: string;
  schoolName: string;
  plan: 'basic' | 'standard' | 'premium';
  contactEmail: string;
  studentCount?: number;
}) {
  const start = performance.now();
  const res = await apiRequest('api/licensing/licenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const latencyMs = Math.round(performance.now() - start);

  emitBackendActivity({
    type: 'licensing',
    title: 'School License Provisioned',
    detail: `${data.schoolName} (${data.plan.toUpperCase()}) 30-day trial activated`,
    status: 'success',
    latencyMs,
  });

  return res;
}
