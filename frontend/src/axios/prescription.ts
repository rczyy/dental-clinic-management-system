import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPrescriptions = async (userId: string) => {
  const res = await axios.get<PrescriptionResponse[]>(`${URL}/prescription/${userId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const addPrescription = async ({
  userId,
  form,
}: {
  userId: string;
  form: Pick<PrescriptionResponse, "name" | "dose" | "frequency">;
}) => {
  const res = await axios.post<PrescriptionResponse>(`${URL}/prescription/${userId}`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const editPrescription = async ({
  id,
  form,
}: {
  id: string;
  form: Partial<Pick<PrescriptionResponse, "name" | "dose" | "frequency">>;
}) => {
  const res = await axios.put<PrescriptionResponse>(`${URL}/prescription/${id}`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const removePrescription = async (id: string) => {
  const res = await axios.delete<{ message: string; id: string }>(`${URL}/prescription/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
