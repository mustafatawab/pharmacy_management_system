import { ReactNode } from "react";

interface InventorySummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function InventorySummaryCard({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}: InventorySummaryCardProps) {
  return (
    <div className="flex items-center p-6 bg-white rounded-xl border shadow-sm">
      <div className={`p-4 rounded-xl ${iconBgColor} ${iconColor} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
