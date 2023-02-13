import { IoMenuOutline } from "react-icons/io5";

type Props = {};

const AdminSideBar = (props: Props) => {
  return (
    <div className="flex h-[90%] w-fit fixed">
      <div className="flex flex-col justify-between m-1 my-2 p-1 sm:hidden">
        <div>
          <IoMenuOutline className="h-10 w-10 p-1 cursor-pointer hover:bg-primary border-transparent rounded" />
          <IoMenuOutline className="h-10 w-10 p-1 cursor-pointer hover:bg-primary border-transparent rounded" />
          <IoMenuOutline className="h-10 w-10 p-1 cursor-pointer hover:bg-primary border-transparent rounded" />
          <IoMenuOutline className="h-10 w-10 p-1 cursor-pointer hover:bg-primary border-transparent rounded" />
        </div>
        <div>
          <IoMenuOutline className="h-10 w-10 p-1 cursor-pointer hover:bg-primary border-transparent rounded" />
        </div>
      </div>
      <div className="flex-col justify-between m-1 my-2 p-1 hidden sm:flex">
        <div>
          <div className="flex gap-2 items-center p-1 pr-2 cursor-pointer hover:bg-primary border-transparent rounded">
            <IoMenuOutline className="w-8 h-8" />
            <span>Register a staff</span>
          </div>
          <div className="flex gap-2 items-center p-1 pr-2 cursor-pointer hover:bg-primary border-transparent rounded">
            <IoMenuOutline className="w-8 h-8" />
            <span>Staff list</span>
          </div>
          <div className="flex gap-2 items-center p-1 pr-2 cursor-pointer hover:bg-primary border-transparent rounded">
            <IoMenuOutline className="w-8 h-8" />
            <span>Attendance</span>
          </div>
          <div className="flex gap-2 items-center p-1 pr-2 cursor-pointer hover:bg-primary border-transparent rounded">
            <IoMenuOutline className="w-8 h-8" />
            <span>Logs</span>
          </div>
        </div>
        <div className="flex gap-2 items-center p-1 pr-2 cursor-pointer hover:bg-primary border-transparent rounded">
          <IoMenuOutline className="w-8 h-8" />
          <span>Profile</span>
        </div>
      </div>
      <div className="h-screen w-[1px] bg-zinc-300"></div>
    </div>
  );
};

export default AdminSideBar;
