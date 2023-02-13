import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getUsers = async () => {
  const res = await axios.get<UserResponse[]>(`${URL}/user`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get<UserResponse>(`${URL}/user/me`, {
    withCredentials: true,
  });
  return res.data;
};

export const login = async (form: LoginFormValues) => {
  const res = await axios.post<LoginResponse>(`${URL}/user/login`, form, {
    withCredentials: true,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios.delete<MessageResponse>(`${URL}/user/logout`, {
    withCredentials: true,
  });
  return res.data;
};
