"use client";

import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { SalesTrendChart } from "@/components/reports/sales-trend-chart";
import { CategoryChart } from "@/components/reports/category-chart";
import { TopProducts } from "@/components/reports/top-products";
import { QuickStats } from "@/components/reports/quick-stats";
import { useToast } from "@/hooks/use-toast";
import {
  useDashboardStats,
  useRecentSales,
  useLowStockMedicines,
} from "@/hooks/useDashboard";
import { useQueries } from "@tanstack/react-query";

export default function ReportsPage() {
  const { data: stats } = useDashboardStats();
  const { data: recentSales = [] } = useRecentSales();
  const { data: lowStockItems = [] } = useLowStockMedicines();

  // Fetch sales data for charts using queries
  const { data: allSales = [], isLoading: salesLoading } = useQueries({
    queries: [
      {
        queryKey: ["sales-recent"],
        queryFn: async () => {
          const res = await fetch(
            "/api/reports/sales?period=last-month",
            { credentials: "include" }
          );
          return res.json();
        },
      },
    ],
  });

  const { data: categoryData = [] } = useQueries({
    queries: [
      {
        queryKey: ["sales-by-category"],
        queryFn: async () => {
          const res = await fetch(
            "/api/reports/categories?period=last-month",
            { credentials: "include" }
          );
          return res.json();
        },
      },
    ],
  });

  const { data: topProducts = [] } = useQueries({
    queries: [
      {
        queryKey: ["top-products"],
        queryFn: async () => {
          const res = await fetch(
            "/api/reports/top-products?period=last-month",
            { credentials: "include" }
          );
          return res.json();
        },
      },
    ],
  });

  if (salesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  // Calculate summary stats from backend data
  const totalRevenue = allSales?.reduce((sum: number, sale: any) =>
    sum + (sale.final_amount || 0), 0) || 0;

  const avgTransaction = totalRevenue / (allSales?.length || 1) || 0;
  const totalProducts = lowStockItems?.length || 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Reports & Analytics
        </h2>
        <button
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-[#2F2F2F] dark:border-[#2F2F2F] dark:text-gray-200 dark:hover:bg-[#3F3F3F]"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-4">
        <DateRangePicker />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Period Revenue"
          value={('$' + totalRevenue.toFixed(2))}
          subtext={`${allSales?.length || 0} transactions`}
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Avg Transaction"
          value={('$' + avgTransaction.toFixed(2))}
          subtext="Per sale"
          icon={<ShoppingCart className="h-6 w-6" />}
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          subtext="0 low stock"
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Today's Sales"
          value="0"
          subtext="$0.00"
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
          iconColor="text-yellow-600 dark:text-yellow-400"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryChart />
        <QuickStats />
      </div>
    </div>
  );
}