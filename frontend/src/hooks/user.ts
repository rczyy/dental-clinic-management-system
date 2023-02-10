import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUser, getUsers, login, logout } from "../axios/user";

export const useGetUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: getUsers });
};

export const useGetUser = () => {
  return useQuery({ queryKey: ["me"], queryFn: getUser });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
