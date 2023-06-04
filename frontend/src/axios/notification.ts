import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getNotifications = async () => {
  const res = await axios.get<NotificationResponse[]>(`${URL}/notification`, {
    withCredentials: true,
  });

  return res.data;
};

export const addNotification = async (notification: NotificationBody) => {
  const res = await axios.post<NotificationResponse>(
    `${URL}/notification`,
    notification,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const readNotifications = async () => {
  const res = await axios.put<NotificationResponse[]>(
    `${URL}/notification/read`,
    undefined,
    {
      withCredentials: true,
    }
  );

  return res.data;
};
