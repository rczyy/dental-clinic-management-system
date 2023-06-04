import { useQueryClient, useMutation } from "@tanstack/react-query";
import { loginWithGoogle } from "../axios/oauth";

export const useLoginWithGoogle = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LoginResponse,
    ErrorMessageResponse | FormErrorResponse,
    string
  >({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
