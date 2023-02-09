import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import DarkModeToggle from "./DarkModeToggle";

type Props = {};

const Navbar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow relative gap-8 px-4 md:px-8">
      <div className="max-w-screen-xl w-full m-auto">
        <div className="flex-1">
          <a className="font-work font-extrabold text-3xl cursor-pointer text-primary">
            Logo
          </a>
        </div>
        <div className="flex flex-none items-center gap-6 sm:hidden">
          <DarkModeToggle className="flex items-center" />
          <IoMenuOutline
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="w-8 h-8 cursor-pointer"
          />
          {isOpen && (
            <ul className="menu bg-base-100 w-full absolute top-16 right-0 shadow">
              <li>
                <a>Log In</a>
              </li>
              <li>
                <a>Sign Up</a>
              </li>
            </ul>
          )}
        </div>
        <div className="flex-none hidden sm:flex gap-8">
          <a className="font-work font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer">
            Log In
          </a>
          <a className="font-work font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer">
            Sign Up
          </a>
        </div>
      </div>
      <DarkModeToggle className="hidden sm:flex" />
    </div>
  );
};

export default Navbar;
