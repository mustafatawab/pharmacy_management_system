import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface TransferItem {
  medicine_barcode: string;
  medicine_name?: string;
  quantity: number;
}

export interface StockTransfer {
  id: number;
  from_tenant_id: number;
  to_tenant_id: number;
  status: string;
  notes?: string;
  created_at: string;
  items: TransferItem[];
}

export const useStockTransfers = (type: "all" | "inbound" | "outbound" = "all") => {
  return useQuery({
    queryKey: ["stock_transfers", type],
    queryFn: async () => {
      const { data } = await api.get("/transfer/", { params: { type } });
      return data;
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/transfer/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_transfers"] });
    },
  });
};

export const useReceiveTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transferId: number) => {
      const response = await api.post(`/transfer/${transferId}/receive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_transfers"] });
    },
  });
};
