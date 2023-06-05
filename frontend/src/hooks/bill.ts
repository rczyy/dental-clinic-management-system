import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBill, editBill, getBills, getDeletedBills } from "../axios/bill";

export const useGetBills = (date?: string) => {
  return useQuery<BillResponse[], ErrorMessageResponse>({
    queryKey: ["bills"],
    queryFn: () => getBills(date),
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

export const useEditBill = () => {
  const queryClient = useQueryClient();
  return useMutation<
    BillResponse,
    ErrorMessageResponse | FormErrorResponse,
    { billId: string; bill: BillFormValues }
  >({
    mutationFn: editBill,
    onSuccess: () => {
      queryClient.invalidateQueries(["bills"]);
    },
  });
};
