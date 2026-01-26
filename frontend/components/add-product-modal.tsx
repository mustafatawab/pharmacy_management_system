"use client";

import { Modal } from "@/components/modal";
import { Package } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      icon={<Package className="h-6 w-6" />}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Category <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-transparent">
              <option value="">Select category</option>
              <option value="pain-relief">Pain Relief</option>
              <option value="antibiotics">Antibiotics</option>
              {/* Add more categories */}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Selling Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-100">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Cost Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-100">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Minimum Stock Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Barcode
            </label>
            <input
              type="text"
              placeholder="Enter barcode"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Batch Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter batch number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Supplier
            </label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-transparent">
              <option value="">Select supplier</option>
              <option value="supplier-a">Supplier A</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Enter product description"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            Add Product
          </button>
        </div>
      </form>
    </Modal>
  );
}
