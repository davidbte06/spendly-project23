"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  X,
} from "lucide-react";
import { deleteTransaction } from "@/lib/actions/transactions";
import TransactionForm from "./TransactionForm";

type Category = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
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

type SortField = "date" | "amount" | "description";
type SortDir = "asc" | "desc";

type Props = {
  transactions: Transaction[];
  categories: Category[];
  onRefresh: () => void;
};

export default function TransactionTable({
  transactions,
  categories,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategoryId, setFilterCategoryId] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = transactions
    .filter((tx) => {
      const matchType = filterType === "all" || tx.type === filterType;
      const matchCat =
        filterCategoryId === "all" || tx.categoryId === filterCategoryId;
      const matchSearch =
        !search ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.name.toLowerCase().includes(search.toLowerCase());
      return matchType && matchCat && matchSearch;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "amount") {
        cmp = a.amount - b.amount;
      } else {
        cmp = a.description.localeCompare(b.description);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteError("");
    startTransition(async () => {
      try {
        await deleteTransaction(id);
        onRefresh();
      } catch (err: unknown) {
        setDeleteError(err instanceof Error ? err.message : "Failed to delete transaction.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-emerald-500" />
    ) : (
      <ChevronDown size={14} className="text-emerald-500" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Edit modal */}
      {editingTx && (
        <TransactionForm
          categories={categories}
          transaction={editingTx}
          onClose={() => setEditingTx(null)}
          onSuccess={() => {
            setEditingTx(null);
            onRefresh();
          }}
        />
      )}

      {/* Delete error toast */}
      {deleteError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{deleteError}</span>
          <button onClick={() => setDeleteError("")} className="flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters bar */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Search */}
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="tx-search"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Row 2: Type filter + category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              id={`filter-${t}`}
              onClick={() => setFilterType(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterType === t
                  ? t === "income"
                    ? "bg-emerald-100 text-emerald-700"
                    : t === "expense"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t === "all" ? "All" : t === "income" ? "💰 Income" : "💸 Expenses"}
            </button>
          ))}

          <select
            id="filter-category"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="ml-auto rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:bg-white"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table — overflow-x-auto for mobile horizontal scroll */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="text-sm font-medium text-gray-500">
              No transactions found
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Try adjusting your filters or add a new transaction
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60 text-left">
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Type
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
                    onClick={() => handleSort("description")}
                  >
                    <span className="flex items-center gap-1">
                      Description <SortIcon field="description" />
                    </span>
                  </th>
                  <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                    Category
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
                    onClick={() => handleSort("date")}
                  >
                    <span className="flex items-center gap-1">
                      Date <SortIcon field="date" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
                    onClick={() => handleSort("amount")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount <SortIcon field="amount" />
                    </span>
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group transition hover:bg-gray-50/50"
                  >
                    {/* Type icon */}
                    <td className="px-4 py-4">
                      <div
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                          tx.type === "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <TrendingUp size={15} />
                        ) : (
                          <TrendingDown size={15} />
                        )}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-[160px] px-4 py-4">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {tx.description}
                      </p>
                      {/* Show category inline on mobile (sm hidden above) */}
                      <p className="mt-0.5 truncate text-xs text-gray-400 sm:hidden">
                        {tx.category.icon} {tx.category.name}
                      </p>
                    </td>

                    {/* Category — hidden on smallest screens */}
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {tx.category.icon} {tx.category.name}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`text-sm font-semibold whitespace-nowrap ${
                          tx.type === "income"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}$
                        {tx.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Actions — always visible (not hover-only, for touch devices) */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          id={`edit-tx-${tx.id}`}
                          onClick={() => setEditingTx(tx)}
                          title="Edit"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          id={`delete-tx-${tx.id}`}
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id || isPending}
                          title="Delete"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary row */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 px-5 py-3 text-sm text-gray-500">
          <span>
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-4">
            <span className="font-medium text-emerald-600">
              +$
              {filtered
                .filter((t) => t.type === "income")
                .reduce((s, t) => s + t.amount, 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="font-medium text-red-500">
              -$
              {filtered
                .filter((t) => t.type === "expense")
                .reduce((s, t) => s + t.amount, 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
