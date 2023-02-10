import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUser, getUsers, login, logout } from "../axios/user";

export const useGetUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: getUsers });
};

export const useGetUser = () => {
  return useQuery({ queryKey: ["me"], queryFn: getUser });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      useQueryClient().invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      useQueryClient().invalidateQueries({ queryKey: ["user"] });
    },
  });
};
