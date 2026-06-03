import { ArrowUpCircle, ArrowDownCircle, Scale } from "lucide-react";

type Props = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  month: number;
  year: number;
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function MonthlySummary({
  totalIncome,
  totalExpenses,
  balance,
  month,
  year,
}: Props) {
  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: ArrowUpCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      valueColor: "text-emerald-700",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      icon: ArrowDownCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      valueColor: "text-red-600",
    },
    {
      label: "Net Balance",
      value: balance,
      icon: Scale,
      color: balance >= 0 ? "text-blue-600" : "text-red-500",
      bg: balance >= 0 ? "bg-blue-50" : "bg-red-50",
      valueColor: balance >= 0 ? "text-blue-700" : "text-red-600",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-500">
        {MONTHS[month - 1]} {year}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color, bg, valueColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">{label}</p>
              <p className={`text-xl font-bold tracking-tight ${valueColor}`}>
                {fmt(value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
