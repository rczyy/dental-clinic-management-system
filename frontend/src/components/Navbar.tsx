import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
type Props = {};

const Navbar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="navbar bg-base-100 shadow relative">
      <div className="max-w-screen-xl w-full m-auto">
        <div className="flex-1">
          <a className="normal-case text-xl cursor-pointer">daisyUI</a>
        </div>
        <div className="flex-none sm:hidden">
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
          <a className="border-b border-transparent hover:border-black py-1 cursor-pointer">
            Log In
          </a>
          <a className="border-b border-transparent hover:border-black py-1 cursor-pointer">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
