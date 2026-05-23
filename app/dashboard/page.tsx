import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank, } from "lucide-react";

export default function DashboardPage() {
    return (
        <div>
            <DashboardHeader />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 x1:grid-cols-4">
                <SummaryCard
                    title="Total Balance"
                    amount="$2000.00"
                    icon={Wallet}
                />
                <SummaryCard
                    title="Income"
                    amount="$1000.00"
                    icon={ArrowUpCircle}
                />
                <SummaryCard
                    title="Expenses"
                    amount="$500.00"
                    icon={ArrowDownCircle}
                />
                <SummaryCard
                    title="Savings"
                    amount="$1500.00"
                    icon={PiggyBank}
                />
            </div>
        </div>
    );
}