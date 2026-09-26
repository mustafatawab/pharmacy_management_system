"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/stat-card";
import { AlertCard } from "@/components/alert-card";
import { RecentActivity } from "@/components/recent-activity";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { useDashboardStats, useLowStockMedicines, useRecentSales } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStockItems = [] } = useLowStockMedicines();
  const { data: recentSales = [] } = useRecentSales();

  if (!hasMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-background text-foreground">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="animate-spin rounded-full border-4 border-border border-b-transparent"
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-foreground">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No products yet</h3>
          <p className="text-muted-foreground mt-2">Add your first product to get started with dashboard statistics.</p>
          <button
            onClick={() => window.location.href="/product"}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Add First Product
          </button>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-foreground">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-background via-neutral-100 to-card" style={{ animation: "revealContent 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-foreground tracking-tight"
      >
        Dashboard Overview
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ animation: "revealCards 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <StatCard
            index={0}
            title="Today's Sales"
            value={`PKR ${(stats?.todaySales || 0).toFixed(2)}`}
            subtext={`${stats?.todayTransactions || 0} transactions`}
            icon={<DollarSign className="h-6 w-6" />}
            iconBgColor="bg-success/10"
            iconColor="text-success"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <StatCard
            index={1}
            title="Total Products"
            value={(stats?.totalProducts || 0).toString()}
            subtext={`${stats?.lowStockCount || 0} low stock`}
            icon={<Package className="h-6 w-6" />}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <StatCard
            index={2}
            title="Total Revenue"
            value={`PKR ${(stats?.totalRevenue || 0).toFixed(2)}`}
            subtext="All time"
            icon={<TrendingUp className="h-6 w-6" />}
            iconBgColor="bg-warning/10"
            iconColor="text-warning"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <StatCard
            index={3}
            title="Active Users"
            value={(stats?.activeUsers || 0).toString()}
            subtext="System users"
            icon={<Users className="h-6 w-6" />}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ animation: "revealCards 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <AlertCard
            title="Low Stock Alert"
            type="low-stock"
            items={lowStockItems}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <AlertCard
            title="Expiring Soon"
            type="expiring"
            items={[]}
          />
        </motion.div>

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