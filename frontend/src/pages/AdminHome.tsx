import { Navigate, Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar";
import { useGetUser } from "../hooks/user";

type Props = {};

const AdminHome = (props: Props) => {
  const {data, isLoading} = useGetUser();

  if(isLoading) return <h2>Loading...</h2>
  if(!data) return <Navigate to="/login"/>
  if(data.role !== "Admin") return <Navigate to="/"/>

  return (
    <div className="flex">
      <AdminSideBar />
      <Outlet/>
    </div>
  );
};

export default AdminHome;
