import {
  AiOutlineMedicineBox,
  AiOutlineSchedule,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BiReceipt, BiUserCheck } from "react-icons/bi";
import { CgUserList } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/admin";
import { useGetMe } from "../../hooks/user";
import { HiOutlineDocumentText } from "react-icons/hi";

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
      className={`fixed lg:sticky inset-0 lg:top-0 flex flex-col bg-base-100/95 min-h-screen ${
        sidebar ? "max-w-xs border-r" : "max-w-0 border-none"
      } min-w-0 w-full pt-20 border-r-neutral shadow-2xl lg:shadow z-20 transition-[max-width] overflow-hidden`}
    >
      <SidebarItem
        name="Dashboard"
        Icon={MdOutlineSpaceDashboard}
        route="/dashboard"
      />
      {(data?.role === "Admin" || data?.role === "Manager") && (
        <SidebarItem name="Staff" Icon={CgUserList} route="/staff" />
      )}

      <SidebarItem name="Patients" Icon={CgUserList} route="/patients" />

      <SidebarItem
        name="Appointments"
        Icon={AiOutlineSchedule}
        route="/appointments"
      />

      {(data?.role === "Admin" ||
        data?.role === "Manager" ||
        data?.role === "Dentist" ||
        data?.role === "Front Desk") && (
        <SidebarItem name="Bills" Icon={BiReceipt} route="/bills" />
      )}

      {data?.role !== "Patient" && (
        <SidebarItem
          name="Dentists' Schedules"
          Icon={AiTwotoneCalendar}
          route="/dentists-schedule"
        />
      )}

      {data?.role === "Dentist" && (
        <SidebarItem
          name="My Schedule"
          Icon={AiTwotoneCalendar}
          route="/my-schedule"
        />
      )}

      <SidebarItem
        name="Services"
        Icon={AiOutlineMedicineBox}
        route="/services"
      />

      {data?.role !== "Admin" && (
        <SidebarItem
          name="My Attendance"
          Icon={BiUserCheck}
          route="/attendance"
        />
      )}

      {(data?.role === "Admin" ||
        data?.role === "Manager" ||
        data?.role === "Front Desk") && (
        <SidebarItem
          name="Staff Attendance"
          Icon={BiUserCheck}
          route="/staff-attendance"
        />
      )}

      {(data?.role === "Admin" || data?.role === "Manager") && (
        <SidebarItem
          name="Audit trail"
          Icon={HiOutlineDocumentText}
          route="/audit-trail"
        />
      )}
    </div>
  );
};

const SidebarItem = ({ name, Icon, route }: SidebarItemProps) => {
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);

  return (
    <Link
      to={route}
      className="flex gap-3.5 items-center px-4 py-5 tracking-tighter cursor-pointer border-l-[6px] border-l-transparent
      hover:border-l-primary rounded-r-md hover:bg-base-200 transition-all ease-in-out duration-100"
      onClick={window.innerWidth < 768 ? toggleSidebar : undefined}
    >
      <Icon className="w-6 h-6" />
      <span className="text-base text-center font-medium truncate">{name}</span>
    </Link>
  );
};

export default Sidebar;
