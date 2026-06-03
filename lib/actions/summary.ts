"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Returns income total, expense total, and net balance
 * for the given month and year for the logged-in user.
 */
export async function getMonthlySummary(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Build date range for the month
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "income",
        date: { gte: start, lt: end },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "expense",
        date: { gte: start, lt: end },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount ?? 0;
  const totalExpenses = expenseResult._sum.amount ?? 0;
  const balance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balance, month, year };
}

/**
 * Returns expense totals grouped by category for the given month/year.
 * Each entry has: categoryId, categoryName, categoryIcon, total, percentage.
 */
export async function getCategoryBreakdown(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  // Fetch all expense transactions for the month with category info
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      type: "expense",
      date: { gte: start, lt: end },
    },
    include: { category: true },
  });

  // Group by category
  const map = new Map<
    string,
    { categoryId: string; categoryName: string; categoryIcon: string | null; total: number }
  >();

  for (const tx of transactions) {
    const key = tx.categoryId;
    const existing = map.get(key);
    if (existing) {
      existing.total += tx.amount;
    } else {
      map.set(key, {
        categoryId: tx.categoryId,
        categoryName: tx.category.name,
        categoryIcon: tx.category.icon,
        total: tx.amount,
      });
    }
  }

  const rows = Array.from(map.values()).sort((a, b) => b.total - a.total);
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return rows.map((r) => ({
    ...r,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0,
  }));
}

/**
 * Returns all transactions for the user (for CSV export).
 * Ordered by date descending.
 */
export async function getAllTransactionsForExport() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { date: "desc" },
  });
}
