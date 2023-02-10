import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getPatient,
  getPatients,
  registerPatient,
  removePatient,
} from "../axios/patient";

export const useGetPatients = () => {
  return useQuery({ queryKey: ["patients"], queryFn: getPatients });
};

export const useGetPatient = (id: string) => {
  return useQuery({ queryKey: ["patients", id], queryFn: () => getPatient(id) });
};

export const useRegisterPatient = () => {
  return useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      useQueryClient().invalidateQueries(["patients"]);
    },
  });
};

export const useRemovePatient = () => {
  return useMutation({
    mutationFn: removePatient,
    onSuccess: () => {
      useQueryClient().invalidateQueries(["patients"]);
    },
  });
};
