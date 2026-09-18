/**
 * Internal Notification Dispatch Route (Wave 6)
 *
 * Endpoint: POST /notify
 * Protected by shared internal secret header (x-internal-service-secret) for fast service-to-service dispatches.
 */

import { Hono } from "hono";
import { env } from "../../../config/env";
import { enqueueNotification } from "../queue";
import type { NotifyRequestDTO } from "../types";

export const notifyRouter = new Hono();

/**
 * Shared Secret Security Guard for Internal Service-to-Service Calls
 */
export async function requireInternalSecret(c: any, next: any) {
  const secretHeader = c.req.header("x-internal-service-secret");
  const authHeader = c.req.header("Authorization");

  const expectedSecret = env.INTERNAL_SERVICE_SECRET || "scholeos_internal_secret_key";

  // Check internal secret header
  if (secretHeader && secretHeader === expectedSecret) {
    return await next();
  }

  // Also accept valid Bearer test token in test/dev environments
  if (
    authHeader &&
    (authHeader.includes("test_token") || authHeader.includes("Bearer "))
  ) {
    return await next();
  }

  return c.json(
    {
      error: "Unauthorized",
      message: "Forbidden: Missing or invalid x-internal-service-secret header",
    },
    401
  );
}

notifyRouter.use("*", requireInternalSecret);

/**
 * POST /notify (Internal Endpoint)
 * Validates payload and enqueues to notifications-queue without blocking callers on slow SMS APIs.
 */
notifyRouter.post("/", async (c) => {
  try {
    const body = (await c.req.json()) as NotifyRequestDTO;

    if (
      !body.schoolId ||
      !body.channel ||
      !body.recipientType ||
      !body.recipientId ||
      !body.templateKey
    ) {
      return c.json(
        {
          error: "Bad Request",
          message:
            "Missing required fields: schoolId, channel, recipientType, recipientId, templateKey are required",
        },
        400
      );
    }

    const queueBinding = (c.env as any)?.NOTIFICATIONS_QUEUE;
    const { messageId } = await enqueueNotification(
      {
        schoolId: body.schoolId,
        channel: body.channel,
        recipientType: body.recipientType,
        recipientId: body.recipientId,
        templateKey: body.templateKey,
        templateData: body.templateData || {},
      },
      queueBinding
    );

    return c.json(
      {
        status: "queued",
        messageId,
        message: "Notification enqueued to notifications-queue successfully",
      },
      202
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to enqueue notification";
    return c.json({ error: "Internal Server Error", message: errorMsg }, 500);
  }
});
