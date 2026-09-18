/**
 * Notification Provider Interface (Wave 6)
 *
 * Pluggable provider contract allowing seamless substitution of SMS/WhatsApp providers
 * (e.g. swapping Termii for Africa's Talking) without changing core worker logic.
 */

import type { NotificationChannel } from "../types";

export interface SendMessageParams {
  to: string; // Phone number e.g. +2348012345678 or 08012345678
  message: string;
  channel: NotificationChannel;
  schoolName?: string;
}

export interface SendMessageResult {
  success: boolean;
  providerRef?: string;
  error?: string;
  costUnits?: number;
}

export interface NotificationProvider {
  name: string;
  send(params: SendMessageParams): Promise<SendMessageResult>;
}
