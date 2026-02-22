import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getUsers = async () => {
  const res = await fetch(`${API_URL}/user`, {
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

const addUser = async (data: {
  full_name: string;
  username: string;
  password: string;
  is_active: boolean;
}) => {
  const res = await fetch(`${API_URL}/user`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  console.log("\n\nReponse inside the add User function is ", response);
  if (!res.ok) {
    throw new Error(response?.detail || "Failed to add user");
  }
  return response;
};

const deleteUser = async (id: string) => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  if (!res.ok) {
    throw new Error(response?.detail || "Failed to delete user");
  }

  return response;
};

const updateUser = async (data: {
  id: string;
  full_name: string;
  username: string;
  password: string;
  is_active: boolean;
}) => {
  const res = await fetch(`${API_URL}/user/${data.id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  if (!res.ok) {
    throw new Error(response?.detail || "Failed to update user");
  }

  return response;
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

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: {
        id: string;
        full_name: string;
        username: string;
        password: string;
        is_active: boolean;
      };
    }) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
