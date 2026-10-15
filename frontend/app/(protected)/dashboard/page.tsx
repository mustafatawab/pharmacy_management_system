"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/stat-card";
import { AlertCard } from "@/components/alert-card";
import { RecentActivity } from "@/components/recent-activity";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { useDashboardStats, useLowStockMedicines, useRecentSales } from "@/hooks/useDashboard";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
 const currentDate = new Date().toLocaleDateString("en-US", {
 weekday: "long",
 year: "numeric",
 month: "long",
 day: "numeric",
 });

 const [hasMounted, setHasMounted] = useState(false);
 const { user } = useAuth();

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
 className="animate-spin rounded-full border-4 border-border border-b-transparent h-12 w-12"
 />
 </div>
 );
 }

 if (statsLoading) {
 return (
 <div className="flex items-center justify-center h-64 text-foreground">
 <div className="animate-spin rounded-full border-4 border-primary border-b-transparent h-12 w-12" />
 </div>
 );
 }

 return (
 <div className="space-y-10 min-h-screen pb-12" style={{ animation: "revealContent 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
 
 {/* Header Section */}
 <div className="flex items-center justify-between mb-8">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 >
 <h2 className="h2 text-3xl font-extrabold text-foreground tracking-tight mb-2">
 Welcome {user?.full_name || "Admin"}!
 </h2>
 <p className="text-muted-foreground font-medium">Pharmacy Sales Results</p>
 </motion.div>
 
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className="hidden sm:flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft"
 >
 <span className="text-sm font-bold text-card-foreground">📅 {currentDate}</span>
 </motion.div>
 </div>

 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ animation: "revealCards 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards" }}>
 <StatCard
 index={0}
 variant="green"
 title="Today's Sales"
 value={`PKR ${(stats?.todaySales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 subtext={`${stats?.todayTransactions || 0} transactions`}
 icon={<DollarSign />}
 />

 <StatCard
 index={1}
 variant="teal"
 title="Available Categories"
 value={(stats?.totalProducts || 0).toString()}
 subtext={`${stats?.lowStockCount || 0} low stock`}
 icon={<Package />}
 />

 <StatCard
 index={2}
 variant="pink"
 title="Expired Medicines"
 value={(stats?.totalProducts ? 0 : 0).toString()}
 subtext={`Check inventory`}
 icon={<TrendingUp />}
 />

 <StatCard
 index={3}
 variant="purple"
 title="System Users"
 value={"4"}
 subtext={`Active roles`}
 icon={<Users />}
 />
 </div>

 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="lg:col-span-2 space-y-8"
 >
 <div className="bg-card rounded-3xl p-6 shadow-soft h-[400px] flex items-center justify-center border border-transparent">
 <div className="text-muted-foreground text-center">
 <BarChart2Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
 <h3 className="h3 font-bold mb-1">Total Sales Overview</h3>
 <p className="text-sm opacity-80">Chart visualization placeholder</p>
 </div>
 </div>
 <RecentActivity activities={recentSales.length > 0 ? recentSales.map((s: any) => ({
 id: s.id?.toString() || Math.random().toString(),
 title: `Sale #${s.id}`,
 time: new Date(s.created_at).toLocaleString(),
 type: "sale",
 amount: `PKR ${s.final_amount}`
 })) : []} />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="space-y-8"
 >
 <div className="bg-card rounded-3xl p-6 shadow-soft h-[300px] flex items-center justify-center">
 <div className="text-muted-foreground text-center">
 <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
 <h3 className="h3 font-bold mb-1">Graph Report</h3>
 <p className="text-sm opacity-80">Doughnut chart placeholder</p>
 </div>
 </div>
 <AlertCard title="Low Stock Alert" type="low-stock" items={lowStockItems} />
 </motion.div>
 </div>
 </div>
 );
}

function BarChart2Icon(props: any) {
 return (
 <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
 );
}
function PieChartIcon(props: any) {
 return (
 <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
 );
}
