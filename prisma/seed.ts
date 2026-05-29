import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Load .env manually when run via tsx outside of Next.js
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

const connectionString =
  process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No database connection string found in environment variables.");
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? true : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  // --- Expenses ---
  { name: "Food", type: "expense", icon: "🍔" },
  { name: "Transport", type: "expense", icon: "🚌" },
  { name: "Bills", type: "expense", icon: "📄" },
  { name: "Entertainment", type: "expense", icon: "🎬" },
  { name: "Health", type: "expense", icon: "🏥" },
  { name: "Shopping", type: "expense", icon: "🛍️" },
  { name: "Education", type: "expense", icon: "📚" },
  { name: "Home", type: "expense", icon: "🏠" },
  { name: "Other expenses", type: "expense", icon: "💸" },
  // --- Income ---
  { name: "Salary", type: "income", icon: "💼" },
  { name: "Investments", type: "income", icon: "📈" },
  { name: "Freelance", type: "income", icon: "💻" },
  { name: "Gift", type: "income", icon: "🎁" },
  { name: "Other income", type: "income", icon: "💰" },
];

async function main() {
  console.log("🌱 Starting database seed...");


  console.log("Cleaning up existing default categories...");
  await prisma.category.deleteMany({
    where: { userId: null },
  });

  for (const cat of defaultCategories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        userId: null,
      },
    });
    console.log(`  ✅ Created: ${cat.icon} ${cat.name}`);
  }

  console.log("\n✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
