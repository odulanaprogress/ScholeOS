import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_SECRET_KEY: z.string().default("sk_test_placeholder_key"),
  CLERK_PUBLISHABLE_KEY: z.string().default("pk_test_placeholder_key"),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().default("whsec_placeholder_secret"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FIREBASE_PROJECT_ID: z.string().default("scholesos"),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_KEY: z.string().optional(),
  // Wave 5: Fees Service
  PAYSTACK_SECRET_KEY: z.string().default("sk_test_paystack_placeholder"),
  FLUTTERWAVE_SECRET_HASH: z.string().default("flw_secret_hash_placeholder"),
  CLOUDINARY_CLOUD_NAME: z.string().default("scholesos"),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // Wave 6: Notification Service
  TERMII_API_KEY: z.string().default("termii_test_api_key"),
  TERMII_SENDER_ID: z.string().default("ScholeOS"),
  INTERNAL_SERVICE_SECRET: z.string().default("scholeos_internal_secret_key"),
  // Wave 9: AI Service
  ANTHROPIC_API_KEY: z.string().default("sk-ant-placeholder-test-key"),
  ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
