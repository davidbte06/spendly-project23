"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/dashboard",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/categories",   label: "Categories",   icon: Tag },
  { href: "/dashboard/budget",       label: "Budget",       icon: Wallet },
  { href: "/dashboard/summary",      label: "Summary",      icon: BarChart3 },
];

function NavContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-emerald-400">
          Spendly
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">Finance Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-emerald-400" : "text-slate-400"}
              />
              {label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 space-y-3">
        <button
          id="logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Log Out
        </button>
        <p className="px-1 text-xs text-slate-600">Spendly v1.0</p>
      </div>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <span className="text-lg font-extrabold tracking-tight text-emerald-400">
          Spendly
        </span>
        <button
          id="sidebar-toggle"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-slate-900 text-white shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            <NavContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Desktop sidebar (always visible on lg+) ── */}
      <aside className="hidden lg:flex lg:min-h-screen lg:w-64 lg:flex-col bg-slate-900 text-white">
        <NavContent pathname={pathname} />
      </aside>
    </>
  );
}