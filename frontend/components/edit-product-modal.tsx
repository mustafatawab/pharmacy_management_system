"use client";

import { Modal } from "@/components/modal";
import { Package, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateMedicine } from "@/hooks/useMedicine";
import { useCategories } from "@/hooks/useCategory";
import { toast } from "react-hot-toast";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: any;
}

export function EditProductModal({ isOpen, onClose, medicine }: EditProductModalProps) {
  const { data: categories } = useCategories();
  const updateMedicine = useUpdateMedicine();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    unit: "tablet",
    quantity: 0,
    selling_price: 0,
    purchase_price: 0,
    is_active: true,
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || "",
        description: medicine.description || "",
        category_id: medicine.category_id?.toString() || "",
        unit: medicine.unit || "tablet",
        quantity: medicine.quantity || 0,
        selling_price: medicine.selling_price || 0,
        purchase_price: medicine.purchase_price || 0,
        is_active: medicine.is_active ?? true,
      });
    }
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id)
      };
      await updateMedicine.mutateAsync({ id: medicine.id, data: payload });
      toast.success("Medicine updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Medicine"
      icon={<Package className="h-6 w-6" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            >
              <option value="">Select category</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Selling Price (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              name="selling_price"
              type="number"
              required
              value={formData.selling_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Purchase Price (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              name="purchase_price"
              type="number"
              required
              value={formData.purchase_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              name="quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              required
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            >
              <option value="tablet">Tablet</option>
              <option value="bottle">Bottle</option>
              <option value="strip">Strip</option>
              <option value="box">Box</option>
              <option value="injection">Injection</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white dark:bg-[#212121]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#2F2F2F]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Medicine
          </button>
        </div>
      </form>
    </Modal>
  );
}
