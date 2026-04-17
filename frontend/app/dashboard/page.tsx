"use client";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { AlertCard } from "@/components/alert-card";
import { RecentActivity } from "@/components/recent-activity";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          value="USD 0.00"
          subtext="0 transactions"
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          index={1}
          title="Total Products"
          value="4"
          subtext="1 low stock"
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          index={2}
          title="Total Revenue"
          value="USD 0.00"
          subtext="All time"
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          index={3}
          title="Active Users"
          value="2"
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
          items={[
            {
              id: "1",
              title: "Amoxicillin 250mg",
              subtitle: "8 units remaining",
              tag: "Low Stock",
              tagColor: "bg-red-100 text-red-700",
            },
            // Add more empty items if needed for layout spacing or verification
          ]}
        />
        <AlertCard
          title="Expiring Soon"
          type="expiring"
          items={[
            {
              id: "1",
              title: "Paracetamol 500mg",
              subtitle: "Expires: 31/12/2025",
              tag: "Expiring",
              tagColor: "bg-amber-100 text-amber-700",
            },
            {
              id: "2",
              title: "Amoxicillin 250mg",
              subtitle: "Expires: 30/06/2024",
              tag: "Expiring",
              tagColor: "bg-amber-100 text-amber-700",
            },
            {
              id: "3",
              title: "Vitamin C 1000mg",
              subtitle: "Expires: 15/03/2026",
              tag: "Expiring",
              tagColor: "bg-amber-100 text-amber-700",
            },
          ]}
        />
        <RecentActivity
          activities={[
            {
              id: "1",
              title: "New Sale",
              time: "2 minutes ago",
              type: "sale",
              amount: "+$45.60",
            },
            {
              id: "2",
              title: "Stock Updated",
              time: "15 minutes ago",
              type: "restock",
              status: "Inventory",
            },
            {
              id: "3",
              title: "Purchase Order",
              time: "1 hour ago",
              type: "order",
              status: "Pending",
            },
          ]}
        />
      </div>
    </div>
  );
}
