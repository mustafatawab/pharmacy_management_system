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
    <div className="bg-card rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
      {/* Table Header / Controls */}
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border-none rounded-xl text-sm text-foreground bg-white dark:bg-zinc-950 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-zinc-400 font-bold"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-950 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-zinc-50/30 dark:bg-zinc-900/30 text-zinc-400 font-bold">
            <tr>
              <SortHeader label="Medicine" column="name" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Category" column="category" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Price" column="selling_price" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Stock" column="quantity" onSort={onSort} currentSort={currentSort} />
              <th className="px-6 py-4 tracking-[0.2em] uppercase opacity-60">Status</th>
              <th className="px-6 py-4 tracking-[0.2em] uppercase text-right opacity-60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-5"><div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full" /></td>
                </tr>
              ))
            ) : medicines.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-16 text-center text-zinc-400 font-bold uppercase tracking-widest">No inventory records</td></tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {medicines.map((medicine, idx) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={medicine.id}
                    className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight text-sm">{medicine.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-widest group-hover:bg-white dark:group-hover:bg-zinc-950 transition-colors">
                        {medicine.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">
                      ${parseFloat(medicine.selling_price.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold flex items-baseline gap-1 ${medicine.quantity < 10 ? 'text-warning' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        <span className="text-sm">{medicine.quantity}</span>
                        <span className="text-[9px] opacity-60 uppercase tracking-tighter">{medicine.unit}s</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] ${medicine.is_active ? "text-success bg-success/5" : "text-zinc-400 bg-zinc-100 dark:bg-zinc-800"}`}>
                        <div className={`h-1 w-1 rounded-full ${medicine.is_active ? "bg-success animate-pulse" : "bg-zinc-300"}`} />
                        {medicine.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => onEdit?.(medicine)} className="p-2 text-zinc-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-950 rounded-xl transition-all shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDelete?.(medicine)} className="p-2 text-zinc-400 hover:text-danger hover:bg-white dark:hover:bg-zinc-950 rounded-xl transition-all shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
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
      <div className="px-6 py-4 bg-zinc-50/20 dark:bg-zinc-950/20 flex items-center justify-between">
        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          Inventory Feed · <span className="text-zinc-600 dark:text-zinc-300">{total} Items</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="p-2 bg-white dark:bg-zinc-900 rounded-xl disabled:opacity-20 hover:text-primary transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Page {page} of {totalPages || 1}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="p-2 bg-white dark:bg-zinc-900 rounded-xl disabled:opacity-20 hover:text-primary transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
