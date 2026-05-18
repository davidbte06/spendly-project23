import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "../auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spendly",
  description: "Personal finance tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // verify if user is authenticated on every page load
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-blue-600">
            Spendly
          </Link>

          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Hello, {session.user?.name || "User"}
                </span>
                {/* Log Out button (Server Action) */}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                    Log Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-sm font-medium hover:text-blue-600">
                  Log In
                </Link>
                <Link href="/register" className="text-sm font-medium hover:text-blue-600">
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}