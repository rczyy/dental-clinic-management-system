import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  addPrescription,
  editPrescription,
  getPrescriptions,
  removePrescription,
} from "../axios/prescription";

export const useGetPrescriptions = (userId: string, enabled?: boolean) => {
  return useQuery<PrescriptionResponse[], FormErrorResponse | ErrorMessageResponse>({
    queryKey: ["prescription", userId],
    queryFn: () => getPrescriptions(userId),
    ...(enabled !== undefined && { enabled }),
  });
};

export const useAddPrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PrescriptionResponse,
    FormErrorResponse | ErrorMessageResponse,
    {
      userId: string;
      form: Pick<PrescriptionResponse, "name" | "dose" | "frequency">;
    }
  >({
    mutationFn: addPrescription,
    onSuccess: (_, { userId }) => queryClient.invalidateQueries(["prescription", userId]),
  });
};

export const useEditPrescription = () => {
  return useMutation<
    PrescriptionResponse,
    FormErrorResponse | ErrorMessageResponse,
    {
      id: string;
      form: Pick<PrescriptionResponse, "name" | "dose" | "frequency">;
    }
  >({
    mutationFn: editPrescription,
  });
};

export const useRemovePrescription = () => {
  return useMutation<
    { message: string; id: string },
    FormErrorResponse | ErrorMessageResponse,
    string
  >({
    mutationFn: removePrescription,
  });
};
