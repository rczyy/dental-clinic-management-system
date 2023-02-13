import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;
export const getUsers = async () => {
  const res = await axios.get(`${URL}/user`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get(`${URL}/user/me`, { withCredentials: true });
  return res.data;
};

export const login = async (form: FormValues) => {
  const res = await axios.post(`${URL}/user/login`, form, {
    withCredentials: true,
  });
  localStorage.setItem("Bearer token", res.data.token);
  return res.data;
};

export const logout = async () => {
  const res = await axios.delete(`${URL}/user/logout`, {
    withCredentials: true,
  });
  return res.data;
};
