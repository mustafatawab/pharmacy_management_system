"use client";

import { InventorySummaryCard } from "@/components/inventory-summary-card";
import { InventoryTable } from "@/components/inventory-table";
import { AddProductModal } from "@/components/add-product-modal";
import { EditProductModal } from "@/components/edit-product-modal";
import { AddCategoryModal } from "@/components/add-category-modal";
import { ManageCategoriesModal } from "@/components/manage-categories-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { AlertTriangle, Calendar, Package, Plus, Tag, Settings2 } from "lucide-react";
import { useState } from "react";
import { useMedicines, useDeleteMedicine, MedicineFilter } from "@/hooks/useMedicine";
import { useExpiryAlerts } from "@/hooks/useDashboard";
import { useCategories } from "@/hooks/useCategory";
import { toast } from "react-hot-toast";
import { ExpiryTable } from "@/components/expiry-table";

export default function InventoryPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  
  const [filters, setFilters] = useState<MedicineFilter>({
    page: 1,
    page_size: 5,
    search: "",
    sort_by: "name",
    sort_order: "asc",
  });
  
  const [activeTab, setActiveTab] = useState<"catalog" | "expiry">("catalog");

  const { data: medicines, isLoading } = useMedicines(filters);
  const { data: categories } = useCategories();
  const { data: expiryAlerts = [], isLoading: isLoadingExpiry } = useExpiryAlerts();
  const deleteMedicine = useDeleteMedicine();
  
  // Use data directly from backend response
  const displayMedicines = medicines?.items?.map((m: any) => ({
    ...m,
    category: categories?.find((c: any) => c.id === m.category_id)?.name || "Uncategorized"
  })) || [];

  const totalItems = medicines?.total || 0;

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

  const handleEdit = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsEditProductOpen(true);
  };

  const handleDeleteClick = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMedicine) return;
    try {
      await deleteMedicine.mutateAsync(selectedMedicine.id);
      toast.success("Medicine deleted successfully");
      setIsDeleteConfirmOpen(false);
      setSelectedMedicine(null);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to delete medicine");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tighter">
            Inventory Terminal
          </h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Catalog Management</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsManageCategoriesOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Settings2 className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Tag className="h-4 w-4" />
            New Group
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20 group"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
            Add Medicine
          </button>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => {
          setIsEditProductOpen(false);
          setSelectedMedicine(null);
        }}
        medicine={selectedMedicine}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedMedicine(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Medicine"
        message={`Are you sure you want to delete "${selectedMedicine?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMedicine.isPending}
        variant="danger"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setActiveTab("catalog")} className="cursor-pointer">
          <InventorySummaryCard
            title="Total Products"
            value={totalItems.toString()}
            icon={<Package className="h-6 w-6" />}
            iconBgColor={activeTab === "catalog" ? "bg-primary/20" : "bg-primary/10"}
            iconColor="text-primary"
          />
        </div>
        <InventorySummaryCard
          title="Low Stock"
          value="-"
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <div onClick={() => setActiveTab("expiry")} className="cursor-pointer">
          <InventorySummaryCard
            title="Expiring Soon"
            value={expiryAlerts.length.toString()}
            icon={<Calendar className="h-6 w-6" />}
            iconBgColor={activeTab === "expiry" ? "bg-amber-100" : "bg-amber-50"}
            iconColor="text-amber-600"
          />
        </div>
      </div>

      {activeTab === "catalog" ? (
        <InventoryTable
          medicines={displayMedicines}
          isLoading={isLoading}
          total={totalItems}
          page={filters.page || 1}
          pageSize={filters.page_size || 10}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          currentSort={filters.sort_by}
          sortOrder={filters.sort_order}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Expiring Batches (Next 90 Days)</h3>
          <ExpiryTable 
            alerts={expiryAlerts} 
            isLoading={isLoadingExpiry} 
            onReturn={(batch) => {
              toast("RTS Workflow coming soon!", { icon: "🔄" });
            }}
          />
        </div>
      )}
    </div>
  );
}
