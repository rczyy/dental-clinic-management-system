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

export const getDeletedBills = async (date?: string) => {
  const searchParams = new URLSearchParams({ ...(date && { date }) });

  const res = await axios.get<BillResponse[]>(
    `${URL}/bill/deleted?${searchParams}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const getPatientBills = async (userId: string) => {
  const res = await axios.get<BillResponse[]>(`${URL}/bill/${userId}`, {
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

export const editBill = async ({
  billId,
  bill,
}: {
  billId: string;
  bill: BillFormValues;
}) => {
  const res = await axios.put<BillResponse>(`${URL}/bill/${billId}`, bill, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const recoverBill = async (billId: string) => {
  const res = await axios.put<BillResponse>(
    `${URL}/bill/recover/${billId}`,
    undefined,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const removeBill = async (billId: string) => {
  const res = await axios.delete<BillResponse>(`${URL}/bill/${billId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
