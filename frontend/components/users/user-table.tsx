"use client";
import {
  Shield,
  ShieldAlert,
  Pencil,
  Trash2,
  Eye,
  LoaderCircle,
} from "lucide-react";
import { Modal } from "../modal";
import { useDeleteUser, useUpdateUser } from "@/hooks/useUser";
import { useState } from "react";
import toast from "react-hot-toast";
export interface User {
  id: string;
  full_name: string;
  username: string;
  role: "admin" | "staff";
  is_active: boolean;
  password?: string;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const deleteUser = useDeleteUser();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userFormValue, setUserFormValue] = useState({
    id: "",
    full_name: "",
    username: "",
    password: "",
    is_active: false,
  });

  const updateUserMutation = useUpdateUser();

  const onHandleUpadateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserFormValue((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateUser = () => {
    updateUserMutation.mutate(
      { data: userFormValue },
      {
        onSuccess: () => {
          setIsUpdateModal(false);
          setSelectedUserId(null);
          toast.success("User updated successfully");
        },
        onError: () => {
          toast.error("Failed to update user");
        },
      },
    );
  };

  const handleDeleteUser = () => {
    console.log(selectedUserId);
    if (selectedUserId) {
      // deleteUser.mutate(selectedUserId);
      // setIsModalOpen(false);
      // setSelectedUserId(null);
      // toast.success("User deleted successfully");
      deleteUser.mutate(selectedUserId, {
        onSuccess: () => {
          setIsDeleteModal(false);
          setSelectedUserId(null);
          toast.success("User deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete user");
        },
      });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-[#212121] dark:bg-[#212121] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 dark:border-[#2F2F2F] dark:bg-[#2F2F2F]">
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                FULLNAME
              </th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                USERNAME
              </th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                ROLE
              </th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                STATUS
              </th>

              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-[#2F2F2F]/50"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {user.full_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                    <span className="text-gray-400 text-xs">
                      @
                      {user.username?.split(" ")[0]?.toLowerCase() ||
                        user.username.toLowerCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 capitalize">
                    {user.role === "admin" ? (
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                    ) : (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-gray-900 dark:text-white">
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.is_active
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {user.is_active ? "Active" : "In-Active"}
                  </span>
                </td>

                {/* <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.length === 0 ? (
                      <span className="text-gray-400 italic">
                        No permissions
                      </span>
                    ) : user.permissions[0] === "All permissions" ? (
                      <span className="text-gray-600 dark:text-gray-300">
                        All permissions
                      </span>
                    ) : (
                      user.permissions.map((perm, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          {perm}
                        </span>
                      ))
                    )}
                  </div>
                </td> */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsUpdateModal(true);
                        setSelectedUserId(user.id);
                        setUserFormValue({
                          id: user.id,
                          full_name: user.full_name,
                          username: user.username,
                          is_active: user.is_active,
                          password: "",
                        });
                      }}
                      className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      disabled={user.role === "admin"}
                      onClick={() => {
                        if (user.role === "admin") {
                          toast.error("Admin cannot be deleted");
                          return;
                        }
                        setSelectedUserId(user.id);
                        setIsDeleteModal(true);
                      }}
                      className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
          title="Delete User"
          icon={<Trash2 className="h-4 w-4 text-red-600" />}
        >
          <div className="flex flex-col items-center gap-6 p-6">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this user?
            </p>
            <div className="flex gap-4">
              {/* Cancel */}
              <button
                onClick={() => setIsDeleteModal(false)}
                className="
                  flex items-center justify-center
                  rounded-md border border-gray-300
                  bg-white dark:bg-[#212121] dark:border-gray-600
                  px-5 py-2 text-sm font-medium
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-primary-500
                "
              >
                No, keep it
              </button>
              {/* Confirm */}
              <button
                onClick={handleDeleteUser}
                className="
                  flex items-center justify-center border border-blue-700
                  rounded-md bg-primary-600 hover:bg-primary-700
                  px-5 py-2 text-sm font-medium
                  text-blue-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-primary-500
                "
              >
                Yes, delete
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isUpdateModal}
          onClose={() => setIsUpdateModal(false)}
          title="Update User"
          icon={<Pencil className="h-4 w-4 text-blue-600" />}
        >
          {/* {error && <p className="text-red-600 mb-2 text-sm">{error}</p>} */}
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
                onChange={onHandleUpadateChange}
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
                value={userFormValue.full_name}
                onChange={onHandleUpadateChange}
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
                  value={userFormValue.password}
                  onChange={onHandleUpadateChange}
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
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="activeUser"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer"
              >
                Active User
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-[#2F2F2F]">
              <button
                onClick={() => setIsUpdateModal(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#2F2F2F] dark:text-gray-300 dark:hover:bg-[#2F2F2F]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updateUserMutation.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateUserMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
