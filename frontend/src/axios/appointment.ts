import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAppointments = async () => {
  const res = await axios.get(`${URL}/appointment/`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
}

export const addAppointment = async (appointment: AppointmentFormValues) => {
  const res = await axios.post(`${URL}/appointment/add`, appointment, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
