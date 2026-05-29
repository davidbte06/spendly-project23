"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Plus, Save } from "lucide-react";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";

type Category = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  categoryId: string;
};

type Props = {
  categories: Category[];
  transaction?: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TransactionForm({
  categories,
  transaction,
  onClose,
  onSuccess,
}: Props) {
  const isEditing = !!transaction;
  const [type, setType] = useState<"income" | "expense">(
    (transaction?.type as "income" | "expense") ?? "expense"
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (isEditing && transaction) {
          await updateTransaction(transaction.id, data);
        } else {
          await createTransaction(data);
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    });
  };

  const defaultDate = transaction
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-2xl bg-white shadow-2xl border border-gray-100 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              {isEditing ? <Save size={16} /> : <Plus size={16} />}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Transaction" : "New Transaction"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`rounded-lg py-2 text-sm font-medium transition ${type === "expense"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`rounded-lg py-2 text-sm font-medium transition ${type === "income"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                💰 Income
              </button>
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                $
              </span>
              <input
                type="number"
                name="amount"
                required
                step="0.01"
                min="0.01"
                defaultValue={transaction?.amount}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              defaultValue={transaction?.description}
              placeholder="e.g. Lunch at restaurant"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              required
              defaultValue={transaction?.categoryId ?? ""}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            >
              <option value="" disabled>
                Select a category
              </option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              defaultValue={defaultDate}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
