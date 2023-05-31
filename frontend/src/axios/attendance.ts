import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAttendance = async () => {
  const res = await axios.get<AttendanceResponse[]>(`${URL}/attendance/`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getMyAttendance = async () => {
  const res = await axios.get<AttendanceResponse[]>(`${URL}/attendance/me`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const editAttendance = async (data: AttendanceFormValues, id: string) => {
  const res = await axios.patch<AttendanceResponse>(`${URL}/attendance/edit/${id}`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const logTimeIn = async (timeIn: string) => {
  const res = await axios.post<AttendanceResponse>(
    `${URL}/attendance/time-in`,
    { timeIn },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const logTimeOut = async (timeOut: string) => {
  const res = await axios.post<AttendanceResponse>(
    `${URL}/attendance/time-out`,
    { timeOut },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};
