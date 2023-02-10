import { useQuery } from "@tanstack/react-query";
import { getDentists } from "../axios/dentist";

export const useGetDentists = () => {
  return useQuery({ queryKey: ["dentists"], queryFn: getDentists });
};
