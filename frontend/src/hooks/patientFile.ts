import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { addPatientFile, getPatientFiles, removePatientFile } from "../axios/patientFile";

export const useGetPatientFiles = (userId: string, bill?: string, enabled?: boolean) => {
  return useQuery<PatientFileResponse[], FormErrorResponse | ErrorMessageResponse>({
    queryKey: ["patient-files", userId, bill],
    queryFn: () => getPatientFiles(userId, bill),
    ...(enabled !== undefined && { enabled }),
  });
};

export const useAddPatientFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PatientFileResponse,
    FormErrorResponse | ErrorMessageResponse,
    {
      userId: string;
      formData: FormData;
    }
  >({
    mutationFn: addPatientFile,
    onSuccess: (_, { userId }) => queryClient.invalidateQueries(["patient-files", userId]),
  });
};

export const useRemovePatientFile = () => {
  return useMutation<
    { message: string; id: string },
    FormErrorResponse | ErrorMessageResponse,
    string
  >({
    mutationFn: removePatientFile,
  });
};
