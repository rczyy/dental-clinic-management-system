import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getManagers = async () => {
  const res = await axios.get<ManagerResponse[]>(`${URL}/manager`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
