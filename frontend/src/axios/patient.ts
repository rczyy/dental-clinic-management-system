import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatients = async () => {
  const res = await axios.get(`${URL}/patient`);
  return res.data;
};

export const getPatient = async (id: string) => {
  const res = await axios.get(`${URL}/patient/${id}`);
  return res.data;
};

export const registerPatient = async (form: SignupValues) => {
  const res = await axios.post(`${URL}/patient/register`, form);
  return res.data;
};

export const removePatient = async (id: string) => {
  const res = await axios.delete(`${URL}/patient/remove/${id}`);
  return res.data;
};
