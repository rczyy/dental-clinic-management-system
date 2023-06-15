import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatientFiles = async (userId: string, bill?: string) => {
  const searchParams = new URLSearchParams({ ...(bill && { bill }) });

  const res = await axios.get<PatientFileResponse[]>(
    `${URL}/patient-file/${userId}?${searchParams}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const addPatientFile = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
  const res = await axios.post<PatientFileResponse>(`${URL}/patient-file/${userId}`, formData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const removePatientFile = async (id: string) => {
  const res = await axios.delete<{ message: string; id: string }>(`${URL}/patient-file/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
