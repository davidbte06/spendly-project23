export default function DashboardHeader() {
  const now = new Date();
  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {greeting()} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Here&apos;s an overview of your finances.
      </p>
    </div>
  );
}