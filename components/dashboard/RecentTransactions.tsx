import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

type Category = {
  name: string;
  icon: string | null;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  category: Category;
};

type Props = {
  transactions: Transaction[];
};

export default function RecentTransactions({ transactions }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {/* List */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-2xl">💳</p>
          <p className="mt-2 text-sm font-medium text-gray-500">
            No transactions yet
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Add your first transaction to see it here
          </p>
          <Link
            href="/dashboard/transactions"
            className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100"
          >
            Go to Transactions
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50/50"
            >
              {/* Type icon */}
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                  tx.type === "income"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {tx.type === "income" ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {tx.description}
                </p>
                <p className="text-xs text-gray-400">
                  {tx.category.icon} {tx.category.name} ·{" "}
                  {new Date(tx.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              {/* Amount */}
              <span
                className={`flex-shrink-0 text-sm font-semibold ${
                  tx.type === "income" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}$
                {tx.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
