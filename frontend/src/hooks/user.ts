import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  editUser,
  getMe,
  getUser,
  getUsers,
  login,
  logout,
  resetPassword,
  verifyUser,
} from "../axios/user";

export const useGetUsers = () => {
  return useQuery<UserResponse[], ErrorMessageResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useGetUser = (id: string) => {
  return useQuery<UserResponse, ErrorMessageResponse>({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });
};

export const useGetMe = () => {
  return useQuery<UserResponse, ErrorMessageResponse>({
    queryKey: ["me"],
    queryFn: getMe,
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UserResponse,
    ErrorMessageResponse,
    { data: FormData; id: string }
  >({
    mutationFn: ({ data, id }) => editUser(data, id),
    onSuccess: ({ _id: id }) => {
      queryClient.invalidateQueries(["users", id]);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, FormErrorResponse, LoginFormValues>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  return useMutation<MessageResponse, ErrorMessageResponse, string>({
    mutationFn: verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useResetPassword = () => {
  return useMutation<
    MessageResponse,
    ErrorMessageResponse,
    { token: string; password: string; confirmPassword: string }
  >({
    mutationFn: resetPassword,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<MessageResponse, ErrorMessageResponse>({
    mutationFn: logout,
    onMutate: () => {
      queryClient.setQueryData(["me"], null);
      navigate("/login");
    },
  });
};
