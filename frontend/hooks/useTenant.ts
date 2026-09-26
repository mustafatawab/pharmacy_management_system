import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Tenant {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
  is_active: boolean;
}

export interface TenantCreate {
  name: string;
  address: string;
  city?: string;
  phone: string;
  email: string;
  timezone?: string;
  currency?: string;
  is_active?: boolean;
}

export interface TenantUpdate {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  currency?: string;
  is_active?: boolean;
}

export const useTenant = () => {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: async () => {
      const { data } = await api.get("/tenant/me");
      return data;
    },
  });
};

export const useTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const { data } = await api.get("/tenant/");
      return data;
    },
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTenant: TenantCreate) => {
      const { data } = await api.post("/tenant/setup", newTenant);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TenantUpdate }) => {
      const response = await api.put(`/tenant/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};
