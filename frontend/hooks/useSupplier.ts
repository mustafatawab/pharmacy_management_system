import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  outstanding_balance: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierCreate {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface SupplierUpdate {
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SupplierLedgerEntry {
  id: number;
  supplier_id: string;
  reference_type: string;
  reference_id?: number;
  debit: number;
  credit: number;
  balance_after: number;
  notes?: string;
  created_at: string;
}

export const useSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data } = await api.get<Supplier[]>("/supplier");
      return data;
    },
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      const { data } = await api.get<Supplier>(`/supplier/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSupplier: SupplierCreate) => {
      const { data } = await api.post("/supplier", newSupplier);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SupplierUpdate }) => {
      const response = await api.put(`/supplier/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/supplier/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

export const useSupplierLedger = (id: string) => {
  return useQuery({
    queryKey: ["supplier-ledger", id],
    queryFn: async () => {
      const { data } = await api.get<SupplierLedgerEntry[]>(`/supplier/${id}/ledger`);
      return data;
    },
    enabled: !!id,
  });
};

export const usePaySupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, amount, notes, payment_method }: { id: string; amount: number, notes?: string, payment_method?: string }) => {
      const { data } = await api.post(`/supplier/${id}/pay`, { amount, notes, payment_method });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-ledger", variables.id] });
    },
  });
};
