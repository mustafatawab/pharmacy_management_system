"use client";

import { Search, Filter, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Medicine {
  id: number;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  selling_price: number;
  purchase_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface InventoryTableProps {
  medicines: Medicine[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onSort: (column: string) => void;
  currentSort?: string;
  sortOrder?: "asc" | "desc";
  onEdit?: (medicine: any) => void;
  onDelete?: (medicine: any) => void;
}

export function InventoryTable({
  medicines,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
  onSearch,
  onSort,
  currentSort,
  sortOrder,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const SortHeader = ({ label, column }: { label: string; column: string }) => (
    <th 
      className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2F2F2F] transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${currentSort === column ? "text-blue-500" : "text-gray-400"}`} />
      </div>
    </th>
  );

  return (
    <div className="bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl shadow-sm overflow-hidden">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2F2F2F] flex items-center justify-between gap-4 bg-white dark:bg-[#2F2F2F]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-[#212121] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#212121]">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-[#212121] text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
            <tr>
              <SortHeader label="Medicine" column="name" />
              <SortHeader label="Category" column="category" />
              <SortHeader label="Price" column="selling_price" />
              <SortHeader label="Stock" column="quantity" />
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 h-12 bg-gray-50/50 dark:bg-[#212121]"></td>
                </tr>
              ))
            ) : medicines.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No medicines found</td>
              </tr>
            ) : (
              medicines.map((medicine) => (
                <tr
                  key={medicine.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-[#212121] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {medicine.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Unit: {medicine.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {medicine.category}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    PKR {medicine.selling_price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {medicine.quantity} {medicine.unit}{medicine.quantity !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${medicine.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {medicine.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit?.(medicine)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete?.(medicine)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-[#2F2F2F] flex items-center justify-between bg-white dark:bg-[#2F2F2F]">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900 dark:text-gray-100">{medicines.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(page * pageSize, total)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{total}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="p-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#212121]"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="p-2 border border-gray-200 dark:border-[#2F2F2F] rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
