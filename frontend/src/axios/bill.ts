import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getBills = async (date?: string) => {
  const searchParams = new URLSearchParams({ ...(date && { date }) });

  const res = await axios.get<BillResponse[]>(`${URL}/bill?${searchParams}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getDeletedBills = async () => {
  const res = await axios.get<BillResponse[]>(`${URL}/bill/deleted`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const addBill = async (bill: BillFormValues) => {
  const res = await axios.post<BillResponse>(`${URL}/bill`, bill, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
