"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import {
  ShoppingCart,
  Plus,
  Calendar,
  Search,
  Trash2,
  Eye,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  cost: number;
}

const MOCK_SUPPLIERS = [
  { id: "1", name: "PharmaDistro Ltd" },
  { id: "2", name: "MediSupply Global" },
  { id: "3", name: "HealthCare Logistics" },
];

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Paracetamol 500mg", cost: 3.5 },
  { id: "2", name: "Vitamin C 1000mg", cost: 5.25 },
  { id: "3", name: "Insulin Pen", cost: 22.5 },
  { id: "4", name: "Amoxicillin 250mg", cost: 8.0 },
  { id: "5", name: "Ibuprofen 400mg", cost: 4.2 },
];

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewPurchaseModal({ isOpen, onClose }: NewPurchaseModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProduct = (product: Product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const filteredProducts = MOCK_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Purchase Order"
      icon={<ShoppingCart className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-6 ">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Supplier *
            </label>
            <select className="px-3 py-2 bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#212121] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select supplier</option>
              {MOCK_SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Invoice Number *
            </label>
            <input
              type="text"
              placeholder="Enter invoice number"
              className="px-3 py-2 bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#212121] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Order Date *
            </label>
            <div className="relative">
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#212121] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Delivery *
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#212121] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Product Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          {/* Available Products */}
          <div className="flex flex-col border border-gray-200 dark:border-[#212121] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-[#212121] bg-gray-50 dark:bg-[#2F2F2F]">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Available Products
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#212121] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white dark:bg-[#212121]">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#2F2F2F] group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Cost: ${product.cost.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddProduct(product)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Items */}
          <div className="flex flex-col border border-gray-200 dark:border-[#212121] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-[#212121] bg-gray-50 dark:bg-[#2F2F2F]">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Purchase Items
              </h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#212121]">
              {selectedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <span className="text-sm">No items selected</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-[#2F2F2F] bg-gray-50 dark:bg-[#2F2F2F]/50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ${product.cost.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#212121]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2F2F2F] rounded-lg border border-gray-200 dark:border-[#212121]"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Create Purchase Order
          </button>
        </div>
      </div>
    </Modal>
  );
}
