import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./index";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("🚀 Running ScholeOS database migrations...");
  const migrationsFolder = path.resolve(__dirname, "../../drizzle");

  try {
    await migrate(db, { migrationsFolder });
    console.log("✅ All migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
