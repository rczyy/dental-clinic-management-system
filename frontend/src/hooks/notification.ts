import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNotification,
  getNotifications,
  readNotifications,
} from "../axios/notification";

export const useGetNotifications = (enabled: boolean) => {
  return useQuery<NotificationResponse[], ErrorMessageResponse>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled,
  });
};

export const useAddNotification = () => {
  return useMutation<
    NotificationResponse,
    ErrorMessageResponse,
    NotificationBody
  >({
    mutationFn: addNotification,
  });
};

export const useReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<NotificationResponse[], ErrorMessageResponse, undefined>({
    mutationFn: readNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};
