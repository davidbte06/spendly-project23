import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
 
type Props = {
  budgetAmount: number;
  spentAmount: number;
  month: number;
  year: number;
};
 
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
 
const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
 
export default function BudgetProgress({ budgetAmount, spentAmount, month, year }: Props) {
  const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
  const isOver     = spentAmount > budgetAmount;
  const isWarning  = !isOver && percentage >= 75;
  const remaining  = budgetAmount - spentAmount;
 
  const barColor = isOver
    ? "bg-red-500"
    : isWarning
    ? "bg-amber-400"
    : "bg-emerald-500";
 
  const StatusIcon = isOver ? AlertTriangle : isWarning ? AlertTriangle : CheckCircle;
  const statusColor = isOver
    ? "text-red-600"
    : isWarning
    ? "text-amber-600"
    : "text-emerald-600";
 
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown size={18} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">
            Budget — {MONTHS[month - 1]} {year}
          </h2>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${statusColor}`}
        >
          <StatusIcon size={14} />
          {isOver
            ? `Over by ${fmt(Math.abs(remaining))}`
            : isWarning
            ? "Nearing limit"
            : "On track"}
        </span>
      </div>
 
      {/* Amounts */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-gray-900">
            {fmt(spentAmount)}
          </p>
          <p className="mt-0.5 text-sm text-gray-400">
            spent of {fmt(budgetAmount)} budget
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isOver ? "text-red-600" : "text-emerald-600"}`}>
            {isOver ? "-" : "+"}{fmt(Math.abs(remaining))}
          </p>
          <p className="text-xs text-gray-400">{isOver ? "over budget" : "remaining"}</p>
        </div>
      </div>
 
      {/* Progress bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>$0</span>
        <span className="font-medium">{Math.round(percentage)}% used</span>
        <span>{fmt(budgetAmount)}</span>
      </div>
    </div>
  );
}
 