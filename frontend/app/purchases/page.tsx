import { mockPurchases } from "@/data/mock-purchases";
import { PurchasesTable } from "@/components/purchases/purchases-table";
import { StatCard } from "@/components/stat-card";
import { TrendingUp, Clock, PackageCheck, Plus } from "lucide-react";

export default function PurchasesPage() {
  const totalValue = mockPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalPurchases = mockPurchases.length;
  const pendingPurchases = mockPurchases.filter(
    (p) => p.status === "Pending"
  ).length;
  const deliveredPurchases = mockPurchases.filter(
    (p) => p.status === "Delivered"
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Purchase Management
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 dark:border-[#212121] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#212121] bg-white dark:bg-[#2F2F2F]">
            Manage Suppliers
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Purchase
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Purchases"
          value={totalPurchases.toString()}
          subtext=""
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Pending"
          value={pendingPurchases.toString()}
          subtext=""
          icon={<Clock className="h-6 w-6" />}
          iconBgColor="bg-amber-50 dark:bg-amber-900/20"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Delivered"
          value={deliveredPurchases.toString()}
          subtext=""
          icon={<PackageCheck className="h-6 w-6" />}
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Total Value"
          value={`USD ${totalValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtext=""
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Table */}
      <PurchasesTable purchases={mockPurchases} />
    </div>
  );
}
