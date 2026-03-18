"use client";

import { Modal } from "@/components/modal";
import { Package, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateMedicine } from "@/hooks/useMedicine";
import { useCategories } from "@/hooks/useCategory";
import { toast } from "react-hot-toast";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const createMedicine = useCreateMedicine();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    unit: "tablet",
    quantity: 0,
    selling_price: 0,
    purchase_price: 0,
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    setLoading(true);
    try {
      await createMedicine.mutateAsync(formData);
      toast.success("Medicine added successfully");
      onClose();
      setFormData({
        name: "",
        description: "",
        category: "",
        unit: "tablet",
        quantity: 0,
        selling_price: 0,
        purchase_price: 0,
        is_active: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Medicine"
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
              placeholder="Enter medicine name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121]"
            >
              <option value="">Select category</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
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
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
            placeholder="Enter medicine description"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
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
            Add Medicine
          </button>
        </div>
      </form>
    </Modal>
  );
}
