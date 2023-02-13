import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatients = async () => {
  const res = await axios.get(`${URL}/patient`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getPatient = async (id: string) => {
  const res = await axios.get(`${URL}/patient/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const registerPatient = async (form: FormValues) => {
  const res = await axios.post(`${URL}/patient/register`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const removePatient = async (id: string) => {
  const res = await axios.delete(`${URL}/patient/remove/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
