import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getService,
  addService,
  editService,
  deleteService,
} from "../axios/service";

export const useGetServices = () => {
  return useQuery<ServiceResponse[], ErrorMessageResponse>({ queryKey: ["services"], queryFn: getServices });
};

export const useGetService = (id: string) => {
  return useQuery<ServiceResponse, ErrorMessageResponse>({
    queryKey: ["service", id],
    queryFn: () => getService(id),
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, ErrorMessageResponse>({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};

export const useEditService = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, ErrorMessageResponse>({
    mutationFn: () => editService(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};

export const useDeleteService = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, ErrorMessageResponse>({
    mutationFn: () => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};
