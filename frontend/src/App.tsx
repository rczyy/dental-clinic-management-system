import { QueryClient } from "@tanstack/react-query";
import { Outlet, useLoaderData } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getUser } from "./axios/user";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({ queryKey: ["user"], queryFn: getUser });

const App = (props: Props) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
