import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  unit: string;
  quantity: number;
  selling_price: string;
  purchase_price: string;
  is_active: boolean;
  category_id: number | null;
  category: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  selling_price: number;
  purchase_price: number;
  is_active?: boolean;
  category_id?: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  unit?: string;
  quantity?: number;
  selling_price?: number;
  purchase_price?: number;
  is_active?: boolean;
  category_id?: number;
}

export interface ProductFilter {
  search?: string;
  category_id?: number;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export const useProducts = (filters?: ProductFilter) => {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: async () => {
      const { data } = await api.get("/medicine", { params: filters });
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["medicines", id],
    queryFn: async () => {
      const { data } = await api.get(`/medicine/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct: ProductCreate) => {
      const { data } = await api.post("/medicine", newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductUpdate }) => {
      const response = await api.put(`/medicine/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/medicine/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
