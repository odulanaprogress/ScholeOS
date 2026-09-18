/**
 * Termii Notification Provider Implementation (Wave 6)
 *
 * Implements NotificationProvider for Termii (Nigeria SMS & WhatsApp).
 * Connects to Termii API when credentials are provided, with mock test fallback.
 */

import type { NotificationProvider, SendMessageParams, SendMessageResult } from "./provider.interface";
import { env } from "../../../config/env";

export class TermiiProvider implements NotificationProvider {
  name = "termii";

  private apiKey: string;
  private senderId: string;

  constructor() {
    this.apiKey = env.TERMII_API_KEY || "termii_test_api_key";
    this.senderId = env.TERMII_SENDER_ID || "ScholeOS";
  }

  /**
   * Normalizes Nigerian phone numbers to 234 format (e.g. 08012345678 -> 2348012345678)
   */
  private formatPhoneNumber(raw: string): string {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.startsWith("234") && cleaned.length === 13) {
      return cleaned;
    }
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      return "234" + cleaned.substring(1);
    }
    return cleaned;
  }

  async send(params: SendMessageParams): Promise<SendMessageResult> {
    const formattedTo = this.formatPhoneNumber(params.to);

    // In test or development mode with placeholder credentials
    if (
      process.env.NODE_ENV === "test" ||
      env.NODE_ENV === "test" ||
      this.apiKey.includes("test")
    ) {
      const mockRef = `termii_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      console.log(
        `[Termii Provider] (Test Mode) Sent ${params.channel} to ${formattedTo}: "${params.message}" (Ref: ${mockRef})`
      );
      return {
        success: true,
        providerRef: mockRef,
        costUnits: params.channel === "whatsapp" ? 2 : 1,
      };
    }

    try {
      const endpoint =
        params.channel === "whatsapp"
          ? "https://api.ng.termii.com/api/whatsapp/send"
          : "https://api.ng.termii.com/api/sms/send";

      const payload = {
        to: formattedTo,
        from: this.senderId,
        sms: params.message,
        type: "plain",
        channel: params.channel === "whatsapp" ? "whatsapp" : "generic",
        api_key: this.apiKey,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Termii API error (${res.status}): ${errorText}`,
        };
      }

      const data = (await res.json()) as { message_id?: string; message?: string };
      return {
        success: true,
        providerRef: data.message_id || `termii_${Date.now()}`,
        costUnits: 1,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Termii request failed";
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}
