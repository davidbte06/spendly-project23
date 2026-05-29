import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from "lucide-react";
import { getDashboardSummary, getRecentTransactions } from "@/lib/actions/transactions";

export default async function DashboardPage() {
  const [summary, recent] = await Promise.all([
    getDashboardSummary(),
    getRecentTransactions(),
  ]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          amount={fmt(summary.balance)}
          icon={Wallet}
          trend={summary.balance >= 0 ? "up" : "down"}
        />
        <SummaryCard
          title="Income"
          amount={fmt(summary.totalIncome)}
          icon={ArrowUpCircle}
          trend="up"
        />
        <SummaryCard
          title="Expenses"
          amount={fmt(summary.totalExpenses)}
          icon={ArrowDownCircle}
          trend="down"
        />
        <SummaryCard
          title="Savings"
          amount={fmt(summary.savings)}
          icon={PiggyBank}
          trend="up"
        />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recent} />
    </div>
  );
}