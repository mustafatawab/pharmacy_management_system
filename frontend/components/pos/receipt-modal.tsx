"use client";

import { Printer, X, CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface ReceiptItem {
  medicine_name?: string;
  medicine_id: number;
  quantity: number;
  dispensed_unit: string;
  unit_price: string | number;
  total_price: string | number;
}

interface ReceiptData {
  id: number;
  created_at: string;
  payment_method: string;
  total_amount: string | number;
  discount: string | number;
  final_amount: string | number;
  items: ReceiptItem[];
}

interface TenantInfo {
  name: string;
  address?: string;
  phone?: string;
  currency?: string;
}

interface ReceiptModalProps {
  sale: ReceiptData;
  tenant: TenantInfo | null;
  cashierName?: string;
  onClose: () => void;
}

export function ReceiptModal({ sale, tenant, cashierName, onClose }: ReceiptModalProps) {
  const currency = tenant?.currency || "PKR";
  const fmt = (val: string | number) =>
    `${currency} ${parseFloat(String(val)).toFixed(2)}`;

  const saleDate = new Date(sale.created_at);
  const dateStr = saleDate.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = saleDate.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* ── Backdrop (hidden on print) ── */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-sm relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 no-print">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-bold text-sm text-foreground">Transaction Complete</span>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Receipt Content — this is what gets printed */}
          <div id="receipt-content" className="p-4">
            {/* Pharmacy Header */}
            <div className="text-center mb-4 receipt-section">
              <h1 className="font-black text-base tracking-tight">
                {tenant?.name || "Pharmacy"}
              </h1>
              {tenant?.address && (
                <p className="text-xs text-zinc-500 mt-0.5">{tenant.address}</p>
              )}
              {tenant?.phone && (
                <p className="text-xs text-zinc-500">{tenant.phone}</p>
              )}
              <div className="border-t border-dashed border-zinc-300 mt-3 pt-2 text-[10px] text-zinc-400 flex justify-between">
                <span>{dateStr}</span>
                <span>Receipt #{sale.id}</span>
                <span>{timeStr}</span>
              </div>
              {cashierName && (
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Cashier: {cashierName}
                </p>
              )}
            </div>

            {/* Line Items */}
            <div className="border-t border-dashed border-zinc-300 pt-2 mb-2">
              <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              {sale.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-[10px] font-medium py-1 border-b border-zinc-50">
                  <span className="col-span-6 font-semibold text-foreground leading-tight">
                    {item.medicine_name || `Med #${item.medicine_id}`}
                  </span>
                  <span className="col-span-2 text-center text-zinc-500">
                    {item.quantity} {item.dispensed_unit}
                  </span>
                  <span className="col-span-2 text-right text-zinc-500">
                    {fmt(item.unit_price)}
                  </span>
                  <span className="col-span-2 text-right font-bold text-foreground">
                    {fmt(item.total_price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 mt-3">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Subtotal</span>
                <span>{fmt(sale.total_amount)}</span>
              </div>
              {parseFloat(String(sale.discount)) > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Discount</span>
                  <span>- {fmt(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-foreground border-t border-dashed border-zinc-300 pt-2 mt-2">
                <span>TOTAL</span>
                <span>{fmt(sale.final_amount)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Payment</span>
                <span className="uppercase font-bold">{sale.payment_method}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t border-dashed border-zinc-300 text-[9px] text-zinc-400">
              Thank you for your visit!
              <br />
              Please keep this receipt for returns/exchanges.
            </div>
          </div>

          {/* Action Buttons (hidden on print) */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 no-print">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
