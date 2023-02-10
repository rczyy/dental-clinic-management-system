import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getFrontDesks = async () => {
  const res = await axios.get(`${URL}/frontDesk`);
  return res.data;
};
