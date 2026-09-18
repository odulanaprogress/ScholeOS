import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import { env } from "../config/env";

/**
 * PostgreSQL Connection Client
 * Compatible with Neon, Supabase, AWS RDS, Docker, and local PostgreSQL.
 */
export const client = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === "production" ? 10 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

/**
 * Drizzle ORM Database Instance
 * Fully typed with all tables, enums, and relational schemas.
 */
export const db = drizzle(client, { schema });
export type DB = typeof db;
