import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


const getCategories = async () => {
    const res = await fetch(`${API_URL}/category`, {
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
}