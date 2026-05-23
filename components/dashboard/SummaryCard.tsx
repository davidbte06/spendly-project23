import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
    title: string;
    amount: string;
    icon: LucideIcon;
}

export default function SummaryCard({title, amount, icon:Icon,}: SummaryCardProps) {
    return (
        <div className="rounded-2x1 border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>

                <div className="rounded-x1 bg-emerald-100 p-3 text-emerald-600">
                    <Icon size={22}/>
                </div>

            </div>

            <div className="mt-5">
                <h2 className="text-3x1 font-bold tracking-tight text-gray-900">
                    {amount}
                </h2>
            </div>
        </div>
    )
}