import {
  AiOutlineCreditCard,
  AiOutlineMedicineBox,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BiCalendarCheck, BiUserCheck } from "react-icons/bi";
import { VscNote } from "react-icons/vsc";
import { CgUserList } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/admin";
import { useGetMe } from "../../hooks/user";

type SidebarItemProps = {
  name: string;
  Icon: IconType;
  route: string;
};

const Sidebar = () => {
  const { data } = useGetMe();
  const sidebar = useAdminStore((state) => state.sidebar);

  return (
    <div
      className={
        "flex bg-base-100 min-h-[inherit] pt-20 pb-4 px-1 border-neutral border-r fixed z-20 transition-all lg:relative " +
        (sidebar ? "left-0 w-72 lg:w-80" : "-left-80 lg:w-0")
      }
    >
      <div className="flex flex-col w-full gap-1">
        {(data?.role === "Admin" || data?.role === "Manager") && (
          <SidebarItem
            name="Staff list"
            Icon={CgUserList}
            route="/dashboard/staff"
          />
        )}

        <SidebarItem
          name="Patient list"
          Icon={CgUserList}
          route="/dashboard/patients"
        />

        <SidebarItem
          name="Appointments"
          Icon={BiCalendarCheck}
          route="/dashboard"
        />

        {(data?.role === "Admin" ||
          data?.role === "Manager" ||
          data?.role === "Dentist" ||
          data?.role === "Front Desk") && (
          <SidebarItem
            name="Billings"
            Icon={AiOutlineCreditCard}
            route="/dashboard"
          />
        )}

        {data?.role === "Dentist" && (
          <SidebarItem
            name="My Schedule"
            Icon={AiTwotoneCalendar}
            route="/dashboard"
          />
        )}

        {(data?.role === "Admin" ||
          data?.role === "Manager" ||
          data?.role === "Front Desk") && (
          <SidebarItem
            name="Dentists' Schedules"
            Icon={AiTwotoneCalendar}
            route="/dashboard"
          />
        )}

        <SidebarItem
          name="Services"
          Icon={AiOutlineMedicineBox}
          route="/dashboard/services"
        />

        {data?.role !== "Admin" && (
          <SidebarItem
            name="My Attendance"
            Icon={BiUserCheck}
            route="/dashboard/attendance"
          />
        )}

        {(data?.role === "Admin" ||
          data?.role === "Manager" ||
          data?.role === "Front Desk") && (
          <SidebarItem
            name="Staff Attendance"
            Icon={BiUserCheck}
            route="/dashboard/staff-attendance"
          />
        )}
        {(data?.role === "Admin" || data?.role === "Manager") && (
          <SidebarItem name="Logs" Icon={VscNote} route="/" />
        )}
      </div>
    </div>
  );
};

const SidebarItem = ({ name, Icon, route }: SidebarItemProps) => {
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);

  return (
    <Link
      to={route}
      className="flex gap-3.5 items-center px-3 py-4 tracking-tighter cursor-pointer border-l-[6px] border-l-base-100 
      hover:border-l-primary rounded-r-md hover:bg-base-200 transition-all ease-in-out duration-100"
      onClick={window.innerWidth < 768 ? toggleSidebar : undefined}
    >
      <Icon className="w-6 h-6" />
      <span className="text-base text-center font-medium">{name}</span>
    </Link>
  );
};

export default Sidebar;
