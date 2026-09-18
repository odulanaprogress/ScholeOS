/**
 * Notification Service Types (Wave 6)
 */

export type NotificationChannel = "sms" | "whatsapp" | "in_app";
export type NotificationRecipientType = "parent" | "staff" | "student";
export type NotificationStatus = "queued" | "sent" | "failed";

export type NotificationTemplateKey =
  | "absence_alert"
  | "payment_confirmation"
  | "payment_rejected"
  | "arrears_reminder"
  | "submission_reminder"
  | "announcement";

export interface NotificationQueueMessage {
  schoolId: string;
  channel: NotificationChannel;
  recipientType: NotificationRecipientType;
  recipientId: string;
  templateKey: NotificationTemplateKey;
  templateData: Record<string, any>;
  messageId?: string;
  timestamp?: string;
}

export interface NotifyRequestDTO {
  schoolId: string;
  channel: NotificationChannel;
  recipientType: NotificationRecipientType;
  recipientId: string;
  templateKey: NotificationTemplateKey;
  templateData: Record<string, any>;
}

export interface SendAnnouncementDTO {
  announcementId: string;
}
