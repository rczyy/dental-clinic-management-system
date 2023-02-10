import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getUsers = async () => {
  const res = await axios.get(`${URL}/user`);
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get(`${URL}/user/me`);
  return res.data;
};

export const login = async (form: LoginValues) => {
  const res = await axios.post(`${URL}/user/login`, form);
  return res.data;
};

export const logout = async () => {
    const res = await axios.delete(`${URL}/user/logout`);
    return res.data;
};
