import { useQuery } from "@tanstack/react-query";
import { getDentistSchedule } from "../axios/dentistSchedule";

export const useGetDentistSchedule = (dentist: string, enabled: boolean) => {
  return useQuery<DentistScheduleResponse[], ErrorMessageResponse, string>({
    queryKey: ["schedule", dentist],
    queryFn: () => getDentistSchedule(dentist),
    enabled: enabled,
  });
};
