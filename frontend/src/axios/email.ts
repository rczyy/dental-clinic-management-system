import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const requestEmailVerification = async (token: string) => {
  const res = await axios.post<MessageResponse>(`${URL}/email/verification`, {
    token,
  });

  return res.data;
};
