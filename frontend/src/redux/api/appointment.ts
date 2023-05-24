import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}/appointment/` }),
  endpoints: (builder) => ({
    getDentistAppointments: builder.query<AppointmentResponse[], {id: string, date: string}>({
      query: (args) => ({
        url: `get-dentist-appointments/${args.id}/?date=${args.date}`,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
        },
      }),
    }),
    getPatientAppointments: builder.query<AppointmentResponse[], {id: string, date: string}>({
      query: (args) => ({
        url: `get-patient-appointments/${args.id}/?date=${args.date}`,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetDentistAppointmentsQuery,
  useLazyGetPatientAppointmentsQuery,
} = appointmentApi;
