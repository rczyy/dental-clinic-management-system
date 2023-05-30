import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAppointments = async ({
  date,
  includePast,
}: {
  date: string;
  includePast: boolean;
}) => {
  const searchParams = new URLSearchParams({
    ...(date && { date: date }),
    ...(includePast !== undefined && { includePast: String(includePast) }),
  });

  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment?${searchParams}`,
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
  const searchParams = new URLSearchParams({
    ...(date && { date: date }),
  });

  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment/get-dentist-appointments/${dentist}?${searchParams}`,
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
  const searchParams = new URLSearchParams({
    ...(date && { date: date }),
  });

  const res = await axios.get<AppointmentResponse[]>(
    `${URL}/appointment/get-patient-appointments/${patient}?${searchParams}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};
