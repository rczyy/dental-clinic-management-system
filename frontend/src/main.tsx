import ReactDOM from "react-dom/client";
import Root, { loader as appLoader } from "./layout/Root";
import DashboardRoot from "./layout/DashboardRoot";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import SetAppointment from "./pages/SetAppointment";
import ServiceList from "./pages/ServiceList";
import StaffList, { loader as staffLoader } from "./pages/StaffList";
import PatientList, { loader as patientLoader } from "./pages/PatientList";
import RegisterStaff from "./pages/RegisterStaff";
import RegisterPatient from "./pages/RegisterPatient";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import Error from "./pages/Error";
import Services from "./pages/Services";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { appointmentApi } from "./redux/api/appointment";
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
    element: <Root />,
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
        path: "dashboard",
        element: <DashboardRoot />,
        children: [
          {
            path: "patients",
            element: <PatientList />,
            loader: patientLoader(queryClient),
          },
          {
            path: "staff",
            element: <StaffList />,
            loader: staffLoader(queryClient),
          },
          {
            path: "staff/register",
            element: <RegisterStaff />,
          },
          {
            path: "patient/register",
            element: <RegisterPatient />,
          },
          {
            path: "services",
            element: <ServiceList />,
          },
        ],
      },
      {
        path: "services",
        element: <Services />,
        children: [
          {
            path: ":serviceCategory",
            element: <Services />,
          },
        ],
      },
      {
        path: "set-appointment",
        element: <SetAppointment />,
      },
      {
        path: "set-appointment/success",
        element: <AppointmentSuccess />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ApiProvider api={appointmentApi}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </LocalizationProvider>
    </ApiProvider>
  </QueryClientProvider>
);
