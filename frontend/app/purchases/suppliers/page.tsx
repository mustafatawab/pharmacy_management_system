"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Supplier, SupplierCard } from "@/components/purchases/supplier-card";

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "PharmaCorp Ltd",
    contactPerson: "John Smith",
    email: "orders@pharmacorp.com",
    phone: "+1-555-0123",
    address: "123 Medical Drive, City, State 12345",
    addedDate: "01/01/2024",
  },
  {
    id: "2",
    name: "MediSupply Co",
    contactPerson: "Sarah Johnson",
    email: "supply@medisupply.com",
    phone: "+1-555-0456",
    address: "456 Healthcare Blvd, City, State 67890",
    addedDate: "02/01/2024",
  },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);

  const filteredSuppliers = MOCK_SUPPLIERS.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/purchases"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-[#212121] dark:bg-[#212121] dark:text-gray-400 dark:hover:bg-[#2F2F2F] dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Suppliers Management
          </h1>
        </div>
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
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#212121] dark:bg-[#212121]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Add New Supplier
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Person *
              </label>
              <input
                type="text"
                placeholder="Enter contact person name"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone *
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <textarea
                rows={3}
                placeholder="Enter complete address"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsAddingSupplier(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#2F2F2F] dark:text-gray-300 dark:hover:bg-[#2F2F2F]"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Supplier
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#212121] dark:bg-[#212121] dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
