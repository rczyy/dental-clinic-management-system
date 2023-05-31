import { useMutation, useQuery } from "@tanstack/react-query";
import {
  editDentistSchedule,
  getDentistSchedule,
} from "../axios/dentistSchedule";

export const useGetDentistSchedule = (dentist?: string, enabled?: boolean) => {
  return useQuery<DentistScheduleResponse[], ErrorMessageResponse>({
    queryKey: ["schedule", ...(dentist ? [dentist] : [])],
    queryFn: () => getDentistSchedule(dentist),
    enabled: enabled ? enabled : true,
  });
};

export const useEditDentistSchedule = () => {
  return useMutation<DentistScheduleResponse[], ErrorMessageResponse, string[]>(
    {
      mutationFn: editDentistSchedule,
    }
  );
};
