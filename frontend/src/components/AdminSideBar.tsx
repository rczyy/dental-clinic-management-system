import { BiUserCheck } from "react-icons/bi";
import { VscNote } from "react-icons/vsc";
import { CgUserList, CgUserAdd } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

type SideBarItemProps = {
  name: string;
  Icon: IconType;
  route: string;
};

const AdminSideBar = () => {
  return (
    <div className="flex flex-col sticky justify-between h-screen w-fit sm:min-w-[13rem] pt-[5rem] pb-4 px-1 border-base-200 border-r font-work bg-base-100">
      <div className="flex flex-col">
        <SideBarItem
          name="Add a staff"
          Icon={CgUserAdd}
          route="/admin/register-staff"
        />
        <SideBarItem name="Attendance" Icon={BiUserCheck} route="/" />
        <SideBarItem name="Staff list" Icon={CgUserList} route="/" />
        <SideBarItem name="Logs" Icon={VscNote} route="/" />
      </div>
    </div>
  );
};

const SideBarItem = ({ name, Icon, route }: SideBarItemProps) => {
  return (
    <Link
      to={route}
      className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-center 
      sm:px-3 px-1 py-3 cursor-pointer hover:bg-base-200 sm:border-l-[6px] 
      hover:border-l-primary border-l-base-100 transition-all ease-in-out duration-100"
    >
      <Icon className="w-6 h-6" />
      <span className="text-[0.6rem] sm:text-sm font-semibold text-center">
        {name}
      </span>
    </Link>
  );
};

export default AdminSideBar;
