import { useQuery } from "@tanstack/react-query";
import { getManagers } from "../axios/manager";

export const useGetManagers = () => {
  return useQuery<ManagerResponse[], ErrorMessageResponse>({
    queryKey: ["managers"],
    queryFn: getManagers,
  });
};
