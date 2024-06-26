import axios from "axios";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const getStaffs = async () => {
  const res = await axios.get<StaffResponse[]>(`${URL}/staff`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getDeletedStaffs = async () => {
  const res = await axios.get<StaffResponse[]>(`${URL}/staff/deleted`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const getStaff = async (id: string) => {
  const res = await axios.get<StaffResponse>(`${URL}/staff/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const registerStaff = async (form: StaffSignupFormValues) => {
  const res = await axios.post<UserResponse>(`${URL}/staff/register`, form, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};

export const recoverStaff = async (userId: string) => {
  const res = await axios.put<UserResponse>(
    `${URL}/staff/recover/${userId}`,
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

export const removeStaff = async (id: string) => {
  const res = await axios.delete<DeleteResponse>(`${URL}/staff/remove/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Bearer token")}`,
    },
  });
  return res.data;
};
