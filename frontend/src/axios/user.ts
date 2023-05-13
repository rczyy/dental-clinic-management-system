import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;
export const getUsers = async () => {
  const res = await axios.get<UserResponse[]>(`${URL}/user`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
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
  localStorage.setItem("Bearer token", res.data.token);
  return res.data;
};

export const verifyUser = async (token: string) => {
  const res = await axios.put<MessageResponse>(`${URL}/user/verify`, { token });

  return res.data;
};

export const resetPassword = async (body: {
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await axios.put<MessageResponse>(
    `${URL}/user/reset-password`,
    body
  );

  return res.data;
};

export const logout = async () => {
  const res = await axios.delete<MessageResponse>(`${URL}/user/logout`, {
    withCredentials: true,
  });
  return res.data;
};
