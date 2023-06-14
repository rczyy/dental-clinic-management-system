import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  addPatientCondition,
  editPatientCondition,
  getPatientConditions,
  removePatientCondition,
} from "../axios/patientCondition";

export const useGetPatientConditions = (userId: string, enabled?: boolean) => {
  return useQuery<PatientConditionResponse[], FormErrorResponse | ErrorMessageResponse>({
    queryKey: ["patient-conditions", userId],
    queryFn: () => getPatientConditions(userId),
    ...(enabled !== undefined && { enabled }),
  });
};

export const useAddPatientCondition = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PatientConditionResponse,
    FormErrorResponse | ErrorMessageResponse,
    {
      userId: string;
      form: Pick<PatientConditionResponse, "condition" | "conditionType">;
    }
  >({
    mutationFn: addPatientCondition,
    onSuccess: (_, { userId }) => queryClient.invalidateQueries(["patient-conditions", userId]),
  });
};

export const useEditPatientCondition = () => {
  return useMutation<
    PatientConditionResponse,
    FormErrorResponse | ErrorMessageResponse,
    {
      id: string;
      form: Pick<PatientConditionResponse, "condition" | "conditionType">;
    }
  >({
    mutationFn: editPatientCondition,
  });
};

export const useRemovePatientCondition = () => {
  return useMutation<
    { message: string; id: string },
    FormErrorResponse | ErrorMessageResponse,
    string
  >({
    mutationFn: removePatientCondition,
  });
};
