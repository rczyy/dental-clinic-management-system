import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getDeletedStaffs,
  getStaff,
  getStaffs,
  recoverStaff,
  registerStaff,
  removeStaff,
} from "../axios/staff";

export const useGetStaffs = () => {
  return useQuery<StaffResponse[], ErrorMessageResponse>({
    queryKey: ["staffs"],
    queryFn: getStaffs,
  });
};

export const useGetDeletedStaffs = () => {
  return useQuery({
    queryKey: ["deleted-staffs"],
    queryFn: getDeletedStaffs,
  });
};

export const useGetStaff = (id: string) => {
  return useQuery<StaffResponse, ErrorMessageResponse>({
    queryKey: ["staffs", id],
    queryFn: () => getStaff(id),
  });
};

export const useRegisterStaff = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UserResponse,
    FormErrorResponse | ErrorMessageResponse,
    StaffSignupFormValues
  >({
    mutationFn: registerStaff,
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

export const useRecoverStaff = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, ErrorMessageResponse, string>({
    mutationFn: recoverStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      queryClient.invalidateQueries(["deleted-staffs"]);
    },
  });
};

export const useRemoveStaff = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorMessageResponse, string>({
    mutationFn: removeStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      queryClient.invalidateQueries(["deleted-staffs"]);
    },
  });
};
