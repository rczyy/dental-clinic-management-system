import { IoMenuOutline } from "react-icons/io5";

type Props = {};

const AdminSideBar = (props: Props) => {

  return (
    <div className="flex flex-col gap-4 relative h-screen w-fit border-r mr-2 sm:hidden">
      <IoMenuOutline className="w-8 h-8 cursor-pointer" />
      <IoMenuOutline className="w-8 h-8 cursor-pointer" />
      <IoMenuOutline className="w-8 h-8 cursor-pointer" />
      
    </div>
  );
};

export default AdminSideBar;
