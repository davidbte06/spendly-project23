import { PieChart } from "lucide-react";

type CategoryRow = {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  total: number;
  percentage: number;
};

type Props = {
  rows: CategoryRow[];
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// A palette of Tailwind bar colors to cycle through
const BAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export default function CategoryBreakdown({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
        <p className="text-3xl">📊</p>
        <p className="mt-3 text-sm font-medium text-gray-500">
          No expense data for this period
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Add some expense transactions to see the breakdown
        </p>
      </div>
    );
  }

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-50 px-6 py-4">
        <PieChart size={16} className="text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900">
          Spending by Category
        </h3>
        <span className="ml-auto text-sm font-semibold text-gray-600">
          {fmt(grandTotal)} total
        </span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-gray-50 px-6">
        {rows.map((row, i) => (
          <li key={row.categoryId} className="py-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{row.categoryIcon}</span>
                <span className="text-sm font-medium text-gray-800">
                  {row.categoryName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  {fmt(row.total)}
                </span>
                <span className="w-10 text-right text-xs font-medium text-gray-400">
                  {row.percentage}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-500`}
                style={{ width: `${row.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
