import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBill,
  editBill,
  getBills,
  getDeletedBills,
  recoverBill,
  removeBill,
} from "../axios/bill";

export const useGetBills = (date?: string) => {
  return useQuery<BillResponse[], ErrorMessageResponse>({
    queryKey: ["bills"],
    queryFn: () => getBills(date),
  });
};

export const useGetDeletedBills = (date?: string) => {
  return useQuery<BillResponse[], ErrorMessageResponse>({
    queryKey: ["deleted-bills"],
    queryFn: () => getDeletedBills(date),
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

export const useRecoverBill = () => {
  const queryClient = useQueryClient();
  return useMutation<
    BillResponse,
    ErrorMessageResponse | FormErrorResponse,
    string
  >({
    mutationFn: recoverBill,
    onSuccess: () => {
      queryClient.invalidateQueries(["bills"]);
      queryClient.invalidateQueries(["deleted-bills"]);
    },
  });
};

export const useRemoveBill = () => {
  const queryClient = useQueryClient();
  return useMutation<
    BillResponse,
    ErrorMessageResponse | FormErrorResponse,
    string
  >({
    mutationFn: removeBill,
    onSuccess: () => {
      queryClient.invalidateQueries(["bills"]);
      queryClient.invalidateQueries(["deleted-bills"]);
    },
  });
};
