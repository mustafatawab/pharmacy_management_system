import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface MedicineFilter {
  search?: string;
  barcode?: string;     // For barcode scanner lookup
  category_id?: number;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export const useMedicines = (filters?: MedicineFilter) => {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: async () => {
      try {
        const { data } = await api.get("/medicine/", { params: filters });
        return data;
      } catch (e: any) {
        if (!navigator.onLine || e.message === "Network Error") {
          const { getCachedCatalog } = await import('@/lib/offlineSync');
          const cached = await getCachedCatalog();
          if (cached) {
            // Mock API response structure
            return { items: cached, total: cached.length, page: 1, page_size: cached.length };
          }
        }
        throw e;
      }
    },
  });
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMedicine: any) => {
      const { data } = await api.post("/medicine/", newMedicine);
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

export const useAlternatives = (id: number | null) => {
  return useQuery({
    queryKey: ["medicines", "alternatives", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await api.get(`/product/${id}/alternatives`);
      return data;
    },
    enabled: !!id,
  });
};

// ─── Unit Conversion Hooks ───────────────────────────────────────────────────

export const useUnitConversions = (medicineId: number | null) => {
  return useQuery({
    queryKey: ["unit-conversions", medicineId],
    queryFn: async () => {
      const { data } = await api.get(`/medicine/${medicineId}/units/`);
      return data as Array<{ id: number; from_unit: string; to_unit: string; factor: number }>;
    },
    enabled: !!medicineId,
  });
};

export const useAddUnitConversion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      medicineId,
      data,
    }: {
      medicineId: number;
      data: { from_unit: string; to_unit: string; factor: number };
    }) => {
      const response = await api.post(`/medicine/${medicineId}/units/`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["unit-conversions", variables.medicineId] });
    },
  });
};

export const useDeleteUnitConversion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      medicineId,
      conversionId,
    }: {
      medicineId: number;
      conversionId: number;
    }) => {
      await api.delete(`/medicine/${medicineId}/units/${conversionId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["unit-conversions", variables.medicineId] });
    },
  });
};
