import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAssistants = async () => {
  const res = await axios.get<AssistantResponse[]>(`${URL}/assistant`, {
    withCredentials: true,
  });
  return res.data;
};
