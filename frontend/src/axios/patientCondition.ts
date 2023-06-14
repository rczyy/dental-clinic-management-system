import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getPatientConditions = async (userId: string) => {
  const res = await axios.get<PatientConditionResponse[]>(`${URL}/patient-condition/${userId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const addPatientCondition = async ({
  userId,
  form,
}: {
  userId: string;
  form: Pick<PatientConditionResponse, "condition" | "conditionType">;
}) => {
  const res = await axios.post<PatientConditionResponse>(
    `${URL}/patient-condition/${userId}`,
    form,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};

export const editPatientCondition = async ({
  id,
  form,
}: {
  id: string;
  form: Partial<Pick<PatientConditionResponse, "condition" | "conditionType">>;
}) => {
  const res = await axios.put<PatientConditionResponse>(`${URL}/patient-condition/${id}`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const removePatientCondition = async (id: string) => {
  const res = await axios.delete<{ message: string; id: string }>(
    `${URL}/patient-condition/${id}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
      },
    }
  );
  return res.data;
};
