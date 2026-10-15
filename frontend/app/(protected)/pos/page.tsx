"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, ShoppingCart, Scan } from "lucide-react";
import { ProductGrid } from "@/components/pos/product-grid";
import { POSCart } from "@/components/pos/pos-cart";
import { ReceiptModal } from "@/components/pos/receipt-modal";
import { AlternativesModal } from "@/components/pos/alternatives-modal";
import { useMedicines } from "@/hooks/useMedicine";
import { useCategories } from "@/hooks/useCategory";
import { useCreateSale, SaleCreate } from "@/hooks/useSale";
import { useTenant } from "@/hooks/useTenant";
import { useCustomers } from "@/hooks/useCustomer";
import { useInsurancePanels } from "@/hooks/useInsurance";
import { queueOfflineSale } from "@/lib/offlineSync";
import { Medicine, Category } from "@/lib/types";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export interface CartItem extends Medicine {
 cartQuantity: number;
 dispensedUnit: string; // Unit as selected at the counter (e.g. "strip", "box")
}

// ─── Barcode scan detection ─────────────────────────────────────────────────
// Barcode scanners emit characters very rapidly (< 50ms between keystrokes)
// followed by an Enter key. We detect this timing pattern.
const SCANNER_MAX_INTERVAL_MS = 50;

