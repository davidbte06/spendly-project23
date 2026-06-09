"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  userId: string | null;
};

const EMOJI_OPTIONS = [
  "📦", "🏷️", "🎯", "⚡", "🌟", "💡", "🔧", "🎨",
  "🍕", "☕", "🐾", "📱", "🎮", "✈️", "🏋️", "🌿",
];

type Props = {
  categories: Category[];
  onRefresh: () => void;
};

export default function CategoryManager({ categories, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedIcon, setSelectedIcon] = useState("📦");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const globalCategories = categories.filter((c) => c.userId === null);
  const userCategories = categories.filter((c) => c.userId !== null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("icon", selectedIcon);

    startTransition(async () => {
      try {
        await createCategory(formData);
        setShowForm(false);
        setSelectedIcon("📦");
        (e.target as HTMLFormElement).reset();
        onRefresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to create category.");
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setError("");
    startTransition(async () => {
      try {
        await deleteCategory(id);
        onRefresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to delete category.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Tag size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              My Categories
            </h2>
            <p className="text-xs text-gray-400">
              {userCategories.length} custom{" "}
              {userCategories.length !== 1 ? "categories" : "category"}
            </p>
          </div>
        </div>
        <button
          id="add-category-btn"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          <Plus size={15} />
          New Category
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Create a custom category
          </h3>
          {error && (
            <div className="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`rounded-lg py-2 text-sm font-medium transition ${type === "expense"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500"
                  }`}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`rounded-lg py-2 text-sm font-medium transition ${type === "income"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500"
                  }`}
              >
                💰 Income
              </button>
            </div>
            <input type="hidden" name="type" value={type} />

            {/* Name */}
            <input
              type="text"
              name="name"
              required
              placeholder="Category name"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />

            {/* Icon picker */}
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">
                Select an icon
              </p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`h-9 w-9 rounded-xl text-lg transition ${selectedIcon === emoji
                        ? "bg-emerald-100 ring-2 ring-emerald-400"
                        : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Selected icon: {selectedIcon}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {isPending ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Default categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Default categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {globalCategories.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${cat.type === "income"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          My custom categories
        </h3>
        {userCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-10 text-center">
            <p className="text-2xl">🏷️</p>
            <p className="mt-2 text-sm font-medium text-gray-500">
              No custom categories yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Create one to better organize your finances
            </p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {userCategories.map((cat) => (
              <div
                key={cat.id}
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:border-gray-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {cat.name}
                    </p>
                    <p
                      className={`text-xs font-medium ${cat.type === "income"
                          ? "text-emerald-500"
                          : "text-red-400"
                        }`}
                    >
                      {cat.type === "income" ? "Income" : "Expense"}
                    </p>
                  </div>
                </div>
                <button
                  id={`delete-cat-${cat.id}`}
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  title="Delete category"
                  className="rounded-lg p-2 text-gray-300 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

