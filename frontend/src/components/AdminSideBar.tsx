import { BiUserCheck } from "react-icons/bi";
import { VscNote } from "react-icons/vsc";
import { CgProfile, CgUserList, CgUserAdd, CgNotes } from "react-icons/cg";
import { IconType } from "react-icons/lib";

type SideBarItemProps = {
  name: string;
  Icon: IconType;
};

const AdminSideBar = () => {
  return (
    <div className="flex flex-col justify-between fixed h-screen w-fit border-r border-base-200 pt-[5rem]">
      <div className="flex flex-col">
        <SideBarItem name="Register a staff" Icon={CgUserAdd} />
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
    <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:min-w-[10rem] p-3 cursor-pointer hover:bg-primary hover:text-zinc-100 border-transparent rounded">
      <Icon className="w-5 h-5" />
      <span className="text-[0.6rem] sm:text-sm">{name}</span>
    </div>
  );
};

export default AdminSideBar;
