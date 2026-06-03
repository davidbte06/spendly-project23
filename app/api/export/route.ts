import { auth } from "@/auth";
import prisma from "@/lib/prisma";
 
export async function GET() {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
 
  // 2. Fetch all user transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { date: "desc" },
  });
 
  // 3. Build CSV string
  const header = ["Date", "Type", "Category", "Description", "Amount"].join(",");
 
  const rows = transactions.map((tx) => {
    const date = new Date(tx.date).toISOString().split("T")[0]; // YYYY-MM-DD
    const type = tx.type;
    const category = `"${tx.category.name.replace(/"/g, '""')}"`;
    const description = `"${tx.description.replace(/"/g, '""')}"`;
    const amount = tx.type === "expense" ? -tx.amount : tx.amount;
    return [date, type, category, description, amount].join(",");
  });
 
  const csv = [header, ...rows].join("\n");
 
  // 4. Return as downloadable file
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="spendly-transactions-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}