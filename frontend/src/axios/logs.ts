import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getLogs = async () => {
  const res = await axios.get<LogResponse[]>(`${URL}/log`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`
    }
  });
  return res.data;
};
