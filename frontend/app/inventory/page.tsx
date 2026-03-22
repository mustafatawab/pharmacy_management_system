"use client";

import { InventorySummaryCard } from "@/components/inventory-summary-card";
import { InventoryTable } from "@/components/inventory-table";
import { AddProductModal } from "@/components/add-product-modal";
import { AlertTriangle, Calendar, Package, Plus } from "lucide-react";
import { useState } from "react";
import { useMedicines, MedicineFilter } from "@/hooks/useMedicine";
import { useCategories } from "@/hooks/useCategory";

export default function InventoryPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [filters, setFilters] = useState<MedicineFilter>({
    page: 1,
    page_size: 10,
    search: "",
    sort_by: "name",
    sort_order: "asc",
  });

  // const { data, isLoading } = useMedicines(filters);
  const { data , isLoading} = useCategories()
  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (sort_by: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by,
      sort_order: prev.sort_by === sort_by && prev.sort_order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inventory Management
        </h2>
        <button
          onClick={() => setIsAddProductOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InventorySummaryCard
          title="Total Products"
          value={data?.total?.toString() || "0"}
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <InventorySummaryCard
          title="Low Stock"
          value="-"
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <InventorySummaryCard
          title="Expiring Soon"
          value="-"
          icon={<Calendar className="h-6 w-6" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <InventoryTable
        medicines={data?.items || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={filters.page || 1}
        pageSize={filters.page_size || 10}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        currentSort={filters.sort_by}
        sortOrder={filters.sort_order}
      />
    </div>
  );
}
