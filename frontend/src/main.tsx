import ReactDOM from "react-dom/client";
import App, { loader as appLoader } from "./App";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import AdminHome from "./pages/AdminHome";
import SetAppointment from "./pages/SetAppointment";
import Staff, { loader as staffLoader } from "./pages/Staff";
import Patient, { loader as patientLoader } from "./pages/Patient";
import RegisterStaff from "./pages/RegisterStaff";
import Error from "./pages/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    loader: appLoader(queryClient),
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "admin",
        element: <AdminHome />,
        children: [
          {
            path: "staff",
            element: <Staff />,
            loader: staffLoader(queryClient),
          },
          {
            path: "patient",
            element: <Patient />,
            loader: patientLoader(queryClient),
          },
          {
            path: "register-staff",
            element: <RegisterStaff />,
          },
        ],
      },
      {
        path: "set-appointment",
        element: <SetAppointment />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
