import { useQuery } from "@tanstack/react-query";
import { getManagers } from "../axios/manager";

export const useGetManagers = () => {
  return useQuery({ queryKey: ["managers"], queryFn: getManagers });
};
