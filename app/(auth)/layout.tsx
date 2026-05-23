import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-emerald-600"
          >
            Spendly
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-emerald-600"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}