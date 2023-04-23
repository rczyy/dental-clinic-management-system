import ReactDOM from "react-dom/client";
import Root, { loader as appLoader } from "./layout/Root";
import DashboardRoot from "./layout/DashboardRoot";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
<<<<<<< HEAD
import AdminHome from "./pages/AdminHome";
import SetAppointment from "./pages/SetAppointment";
import Staff, { loader as staffLoader } from "./pages/Staff";
import Patient, { loader as patientLoader } from "./pages/Patient";
=======
import StaffList, { loader as staffLoader } from "./pages/StaffList";
import PatientList, { loader as patientLoader } from "./pages/PatientList";
>>>>>>> bbd1bf0e0c74260a4cdab6f3c84b3206682fcfda
import RegisterStaff from "./pages/RegisterStaff";
import RegisterPatient from "./pages/RegisterPatient";
import Error from "./pages/Error";
import Services from "./pages/Services";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles.css";
import ServiceList from "./pages/ServiceList";

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
