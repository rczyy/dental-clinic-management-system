import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAppointment, getAppointments } from "../axios/appointment";

export const useGetAppointments = () => {
  return useQuery<AppointmentResponse[], ErrorMessageResponse>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<AppointmentResponse, FormErrorResponse, AppointmentFormValues>({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};
