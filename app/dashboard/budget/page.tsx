"use client";
 
import { useEffect, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import BudgetForm from "@/components/dashboard/BudgetForm";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { getBudget } from "@/lib/actions/budget";
import { getMonthlySummary } from "@/lib/actions/summary";
 
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
 
export default function BudgetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
 
  const [budgetAmount, setBudgetAmount] = useState<number | undefined>(undefined);
  const [spentAmount, setSpentAmount] = useState(0);
  const [isPending, startTransition] = useTransition();
 
  const loadData = () => {
    startTransition(async () => {
      const [budget, summary] = await Promise.all([
        getBudget(month, year),
        getMonthlySummary(month, year),
      ]);
      setBudgetAmount(budget?.amount ?? undefined);
      setSpentAmount(summary.totalExpenses);
    });
  };
 
  useEffect(() => { loadData(); }, [month, year]);
 
  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
 
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };
 
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Budget
            </h1>
            <p className="text-sm text-gray-400">
              Set and track your monthly spending limit
            </p>
          </div>
        </div>
 
        {/* Month navigation */}
        <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm sm:self-auto">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[130px] text-center text-sm font-semibold text-gray-800">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
 
      {/* Loading */}
      {isPending ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="ml-3 text-sm">Loading budget data...</span>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Progress — only shown if budget is set */}
          {budgetAmount !== undefined ? (
            <BudgetProgress
              budgetAmount={budgetAmount}
              spentAmount={spentAmount}
              month={month}
              year={year}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
              <p className="text-4xl">💰</p>
              <p className="mt-3 text-sm font-semibold text-gray-600">
                No budget set for {MONTHS[month - 1]} {year}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Use the form to define your monthly spending limit
              </p>
            </div>
          )}
 
          {/* Form */}
          <BudgetForm
            month={month}
            year={year}
            currentAmount={budgetAmount}
            onSuccess={loadData}
          />
        </div>
      )}
    </div>
  );
}
 