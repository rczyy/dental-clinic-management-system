import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatients = async () => {
  const res = await axios.get<PatientResponse[]>(`${URL}/patient`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getDeletedPatients = async () => {
  const res = await axios.get<PatientResponse[]>(`${URL}/patient/deleted`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getPatient = async (id: string) => {
  const res = await axios.get<PatientResponse>(`${URL}/patient/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getPatientNames = async () => {
  const res = await axios.get<PatientNamesResponse[]>(`${URL}/patient/names`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const registerPatient = async (form: SignupFormValues) => {
  const res = await axios.post<UserResponse>(`${URL}/patient/register`, form, {
    withCredentials: true,
  });
  return res.data;
};

export const recoverPatient = async (userId: string) => {
  const res = await axios.put<UserResponse>(
    `${URL}/patient/recover/${userId}`,
    null,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const removePatient = async (id: string) => {
  const res = await axios.delete<DeleteResponse>(
    `${URL}/patient/remove/${id}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const unbanPatient = async (patientId: string) => {
  const res = await axios.put<UserResponse>(
    `${URL}/patient/unban/${patientId}`,
    null,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const banPatient = async (patientId: string) => {
  const res = await axios.put<DeleteResponse>(
    `${URL}/patient/ban/${patientId}`,
    null,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};
