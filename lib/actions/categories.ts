"use server";
 
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
/** Returns global categories (userId = null) plus user-specific ones */
export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  return prisma.category.findMany({
    where: {
      OR: [{ userId: null }, { userId: session.user.id }],
    },
    orderBy: [{ userId: "asc" }, { name: "asc" }],
  });
}
 
/** Returns categories filtered by type */
export async function getCategoriesByType(type: "income" | "expense") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  return prisma.category.findMany({
    where: {
      type,
      OR: [{ userId: null }, { userId: session.user.id }],
    },
    orderBy: [{ userId: "asc" }, { name: "asc" }],
  });
}
 
/** Creates a custom category for the logged-in user */
export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const icon = (formData.get("icon") as string) || "📦";
 
  if (!name || !type) throw new Error("Name and type are required.");
  if (!["income", "expense"].includes(type)) throw new Error("Invalid type.");
 
  // Check for duplicate (same user, same name)
  const existing = await prisma.category.findFirst({
    where: { name, userId: session.user.id },
  });
  if (existing) throw new Error("You already have a category with that name.");
 
  await prisma.category.create({
    data: { name, type, icon, userId: session.user.id },
  });
 
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");
}
 
/** Deletes a user's custom category (cannot delete global ones) */
export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
 
  const category = await prisma.category.findFirst({
    where: { id, userId: session.user.id },
  });
 
  if (!category) {
    throw new Error("Category not found or you don't have permission to delete it.");
  }
 
  // Check if any transaction uses this category
  const inUse = await prisma.transaction.count({ where: { categoryId: id } });
  if (inUse > 0) {
    throw new Error(
      "Cannot delete this category because it has associated transactions."
    );
  }
 
  await prisma.category.delete({ where: { id } });
 
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");
}