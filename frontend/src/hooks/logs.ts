import { useQuery } from "@tanstack/react-query";
import { getLogs } from "../axios/logs";

export const useGetLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: getLogs
  });
};
