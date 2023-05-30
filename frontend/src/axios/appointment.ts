import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAppointments = async (date: string) => {
  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment${date ? `?date=${date}` : ""}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const addAppointment = async (appointment: AppointmentFormValues) => {
  const res = await axios.post<AppointmentResponse>(
    `${URL}/appointment/add`,
    appointment,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const getDentistAppointments = async ({
  dentist,
  date,
}: {
  dentist: string;
  date: string;
}) => {
  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment/get-dentist-appointments/${dentist}${
      date ? `?date=${date}` : ""
    }`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const getPatientAppointments = async ({
  patient,
  date,
}: {
  patient: string;
  date: string;
}) => {
  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment/get-patient-appointments/${patient}${
      date ? `?date=${date}` : ""
    }`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};
