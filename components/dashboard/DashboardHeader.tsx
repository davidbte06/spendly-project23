"use client";

import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {greeting} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Here&apos;s an overview of your finances.
      </p>
    </div>
  );
}