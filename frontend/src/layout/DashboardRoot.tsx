import { Navigate, Outlet, useNavigation } from "react-router-dom";
import { useAdminStore } from "../store/admin";
import { useGetUser } from "../hooks/user";
import Sidebar from "../components/Root/Sidebar";

type Props = {};

const DashboardRoot = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const navigation = useNavigation();
  const { data } = useGetUser();

  if (!data) return <Navigate to="/login" />;
  if (data.role !== "Admin") return <Navigate to="/" />;

  return (
    <div className="flex min-h-[inherit] relative">
      <div
        className={
          "w-full min-h-[inherit] fixed bg-black bg-opacity-50 z-20 " +
          (sidebar ? "lg:hidden" : "hidden")
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) toggleSidebar();
        }}
      ></div>
      <Sidebar />
      <main className={navigation.state === "loading" ? "opacity-50" : ""}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardRoot;
