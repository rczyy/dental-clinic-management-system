import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBill, getBills, getDeletedBills } from "../axios/bill";

export const useGetBills = () => {
  return useQuery<BillResponse[], ErrorMessageResponse>({
    queryKey: ["bills"],
    queryFn: getBills,
  });
};

export const useGetDeletedBills = () => {
  return useQuery<BillResponse[], ErrorMessageResponse>({
    queryKey: ["deleted-bills"],
    queryFn: getDeletedBills,
  });
};

export const useAddBill = () => {
  const queryClient = useQueryClient();
  return useMutation<
    BillResponse,
    ErrorMessageResponse | FormErrorResponse,
    BillFormValues
  >({
    mutationFn: addBill,
    onSuccess: () => {
      queryClient.invalidateQueries(["bills"]);
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};
