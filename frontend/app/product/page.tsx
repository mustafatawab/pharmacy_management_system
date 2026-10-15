"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuppliers } from "@/hooks/useSupplier";
import { useMedicines, useCreateMedicine, useUpdateMedicine } from "@/hooks/useMedicine";
import { DollarSign, Package, Check, X, Loader2, Menu, Plus } from "lucide-react";
import { AddProductModal } from "@/components/add-product-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductPage() {
 const router = useRouter();
 const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
 const { data: medicinesData, isLoading: medicinesLoading, refetch } = useMedicines();
 const medicines = medicinesData?.items || [];
 const createMedicine = useCreateMedicine();
 const updateMedicine = useUpdateMedicine();

 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
 const [formData, setFormData] = useState({
 name: "",
 description: "",
 unit: "",
 quantity: 0,
 selling_price: 0,
 purchase_price: 0,
 is_active: true,
 category_id: "",
 supplier_id: "",
 });

if (suppliersLoading || medicinesLoading) {
 return (
 <div className="flex items-center justify-center h-66 text-muted-foreground">
 Loading...
 </div>
 );
 }

 // Empty state when no products
 if (!medicines || medicines.length === 0) {
 return (
 <div className="flex min-h-screen items-center justify-center p-8 text-foreground">
 <div className="text-center">
 <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mx-auto mb-4">
 <Package className="h-8 w-8 text-muted" />
 </div>
 <h3 className="h3 text-xl font-medium text-foreground">No products yet</h3>
 <p className="text-muted-foreground mt-2">Add your first product to start tracking inventory.</p>
 <button
 onClick={() => window.location.href="/product/new"}
 className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
 >
 Add First Product
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="p-4">
 <h2 className="h2 text-2xl font-bold text-card-foreground mb-6">
 Product Management
 </h2>

 {/* Statistics Cards Row */}
 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-6">
 <div className="rounded-lg border border-border bg-card p-4 shadow-sm dark:border-[#212121] dark:bg-neutral-800">
 <h3 className="h3 text-sm font-medium text-card-foreground dark:text-muted-foreground">Total Products</h3>
 <p className="text-3xl font-bold text-card-foreground">{medicines.length}</p>
 </div>
 <div className="rounded-lg border border-border bg-card p-4 shadow-sm dark:border-[#212121] dark:bg-neutral-800">
 <h3 className="h3 text-sm font-medium text-card-foreground dark:text-muted-foreground">Low Stock</h3>
 <p className="text-3xl font-bold text-card-foreground">
 {medicines.filter((m: any) => m.quantity <= 10).length}
 </p>
 </div>
 </div>

 {/* Suppliers Filter */}
 <div className="card mb-4">
 <div className="p-4 border-b border-border dark:border-[#212121]">
 <h3 className="h3 font-medium text-card-foreground dark:text-muted-foreground">
 Filter by Supplier
 </h3>
 <div className="mt-2 flex flex-wrap gap-2">
 <button
 onClick={() => setFormData((p) => ({ ...p, supplier_id: "" }))}
 className={`rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#3F3F3F] ${formData.supplier_id === "" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
 >
 All
 </button>
 {suppliers.map((supplier: any) => (
 <button
 key={supplier.id}
 onClick={() => setFormData((p) => ({ ...p, supplier_id: supplier.id }))}
 className={`rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#3F3F3F] ${formData.supplier_id === supplier.id?.toString() ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
 >
 {supplier.company_name}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="grid grid-cols-1 gap-2 mb-4">
 <Link href="/product/new">
 <button
 className="flex-1 rounded-lg bg-primary hover:bg-primary-hover text-white py-2 px-4 text-sm font-medium flex items-center justify-center gap-2"
 >
 <Plus className="h-4 w-4" />
 Add New Product
 </button>
 </Link>
 </div>

 {/* Products Table */}
 <div className="rounded-lg border border-border overflow-hidden dark:border-[#212121]">
 <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-xs text-muted-foreground">
 <div className="grid grid-cols-2 lg:grid-cols-4">
 <div>Name</div>
 <div>Category</div>
 <div>Supplier</div>
 <div>Stock</div>
 <div>Price</div>
 </div>
 </div>
 <div className="divide-y divide-gray-200 dark:divide-gray-700">
 {medicines.map((med: any) => {
 const supplier = suppliers.find((s: any) => s.id === med.supplier_id);
 return (
 <div key={med.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-[#3F3F3F]">
 <div className="grid grid-cols-2 lg:grid-cols-4">
 <div className="font-medium text-card-foreground">{med.name}</div>
 <div className="text-xs text-muted-foreground">{med.category?.name || "—"}</div>
 <div className="text-xs text-muted-foreground">
 {supplier ? supplier.company_name : "—"}
 </div>
 <div className="text-xs text-muted-foreground">
 {med.quantity} {med.unit}
 </div>
 <div className="text-xs text-muted-foreground">
 {med.selling_price}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}