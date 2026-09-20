import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface InsurancePanel {
  id: number;
  name: string;
  discount_percentage: number;
  receivable_balance: number;
  created_at: string;
}

export const useInsurancePanels = () => {
  return useQuery({
    queryKey: ["insurance_panels"],
    queryFn: async () => {
      const { data } = await api.get("/insurance/panel");
      return data as InsurancePanel[];
    },
  });
};

export const useCreateInsurancePanel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/insurance/panel", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance_panels"] });
    },
  });
};

export const useInsuranceLedger = (panelId: number | null) => {
  return useQuery({
    queryKey: ["insurance_ledger", panelId],
    queryFn: async () => {
      if (!panelId) return [];
      const { data } = await api.get(`/insurance/panel/${panelId}/ledger`);
      return data;
    },
    enabled: !!panelId,
  });
};

export const usePayInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ panelId, amount, notes }: { panelId: number; amount: number; notes: string }) => {
      const response = await api.post(`/insurance/panel/${panelId}/payment`, { amount, notes });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["insurance_panels"] });
      queryClient.invalidateQueries({ queryKey: ["insurance_ledger", variables.panelId] });
    },
  });
};
