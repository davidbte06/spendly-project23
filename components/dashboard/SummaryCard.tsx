import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type SummaryCardProps = {
  title: string;
  amount: string;
  icon: LucideIcon;
  trend?: "up" | "down";
};

export default function SummaryCard({
  title,
  amount,
  icon: Icon,
  trend,
}: SummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {amount}
        </h2>

        {trend && (
          <div
            className={`mt-1 flex items-center gap-1 text-xs font-medium ${
              trend === "up" ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            <span>{trend === "up" ? "Positive" : "Negative"}</span>
          </div>
        )}
      </div>

      {/* Decorative background dot */}
      <div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-5 ${
          trend === "down" ? "bg-red-400" : "bg-emerald-400"
        }`}
      />
    </div>
  );
}