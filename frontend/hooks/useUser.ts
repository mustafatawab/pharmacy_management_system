import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

const getUsers = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      return result;
    }
  } catch (error) {
    return error;
  }
};

const addUser = async (
  full_name: string,
  username: string,
  password: string,
  is_active: boolean,
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        username,
        password,
        is_active,
      }),
    });
    if (res.ok) {
      const response = await res.json();
      return response;
    }
  } catch (error) {
    return error;
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
    mutationFn: (full_name: string , username:string, password:string , is_active : boolean) => addUser(full_name, username, password, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}



