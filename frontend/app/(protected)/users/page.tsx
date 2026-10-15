"use client";

import { useState } from "react";
import { Plus, Search, Eye, Loader2Icon, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User, UserTable } from "@/components/users/user-table";
import { useUsers, useAddUser } from "@/hooks/useUser";
import useLoadingDots from "@/hooks/useLoadingDots";

export default function UserManagementPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [isAddingUser, setIsAddingUser] = useState(false);
 const [userFormValue, setUserFormValue] = useState({
 full_name: "",
 username: "",
 password: "",
 is_active: true,
 });

 const dots = useLoadingDots();

 const { data: users = [], isLoading } = useUsers();
 const addUserMutation = useAddUser();

 const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 e.preventDefault();

 const { name, value, type, checked } = e.target;
 setUserFormValue((prev) => ({
 ...prev,
 [name]: type == "checkbox" ? checked : value,
 }));

 console.log(userFormValue);
 };

 const addUser = async () => {
 if (
 !userFormValue.username ||
 !userFormValue.full_name ||
 !userFormValue.password
 ) {
 toast.error("Please fill in all required fields");
 return;
 }

 addUserMutation.mutate(userFormValue, {
 onSuccess: () => {
 toast.success("User added successfully");
 setIsAddingUser(false);
 setUserFormValue({
 full_name: "",
 username: "",
 password: "",
 is_active: true,
 });
 },
 onError: (error: any) => {
 toast.error(error.message || "Failed to add user");
 },
 });
 };

 const filteredUsers = users.filter(
 (user: User) =>
 user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 user.username.toLowerCase().includes(searchQuery.toLowerCase()),
 );

 return (
 <div className="flex flex-col gap-6">
 {/* Header */}

 <div className="flex items-center justify-between">
 <h1 className="h1 text-xl font-bold text-card-foreground">
 User Management
 </h1>
 <button
 onClick={() => setIsAddingUser(true)}
 className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
 >
 <Plus className="h-4 w-4" />
 Add User
 </button>
 </div>

 {/* Add User Form */}
 {isAddingUser && (
 <div className="rounded-xl border border-border bg-card p-6 shadow-sm dark:border-[#212121] dark:bg-neutral-900">
 <h2 className="h2 mb-6 text-lg font-semibold text-card-foreground">
 Add New User
 </h2>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 <div className="flex flex-col gap-2">
 <label
 htmlFor="username"
 className="text-sm font-medium text-card-foreground dark:text-muted-foreground"
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
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>
 <div className="flex flex-col gap-2">
 <label
 htmlFor="full_name"
 className="text-sm font-medium text-card-foreground dark:text-muted-foreground"
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
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 </div>

 <div className="flex flex-col gap-2">
 <label
 htmlFor="password"
 className="text-sm font-medium text-card-foreground dark:text-muted-foreground"
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
 className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 "
 />
 <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer" />
 </div>
 </div>

 {/* <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Role *
 </label>
 <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 ">
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
 className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
 />
 <label
 htmlFor="activeUser"
 className="text-sm font-medium text-card-foreground dark:text-muted-foreground select-none cursor-pointer"
 >
 Active User
 </label>
 </div>
 </div>

 {/* <div className="mt-8">
 <h3 className="h3 mb-4 text-sm font-medium text-card-foreground dark:text-muted-foreground">
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
 className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
 />
 <div className="flex flex-col">
 <label
 htmlFor={perm.id}
 className="text-sm font-medium text-card-foreground cursor-pointer hover:text-primary transition-colors"
 >
 {perm.label}
 </label>
 <span className="text-xs text-muted-foreground">
 {perm.desc}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div> */}

 <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border">
 <button
 onClick={() => setIsAddingUser(false)}
 className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#2F2F2F]"
 >
 Cancel
 </button>
 <button
 onClick={addUser}
 disabled={addUserMutation.isPending}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {addUserMutation.isPending ? (
 <LoaderCircle className="animate-spin" />
 ) : (
 "Add User"
 )}
 </button>
 </div>
 </div>
 )}

 {/* Search */}
 <div className="relative">
 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
 <input
 type="text"
 placeholder="Search users..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm text-card-foreground placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#212121] dark:bg-neutral-900 dark:placeholder-gray-400"
 />
 </div>

 {/* User Table */}
 {isLoading ? (
 <div className="flex items-center justify-center gap-1 text-xl">
 <Loader2Icon className="animate-spin" /> Loading Users {dots}
 </div>
 ) : (
 <UserTable users={filteredUsers} />
 )}
 </div>
 );
}
