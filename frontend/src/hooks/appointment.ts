import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAppointment,
  getAppointments,
  getDentistAppointments,
  getPatientAppointments,
} from "../axios/appointment";

export const useGetAppointments = ({
  date,
  includePast,
}: {
  date: string;
  includePast: boolean;
}) => {
  return useQuery<AppointmentResponse[], ErrorMessageResponse>({
    queryKey: ["appointments"],
    queryFn: () => getAppointments({ date, includePast }),
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AppointmentResponse,
    FormErrorResponse,
    AppointmentFormValues
  >({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};

export const useGetDentistAppointments = ({
  dentist,
  date,
}: {
  dentist: string;
  date: string;
}) => {
  return useQuery<AppointmentResponse[], ErrorMessageResponse>({
    queryKey: ["appointments", dentist],
    queryFn: () => getDentistAppointments({ dentist, date }),
  });
};

export const useGetPatientAppointments = ({
  patient,
  date,
}: {
  patient: string;
  date: string;
}) => {
  return useQuery<AppointmentResponse[], ErrorMessageResponse>({
    queryKey: ["appointments", patient],
    queryFn: () => getPatientAppointments({ patient, date }),
  });
};
