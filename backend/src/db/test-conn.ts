import { client } from "./index";

async function testConnection() {
  console.log("🔌 Testing database connection...");
  try {
    const result = await client`SELECT version(), NOW() as current_time;`;
    console.log("✅ Successfully connected to database!");
    console.log("📊 PostgreSQL Version:", result[0].version);
    console.log("⏰ Server Time:", result[0].current_time);

    const tables = await client`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`;
    console.log(`📋 Total ${tables.length} tables in public schema.`);

    const [schoolCount] = await client`SELECT count(*)::int as count FROM schools;`;
    const [staffCount] = await client`SELECT count(*)::int as count FROM staff;`;
    const [studentCount] = await client`SELECT count(*)::int as count FROM students;`;
    const [classCount] = await client`SELECT count(*)::int as count FROM classes;`;
    const [invoiceCount] = await client`SELECT count(*)::int as count FROM invoices;`;

    console.log("📊 Live Seeded Data Verification:");
    console.log(`  • Schools     : ${schoolCount.count}`);
    console.log(`  • Staff       : ${staffCount.count}`);
    console.log(`  • Students    : ${studentCount.count}`);
    console.log(`  • Classes     : ${classCount.count}`);
    console.log(`  • Invoices    : ${invoiceCount.count}`);
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  } finally {
    await client.end();
  }
}

testConnection();
