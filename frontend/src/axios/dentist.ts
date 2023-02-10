import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getDentists = async () => {
  const res = await axios.get(`${URL}/dentist`);
  return res.data;
};
