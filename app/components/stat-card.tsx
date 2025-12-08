import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">{subtext}</p>
    </div>
  );
}
