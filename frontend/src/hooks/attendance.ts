import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendance, getMyAttendance, logTimeIn, logTimeOut } from "../axios/attendance";

export const useGetAttendance = () => {
  return useQuery<AttendanceResponse[], ErrorMessageResponse>({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
};

export const useGetMyAttendance = () => {
  return useQuery<AttendanceResponse[], ErrorMessageResponse>({
    queryKey: ["myAttendance"],
    queryFn: getMyAttendance,
  });
};

export const useLogTimeIn = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceResponse, FormErrorResponse, string>({
    mutationFn: (timeIn) => logTimeIn(timeIn),
    onSuccess: () => queryClient.invalidateQueries(["myAttendance"]),
  });
};

export const useLogTimeOut = () => {
    const queryClient = useQueryClient();
    return useMutation<AttendanceResponse, FormErrorResponse, string>({
      mutationFn: (timeOut) => logTimeOut(timeOut),
      onSuccess: () => queryClient.invalidateQueries(["myAttendance"]),
    });
  };