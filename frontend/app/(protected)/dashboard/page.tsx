"use client";
import { StatCard } from "@/components/stat-card";
import { AlertCard } from "@/components/alert-card";
import { RecentActivity } from "@/components/recent-activity";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import {
  useDashboardStats,
  useLowStockMedicines,
  useRecentSales,
} from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStockItems = [] } = useLowStockMedicines();
  const { data: recentSales = [] } = useRecentSales();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4">📅</span>
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          title="Today's Sales"
          value={`PKR ${(stats?.todaySales || 0).toFixed(2)}`}
          subtext={`${stats?.todayTransactions || 0} transactions`}
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          index={1}
          title="Total Products"
          value={(stats?.totalProducts || 0).toString()}
          subtext={`${stats?.lowStockCount || 0} low stock`}
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          index={2}
          title="Total Revenue"
          value={`PKR ${(stats?.totalRevenue || 0).toFixed(2)}`}
          subtext="All time"
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          index={3}
          title="Active Users"
          value={(stats?.activeUsers || 0).toString()}
          subtext="System users"
          icon={<Users className="h-6 w-6" />}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AlertCard
          title="Low Stock Alert"
          type="low-stock"
          items={lowStockItems}
        />
        <AlertCard
          title="Expiring Soon"
          type="expiring"
          items={[]}
        />
        <RecentActivity
          activities={recentSales.length > 0 ? recentSales : [
            {
              id: "1",
              title: "No recent sales",
              time: "Start selling to see activity",
              type: "sale",
            },
          ]}
        />
      </div>
    </div>
  );
}
