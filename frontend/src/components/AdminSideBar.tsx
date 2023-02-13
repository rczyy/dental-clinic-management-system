import { BiUserCheck } from "react-icons/bi";
import { VscNote } from "react-icons/vsc";
import { CgProfile, CgUserList, CgUserAdd } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

type SideBarItemProps = {
  name: string;
  Icon: IconType;
};

const AdminSideBar = () => {
  return (
    <div className="flex flex-col justify-between h-screen fixed w-fit pt-[5rem] pb-4 border-base-200 border font-work">
      <div className="flex flex-col">
        <SideBarItem name="Add a staff" Icon={CgUserAdd} />
        <SideBarItem name="Attendance" Icon={BiUserCheck} />
        <SideBarItem name="Staff list" Icon={CgUserList} />
        <SideBarItem name="Logs" Icon={VscNote} />
      </div>
      <div>
        <SideBarItem name="Profile" Icon={CgProfile} />
      </div>
    </div>
  );
};

const SideBarItem = ({ name, Icon }: SideBarItemProps) => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-2 items-center 
    w-full sm:min-w-[13rem] sm:px-3 px-1 py-3 cursor-pointer 
    hover:bg-base-200 border-l-[6px] hover:border-l-primary border-l-base-100 
    transition-all ease-in-out duration-100"
    >
      <Icon className="w-5 h-5" />
      <Link
        to="/admin/register-staff"
        className="text-[0.6rem] sm:text-sm lg:text-base text-center"
      >
        {name}
      </Link>
    </div>
  );
};

export default AdminSideBar;
