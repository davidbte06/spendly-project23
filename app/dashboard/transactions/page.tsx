"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import TransactionTable from "@/components/dashboard/TransactionTable";
import TransactionForm from "@/components/dashboard/TransactionForm";
import ExportButton from "@/components/dashboard/ExportButton";
import { getTransactions } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  userId?: string | null;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  categoryId: string;
  category: Category;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const [txs, cats] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);
      setTransactions(txs as unknown as Transaction[]);
      setCategories(cats as unknown as Category[]);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Transactions
            </h1>
            <p className="text-sm text-gray-400">
              Record and manage your financial movements
            </p>
          </div>
        </div>
 
        <div className="flex items-center gap-2 sm:gap-3">
          <ExportButton />
          <button
            id="new-transaction-btn"
            onClick={() => setShowForm(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95 sm:flex-none sm:px-5"
          >
            <Plus size={16} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Add transaction modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={loadData}
        />
      )}

      {/* Loading state */}
      {isPending && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="ml-3 text-sm">Loading transactions...</span>
        </div>
      ) : (
        <TransactionTable
          transactions={transactions}
          categories={categories}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}