import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getFrontDesks = async () => {
  const res = await axios.get<FrontDeskResponse[]>(`${URL}/frontDesk`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
