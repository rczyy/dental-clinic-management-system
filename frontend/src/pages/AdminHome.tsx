import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../store/admin";
import { useGetUser } from "../hooks/user";
import AdminSideBar from "../components/AdminSideBar";

type Props = {};

const AdminHome = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const { data } = useGetUser();

  if (!data) return <Navigate to="/login" />;
  if (data.role !== "Admin") return <Navigate to="/" />;

  return (
    <div className="flex min-h-[inherit] relative">
      <div
        className={
          "w-full min-h-[inherit] fixed bg-black bg-opacity-50 z-10 " +
          (sidebar ? "md:hidden" : "hidden")
        }
      ></div>
      <AdminSideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminHome;
