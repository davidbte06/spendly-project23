"use client";
 
import { useEffect, useState, useTransition } from "react";
import CategoryManager from "@/components/dashboard/CategoryManager";
import { getCategories } from "@/lib/actions/categories";
 
type Category = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  userId: string | null;
};
 
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
 
  const loadCategories = () => {
    startTransition(async () => {
      const cats = await getCategories();
      setCategories(cats as unknown as Category[]);
    });
  };
 
  useEffect(() => {
    loadCategories();
  }, []);
 
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage how you organize your income and expenses
        </p>
      </div>
 
      {/* Content */}
      {isPending && categories.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="ml-3 text-sm">Loading categories...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <CategoryManager
            categories={categories}
            onRefresh={loadCategories}
          />
        </div>
      )}
    </div>
  );
}
 
 