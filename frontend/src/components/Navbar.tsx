import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useGetUser } from "../hooks/user";
import DarkModeToggle from "./DarkModeToggle";

type Props = {};

const Navbar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {data} = useGetUser()

  return (
    <div className="navbar bg-base-100 shadow gap-8 2xl:gap-0 px-4 z-30 md:px-8 fixed">
      <div className="max-w-screen-xl w-full m-auto">
        <div className="flex-1">
          <Link to="/" className="font-work font-extrabold text-3xl cursor-pointer text-primary">
            Logo
          </Link>
        </div>
        <div className="flex flex-none items-center gap-6 relative sm:hidden">
          <DarkModeToggle className="flex items-center" />
          <IoMenuOutline
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="w-8 h-8 cursor-pointer"
          />
          {isOpen && (
            <ul className="menu bg-base-100 w-screen absolute top-12 -right-4 border-base-200 border shadow">
              <li>
                <Link to="/login">Log in</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </ul>
          )}
        </div>
        <div className="flex-none hidden sm:flex gap-8">
          <Link to="/login" className="font-work font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer transition-all ease-in-out duration-100">
            Log In
          </Link>
          <Link to="/signup" className="font-work font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer transition-all ease-in-out duration-100">
            Sign Up
          </Link>
        </div>
      </div>
      <DarkModeToggle className="hidden sm:flex" />
    </div>
  );
};

export default Navbar;
