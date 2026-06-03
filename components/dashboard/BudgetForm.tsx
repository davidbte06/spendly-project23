"use client";
 
import { useState, useTransition } from "react";
import { Target, Check } from "lucide-react";
import { setBudget } from "@/lib/actions/budget";
 
type Props = {
  month: number;
  year: number;
  currentAmount?: number;
  onSuccess: () => void;
};
 
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
 
export default function BudgetForm({ month, year, currentAmount, onSuccess }: Props) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
 
    startTransition(async () => {
      try {
        await setBudget(formData);
        setSuccess(true);
        onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to save budget.");
      }
    });
  };
 
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Target size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {currentAmount ? "Update Budget" : "Set Budget"}
          </h2>
          <p className="text-xs text-gray-400">
            {MONTHS[month - 1]} {year}
          </p>
        </div>
      </div>
 
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={15} />
          Budget saved successfully!
        </div>
      )}
 
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden month/year */}
        <input type="hidden" name="month" value={month} />
        <input type="hidden" name="year" value={year} />
 
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Monthly spending limit
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
              $
            </span>
            <input
              id="budget-amount"
              type="number"
              name="amount"
              required
              step="0.01"
              min="1"
              defaultValue={currentAmount}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
 
        <button
          id="save-budget-btn"
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Saving..." : currentAmount ? "Update Budget" : "Set Budget"}
        </button>
      </form>
    </div>
  );
}