import { Webhook } from "svix";
import { env } from "../config/env";
import { db } from "../db/index";
import { webhookLog } from "../db/schema/webhooks";
import { eq } from "drizzle-orm";

export interface ClerkWebhookHeaders {
  "svix-id": string;
  "svix-timestamp": string;
  "svix-signature": string;
}

export interface ClerkWebhookEvent {
  data: Record<string, any>;
  object: "event";
  type:
    | "user.created"
    | "user.updated"
    | "user.deleted"
    | "organization.created"
    | "organization.updated"
    | "organization.deleted"
    | "organizationMembership.created"
    | "organizationMembership.updated"
    | "organizationMembership.deleted";
}

/**
 * Verify Clerk Webhook Signature using Svix
 */
export function verifyClerkWebhook(
  payload: string | Buffer,
  headers: Record<string, string | string[] | undefined>,
  secretOverride?: string
): ClerkWebhookEvent {
  const svixId = headers["svix-id"] as string;
  const svixTimestamp = headers["svix-timestamp"] as string;
  const svixSignature = headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing required Svix verification headers");
  }

  const signingSecret = secretOverride || process.env.CLERK_WEBHOOK_SIGNING_SECRET || env.CLERK_WEBHOOK_SIGNING_SECRET;
  const wh = new Webhook(signingSecret);
  const verified = wh.verify(payload, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  }) as ClerkWebhookEvent;

  return verified;
}

/**
 * Record and guard webhook event against duplicate processing (Idempotency)
 */
export async function recordWebhookIdempotency(params: {
  provider: "clerk" | "paystack" | "flutterwave";
  eventId: string;
  payload: Record<string, any>;
}): Promise<boolean> {
  try {
    // Check if event already processed
    const existing = await db
      .select({ id: webhookLog.id })
      .from(webhookLog)
      .where(eq(webhookLog.eventId, params.eventId))
      .limit(1);

    if (existing.length > 0) {
      console.warn(`[Webhook] Duplicate event ignored: ${params.eventId}`);
      return false; // already processed
    }

    // Insert to log
    await db.insert(webhookLog).values({
      provider: params.provider,
      eventId: params.eventId,
      payload: params.payload,
    });

    return true; // proceed with handling
  } catch (error) {
    console.error("[Webhook] Idempotency record error:", error);
    // If a race condition caused a unique constraint violation, treat as duplicate
    return false;
  }
}
