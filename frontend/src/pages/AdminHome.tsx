import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar";

type Props = {};

const AdminHome = (props: Props) => {
  return (
    <div className="flex">
      <AdminSideBar />
      <Outlet/>
    </div>
  );
};

export default AdminHome;
