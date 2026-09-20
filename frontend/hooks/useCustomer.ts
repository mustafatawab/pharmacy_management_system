import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  credit_limit: number;
  outstanding_balance: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerLedgerEntry {
  id: number;
  customer_id: number;
  reference_type: string;
  reference_id?: number;
  debit: number;
  credit: number;
  balance_after: number;
  notes?: string;
  created_at: string;
}

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await api.get<Customer[]>("/customer/");
      return data;
    },
  });
};

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const { data } = await api.get<Customer>(`/customer/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCustomer: any) => {
      const { data } = await api.post("/customer/", newCustomer);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useCustomerLedger = (id: number) => {
  return useQuery({
    queryKey: ["customer-ledger", id],
    queryFn: async () => {
      const { data } = await api.get<CustomerLedgerEntry[]>(`/customer/${id}/ledger`);
      return data;
    },
    enabled: !!id,
  });
};

export const usePayCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, amount, notes, payment_method }: { id: number; amount: number, notes?: string, payment_method?: string }) => {
      const { data } = await api.post(`/customer/${id}/pay`, { amount, notes, payment_method });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer-ledger", variables.id] });
    },
  });
};
