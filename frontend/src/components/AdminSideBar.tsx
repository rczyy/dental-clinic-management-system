import { BiUserCheck } from "react-icons/bi";
import { VscNote } from "react-icons/vsc";
import { CgUserList, CgUserAdd } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import { useAdminStore } from "../store/admin";

type SideBarItemProps = {
  name: string;
  Icon: IconType;
  route: string;
};

const AdminSideBar = () => {
  const sidebar = useAdminStore((state) => state.sidebar);

  return (
    <div
      className={
        "flex bg-base-100 min-h-[inherit] pt-20 pb-4 px-1 border-base-200 border-r fixed z-20 transition-all md:relative " +
        (sidebar ? "left-0 w-80" : "-left-80 md:w-0")
      }
    >
      <div className="flex flex-col w-full gap-1">
        <SideBarItem
          name="Add a staff"
          Icon={CgUserAdd}
          route="/admin/register-staff"
        />
        <SideBarItem name="Staff list" Icon={CgUserList} route="/admin/staff" />
        <SideBarItem
          name="Patient list"
          Icon={CgUserList}
          route="/admin/patient"
        />
        <SideBarItem name="Attendance" Icon={BiUserCheck} route="/" />
        <SideBarItem name="Logs" Icon={VscNote} route="/" />
      </div>
    </div>
  );
};

const SideBarItem = ({ name, Icon, route }: SideBarItemProps) => {
  return (
    <Link
      to={route}
      className="flex gap-2 items-center px-3 py-3 cursor-pointer border-l-[6px] border-l-base-100 
      hover:border-l-primary hover:bg-base-200 transition-all ease-in-out duration-100"
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs sm:text-sm text-center">{name}</span>
    </Link>
  );
};

export default AdminSideBar;
