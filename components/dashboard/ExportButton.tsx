"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");

      // Get filename from Content-Disposition header if present, else use fallback
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+?)"/);
      a.download = match ? match[1] : `spendly-transactions-${new Date().toISOString().split("T")[0]}.csv`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="export-csv-btn"
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
    >
      <Download size={15} className="text-gray-500" />
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  );
}
