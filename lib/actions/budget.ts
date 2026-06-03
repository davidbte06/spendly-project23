"use server";
 
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
/** Returns the budget for the given month/year, or null if not set */
export async function getBudget(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  return prisma.budget.findFirst({
    where: { userId: session.user.id, month, year },
  });
}
 
/**
 * Creates or updates (upsert) the monthly budget for the current user.
 * FormData fields: amount (number), month (1-12), year (YYYY)
 */
export async function setBudget(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  const amount = parseFloat(formData.get("amount") as string);
  const month = parseInt(formData.get("month") as string, 10);
  const year = parseInt(formData.get("year") as string, 10);
 
  if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a positive number.");
  if (month < 1 || month > 12) throw new Error("Invalid month.");
  if (year < 2000 || year > 2100) throw new Error("Invalid year.");
 
  const existing = await prisma.budget.findFirst({
    where: { userId: session.user.id, month, year },
  });
 
  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { amount },
    });
  } else {
    await prisma.budget.create({
      data: { amount, month, year, userId: session.user.id },
    });
  }
 
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard");
}