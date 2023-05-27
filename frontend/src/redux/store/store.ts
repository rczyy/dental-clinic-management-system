import { configureStore } from "@reduxjs/toolkit";
import { appointmentApi } from "../api/appointment";
import { addressApi } from "../api/address";

export const store = configureStore({
  reducer: {
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(appointmentApi.middleware)
      .concat(addressApi.middleware),
});
