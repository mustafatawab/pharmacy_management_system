import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SaleItem {
  medicine_id: number;
  quantity: number;
  unit_price: number;
}

export interface SaleCreate {
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_method: string;
  items: SaleItem[];
}

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSale: SaleCreate) => {
      const { data } = await api.post("/sale/", newSale);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] }); // Invalidate medicines to refresh stock
    },
  });
};

export const useSales = (filters?: any) => {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: async () => {
      const { data } = await api.get("/sale/", { params: filters });
      return data;
    },
  });
};

export const useSale = (id: number) => {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: async () => {
      const { data } = await api.get(`/sale/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
