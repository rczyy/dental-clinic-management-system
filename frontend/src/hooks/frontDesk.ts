import { useQuery } from "@tanstack/react-query";
import { getFrontDesks } from "../axios/frontDesk";

export const useGetFrontDesks = () => {
  return useQuery({ queryKey: ["frontDesks"], queryFn: getFrontDesks });
};
