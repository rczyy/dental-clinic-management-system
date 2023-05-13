import { useQuery } from "@tanstack/react-query";
import { getDentists, getDentistNames } from "../axios/dentist";

export const useGetDentists = () => {
  return useQuery<DentistResponse[], ErrorMessageResponse>({
    queryKey: ["dentists"],
    queryFn: getDentists,
  });
};

export const useGetDentistNames = () => {
  return useQuery<DentistNamesResponse[], ErrorMessageResponse>({
    queryKey: ["dentistNames"],
    queryFn: getDentistNames,
  });
};
