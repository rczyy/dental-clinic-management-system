import { rootApi } from "./root";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const appointmentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDentistAppointments: builder.query<
      AppointmentResponse[],
      { id: string; date: string }
    >({
      query: (args) => ({
        url: `${URL}/appointment/get-dentist-appointments/${args.id}/?date=${args.date}`,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
        },
      }),
    }),
    getPatientAppointments: builder.query<
      AppointmentResponse[],
      { id: string; date: string }
    >({
      query: (args) => ({
        url: `${URL}/appointment/get-patient-appointments/${args.id}/?date=${args.date}`,
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
