"use client";

import { InventorySummaryCard } from "@/components/inventory-summary-card";
import { InventoryTable } from "@/components/inventory-table";
import { AddProductModal } from "@/components/add-product-modal";
import { AlertTriangle, Calendar, Package, Plus } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
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
          value="4"
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <InventorySummaryCard
          title="Low Stock"
          value="1"
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <InventorySummaryCard
          title="Expiring Soon"
          value="4"
          icon={<Calendar className="h-6 w-6" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <InventoryTable
        products={[
          {
            id: "1",
            name: "Paracetamol 500mg",
            batch: "PAR001",
            category: "Pain Relief",
            price: "USD $5.99",
            stock: 150,
            minStock: 20,
            expiry: "31/12/2025",
            status: "Expiring Soon",
          },
          {
            id: "2",
            name: "Amoxicillin 250mg",
            batch: "AMO002",
            category: "Antibiotics",
            price: "USD $12.50",
            stock: 8,
            minStock: 15,
            expiry: "30/06/2024",
            status: "Low Stock",
          },
          {
            id: "3",
            name: "Vitamin C 1000mg",
            batch: "VTC003",
            category: "Vitamins",
            price: "USD $8.75",
            stock: 75,
            minStock: 25,
            expiry: "15/03/2026",
            status: "Expiring Soon",
          },
          {
            id: "4",
            name: "Insulin Pen",
            batch: "INS004",
            category: "Diabetes Care",
            price: "USD $35.00",
            stock: 12,
            minStock: 10,
            expiry: "20/08/2024",
            status: "Expiring Soon",
          },
        ]}
      />
    </div>
  );
}
