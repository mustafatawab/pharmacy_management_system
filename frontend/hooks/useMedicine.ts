import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface MedicineFilter {
  search?: string;
  category?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export const useMedicines = (filters: MedicineFilter) => {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: async () => {
      const { data } = await api.get("/medicine", { params: filters });
      return data;
    },
  });
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMedicine: any) => {
      const { data } = await api.post("/medicine", newMedicine);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/medicine/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useDeleteMedicine = () => {
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
