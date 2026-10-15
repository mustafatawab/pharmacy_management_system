import { Trash2, ShoppingCart, Plus, Minus, Package, X, Loader2, ArrowRight, ChevronDown } from "lucide-react";
import { Medicine } from "@/lib/types";

interface CartItem extends Medicine {
 cartQuantity: number;
 dispensedUnit: string;
}

interface POSCartProps {
 cartItems: CartItem[];
 onRemoveFromCart: (id: number) => void;
 onUpdateQuantity: (id: number, delta: number) => void;
 onUpdateUnit: (id: number, unit: string) => void;
 onClearCart: () => void;
 onCheckout: () => void;
 isProcessing?: boolean;
 currency?: string;
 // Phase 3 props
 paymentMethod: string;
 setPaymentMethod: (m: string) => void;
 customerId: number | undefined;
 setCustomerId: (id: number | undefined) => void;
 refillDuration: number | undefined;
 setRefillDuration: (days: number | undefined) => void;
 customers: any[];
 insurancePanelId?: number;
 setInsurancePanelId?: (id: number | undefined) => void;
 insurancePanels?: any[];
}

export function POSCart({
 cartItems,
 onRemoveFromCart,
 onUpdateQuantity,
 onUpdateUnit,
 onClearCart,
 onCheckout,
 isProcessing = false,
 currency = "PKR",
 paymentMethod,
 setPaymentMethod,
 customerId,
 setCustomerId,
 refillDuration,
 setRefillDuration,
 customers = [],
 insurancePanelId,
 setInsurancePanelId,
 insurancePanels = [],
}: POSCartProps) {
 const subtotal = cartItems.reduce(
 (sum, item) => sum + parseFloat(item.selling_price) * item.cartQuantity,
 0
 );
 const total = subtotal;

 const fmt = (val: number) => `${currency} ${val.toFixed(2)}`;

 return (
 <div className="w-full flex flex-col bg-card rounded-2xl overflow-hidden h-full shadow-sm">
 <div className="p-4 border-b border-zinc-50 dark:border-zinc-900 flex justify-between items-center bg-neutral-50/50 dark:bg-zinc-900/50">
 <div className="flex items-center gap-2">
 <ShoppingCart className="h-4 w-4 text-muted-foreground" />
 <h3 className="h3 text-xs font-bold text-foreground uppercase tracking-widest">
 Shopping Cart
 </h3>
 </div>
 {cartItems.length > 0 && (
 <button
 onClick={onClearCart}
 className="text-[10px] font-bold text-muted-foreground hover:text-danger uppercase tracking-tighter transition-colors"
 >
 Clear
 </button>
 )}
 </div>

 {/* Cart Items List */}
 <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
 {cartItems.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground px-6">
 <div className="mb-4 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl">
 <Package className="h-8 w-8 text-zinc-300 dark:text-muted-foreground" />
 </div>
 <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
 Cart is Empty
 </p>
 <p className="text-[10px] font-medium opacity-60 mt-1">Add items to start transaction</p>
 </div>
 ) : (
 cartItems.map((item) => {
 // Build available units: base_unit + any unit_conversions from_unit
 const baseUnit = (item as any).base_unit || item.unit || "unit";
 const availableUnits: string[] = [baseUnit];
 // unit_conversions populated if returned by API
 if (Array.isArray((item as any).unit_conversions)) {
 for (const uc of (item as any).unit_conversions) {
 if (!availableUnits.includes(uc.from_unit)) {
 availableUnits.push(uc.from_unit);
 }
 }
 } else if (item.unit && item.unit !== baseUnit && !availableUnits.includes(item.unit)) {
 availableUnits.push(item.unit);
 }

 return (
 <div
 key={item.id}
 className="bg-neutral-50/50 dark:bg-zinc-900/50 p-3 rounded-xl flex flex-col gap-2 group transition-all hover:bg-zinc-100/50 dark:hover:bg-neutral-800/50"
 >
 <div className="flex justify-between items-start">
 <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-tight">
 {item.name}
 </h4>
 <button
 onClick={() => onRemoveFromCart(item.id)}
 className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
 >
 <X className="h-3.5 w-3.5" />
 </button>
 </div>

 {/* Unit Selector */}
 {availableUnits.length > 1 && (
 <div className="relative">
 <select
 value={item.dispensedUnit}
 onChange={(e) => onUpdateUnit(item.id, e.target.value)}
 className="w-full text-[10px] font-bold text-muted-foreground bg-card border border-border rounded-lg px-2 py-1 appearance-none cursor-pointer pr-6"
 >
 {availableUnits.map((u) => (
 <option key={u} value={u}>
 Sell per {u}
 </option>
 ))}
 </select>
 <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground pointer-events-none" />
 </div>
 )}

 <div className="flex justify-between items-center mt-1">
 <span className="text-xs font-extrabold text-primary">
 {fmt(parseFloat(item.selling_price) * item.cartQuantity)}
 </span>
 <div className="flex items-center gap-1 bg-card rounded-lg p-0.5 shadow-sm border border-border">
 <button
 onClick={() => onUpdateQuantity(item.id, -1)}
 className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-all disabled:opacity-20"
 disabled={item.cartQuantity <= 1}
 >
 <Minus className="h-3 w-3" />
 </button>
 <span className="text-[10px] font-bold w-5 text-center text-foreground">
 {item.cartQuantity}
 </span>
 <button
 onClick={() => onUpdateQuantity(item.id, 1)}
 className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-all"
 >
 <Plus className="h-3 w-3" />
 </button>
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>

 {/* Footer / Totals */}
 {cartItems.length > 0 && (
 <div className="p-4 bg-neutral-50/50 dark:bg-zinc-900/50 border-t border-border dark:border-zinc-900 flex flex-col gap-3">
 
 <div className="grid grid-cols-2 gap-2">
 <select
 value={paymentMethod}
 onChange={(e) => setPaymentMethod(e.target.value)}
 className="text-xs font-bold text-muted-foreground bg-card border border-border rounded-lg p-2"
 >
 <option value="cash">Cash</option>
 <option value="card">Card</option>
 <option value="credit">Credit / Khata</option>
 <option value="insurance">Insurance Split</option>
 </select>
 
 {paymentMethod === "insurance" ? (
 <select
 value={insurancePanelId || ""}
 onChange={(e) => setInsurancePanelId?.(e.target.value ? Number(e.target.value) : undefined)}
 className="text-xs font-bold text-muted-foreground bg-card border border-border rounded-lg p-2"
 >
 <option value="">Select Insurance</option>
 {insurancePanels.map(p => <option key={p.id} value={p.id}>{p.name} ({p.discount_percentage}%)</option>)}
 </select>
 ) : (
 <select
 value={customerId || ""}
 onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : undefined)}
 className="text-xs font-bold text-muted-foreground bg-card border border-border rounded-lg p-2"
 >
 <option value="">Guest Walk-in</option>
 {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
 </select>
 )}
 </div>
 
 <div className="flex items-center gap-2">
 <input
 type="number"
 placeholder="Refill in (Days)"
 value={refillDuration || ""}
 onChange={(e) => setRefillDuration(e.target.value ? Number(e.target.value) : undefined)}
 className="w-full text-xs bg-card border border-border rounded-lg p-2"
 />
 </div>

 <div className="space-y-1.5 mt-2">
 <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
 <span>Subtotal</span>
 <span>{fmt(subtotal)}</span>
 </div>
 
 {paymentMethod === "insurance" && insurancePanelId && (
 <>
 {(() => {
 const panel = insurancePanels.find(p => p.id === insurancePanelId);
 const insAmount = panel ? (total * panel.discount_percentage / 100) : 0;
 const copay = total - insAmount;
 return (
 <div className="flex flex-col gap-1 text-[10px] font-bold">
 <div className="flex justify-between text-primary">
 <span>Insurance Claim ({panel?.discount_percentage}%)</span>
 <span>{fmt(insAmount)}</span>
 </div>
 <div className="flex justify-between text-green-500">
 <span>Patient Co-Pay</span>
 <span>{fmt(copay)}</span>
 </div>
 </div>
 );
 })()}
 </>
 )}

 <div className="flex justify-between text-base font-extrabold text-foreground pt-2 mt-2 border-t border-border tracking-tight">
 <span>Total</span>
 <span className="text-primary">{fmt(total)}</span>
 </div>
 </div>
 <button
 onClick={onCheckout}
 disabled={isProcessing}
 className="w-full bg-primary hover:bg-primary-hover disabled:bg-zinc-300 dark:disabled:bg-neutral-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
 >
 {isProcessing ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <>
 <ArrowRight className="h-4 w-4" />
 Complete Payment
 </>
 )}
 </button>
 </div>
 )}
 </div>
 );
}
