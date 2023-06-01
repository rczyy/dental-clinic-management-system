import "./styles.css";
import ReactDOM from "react-dom/client";
import Root, { loader as appLoader } from "./layout/Root";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import SetAppointment from "./pages/SetAppointment";
import ServiceList from "./pages/ServiceList";
import StaffList from "./pages/StaffList";
import PatientList from "./pages/PatientList";
import RegisterStaff from "./pages/RegisterStaff";
import RegisterPatient from "./pages/RegisterPatient";
import AddService from "./pages/AddService";
import Profile from "./pages/Profile";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import MyAttendance from "./pages/MyAttendance";
import StaffAttendance from "./pages/StaffAttendance";
import StaffSetAppointment from "./pages/StaffSetAppointment";
import AuditTrail from "./pages/AuditTrail";
import Error from "./pages/Error";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { rootApi } from "./redux/api/root";
import { MyAppointments } from "./pages/MyAppointments";
import { MySchedule } from "./pages/MySchedule";
import { AppointmentList } from "./pages/AppointmentList";
import { DentistsSchedule } from "./pages/DentistsSchedule";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000
    }
  }
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
        element: <Landing />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "profile/:userID",
        element: <Profile />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      },
      {
        path: "verify-email",
        element: <VerifyEmail />
      },
      {
        path: "patients",
        element: <PatientList />
      },
      {
        path: "staff",
        element: <StaffList />
      },
      {
        path: "services",
        element: <ServiceList />
      },
      {
        path: "staff/register",
        element: <RegisterStaff />
      },
      {
        path: "patient/register",
        element: <RegisterPatient />
      },
      {
        path: "services/add",
        element: <AddService />
      },
      {
        path: "set-appointment",
        element: <SetAppointment />
      },
      {
        path: "set-appointment/staff",
        element: <StaffSetAppointment />
      },
      {
        path: "set-appointment/success",
        element: <AppointmentSuccess />
      },
      {
        path: "my-appointments",
        element: <MyAppointments />
      },
      {
        path: "my-schedule",
        element: <MySchedule />
      },
      {
        path: "appointments",
        element: <AppointmentList />
      },
      {
        path: "dentists-schedule",
        element: <DentistsSchedule />
      },
      {
        path: "attendance",
        element: <MyAttendance />
      },
      {
        path: "staff-attendance",
        element: <StaffAttendance />
      },
      {
        path: "audit-trail",
        element: <AuditTrail />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ApiProvider api={rootApi}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </LocalizationProvider>
      </GoogleOAuthProvider>
    </ApiProvider>
  </QueryClientProvider>
);
