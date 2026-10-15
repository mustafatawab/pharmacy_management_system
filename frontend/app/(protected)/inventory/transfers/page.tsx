"use client";

import { useState } from "react";
import { Plus, Package, ArrowRight, Check, X } from "lucide-react";
import { useStockTransfers, useCreateTransfer, useReceiveTransfer } from "@/hooks/useStockTransfer";
import { useTenants } from "@/hooks/useTenant";
import { toast } from "react-hot-toast";

export default function StockTransfersPage() {
 const [activeTab, setActiveTab] = useState<"all" | "outbound" | "inbound">("all");
 const [showCreateModal, setShowCreateModal] = useState(false);
 
 const { data: transfers = [], isLoading } = useStockTransfers(activeTab);
 const receiveTransfer = useReceiveTransfer();

 const handleReceive = async (id: number) => {
 try {
 await receiveTransfer.mutateAsync(id);
 toast.success("Transfer Received Successfully!");
 } catch (e: any) {
 toast.error(e.response?.data?.detail || "Failed to receive transfer");
 }
 };

 return (
 <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="h1 text-2xl font-bold tracking-tight">Stock Transfers (STO)</h1>
 <p className="text-sm text-muted-foreground">Manage inter-branch inventory transfers</p>
 </div>
 <button
 onClick={() => setShowCreateModal(true)}
 className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
 >
 <Plus className="h-4 w-4" /> New Transfer
 </button>
 </div>

 <div className="flex gap-4 border-b border-border">
 {(["all", "outbound", "inbound"] as const).map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`pb-3 text-sm font-bold capitalize ${activeTab === tab ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
 >
 {tab}
 </button>
 ))}
 </div>

 <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
 {isLoading ? (
 <div className="p-8 text-center text-muted-foreground">Loading transfers...</div>
 ) : transfers.length === 0 ? (
 <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-center">
 <Package className="h-12 w-12 text-zinc-300 dark:text-card-foreground mb-4" />
 <h3 className="h3 text-lg font-bold text-foreground">No Transfers Found</h3>
 <p className="text-sm">You haven't initiated or received any stock transfers yet.</p>
 </div>
 ) : (
 <table className="w-full text-sm text-left">
 <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-border text-muted-foreground font-medium">
 <tr>
 <th className="px-4 py-3">Transfer ID</th>
 <th className="px-4 py-3">Date</th>
 <th className="px-4 py-3">Source &rarr; Dest</th>
 <th className="px-4 py-3">Items</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
 {transfers.map((t: any) => (
 <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-900/50">
 <td className="px-4 py-3 font-medium">TRF-{t.id}</td>
 <td className="px-4 py-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-2">
 <span className="font-medium text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Tenant {t.from_tenant_id}</span>
 <ArrowRight className="h-3 w-3 text-muted-foreground" />
 <span className="font-medium text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Tenant {t.to_tenant_id}</span>
 </div>
 </td>
 <td className="px-4 py-3 text-muted-foreground">{t.items?.length || 0} items</td>
 <td className="px-4 py-3">
 <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
 t.status === 'received' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
 t.status === 'shipped' ? 'bg-primary/20 text-primary dark:bg-blue-900/30 dark:text-blue-400' :
 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
 }`}>
 {t.status}
 </span>
 </td>
 <td className="px-4 py-3 text-right">
 {t.status === "shipped" && activeTab !== "outbound" && (
 <button
 onClick={() => handleReceive(t.id)}
 disabled={receiveTransfer.isPending}
 className="text-xs bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ml-auto"
 >
 <Check className="h-3 w-3" /> Receive
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {showCreateModal && <CreateTransferModal onClose={() => setShowCreateModal(false)} />}
 </div>
 );
}

function CreateTransferModal({ onClose }: { onClose: () => void }) {
 const [toTenantId, setToTenantId] = useState("");
 const [barcode, setBarcode] = useState("");
 const [qty, setQty] = useState("");
 const [items, setItems] = useState<{medicine_barcode: string; quantity: number}[]>([]);
 
 const createTransfer = useCreateTransfer();
 const { data: tenants = [] } = useTenants();

 const handleAddItem = () => {
 if (!barcode || !qty) return;
 setItems([...items, { medicine_barcode: barcode, quantity: Number(qty) }]);
 setBarcode("");
 setQty("");
 };

 const handleSubmit = async () => {
 if (!toTenantId || items.length === 0) return toast.error("Missing fields");
 try {
 await createTransfer.mutateAsync({
 to_tenant_id: Number(toTenantId),
 items
 });
 toast.success("Transfer Initiated");
 onClose();
 } catch (e: any) {
 toast.error(e.response?.data?.detail || "Failed to create transfer");
 }
 };

 return (
 <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-card rounded-2xl w-full max-w-md shadow-xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
 <div className="flex items-center justify-between p-4 border-b border-border bg-neutral-100 dark:bg-neutral-800">
 <h2 className="h2 font-bold">New Stock Transfer</h2>
 <button onClick={onClose} className="p-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg"><X className="h-4 w-4" /></button>
 </div>
 <div className="p-4 space-y-4 overflow-y-auto">
 <div>
 <label className="text-xs font-bold text-muted-foreground uppercase">Destination Branch</label>
 <select value={toTenantId} onChange={e => setToTenantId(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-border">
 <option value="">Select Branch</option>
 {tenants.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
 </select>
 </div>
 
 <div className="border-t border-border pt-4 mt-4">
 <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Add Item to Transfer</label>
 <div className="flex gap-2">
 <input type="text" placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} className="flex-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-border" />
 <input type="number" placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} className="w-20 p-2 border rounded-lg dark:bg-zinc-900 dark:border-border" />
 <button onClick={handleAddItem} className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"><Plus className="h-5 w-5" /></button>
 </div>
 </div>

 {items.length > 0 && (
 <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg text-sm space-y-2">
 {items.map((it, idx) => (
 <div key={idx} className="flex justify-between">
 <span>{it.medicine_barcode}</span>
 <span className="font-bold">{it.quantity} units</span>
 </div>
 ))}
 </div>
 )}
 </div>
 <div className="p-4 border-t border-border bg-neutral-100 dark:bg-neutral-800">
 <button onClick={handleSubmit} disabled={createTransfer.isPending} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-xl">Initiate Transfer</button>
 </div>
 </div>
 </div>
 );
}
