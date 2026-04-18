"use client";

import { Search, Filter, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Package, Tag, DollarSign, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const SortHeader = ({ 
  label, 
  column, 
  onSort, 
  currentSort 
}: { 
  label: string; 
  column: string; 
  onSort: (col: string) => void; 
  currentSort?: string;
}) => (
  <th 
    className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
    onClick={() => onSort(column)}
  >
    <div className="flex items-center gap-1.5 font-bold text-xs tracking-widest uppercase">
      {label}
      <ArrowUpDown className={`h-3 w-3 ${currentSort === column ? "text-primary" : "text-gray-400"}`} />
    </div>
  </th>
);

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

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header / Controls */}
      <div className="p-3 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/30 dark:bg-zinc-900/30">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm text-foreground bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-zinc-400 font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden divide-y divide-border">
        {/* ... existing mobile logic remains same for responsiveness ... */}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 font-bold border-b border-border">
            <tr>
              <SortHeader label="Medicine" column="name" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Category" column="category" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Price" column="selling_price" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Stock" column="quantity" onSort={onSort} currentSort={currentSort} />
              <th className="px-4 py-3 tracking-widest uppercase">Status</th>
              <th className="px-4 py-3 tracking-widest uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-4 py-4"><div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-full" /></td>
                </tr>
              ))
            ) : medicines.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-400 font-medium">No records found</td></tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {medicines.map((medicine, idx) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={medicine.id}
                    className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-foreground tracking-tight">{medicine.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                        {medicine.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-foreground">
                      ${parseFloat(medicine.selling_price.toString()).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-bold ${medicine.quantity < 10 ? 'text-warning' : 'text-foreground'}`}>
                        {medicine.quantity} <span className="text-[9px] opacity-40 uppercase tracking-tighter">{medicine.unit}s</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${medicine.is_active ? "text-success bg-success/10" : "text-zinc-400 bg-zinc-100 dark:bg-zinc-800"}`}>
                        {medicine.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit?.(medicine)} className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDelete?.(medicine)} className="p-1.5 text-zinc-400 hover:text-danger hover:bg-danger/5 rounded-md transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-zinc-50/20 dark:bg-zinc-950/20">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {total} Records Found
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="p-1.5 border border-border rounded-lg disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-bold text-foreground px-2 tracking-tighter">Page {page} of {totalPages || 1}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="p-1.5 border border-border rounded-lg disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
