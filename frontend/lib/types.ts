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

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Medicine {
  id: number;
  name: string;
  description: string | null;
  unit: string;
  quantity: number;
  selling_price: string;
  purchase_price: string;
  is_active: boolean;
  category_id: number | null;
  category: Category | null;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}
