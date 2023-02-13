import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatients = async () => {
  const res = await axios.get<PatientResponse[]>(`${URL}/patient`, {
    withCredentials: true,
  });
  return res.data;
};

export const getPatient = async (id: string) => {
  const res = await axios.get<PatientResponse>(`${URL}/patient/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const registerPatient = async (form: SignupFormValues) => {
  const res = await axios.post<UserResponse>(`${URL}/patient/register`, form, {
    withCredentials: true,
  });
  return res.data;
};

export const removePatient = async (id: string) => {
  const res = await axios.delete<DeleteResponse>(
    `${URL}/patient/remove/${id}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
