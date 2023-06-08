import { QueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router-dom";
import { getMe } from "../axios/user";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Root/Navbar";
import Footer from "../components/Root/Footer";
import Sidebar from "../components/Root/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { useGetMe } from "../hooks/user";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Hong_Kong");

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({ queryKey: ["me"], queryFn: getMe });

const Root = (props: Props) => {
  const { data: me } = useGetMe();

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <ScrollRestoration />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <div className="flex items-start">
        {me && me.role !== "Patient" && <Sidebar />}
        <div className="flex flex-col min-w-0 w-full">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Root;
