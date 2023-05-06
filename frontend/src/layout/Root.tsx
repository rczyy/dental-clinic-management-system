import { QueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router-dom";
import { getUser } from "../axios/user";
import Navbar from "../components/Root/Navbar";
import Footer from "../components/Root/Footer";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({ queryKey: ["user"], queryFn: getUser });

const Root = (props: Props) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
