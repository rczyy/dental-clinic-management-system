import { useQuery } from "@tanstack/react-query";
import { getAssistants } from "../axios/assistant";

export const useGetAssistants = () => {
  return useQuery({ queryKey: ["assistants"], queryFn: getAssistants });
};
