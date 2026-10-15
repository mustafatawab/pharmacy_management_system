import { Calendar, Package, ArrowRightLeft } from "lucide-react";
import { ExpiryAlert } from "@/hooks/useDashboard";
import { useState } from "react";
import { format } from "date-fns";

interface ExpiryTableProps {
 alerts: ExpiryAlert[];
 isLoading: boolean;
 onReturn: (batch: ExpiryAlert) => void;
}

export function ExpiryTable({ alerts, isLoading, onReturn }: ExpiryTableProps) {
 if (isLoading) {
 return (
 <div className="flex justify-center p-8">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 </div>
 );
 }

 if (alerts.length === 0) {
 return (
 <div className="text-center py-12 bg-card rounded-xl border border-border">
 <Package className="mx-auto h-12 w-12 text-zinc-300" />
 <h3 className="h3 mt-2 text-sm font-semibold text-card-foreground">No expiring batches</h3>
 <p className="mt-1 text-xs text-muted-foreground">All inventory is well within expiry dates.</p>
 </div>
 );
 }

 return (
 <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-muted-foreground">
 <tr>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Medicine</th>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Batch No.</th>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Quantity</th>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Expiry Date</th>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Days Left</th>
 <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
 {alerts.map((alert) => (
 <tr key={alert.batch_id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
 <td className="px-6 py-4 font-medium text-foreground">{alert.medicine_name}</td>
 <td className="px-6 py-4 text-muted-foreground">{alert.batch_number}</td>
 <td className="px-6 py-4 text-right text-foreground font-medium">{alert.quantity}</td>
 <td className="px-6 py-4 text-right">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
 <Calendar className="w-3 h-3" />
 {format(new Date(alert.expiry_date), "MMM d, yyyy")}
 </span>
 </td>
 <td className="px-6 py-4 text-right text-red-600 dark:text-red-400 font-bold">
 {alert.days_to_expiry} days
 </td>
 <td className="px-6 py-4 text-right">
 <button
 onClick={() => onReturn(alert)}
 className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 transition-colors"
 >
 <ArrowRightLeft className="w-3.5 h-3.5" />
 RTS
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}
