"use client";

import { Eye, Search, Filter } from "lucide-react";
import { Purchase } from "@/data/mock-purchases";

export function PurchasesTable({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl shadow-sm">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2F2F2F] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search purchases..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#212121] rounded-lg text-sm bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#212121]">
          <Filter className="h-4 w-4" />
          All Status
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-[#212121] text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Expected Delivery</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
            {purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="hover:bg-gray-50/50 dark:hover:bg-[#212121]"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {purchase.invoice}
                    </div>
                    <div className="text-xs text-gray-500">
                      {purchase.itemsCount} items
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {purchase.supplier}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                  {purchase.orderDate}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                  {purchase.expectedDelivery}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                  USD {purchase.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      purchase.status === "Delivered"
                        ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                        : purchase.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
                        : "bg-gray-50 text-gray-700 border-gray-100"
                    }`}
                  >
                    {/* Status Icon */}
                    {purchase.status === "Delivered" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 current-color" />
                    )}

                    {purchase.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
