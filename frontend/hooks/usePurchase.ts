import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PurchaseItem {
  medicine_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Purchase {
  id: number;
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_method: string;
  supplier_name: string;
  supplier_contact: string | null;
  supplier_email: string | null;
  supplier_phone: string | null;
  expected_delivery: string | null;
  created_at: string;
  tenant_id: number;
  user_id: string;
  items: PurchaseItem[];
}

export interface PurchaseCreate {
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_method: string;
  supplier_name: string;
  supplier_contact?: string;
  supplier_email?: string;
  supplier_phone?: string;
  expected_delivery?: string;
  items: PurchaseItem[];
}

export interface PurchaseUpdate {
  total_amount?: number;
  discount?: number;
  final_amount?: number;
  payment_method?: string;
  supplier_name?: string;
  supplier_contact?: string;
  supplier_email?: string;
  supplier_phone?: string;
  expected_delivery?: string;
}

export interface PurchaseFilter {
  start_date?: string;
  end_date?: string;
  user_id?: string;
  supplier_name?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export const usePurchases = (filters?: PurchaseFilter) => {
  return useQuery({
    queryKey: ["purchases", filters],
    queryFn: async () => {
      const { data } = await api.get("/purchase", { params: filters });
      return data;
    },
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPurchase: PurchaseCreate) => {
      const { data } = await api.post("/purchase", newPurchase);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PurchaseUpdate }) => {
      const response = await api.put(`/purchase/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/purchase/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};