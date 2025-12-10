import { AlertCircle, Calendar } from "lucide-react";

interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string; // e.g., "bg-red-100 text-red-700"
}

interface AlertCardProps {
  title: string;
  type: "low-stock" | "expiring";
  items: AlertItem[];
}

export function AlertCard({ title, type, items }: AlertCardProps) {
  const isLowStock = type === "low-stock";
  const Icon = isLowStock ? AlertCircle : Calendar;
  const iconColor = isLowStock ? "text-red-500" : "text-amber-500";
  const iconBg = isLowStock ? "bg-red-50" : "bg-amber-50";

  return (
    <div className="flex flex-col h-full rounded-xl border bg-white dark:bg-[#2F2F2F] border-gray-200 dark:border-[#2F2F2F] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-4 flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              isLowStock
                ? "bg-red-50/50 dark:bg-red-900/10"
                : "bg-amber-50/50 dark:bg-amber-900/10"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${item.tagColor}`}
            >
              {item.tag}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">No alerts.</p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#212121] text-center">
        <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
          View all
        </button>
      </div>
    </div>
  );
}
