import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  banPatient,
  getBannedPatients,
  getDeletedPatients,
  getPatient,
  getPatientNames,
  getPatients,
  recoverPatient,
  registerPatient,
  removePatient,
  unbanPatient,
} from "../axios/patient";

export const useGetPatients = () => {
  return useQuery({ queryKey: ["patients"], queryFn: getPatients });
};

export const useGetDeletedPatients = () => {
  return useQuery({
    queryKey: ["deleted-patients"],
    queryFn: getDeletedPatients,
  });
};

export const useGetBannedPatients = () => {
  return useQuery({
    queryKey: ["banned-patients"],
    queryFn: getBannedPatients,
  });
};

export const useGetPatient = (id: string) => {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => {
      getPatient(id);
    },
  });
};

export const useGetPatientNames = () => {
  return useQuery({ queryKey: ["patient-names"], queryFn: getPatientNames });
};

export const useRegisterPatient = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, FormErrorResponse | ErrorMessageResponse, SignupFormValues>({
    mutationFn: registerPatient,
    onSuccess: () => queryClient.invalidateQueries(["patients"]),
  });
};

export const useRecoverPatient = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, ErrorMessageResponse, string>({
    mutationFn: recoverPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      queryClient.invalidateQueries(["deleted-patients"]);
    },
  });
};

export const useRemovePatient = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorMessageResponse, string>({
    mutationFn: removePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      queryClient.invalidateQueries(["deleted-patients"]);
    },
  });
};

export const useUnbanPatient = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, ErrorMessageResponse, string>({
    mutationFn: unbanPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      queryClient.invalidateQueries(["deleted-patients"]);
      queryClient.invalidateQueries(["banned-patients"]);
    },
  });
};

export const useBanPatient = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorMessageResponse, string>({
    mutationFn: banPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      queryClient.invalidateQueries(["deleted-patients"]);
      queryClient.invalidateQueries(["banned-patients"]);
    },
  });
};
