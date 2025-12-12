"use client";

import { Package } from "lucide-react";

export function TopProducts() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-[#2F2F2F] dark:border-[#2F2F2F]">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-green-100 p-2 text-green-600">
          <Package className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Selling Products
        </h3>
      </div>
      <div className="flex h-[200px] flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No sales data available for this period
        </p>
      </div>
    </div>
  );
}
