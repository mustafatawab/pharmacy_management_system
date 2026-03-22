"use client";

import { Modal } from "@/components/modal";
import { Tag, Trash2, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "./confirmation-modal";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageCategoriesModal({ isOpen, onClose }: ManageCategoriesModalProps) {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to delete category");
    }
  };

  const filteredCategories = categories?.filter((cat: any) => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Categories"
        icon={<Tag className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[#212121] dark:border-[#2F2F2F] dark:text-white"
            />
          </div>

          <div className="max-height-[400px] overflow-y-auto border border-gray-100 dark:border-[#2F2F2F] rounded-lg divide-y divide-gray-100 dark:divide-[#2F2F2F]">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No categories found
              </div>
            ) : (
              filteredCategories.map((cat: any) => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    disabled={deleteCategory.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone and may affect medicines linked to this category.`}
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
        variant="danger"
      />
    </>
  );
}
