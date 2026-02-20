"use client";
import { Shield, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import { Modal } from "../modal";
import { useDeleteUser } from "@/hooks/useUser";
import { useState } from "react";
export interface User {
  id: string;
  full_name: string;
  username: string;
  role: "admin" | "staff";
  is_active: boolean;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const deleteUser = useDeleteUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDeleteUser = () => {
    console.log(selectedUserId);
    if (selectedUserId) {
      deleteUser.mutate(selectedUserId);
      setIsModalOpen(false);
      setSelectedUserId(null);
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
                    <button className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsModalOpen(true);
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Delete User"
        >
          <div className="flex flex-col items-center gap-6 p-6">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this user?
            </p>
            <div className="flex gap-4">
              {/* Cancel */}
              <button
                onClick={() => setIsModalOpen(false)}
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
                  flex items-center justify-center
                  rounded-md bg-primary-600 hover:bg-primary-700
                  px-5 py-2 text-sm font-medium
                  text-white
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-primary-500
                "
              >
                Yes, delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
