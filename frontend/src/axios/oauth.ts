import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const loginWithGoogle = async (code: string) => {
  const res = await axios.post<LoginResponse>(
    `${URL}/oauth/google`,
    {
      code,
    },
    {
      withCredentials: true,
    }
  );

  localStorage.setItem("Bearer token", res.data.token);
  return res.data;
};
