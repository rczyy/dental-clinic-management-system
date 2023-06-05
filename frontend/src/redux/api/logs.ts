import { rootApi } from "./root";

const URL = import.meta.env.VITE_AXIOS_BASE_URL;

export const logsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<LogResponse[], string>({
      query: (date) => ({
        url: `${URL}/log?date=${date}`,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Bearer token")}`
        }
      })
    })
  })
});

export const { useLazyGetLogsQuery } = logsApi;
