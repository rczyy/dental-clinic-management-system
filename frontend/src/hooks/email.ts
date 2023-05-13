import { useMutation } from "@tanstack/react-query";
import { requestEmailVerification, requestResetPassword } from "../axios/email";

export const useRequestEmailVerification = () => {
  return useMutation<MessageResponse, ErrorMessageResponse, string>({
    mutationFn: requestEmailVerification,
  });
};

export const useRequestResetPassword = () => {
  return useMutation<MessageResponse, ErrorMessageResponse, string>({
    mutationFn: requestResetPassword,
  });
};
