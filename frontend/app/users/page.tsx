"use client";

import { useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { User, UserTable } from "@/components/users/user-table";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@pharmacy.com",
    role: "Admin",
    status: "Active",
    lastLogin: "19/11/2025",
    permissions: ["All permissions"],
  },
  {
    id: "2",
    name: "Staff User",
    email: "staff@pharmacy.com",
    role: "Staff",
    status: "Active",
    lastLogin: "20/01/2024",
    permissions: ["sales", "inventory view"],
  },
];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {isAddingUser && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#212121] dark:bg-[#212121]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Add New User
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username *
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter full name"
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
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
                />
                <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white">
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="activeUser"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="activeUser"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer"
              >
                Active User
              </label>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "sales",
                  label: "Sales Management",
                  desc: "Create and manage sales transactions",
                },
                {
                  id: "inventory",
                  label: "Inventory Management",
                  desc: "Add, edit, and delete products",
                },
                {
                  id: "reports",
                  label: "Reports & Analytics",
                  desc: "Access reports and analytics",
                },
                {
                  id: "inventoryView",
                  label: "Inventory View",
                  desc: "View inventory and product information",
                },
                {
                  id: "purchases",
                  label: "Purchase Management",
                  desc: "Create and manage purchase orders",
                },
                {
                  id: "users",
                  label: "User Management",
                  desc: "Manage system users and permissions",
                },
              ].map((perm) => (
                <div key={perm.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={perm.id}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor={perm.id}
                      className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {perm.label}
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {perm.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-[#2F2F2F]">
            <button
              onClick={() => setIsAddingUser(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#2F2F2F] dark:text-gray-300 dark:hover:bg-[#2F2F2F]"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add User
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#212121] dark:bg-[#212121] dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* User Table */}
      <UserTable users={filteredUsers} />
    </div>
  );
}
