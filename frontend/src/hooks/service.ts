import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getService,
  addService,
  editService,
  deleteService,
} from "../axios/service";

export const useGetServices = () => {
  return useQuery<ServiceResponse[], ErrorMessageResponse>({
    queryKey: ["services"],
    queryFn: getServices,
  });
};

export const useGetService = (id: string) => {
  return useQuery<ServiceResponse, ErrorMessageResponse>({
    queryKey: ["service", id],
    queryFn: () => getService(id),
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, FormErrorResponse, ServiceFormValues>({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};

export const useEditService = () => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, ErrorMessageResponse, { data: ServiceFormValues, id: string}>({
    mutationFn: ({data, id}) => editService(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};

export const useDeleteService = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<ServiceResponse, ErrorMessageResponse, string>({
    mutationFn: () => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });
};
