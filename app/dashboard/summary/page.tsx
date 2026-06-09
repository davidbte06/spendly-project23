"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import MonthlySummary from "@/components/dashboard/MonthlySummary";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import ExportButton from "@/components/dashboard/ExportButton";
import { getMonthlySummary, getCategoryBreakdown } from "@/lib/actions/summary";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type SummaryData = { totalIncome: number; totalExpenses: number; balance: number; month: number; year: number };
type BreakdownRow = { categoryId: string; categoryName: string; categoryIcon: string | null; total: number; percentage: number };

export default function SummaryPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());

  const [summary,   setSummary]   = useState<SummaryData | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownRow[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const [s, b] = await Promise.all([
        getMonthlySummary(month, year),
        getCategoryBreakdown(month, year),
      ]);
      setSummary(s);
      setBreakdown(b);
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
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Financial Summary
            </h1>
            <p className="text-sm text-gray-400">
              Analyze your income, expenses and spending habits
            </p>
          </div>
        </div>
 
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Export */}
          <ExportButton />
 
          {/* Month navigation */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[120px] text-center text-sm font-semibold text-gray-800">
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
      </div>
 
      {/* Content */}
      {isPending && !summary ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span className="ml-3 text-sm">Loading summary...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Monthly totals */}
          {summary && (
            <MonthlySummary
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              balance={summary.balance}
              month={month}
              year={year}
            />
          )}
 
          {/* Category breakdown */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Expense Breakdown by Category
            </h2>
            <CategoryBreakdown rows={breakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
