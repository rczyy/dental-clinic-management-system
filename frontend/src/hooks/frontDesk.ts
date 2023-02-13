import { useQuery } from "@tanstack/react-query";
import { getFrontDesks } from "../axios/frontDesk";

export const useGetFrontDesks = () => {
  return useQuery<FrontDeskResponse[], ErrorMessageResponse>({
    queryKey: ["frontDesks"],
    queryFn: getFrontDesks,
  });
};
