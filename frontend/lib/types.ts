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

export interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  total_amount: string;
  discount: string;
  final_amount: string;
  payment_method: string;
  created_at: string;
  tenant_id: number;
  user_id: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  medicine_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
}
