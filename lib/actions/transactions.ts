"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TransactionFilters = {
  type?: "income" | "expense";
  categoryId?: string;
  search?: string;
};

/** Returns all transactions for the current user, with optional filters */
export async function getTransactions(filters: TransactionFilters = {}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.search
        ? {
            description: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });
}

/** Returns the 5 most recent transactions for the dashboard widget */
export async function getRecentTransactions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { date: "desc" },
    take: 5,
  });
}

/** Calculates summary metrics for the dashboard */
export async function getDashboardSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    return { totalIncome: 0, totalExpenses: 0, balance: 0, savings: 0 };
  }

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: session.user.id, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: session.user.id, type: "expense" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount ?? 0;
  const totalExpenses = expenseResult._sum.amount ?? 0;
  const balance = totalIncome - totalExpenses;
  const savings = balance > 0 ? balance : 0;

  return { totalIncome, totalExpenses, balance, savings };
}

/** Creates a new transaction for the current user */
export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string)?.trim();
  const date = new Date(formData.get("date") as string);
  const categoryId = formData.get("categoryId") as string;

  if (!amount || !type || !description || !date || !categoryId) {
    throw new Error("All fields are required.");
  }
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }
  if (!["income", "expense"].includes(type)) {
    throw new Error("Invalid transaction type.");
  }

  // Validate category belongs to user or is global
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ userId: null }, { userId: session.user.id }],
    },
  });
  if (!category) throw new Error("Invalid category.");

  await prisma.transaction.create({
    data: {
      amount,
      type,
      description,
      date,
      userId: session.user.id,
      categoryId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

/** Updates an existing transaction */
export async function updateTransaction(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Ensure the transaction belongs to this user
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Transaction not found.");

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string)?.trim();
  const date = new Date(formData.get("date") as string);
  const categoryId = formData.get("categoryId") as string;

  if (!amount || !type || !description || !date || !categoryId) {
    throw new Error("All fields are required.");
  }
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  // Validate category
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ userId: null }, { userId: session.user.id }],
    },
  });
  if (!category) throw new Error("Invalid category.");

  await prisma.transaction.update({
    where: { id },
    data: { amount, type, description, date, categoryId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

/** Deletes a transaction */
export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!transaction) throw new Error("Transaction not found.");

  await prisma.transaction.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}
