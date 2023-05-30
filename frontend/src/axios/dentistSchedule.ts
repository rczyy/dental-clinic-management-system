import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getDentistSchedule = async (dentist: string) => {
  const res = await axios.get<DentistScheduleResponse[]>(
    `${URL}/dentist-schedule/${dentist}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

// export const addDentistSchedule = async () => {
//   const res = await axios.post<DentistSchedule>(`${URL}/dentist-schedule/`, {
//     withCredentials: true,
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
//     },
//   });
//   return res.data;
// };

// export const deleteDentistSchedule = async () => {
//   const res = await axios.post<AppointmentResponse[]>(
//     `${URL}/dentist-schedule/`,
//     {
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
//       },
//     }
//   );
//   return res.data;
// };
