import { useQuery } from "@tanstack/react-query";
import { getAssistants } from "../axios/assistant";

export const useGetAssistants = () => {
  return useQuery<AssistantResponse[], ErrorMessageResponse>({
    queryKey: ["assistants"],
    queryFn: getAssistants,
  });
};
