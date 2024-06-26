import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getDentists = async () => {
  const res = await axios.get<DentistResponse[]>(`${URL}/dentist`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getDentistNames = async () => {
  const res = await axios.get<DentistNamesResponse[]>(`${URL}/dentist/names`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
