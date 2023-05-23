import { QueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router-dom";
import { getMe } from "../axios/user";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Root/Navbar";
import Footer from "../components/Root/Footer";
import "react-toastify/dist/ReactToastify.css";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({ queryKey: ["user"], queryFn: getMe });

const Root = (props: Props) => {
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
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
