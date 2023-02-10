import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getStaffs = async () => {
  const res = await axios.get(`${URL}/staff`);
  return res.data;
};

export const getStaff = async (id: string) => {
  const res = await axios.get(`${URL}/staff/${id}`);
  return res.data;
};

export const registerStaff = async (form: SignupValues) => {
  const res = await axios.post(`${URL}/staff/register`, form);
  return res.data;
};

export const removeStaff = async (id: string) => {
  const res = await axios.delete(`${URL}/staff/remove/${id}`);
  return res.data;
};
