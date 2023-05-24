import { configureStore } from "@reduxjs/toolkit";
import { appointmentApi } from "../api/appointment";

export const store = configureStore({
    reducer: {
        [appointmentApi.reducerPath]: appointmentApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(appointmentApi.middleware),
});