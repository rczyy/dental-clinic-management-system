import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getStaffs = async () => {
  const res = await axios.get(`${URL}/staff`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getStaff = async (id: string) => {
  const res = await axios.get(`${URL}/staff/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const registerStaff = async (form: FormValues) => {
  const res = await axios.post(`${URL}/staff/register`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const removeStaff = async (id: string) => {
  const res = await axios.delete(`${URL}/staff/remove/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
