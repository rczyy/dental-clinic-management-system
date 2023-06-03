import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendance,
  getMyAttendance,
  editAttendance,
  logTimeIn,
  logTimeOut,
  removeAttendance,
  getAttendanceToday,
} from "../axios/attendance";

export const useGetAttendance = () => {
  return useQuery<AttendanceResponse[], ErrorMessageResponse>({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
};

export const useGetAttendanceToday = () => {
  return useQuery<AttendanceResponse[], ErrorMessageResponse>({
    queryKey: ["attendanceToday"],
    queryFn: getAttendanceToday,
  });
};

export const useGetMyAttendance = () => {
  return useQuery<AttendanceResponse[], ErrorMessageResponse>({
    queryKey: ["myAttendance"],
    queryFn: getMyAttendance,
  });
};

export const useEditAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AttendanceResponse,
    ErrorMessageResponse,
    { data: AttendanceFormValues; id: string }
  >({
    mutationFn: ({ data, id }) => editAttendance(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
      queryClient.invalidateQueries(["attendanceToday"]);
    },
  });
};

export const useRemoveAttendance = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceResponse, ErrorMessageResponse, string>({
    mutationFn: () => removeAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
      queryClient.invalidateQueries(["attendanceToday"]);
    },
  });
};

export const useLogTimeIn = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceResponse, ErrorMessageResponse, string>({
    mutationFn: (timeIn) => logTimeIn(timeIn),
    onSuccess: () => queryClient.invalidateQueries(["myAttendance"]),
  });
};

export const useLogTimeOut = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceResponse, ErrorMessageResponse, string>({
    mutationFn: (timeOut) => logTimeOut(timeOut),
    onSuccess: () => queryClient.invalidateQueries(["myAttendance"]),
  });
};
