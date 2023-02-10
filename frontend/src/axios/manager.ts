import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getManagers = async () => {
  const res = await axios.get(`${URL}/manager`, {withCredentials: true});
  return res.data;
};
