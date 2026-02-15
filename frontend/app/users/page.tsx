"use client";

import { Suspense, useEffect, useState } from "react";
import { Plus, Search, Eye, Loader2Icon, LoaderCircle } from "lucide-react";
import { User, UserTable } from "@/components/users/user-table";
import { useUsers, useAddUser } from "@/hooks/useUser";

// const MOCK_USERS: User[] = [
//   {
//     id: "1",
//     username: "",
//     full_name: "Admin User",
//     role: "admin",
//     is_active: true,
//   },
//   {
//     id: "2",
//     username: "",
//     full_name: "Staff User",
//     role: "staff",
//     is_active: true,
//   },
// ];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userFormValue, setUserFormValue] = useState({
    full_name: "",
    username: "",
    password: "",
    is_active: true,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value, type, checked } = e.target;
    setUserFormValue((prev) => ({
      ...prev,
      [name]: type == "checkbox" ? checked : value,
    }));

    console.log(userFormValue);
  };

  const getUsers = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      setUsers(result);
    }

    setLoading(false);
  };

  const addUser = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userFormValue),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      setLoading(false);
      getUsers();

      setUserFormValue({
        full_name: "",
        username: "",
        password: "",
        is_active: true,
      });
      setIsAddingUser(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
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
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username *
              </label>
              <input
                id="username"
                name="username"
                value={userFormValue.username}
                onChange={handleFormChange}
                type="text"
                placeholder="Enter username"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="full_name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name *
              </label>
              <input
                id="full_name"
                name="full_name"
                onChange={handleFormChange}
                value={userFormValue.full_name}
                type="text"
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleFormChange}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white"
                />
                <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white">
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div> */}

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="activeUser"
                name="is_active"
                checked={userFormValue.is_active}
                onChange={handleFormChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="activeUser"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer"
              >
                Active User
              </label>
            </div>
          </div>

          {/* <div className="mt-8">
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
          </div> */}

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-[#2F2F2F]">
            <button
              onClick={() => setIsAddingUser(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#2F2F2F] dark:text-gray-300 dark:hover:bg-[#2F2F2F]"
            >
              Cancel
            </button>
            <button
              onClick={addUser}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
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
      {loading ? (
        <div className="flex items-center justify-center gap-1 ">
          <LoaderCircle /> Wait
        </div>
      ) : (
        <UserTable users={filteredUsers} />
      )}
    </div>
  );
}
