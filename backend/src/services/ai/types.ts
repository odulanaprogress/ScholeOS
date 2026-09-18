/**
 * AI Service Types (Wave 9)
 *
 * Types and DTOs for Admin Copilot Chat, Report Card Qualitative Comment Generator,
 * and Student Socratic AI Tutor.
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AdminChatRequestDTO {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface AdminChatResponseDTO {
  response: string;
  toolsUsed: string[];
  tokensUsed: number;
  model: string;
}

export interface ReportCardCommentRequestDTO {
  studentId: string;
  termId: string;
  customPrompt?: string;
}

export interface ReportCardCommentResponseDTO {
  studentId: string;
  studentName: string;
  draftComment: string;
  subjectHighlights: string[];
  average: number;
  attendanceRate: string;
  tokensUsed: number;
  editable: boolean;
}

export interface StudentTutorRequestDTO {
  message: string;
  subject: string;
  conversationHistory?: ChatMessage[];
}

export interface StudentTutorResponseDTO {
  response: string;
  subject: string;
  socratic: boolean;
  tokensUsed: number;
}

export interface AiToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AiToolResult {
  toolName: string;
  result: Record<string, any>;
}

export interface UsageRecord {
  schoolId: string;
  userId?: string;
  endpoint: "admin_chat" | "report_card_comment" | "student_tutor";
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: string;
}
