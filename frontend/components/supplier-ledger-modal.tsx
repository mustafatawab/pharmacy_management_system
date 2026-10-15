"use client";

import { useSupplier, useSupplierLedger, usePaySupplier } from "@/hooks/useSupplier";
import { X, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
 supplierId: string;
 onClose: () => void;
}

export function SupplierLedgerModal({ supplierId, onClose }: Props) {
 const { data: supplier, isLoading: loadingSupplier } = useSupplier(supplierId);
 const { data: ledger = [], isLoading: loadingLedger } = useSupplierLedger(supplierId);
 const paySupplier = usePaySupplier();
 
 const [amount, setAmount] = useState("");
 const [notes, setNotes] = useState("");

 const handlePay = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
 
 try {
 await paySupplier.mutateAsync({
 id: supplierId,
 amount: Number(amount),
 notes,
 });
 toast.success("Payment recorded successfully");
 setAmount("");
 setNotes("");
 } catch (error: any) {
 toast.error("Failed to record payment");
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <div className="bg-card rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-border">
 
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-border dark:border-border">
 <div>
 <h3 className="h3 text-xl font-bold text-card-foreground">Account Ledger</h3>
 <p className="text-sm text-muted-foreground mt-1">{supplier?.company_name || "Loading..."}</p>
 </div>
 <button onClick={onClose} className="p-2 text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition">
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
 
 {/* Ledger Table */}
 <div className="flex-1 overflow-x-auto border border-border rounded-xl">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-neutral-100 dark:bg-neutral-800 text-muted-foreground">
 <tr>
 <th className="px-4 py-3 font-semibold">Date</th>
 <th className="px-4 py-3 font-semibold">Type</th>
 <th className="px-4 py-3 font-semibold text-right">Debit</th>
 <th className="px-4 py-3 font-semibold text-right">Credit</th>
 <th className="px-4 py-3 font-semibold text-right">Balance</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
 {ledger.map((entry) => (
 <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
 <td className="px-4 py-3 text-muted-foreground">
 {new Date(entry.created_at).toLocaleDateString()}
 </td>
 <td className="px-4 py-3">
 <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
 entry.reference_type === "purchase" ? "bg-red-50 text-red-600" :
 entry.reference_type === "payment" ? "bg-green-50 text-green-600" :
 "bg-primary/10 text-primary"
 }`}>
 {entry.reference_type}
 </span>
 </td>
 <td className="px-4 py-3 text-right text-red-600 font-medium">
 {entry.debit > 0 ? `$${entry.debit}` : "-"}
 </td>
 <td className="px-4 py-3 text-right text-green-600 font-medium">
 {entry.credit > 0 ? `$${entry.credit}` : "-"}
 </td>
 <td className="px-4 py-3 text-right font-bold text-card-foreground">
 ${entry.balance_after}
 </td>
 </tr>
 ))}
 {ledger.length === 0 && (
 <tr>
 <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
 No transactions recorded.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* Payment Form */}
 <div className="w-full md:w-72 bg-neutral-100 dark:bg-neutral-800/50 p-5 rounded-xl border border-border dark:border-border h-fit">
 <h4 className="font-bold text-card-foreground mb-1">Record Payment</h4>
 <p className="text-xs text-muted-foreground mb-4">Current Balance: <span className="font-bold text-red-600">${supplier?.outstanding_balance || 0}</span></p>
 
 <form onSubmit={handlePay} className="space-y-4">
 <div>
 <label className="text-xs font-semibold text-card-foreground dark:text-muted-foreground uppercase tracking-wider">Amount ($)</label>
 <input 
 type="number" 
 step="0.01"
 required 
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900" 
 />
 </div>
 <div>
 <label className="text-xs font-semibold text-card-foreground dark:text-muted-foreground uppercase tracking-wider">Notes</label>
 <textarea 
 rows={2}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="e.g. Bank Transfer Ref: 123"
 className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900" 
 />
 </div>
 <button 
 type="submit" 
 disabled={paySupplier.isPending || !amount}
 className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition disabled:opacity-50"
 >
 <Receipt className="w-4 h-4" />
 Submit Payment
 </button>
 </form>
 </div>
 </div>
 </div>
 </div>
 );
}
