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
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search medicines by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm text-foreground bg-gray-50/50 dark:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-gray-500 font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
            <Filter className="h-4 w-4" />
            Advanced Filter
          </button>
        </div>
      </div>

      {/* Mobile Card View (Visible on small screens) */}
      <div className="block lg:hidden divide-y divide-border">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 dark:bg-zinc-800 rounded-md mb-2" />
              <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 rounded-md" />
            </div>
          ))
        ) : medicines.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No medicines found</div>
        ) : (
          medicines.map((medicine, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={medicine.id}
              className="p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground">{medicine.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{medicine.category}</span>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${medicine.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                  {medicine.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{medicine.quantity} {medicine.unit}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-bold text-primary">PKR {medicine.selling_price}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => onEdit?.(medicine)} className="flex-1 py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg">Edit</button>
                <button onClick={() => onDelete?.(medicine)} className="flex-1 py-2 bg-danger/5 text-danger text-xs font-bold rounded-lg">Delete</button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden lg:block overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-gray-500 font-medium border-b border-border">
            <tr>
              <SortHeader label="Medicine" column="name" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Category" column="category" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Price" column="selling_price" onSort={onSort} currentSort={currentSort} />
              <SortHeader label="Stock" column="quantity" onSort={onSort} currentSort={currentSort} />
              <th className="px-6 py-4 font-bold text-xs tracking-widest uppercase">Status</th>
              <th className="px-6 py-4 font-bold text-xs tracking-widest uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 h-12">
                    <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-md w-full" />
                  </td>
                </tr>
              ))
            ) : medicines.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No medicines found in inventory</td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {medicines.map((medicine, idx) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    key={medicine.id}
                    className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {medicine.name}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Unit: {medicine.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                        <Tag className="h-3 w-3" />
                        {medicine.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-foreground">
                        PKR {medicine.selling_price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${medicine.quantity < 10 ? 'text-warning' : 'text-foreground'}`}>
                        {medicine.quantity} <span className="text-[10px] opacity-60 uppercase">{medicine.unit}s</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${medicine.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                        <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${medicine.is_active ? "bg-success" : "bg-danger"}`} />
                        {medicine.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit?.(medicine)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete?.(medicine)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
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
      <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30 dark:bg-zinc-900/30">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-foreground">{medicines.length > 0 ? (page - 1) * pageSize + 1 : 0}</span>-
          <span className="text-foreground">{Math.min(page * pageSize, total)}</span> of 
          <span className="text-foreground"> {total}</span> results
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="p-2.5 border border-border rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${page === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "border border-border hover:bg-white dark:hover:bg-zinc-800 text-gray-500"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="p-2.5 border border-border rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
