"use client";

import { Search, Filter, Pencil, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  batch: string;
  category: string;
  price: string;
  stock: number;
  minStock: number;
  expiry: string;
  status: "Low Stock" | "Expiring Soon" | "Good";
  statusColor?: string; // Optional custom color, logic handled in component usually but passed for mock
}

export function InventoryTable({ products }: { products: Product[] }) {
  return (
    <div className="bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl shadow-sm">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2F2F2F] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-[#212121] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#212121]">
          <Filter className="h-4 w-4" />
          All Products
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-[#212121] text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/50 dark:hover:bg-[#212121]"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Batch: {product.batch}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {product.category}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  {product.price}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {product.stock} units
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {product.minStock}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {product.expiry}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    {product.status === "Low Stock" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    )}
                    {/* Always showing expiring soon for demo based on image, logic would be dynamic */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Expiring Soon
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
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
