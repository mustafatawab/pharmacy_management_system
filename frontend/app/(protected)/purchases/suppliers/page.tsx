"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Pencil, Trash2 } from "lucide-react";
import {
 useSuppliers,
 useCreateSupplier,
 useUpdateSupplier,
 useDeleteSupplier,
 Supplier,
} from "@/hooks/useSupplier";
import toast from "react-hot-toast";

export default function SuppliersPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [isAddingSupplier, setIsAddingSupplier] = useState(false);
 const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
 const [formData, setFormData] = useState({
 company_name: "",
 contact_person: "",
 email: "",
 phone: "",
 address: "",
 });

 const { data: suppliers = [], isLoading } = useSuppliers();
 const createSupplier = useCreateSupplier();
 const updateSupplier = useUpdateSupplier();
 const deleteSupplier = useDeleteSupplier();

 const filteredSuppliers = suppliers.filter((supplier: Supplier) =>
 supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const handleSubmit = async () => {
 try {
 if (editingSupplier) {
 await updateSupplier.mutateAsync({
 id: editingSupplier.id,
 data: formData,
 });
 toast.success("Supplier updated successfully");
 } else {
 await createSupplier.mutateAsync(formData);
 toast.success("Supplier created successfully");
 }
 resetForm();
 } catch (error: any) {
 toast.error(error?.response?.data?.detail || "Something went wrong");
 }
 };

 const handleDelete = async (id: string) => {
 if (confirm("Are you sure you want to delete this supplier?")) {
 try {
 await deleteSupplier.mutateAsync(id);
 toast.success("Supplier deleted successfully");
 } catch (error: any) {
 toast.error(error?.response?.data?.detail || "Failed to delete supplier");
 }
 }
 };

 const handleEdit = (supplier: Supplier) => {
 setEditingSupplier(supplier);
 setFormData({
 company_name: supplier.company_name,
 contact_person: supplier.contact_person,
 email: supplier.email,
 phone: supplier.phone,
 address: supplier.address,
 });
 setIsAddingSupplier(true);
 };

 const resetForm = () => {
 setFormData({
 company_name: "",
 contact_person: "",
 email: "",
 phone: "",
 address: "",
 });
 setIsAddingSupplier(false);
 setEditingSupplier(null);
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="text-muted-foreground">Loading suppliers...</div>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <Link
 href="/purchases"
 className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-neutral-50 hover:text-card-foreground dark:border-[#212121] dark:bg-neutral-900 dark:text-muted-foreground dark:hover:bg-[#2F2F2F] dark:hover:text-white"
 >
 <ArrowLeft className="h-4 w-4" />
 </Link>
 <h1 className="h1 text-xl font-bold text-card-foreground">
 Suppliers Management
 </h1>
 </div>
 <button
 onClick={() => setIsAddingSupplier(true)}
 className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
 >
 <Plus className="h-4 w-4" />
 Add Supplier
 </button>
 </div>

 {/* Add/Edit Supplier Form */}
 {isAddingSupplier && (
 <div className="rounded-xl border border-border bg-card p-6 shadow-sm dark:border-[#212121] dark:bg-neutral-900">
 <h2 className="h2 mb-6 text-lg font-semibold text-card-foreground">
 {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
 </h2>
 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Company Name *
 </label>
 <input
 type="text"
 placeholder="Enter company name"
 value={formData.company_name}
 onChange={(e) =>
 setFormData({ ...formData, company_name: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Contact Person *
 </label>
 <input
 type="text"
 placeholder="Enter contact person name"
 value={formData.contact_person}
 onChange={(e) =>
 setFormData({ ...formData, contact_person: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Email *
 </label>
 <input
 type="email"
 placeholder="Enter email address"
 value={formData.email}
 onChange={(e) =>
 setFormData({ ...formData, email: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Phone *
 </label>
 <input
 type="tel"
 placeholder="Enter phone number"
 value={formData.phone}
 onChange={(e) =>
 setFormData({ ...formData, phone: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 <div className="flex flex-col gap-2 md:col-span-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Address
 </label>
 <textarea
 rows={3}
 placeholder="Enter complete address"
 value={formData.address}
 onChange={(e) =>
 setFormData({ ...formData, address: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button
 onClick={resetForm}
 className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#2F2F2F]"
 >
 Cancel
 </button>
 <button
 onClick={handleSubmit}
 disabled={createSupplier.isPending || updateSupplier.isPending}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
 >
 {editingSupplier ? "Update Supplier" : "Add Supplier"}
 </button>
 </div>
 </div>
 )}

 {/* Search */}
 <div className="relative">
 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
 <input
 type="text"
 placeholder="Search suppliers..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm text-card-foreground placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#212121] dark:bg-neutral-900 dark:placeholder-gray-400"
 />
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
 {filteredSuppliers.map((supplier: Supplier) => (
 <div
 key={supplier.id}
 className="rounded-xl border border-border bg-card p-6 shadow-sm dark:border-[#212121] dark:bg-neutral-900"
 >
 <div className="mb-4 flex items-start justify-between">
 <div>
 <h3 className="h3 text-lg font-semibold text-card-foreground">
 {supplier.company_name}
 </h3>
 <p className="text-sm text-muted-foreground">
 {supplier.contact_person}
 </p>
 </div>
 <div className="flex gap-2">
 <button
 onClick={() => handleEdit(supplier)}
 className="rounded-lg p-2 text-muted-foreground hover:bg-neutral-100 hover:text-primary dark:hover:bg-[#3F3F3F]"
 >
 <Pencil className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleDelete(supplier.id)}
 className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </div>
 <div className="space-y-2 text-sm">
 <p className="text-muted-foreground">
 <span className="font-medium">Email:</span> {supplier.email}
 </p>
 <p className="text-muted-foreground">
 <span className="font-medium">Phone:</span> {supplier.phone}
 </p>
 <p className="text-muted-foreground">
 <span className="font-medium">Address:</span> {supplier.address}
 </p>
 </div>
 </div>
 ))}
 </div>

 {filteredSuppliers.length === 0 && (
 <div className="text-center py-12 text-muted-foreground">
 No suppliers found. Click "Add Supplier" to get started.
 </div>
 )}
 </div>
 );
}
