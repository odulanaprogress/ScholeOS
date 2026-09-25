import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("🚀 Running ScholeOS database migrations...");
  const migrationsFolder = path.resolve(__dirname, "../../drizzle");

  // Migrations should use session pooler / direct connection with max: 1
  const migrationUrl = env.DIRECT_URL || env.DATABASE_URL;
  const migrationClient = postgres(migrationUrl, { max: 1 });
  const migrationDb = drizzle(migrationClient);

  try {
    await migrate(migrationDb, { migrationsFolder });
    console.log("✅ All migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigrations();
