import { TrendingUp } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: "sale" | "restock" | "order" | "other";
  amount?: string;
  status?: string;
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="flex flex-col h-full rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-blue-50">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="space-y-6 flex-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
            </div>
            {activity.amount && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                {activity.amount}
              </span>
            )}
            {activity.status && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md ${
                  activity.status === "Pending"
                    ? "bg-purple-50 text-purple-600"
                    : activity.status === "Inventory"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {activity.status}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
          View all activity
        </button>
      </div>
    </div>
  );
}
