import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUser, getUsers, login, logout } from "../axios/user";

export const useGetUsers = () => {
  return useQuery<UserResponse[], ErrorMessageResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useGetUser = () => {
  return useQuery<UserResponse, ErrorMessageResponse>({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, FormErrorResponse, LoginFormValues>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation<MessageResponse, ErrorMessageResponse>({
    mutationFn: logout,
    onMutate: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
};
