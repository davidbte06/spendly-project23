import Link from "next/link";
import{
    LayoutDashboard,
    Wallet,
    ArrowLeftRight
} from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
            <div className="border-b border-slate-800 px-6 py-6">
                <h1 className="text-2x1 font-extrabold tracking-tight text-emerald-400">
                    Spendly
                </h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                <LayoutDashboard size={20} />
                Dashboard
                </Link>

                <Link
                href="/dashboard/budget"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                <Wallet size={20} />
                Budget
                </Link>

                <Link
                href="/dashboard/transactions"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                <ArrowLeftRight size={20} />
                Transactions
                </Link>
            </nav>
            <div className="border-t border-slate-800 p-4">
                <p className="text-xs text-slate-500">
                Spendly v1.0
                </p>
            </div>
        </aside>
    )
    
}