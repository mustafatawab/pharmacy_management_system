import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
};

const addUser = async (data: {
  full_name: string;
  username: string;
  password: string;
  is_active: boolean;
}) => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to add user");
    }
    const response = await res.json();
    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
};

const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
    const response = await res.json();
    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
};

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60, // 1 min cache (optional)
    refetchOnWindowFocus: false, // prevent automatic refetch on tab focus
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: {
      full_name: string;
      username: string;
      password: string;
      is_active: boolean;
    }) => addUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