export default function POSPage() {
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [categoryFilter, setCategoryFilter] = useState("All");
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [completedSale, setCompletedSale] = useState<any | null>(null);
 const [showReceipt, setShowReceipt] = useState(false);
 
 // Phase 3 States
 const [paymentMethod, setPaymentMethod] = useState("cash");
 const [customerId, setCustomerId] = useState<number | undefined>();
 const [prescriptionNo, setPrescriptionNo] = useState("");
 const [doctorName, setDoctorName] = useState("");
 const [refillDuration, setRefillDuration] = useState<number | undefined>();
 const [showNarcoticsModal, setShowNarcoticsModal] = useState(false);

 // Phase 4 States
 const [insurancePanelId, setInsurancePanelId] = useState<number | undefined>();
 const [isOnline, setIsOnline] = useState(true);

 // Offline detection
 useEffect(() => {
 setIsOnline(navigator.onLine);
 const handleOnline = () => setIsOnline(true);
 const handleOffline = () => setIsOnline(false);
 window.addEventListener("online", handleOnline);
 window.addEventListener("offline", handleOffline);
 return () => {
 window.removeEventListener("online", handleOnline);
 window.removeEventListener("offline", handleOffline);
 };
 }, []);

 const searchInputRef = useRef<HTMLInputElement>(null);

 // Barcode scan state
 const [barcodeBuffer, setBarcodeBuffer] = useState("");
 const [barcodeScanning, setBarcodeScanning] = useState(false);
 const lastKeystrokeTime = useRef<number>(0);
 const barcodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

 const { data: medicinesData, isLoading: medicinesLoading } = useMedicines({
 search: searchQuery,
 page_size: 100,
 });

 const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
 const { data: tenant } = useTenant();
 const { data: customers = [] } = useCustomers();
 const { data: insurancePanels = [] } = useInsurancePanels();
 const createSale = useCreateSale();

 const currency = tenant?.currency || "PKR";

 // Cache catalog for offline use
 useEffect(() => {
 if (medicinesData?.items) {
 import('@/lib/offlineSync').then(({ cacheCatalog }) => cacheCatalog(medicinesData.items));
 }
 }, [medicinesData]);

 const filteredProducts = useMemo(() => {
 if (!medicinesData?.items) return [];
 return medicinesData.items.filter((product: Medicine) => {
 const matchesCategory =
 categoryFilter === "All" ||
 product.category?.name === categoryFilter ||
 String(product.category_id) === categoryFilter;
 return matchesCategory;
 });
 }, [medicinesData, categoryFilter]);

 // ─── Barcode scan handling ─────────────────────────────────────────────────
 const handleBarcodeScanned = useCallback(
 async (barcode: string) => {
 if (!barcode.trim()) return;

 setBarcodeScanning(true);
 try {
 const res = await fetch(
 `${process.env.API_URL || "http://localhost:8000"}/medicine/?barcode=${encodeURIComponent(barcode)}`,
 { credentials: "include" }
 );
 const data = await res.json();
 const product: Medicine | undefined = data?.items?.[0];

 if (product) {
 handleAddToCart(product);
 toast.success(`Scanned: ${product.name}`, {
 icon: "📦",
 duration: 1500,
 position: "bottom-center",
 });
 } else {
 toast.error(`No product found for barcode: ${barcode}`, {
 duration: 2000,
 });
 }
 } catch {
 toast.error("Barcode lookup failed");
 } finally {
 setBarcodeScanning(false);
 setBarcodeBuffer("");
 }
 },
 // eslint-disable-next-line react-hooks/exhaustive-deps
 [medicinesData]
 );

 // ─── Keyboard Navigation + Barcode Detection ───────────────────────────────
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 const now = Date.now();
 const interval = now - lastKeystrokeTime.current;
 lastKeystrokeTime.current = now;

 // Barcode scanner: rapid characters not in an input
 const activeEl = document.activeElement;
 const inTextInput =
 activeEl instanceof HTMLInputElement ||
 activeEl instanceof HTMLTextAreaElement;

 if (
 !inTextInput &&
 e.key.length === 1 &&
 interval < SCANNER_MAX_INTERVAL_MS
 ) {
 // Accumulate barcode buffer
 setBarcodeBuffer((prev) => prev + e.key);

 // Reset flush timer
 if (barcodeTimeout.current) clearTimeout(barcodeTimeout.current);
 barcodeTimeout.current = setTimeout(() => {
 setBarcodeBuffer((prev) => {
 if (prev.length >= 4) {
 handleBarcodeScanned(prev);
 }
 return "";
 });
 }, 100);

 return; // Don't propagate to navigation logic
 }

 // Barcode scanner sends Enter after the code
 if (e.key === "Enter" && barcodeBuffer.length >= 4) {
 if (barcodeTimeout.current) clearTimeout(barcodeTimeout.current);
 handleBarcodeScanned(barcodeBuffer);
 return;
 }

 // Focus search with '/'
 if (e.key === "/" && activeEl !== searchInputRef.current) {
 e.preventDefault();
 searchInputRef.current?.focus();
 }

 // Navigate products with arrows
 if (
 activeEl === searchInputRef.current ||
 activeEl === document.body
 ) {
 if (e.key === "ArrowDown") {
 e.preventDefault();
 setSelectedIndex((prev) =>
 Math.min(prev + 1, filteredProducts.length - 1)
 );
 } else if (e.key === "ArrowUp") {
 e.preventDefault();
 setSelectedIndex((prev) => Math.max(prev - 1, 0));
 } else if (e.key === "Enter" && filteredProducts[selectedIndex]) {
 e.preventDefault();
 handleAddToCart(filteredProducts[selectedIndex]);
 }
 }

 // Quick Pay with F12
 if (e.key === "F12") {
 e.preventDefault();
 handleCheckout();
 }
 };

 window.addEventListener("keydown", handleKeyDown);
 return () => window.removeEventListener("keydown", handleKeyDown);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [filteredProducts, selectedIndex, barcodeBuffer, handleBarcodeScanned]);

 // Reset selected index on search
 useEffect(() => {
 setSelectedIndex(0);
 }, [searchQuery, categoryFilter]);

 const [oosMedicine, setOosMedicine] = useState<Medicine | null>(null);

 const handleAddToCart = (product: Medicine) => {
 if (product.quantity <= 0) {
 toast.error(`${product.name} is out of stock`, { icon: "⚠️" });
 setOosMedicine(product);
 return;
 }
 setCartItems((prevItems) => {
 const existingItem = prevItems.find((item) => item.id === product.id);
 if (existingItem) {
 return prevItems.map((item) =>
 item.id === product.id
 ? { ...item, cartQuantity: item.cartQuantity + 1 }
 : item
 );
 }
 return [
 ...prevItems,
 {
 ...product,
 cartQuantity: 1,
 dispensedUnit: (product as any).base_unit || product.unit || "unit",
 },
 ];
 });
 toast.success(`Added ${product.name}`, {
 duration: 1000,
 position: "bottom-center",
 });
 };

 const handleRemoveFromCart = (id: number) => {
 setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
 };

 const handleUpdateQuantity = (id: number, delta: number) => {
 setCartItems((prevItems) =>
 prevItems.map((item) =>
 item.id === id
 ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) }
 : item
 )
 );
 };

 const handleUpdateUnit = (id: number, unit: string) => {
 setCartItems((prevItems) =>
 prevItems.map((item) =>
 item.id === id ? { ...item, dispensedUnit: unit } : item
 )
 );
 };

 const handleClearCart = () => setCartItems([]);

 const handleCheckout = async () => {
 if (cartItems.length === 0) {
 toast.error("Cart is empty");
 return;
 }

 const subtotal = cartItems.reduce(
 (sum, item) => sum + parseFloat(item.selling_price) * item.cartQuantity,
 0
 );
 const total = subtotal; // No tax hardcoded — use real tax config in future
 
 // Check if narcotics in cart without prescription
 const requiresPrescription = cartItems.some(item => (item as any).is_narcotic || (item as any).prescription_required);
 if (requiresPrescription && (!prescriptionNo || !doctorName)) {
 setShowNarcoticsModal(true);
 return;
 }

 let insAmount = undefined;
 let copay = undefined;
 
 if (paymentMethod === "insurance" && insurancePanelId) {
 const panel = insurancePanels.find((p: any) => p.id === insurancePanelId);
 if (panel) {
 insAmount = (total * panel.discount_percentage) / 100;
 copay = total - insAmount;
 }
 }

 const saleData: SaleCreate = {
 total_amount: subtotal,
 discount: 0,
 final_amount: total,
 payment_method: paymentMethod,
 customer_id: customerId,
 prescription_no: prescriptionNo || undefined,
 doctor_name: doctorName || undefined,
 refill_duration_days: refillDuration || undefined,
 insurance_panel_id: insurancePanelId,
 insurance_amount: insAmount,
 patient_copay: copay,
 items: cartItems.map((item) => ({
 medicine_id: item.id,
 quantity: item.cartQuantity,
 unit_price: parseFloat(item.selling_price),
 dispensed_unit: item.dispensedUnit,
 })),
 };

 if (!isOnline) {
 // Offline fallback
 const queued = await queueOfflineSale(saleData);
 if (queued) {
 toast.success("Offline Sale Queued for Sync", { icon: "🔌" });
 // Mock a completed sale for the receipt
 setCompletedSale({ ...saleData, id: "OFFLINE", items: saleData.items.map((i, idx) => ({ ...i, medicine_name: cartItems[idx]?.name })) });
 setShowReceipt(true);
 handleClearCart();
 } else {
 toast.error("Failed to queue offline sale");
 }
 return;
 }

 try {
 const sale = await createSale.mutateAsync(saleData);

 // Enrich sale items with medicine names for receipt
 const enrichedSale = {
 ...sale,
 items: sale.items.map((si: any, idx: number) => ({
 ...si,
 medicine_name: cartItems[idx]?.name,
 })),
 };

 setCompletedSale(enrichedSale);
 setShowReceipt(true);
 handleClearCart();
 toast.success("Transaction Complete", { icon: "💰" });
 } catch (error: any) {
 toast.error(error.response?.data?.detail || "Checkout Failed");
 }
 };

 const categories = useMemo(() => {
 const baseCategories = ["All"];
 if (categoriesData)
 return [...baseCategories, ...categoriesData.map((c: Category) => c.name)];
 return baseCategories;
 }, [categoriesData]);

 const isLoading = medicinesLoading || categoriesLoading;

 return (
 <>
 {oosMedicine && (
 <AlternativesModal
 medicine={oosMedicine}
 onClose={() => setOosMedicine(null)}
 onAddToCart={(alt) => {
 handleAddToCart(alt);
 setOosMedicine(null);
 }}
 />
 )}
 
 {/* ── Receipt Modal ── */}
 {showReceipt && completedSale && (
 <ReceiptModal
 sale={completedSale}
 tenant={tenant || null}
 cashierName={undefined}
 onClose={() => {
 setShowReceipt(false);
 setCompletedSale(null);
 }}
 />
 )}

 {/* ── Narcotics/Prescription Modal ── */}
 {showNarcoticsModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-200 dark:border-red-900/50">
 <h3 className="h3 text-xl font-bold text-red-600 mb-2">Prescription Required</h3>
 <p className="text-sm text-muted-foreground mb-6">One or more items in the cart are controlled substances. You must log the prescription details to complete this sale.</p>
 
 <div className="space-y-4">
 <div>
 <label className="text-sm font-semibold">Doctor Name *</label>
 <input 
 type="text" 
 value={doctorName}
 onChange={(e) => setDoctorName(e.target.value)}
 className="w-full mt-1 px-3 py-2 border border-border dark:border-zinc-700 rounded-lg dark:bg-neutral-800"
 />
 </div>
 <div>
 <label className="text-sm font-semibold">Prescription / License Number *</label>
 <input 
 type="text" 
 value={prescriptionNo}
 onChange={(e) => setPrescriptionNo(e.target.value)}
 className="w-full mt-1 px-3 py-2 border border-border dark:border-zinc-700 rounded-lg dark:bg-neutral-800"
 />
 </div>
 <div className="flex gap-3 pt-4">
 <button 
 onClick={() => setShowNarcoticsModal(false)}
 className="flex-1 py-2 rounded-lg border border-border font-semibold"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setShowNarcoticsModal(false);
 handleCheckout();
 }}
 disabled={!doctorName || !prescriptionNo}
 className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
 >
 Confirm & Pay
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
 {/* Top Action Bar */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl shadow-sm">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-primary/10 rounded-xl">
 <ShoppingCart className="h-5 w-5 text-primary" />
 </div>
 <div>
 <h2 className="h2 text-sm font-bold text-foreground uppercase tracking-wider">
 Point of Sale
 </h2>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2 mt-1">
 <span>Terminal Active · {currency}</span>
 {isOnline ? (
 <span className="text-green-500 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Online
 </span>
 ) : (
 <span className="text-red-500 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Offline
 </span>
 )}
 {barcodeScanning && (
 <span className="ml-2 text-amber-500 animate-pulse">
 · Scanner Active
 </span>
 )}
 </p>
 </div>
 </div>

 <div className="flex-1 w-full max-w-2xl flex gap-2">
 <div className="relative flex-1 group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
 {barcodeScanning && (
 <Scan className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 animate-pulse" />
 )}
 <input
 ref={searchInputRef}
 type="text"
 placeholder="Search ( Press '/' to focus ) or scan barcode"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-neutral-50/50 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
 />
 </div>
 <select
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 className="px-4 py-2.5 rounded-xl border border-border bg-neutral-50/50 focus:bg-card focus:outline-none text-sm font-bold text-muted-foreground appearance-none min-w-[140px] cursor-pointer shadow-sm"
 >
 {categories.map((cat) => (
 <option key={cat} value={cat}>
 {cat}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* Main Grid Area */}
 <div className="flex-1 flex gap-4 overflow-hidden">
 {/* Products Section */}
 <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 {isLoading ? (
 <div className="flex-1 flex items-center justify-center bg-card rounded-2xl">
 <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
 </div>
 ) : (
 <ProductGrid
 products={filteredProducts}
 onAddToCart={handleAddToCart}
 selectedIndex={selectedIndex}
 />
 )}
 </div>

 {/* Cart Column */}
 <div className="w-[380px] shrink-0 flex flex-col">
 <POSCart
 cartItems={cartItems}
 onRemoveFromCart={handleRemoveFromCart}
 onUpdateQuantity={handleUpdateQuantity}
 onUpdateUnit={handleUpdateUnit}
 onClearCart={handleClearCart}
 onCheckout={handleCheckout}
 isProcessing={createSale.isPending}
 currency={currency}
 paymentMethod={paymentMethod}
 setPaymentMethod={setPaymentMethod}
 customerId={customerId}
 setCustomerId={setCustomerId}
 refillDuration={refillDuration}
 setRefillDuration={setRefillDuration}
 customers={customers}
 insurancePanelId={insurancePanelId}
 setInsurancePanelId={setInsurancePanelId}
 insurancePanels={insurancePanels}
 />

 {/* Quick Shortcuts Footer */}
 <div className="mt-3 p-3 bg-neutral-900 rounded-xl text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em] flex justify-between items-center border border-white/5">
 <div className="flex gap-3">
 <span className="flex items-center gap-1.5">
 <kbd className="px-1 border border-border rounded bg-zinc-900">F12</kbd>
 Pay
 </span>
 <span className="flex items-center gap-1.5">
 <kbd className="px-1 border border-border rounded bg-zinc-900">/</kbd>
 Search
 </span>
 <span className="flex items-center gap-1.5">
 <Scan className="h-3 w-3" />
 Scan
 </span>
 </div>
 <div className="text-muted-foreground">Secure Session · v2.0</div>
 </div>
 </div>
 </div>
 </div>
 </>
 );
}
