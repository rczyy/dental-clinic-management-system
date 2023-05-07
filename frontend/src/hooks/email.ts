import { useMutation } from "@tanstack/react-query";
import { requestEmailVerification } from "../axios/email";

export const useRequestEmailVerification = () => {
  return useMutation<MessageResponse, ErrorMessageResponse, string>({
    mutationFn: requestEmailVerification,
  });
};
