import "./styles.css";
import ReactDOM from "react-dom/client";
import Root, { loader as appLoader } from "./layout/Root";
import DashboardRoot from "./layout/DashboardRoot";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import StaffList, { loader as staffLoader } from "./pages/StaffList";
import PatientList, { loader as patientLoader } from "./pages/PatientList";
import RegisterStaff from "./pages/RegisterStaff";
import RegisterPatient from "./pages/RegisterPatient";
import ServiceList from "./pages/ServiceList";
import AddService from "./pages/AddService";
import { VerifyEmail } from "./pages/VerifyEmail";
import Error from "./pages/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles.css";
import Profile from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
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
            path: "services",
            element: <ServiceList />,
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
            path: "services/add",
            element: <AddService />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
