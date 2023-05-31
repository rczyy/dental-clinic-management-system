import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getPatient,
  getPatientNames,
  getPatients,
  registerPatient,
  removePatient,
} from "../axios/patient";

export const useGetPatients = () => {
  return useQuery({ queryKey: ["patients"], queryFn: getPatients });
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
  return useMutation<
    UserResponse,
    FormErrorResponse | ErrorMessageResponse,
    SignupFormValues
  >({
    mutationFn: registerPatient,
    onSuccess: () => queryClient.invalidateQueries(["patients"]),
  });
};

export const useRemovePatient = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorMessageResponse, string>({
    mutationFn: removePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
  });
};
