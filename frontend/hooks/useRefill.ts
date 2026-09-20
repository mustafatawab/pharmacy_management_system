import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface RefillReminder {
  id: number;
  customer_id: number;
  medicine_id: number;
  sale_id?: number;
  next_refill_date: string;
  status: string;
  customer_name: string;
  customer_phone?: string;
  medicine_name: string;
  notes?: string;
  created_at: string;
}

export const useRefills = () => {
  return useQuery({
    queryKey: ["refills"],
    queryFn: async () => {
      const { data } = await api.get<RefillReminder[]>("/refill/");
      return data;
    },
  });
};

export const useMarkRefillSent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/refill/${id}/mark-sent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refills"] });
    },
  });
};
