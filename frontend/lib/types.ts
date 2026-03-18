export interface User {
  id: string;
  full_name: string;
  username: string;
  role: "admin" | "staff";
  is_active: boolean;
  tenant_id: number | null;
}

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
