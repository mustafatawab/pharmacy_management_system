"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuppliers } from "@/hooks/useSupplier";
import { Supplier } from "@/hooks/useSupplier";
import { DollarSign, Package, TrendingUp, Users, Loader2, Menu, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useNavigate } from "next/navigation";

export default function SuppliersPage() {
  const navigate = useNavigate();
  const { data: suppliers = [], isLoading: suppliersLoading, refetch } = useSuppliers();

  if (suppliersLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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

  const handleSubmit = async () => {
    try {
      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          data: formData,
        });
        toast({ title: "Supplier updated successfully" });
      } else {
        await createSupplier.mutateAsync(formData);
        toast({ title: "Supplier created successfully" });
      }
      setIsAddingSupplier(false);
      setFormData({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });
      refetch();
    } catch (error: any) {
      toast({ title: error?.response?.data?.detail || "Something went wrong", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier.mutateAsync(id);
        toast({ title: "Supplier deleted successfully" });
        refetch();
      } catch (error: any) {
        toast({ title: error?.response?.data?.detail || "Failed to delete supplier", variant: "destructive" });
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
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Suppliers Management
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setIsAddingSupplier(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </button>
      </div>

      {/* Add Supplier Form */}
      {isAddingSupplier && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#212121] dark:bg-[#212121] max-w-lg">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingSupplier(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#2F2F2F] dark:text-gray-300 dark:hover:bg-[#2F2F2F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingSupplier ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="mt-6 rounded-lg border border-gray-200 overflow-hidden dark:border-[#212121]">
        <div className="bg-gray-50 dark:bg-[#2F2F2F] px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="grid grid-cols-3">
            <div>Company Name</div>
            <div>Contact Person</div>
            <div>Email</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {suppliers.map((supplier: Supplier) => (
            <div key={supplier.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#3F3F3F]">
              <div className="grid grid-cols-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  {supplier.company_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {supplier.contact_person}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {supplier.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No suppliers message */}
      {suppliers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No suppliers found. Click "Add Supplier" to get started.
        </div>
      )}
    </div>
  );
}