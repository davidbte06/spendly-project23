import { registerUser } from "../../../lib/actions";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                
                {/* Logo / Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-emerald-600">
                        Spendly
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your account and start tracking your finances.
                    </p>
                </div>

                {/* Register Form */}
                <form action={registerUser} className="space-y-5">
                    
                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="john@example.com"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-emerald-500 py-3 font-medium text-white transition hover:bg-emerald-600"
                    >
                        Create Account
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-emerald-600 hover:text-emerald-700"
                    >
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}