import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProducts = async () => {
  const res = await fetch(`${API_URL}/product`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.detail || "Failed to fetch users");
  }

  return result;
};

const createProduct = async (data: {
  name: string;
  description: string;
  category_id: number;
  unit: string;
  quantity: number;
  selling_price: number;
  purchase_price: number;
  is_active: boolean;
  generic_name: string;
}) => {
  const res = await fetch(`${API_URL}/product`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.detail || "Failed to fetch users");
  }

  return result;
};
