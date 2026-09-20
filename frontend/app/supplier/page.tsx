"use client";

import { useState } from "react";
import { 
  useSuppliers, 
  useCreateSupplier, 
  useUpdateSupplier, 
  useDeleteSupplier, 
  Supplier 
} from "@/hooks/useSupplier";
import { Plus, BookOpen, Trash, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { SupplierLedgerModal } from "@/components/supplier-ledger-modal";

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading, refetch } = useSuppliers();
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [ledgerSupplierId, setLedgerSupplierId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setIsAddingSupplier(false);
      setEditingSupplier(null);
      setFormData({ company_name: "", contact_person: "", email: "", phone: "", address: "" });
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier.mutateAsync(id);
        toast.success("Supplier deleted successfully");
        refetch();
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

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Suppliers & Ledger
          </h2>
          <p className="text-sm text-gray-500">Manage vendor accounts and payables</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setFormData({ company_name: "", contact_person: "", email: "", phone: "", address: "" });
            setIsAddingSupplier(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </button>
      </div>

      {isAddingSupplier && (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
              <input type="text" required value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
              <input type="text" required value={formData.contact_person} onChange={(e) => setFormData({...formData, contact_person: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <textarea rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddingSupplier(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition">Cancel</button>
              <button type="submit" disabled={createSupplier.isPending || updateSupplier.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                {editingSupplier ? "Update" : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Balance</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{supplier.company_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{supplier.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-gray-300">{supplier.contact_person}</div>
                  <div className="text-xs text-gray-500 mt-1">{supplier.phone}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-semibold ${supplier.outstanding_balance > 0 ? "text-red-600" : "text-green-600"}`}>
                    ${supplier.outstanding_balance}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setLedgerSupplierId(supplier.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition" title="View Ledger">
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(supplier)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 transition" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(supplier.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition" title="Delete">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No suppliers found. Click "Add Supplier" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ledgerSupplierId && (
        <SupplierLedgerModal 
          supplierId={ledgerSupplierId} 
          onClose={() => setLedgerSupplierId(null)} 
        />
      )}
    </div>
  );
}