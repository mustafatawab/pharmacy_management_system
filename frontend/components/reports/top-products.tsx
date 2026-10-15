"use client";

import { Package } from "lucide-react";

export function TopProducts() {
 return (
 <div className="rounded-xl border border-border bg-card p-6 shadow-sm dark:bg-neutral-800 ">
 <div className="mb-6 flex items-center gap-2">
 <div className="rounded-lg bg-green-100 p-2 text-green-600">
 <Package className="h-5 w-5" />
 </div>
 <h3 className="h3 text-lg font-semibold text-card-foreground">
 Top Selling Products
 </h3>
 </div>
 <div className="flex h-[200px] flex-col items-center justify-center text-center">
 <p className="text-muted-foreground">
 No sales data available for this period
 </p>
 </div>
 </div>
 );
}
