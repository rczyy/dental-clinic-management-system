import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAppointment, getAppointments } from "../axios/appointment";

export const useGetAppointments = () => {
  return useQuery<AppointmentFormValues[], ErrorMessageResponse>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentData: AppointmentFormValues) => addAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};
