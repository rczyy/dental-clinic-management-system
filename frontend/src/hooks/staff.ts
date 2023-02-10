import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getStaff,
  getStaffs,
  registerStaff,
  removeStaff,
} from "../axios/staff";

export const useGetStaffs = () => {
  return useQuery({ queryKey: ["staffs"], queryFn: getStaffs });
};

export const useGetStaff = (id: string) => {
  return useQuery({ queryKey: ["staffs", id], queryFn: () => getStaff(id) });
};

export const useRegisterStaff = () => {
  return useMutation({
    mutationFn: registerStaff,
    onSuccess: () => {
      useQueryClient().invalidateQueries(["staffs"]);
    },
  });
};

export const useRemoveStaff = () => {
  return useMutation({
    mutationFn: removeStaff,
    onSuccess: () => {
      useQueryClient().invalidateQueries(["staffs"]);
    },
  });
};
