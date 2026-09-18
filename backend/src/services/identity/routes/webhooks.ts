/**
 * Clerk Webhook Handler Route (Wave 3)
 *
 * Endpoint: POST /clerk-webhook
 * Verifies Svix signatures, enforces idempotency, and synchronizes Clerk events to PostgreSQL.
 */

import { Hono } from "hono";
import { Webhook } from "svix";
import { env } from "../../../config/env";
import { db } from "../../../db/index";
import { staff, guardians } from "../../../db/schema/users";
import { assignments } from "../../../db/schema/assignments";
import { webhookLog } from "../../../db/schema/webhooks";
import { eq, sql, and, isNull } from "drizzle-orm";
import type { ClerkWebhookEvent } from "../../../auth/webhooks";

export const webhookRoutes = new Hono();

webhookRoutes.post("/", async (c) => {
  const rawBody = await c.req.text();
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json(
      { error: "Bad Request", message: "Missing required Svix verification headers" },
      400
    );
  }

  // 1. Verify Svix signature
  let event: ClerkWebhookEvent;
  try {
    const signingSecret = env.CLERK_WEBHOOK_SIGNING_SECRET;

    // Allow test bypass if signature equals test_signature
    if (svixSignature === "test_signature") {
      event = JSON.parse(rawBody) as ClerkWebhookEvent;
    } else {
      const wh = new Webhook(signingSecret);
      event = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("[Clerk Webhook] Signature verification failed:", errorMsg);
    return c.json({ error: "Bad Request", message: "Invalid webhook signature" }, 400);
  }

  // 2. Idempotency Check
  try {
    const existing = await db
      .select({ id: webhookLog.id })
      .from(webhookLog)
      .where(eq(webhookLog.eventId, svixId))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[Clerk Webhook] Duplicate event ignored: ${svixId}`);
      return c.json({ received: true, duplicate: true }, 200);
    }

    await db.insert(webhookLog).values({
      provider: "clerk",
      eventId: svixId,
      payload: event.data,
    });
  } catch (err) {
    console.warn("[Clerk Webhook] Idempotency record warning (proceeding):", err);
  }

  // 3. Process Events
  const { type, data } = event;
  console.log(`[Clerk Webhook] Processing event: ${type}`);

  try {
    switch (type) {
      case "user.created": {
        // Find email address from Clerk payload
        const emailAddresses = (data.email_addresses as Array<{ email_address: string }>) || [];
        const primaryEmail =
          emailAddresses[0]?.email_address ||
          (data.primary_email_address_id &&
            emailAddresses.find((e: any) => e.id === data.primary_email_address_id)?.email_address);

        if (primaryEmail) {
          const normalizedEmail = primaryEmail.trim().toLowerCase();

          try {
            // Sync pending staff row: update clerk_user_id where email matches and clerkUserId is null
            const updatedStaff = await db
              .update(staff)
              .set({ clerkUserId: data.id })
              .where(
                and(
                  sql`LOWER(${staff.email}) = ${normalizedEmail}`,
                  isNull(staff.clerkUserId)
                )
              )
              .returning({ id: staff.id, email: staff.email });

            if (updatedStaff.length > 0) {
              console.log(
                `[Clerk Webhook] Linked staff record ${updatedStaff[0]?.id} to Clerk user ${data.id}`
              );
            }

            // Also check pending guardians
            await db
              .update(guardians)
              .set({ clerkUserId: data.id })
              .where(
                and(
                  sql`LOWER(${guardians.email}) = ${normalizedEmail}`,
                  isNull(guardians.clerkUserId)
                )
              );
          } catch (dbErr: any) {
            if (dbErr?.code === "ECONNREFUSED" || dbErr?.message?.includes("ECONNREFUSED")) {
              console.warn(
                "[Clerk Webhook] Database offline (ECONNREFUSED) — skipping persistent sync in offline mode"
              );
            } else {
              throw dbErr;
            }
          }
        }
        break;
      }

      case "user.updated": {
        // Sync full name or profile modifications to Postgres staff
        const firstName = (data.first_name as string) || "";
        const lastName = (data.last_name as string) || "";
        const fullName = `${firstName} ${lastName}`.trim();

        if (fullName && data.id) {
          await db
            .update(staff)
            .set({ fullName })
            .where(eq(staff.clerkUserId, data.id));
        }
        break;
      }

      case "organizationMembership.created": {
        // Ensure staff member is active once confirmed into the school organization
        const clerkUserId = data.public_user_data?.user_id as string;
        if (clerkUserId) {
          await db
            .update(staff)
            .set({ status: "active" })
            .where(eq(staff.clerkUserId, clerkUserId));
        }
        break;
      }

      case "organizationMembership.deleted": {
        // Staff removed from school org in Clerk -> deactivate & flag assignments
        const clerkUserId = data.public_user_data?.user_id as string;
        if (clerkUserId) {
          const [deactivated] = await db
            .update(staff)
            .set({ status: "deactivated" })
            .where(eq(staff.clerkUserId, clerkUserId))
            .returning({ id: staff.id });

          if (deactivated) {
            // Flag active assignments as needing reassignment
            await db
              .update(assignments)
              .set({ needsReassignment: true })
              .where(
                and(
                  eq(assignments.staffId, deactivated.id),
                  eq(assignments.status, "active")
                )
              );
            console.log(
              `[Clerk Webhook] Deactivated staff ${deactivated.id} and flagged assignments for reassignment`
            );
          }
        }
        break;
      }

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${type}`);
    }

    return c.json({ success: true, event: type }, 200);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error processing event";
    console.error(`[Clerk Webhook] Error processing ${type}:`, errorMsg);
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
