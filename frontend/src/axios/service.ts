import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getServices = async () => {
  const res = await axios.get<ServiceResponse[]>(`${URL}/service`, {
    withCredentials: true,
  });
  return res.data;
};

export const getService = async (id: string) => {
  const res = await axios.get<ServiceResponse>(`${URL}/service/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const addService = async (data: ServiceFormValues) => {
  const res = await axios.post<ServiceResponse>(`${URL}/service/add`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const editService = async (data: ServiceFormValues, id: string) => {
  const res = await axios.patch<ServiceResponse>(`${URL}/service/edit/${id}`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const deleteService = async (id: string) => {
  const res = await axios.delete(`${URL}/service/remove/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
