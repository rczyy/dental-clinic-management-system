import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useGetUser, useLogout } from "../../hooks/user";
import DarkModeToggle from "../Utilities/DarkModeToggle";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAdminStore } from "../../store/admin";

type Props = {};

const Navbar = (props: Props) => {
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetUser();
  const { mutate } = useLogout();

  const handleLogout: React.MouseEventHandler<HTMLSpanElement> = () => {
    mutate();
    setIsOpen(!isOpen);
  };

  const menuRef = useDetectClickOutside({
    onTriggered: (e) => setIsOpen(false),
  });

  return (
    <div className="navbar bg-base-100 min-h-16 border-b border-b-neutral shadow gap-8 2xl:gap-0 px-4 py-0 z-30 md:px-8 fixed">
      {data && data.role === "Admin" && (
        <IoMenuOutline
          className="w-8 h-8 cursor-pointer"
          onClick={toggleSidebar}
        />
      )}
      <div className="max-w-screen-xl w-full min-h-[inherit] m-auto relative">
        <div className="flex-1">
          {(!data || (data && data.role !== "Admin")) && (
            <Link
              to="/"
              className="font-extrabold text-3xl cursor-pointer text-primary"
            >
              Logo
            </Link>
          )}
        </div>
        {data ? (
          <>
            <DarkModeToggle className="flex items-center mx-6 sm:hidden" />
            <div
              className="flex items-center sm:gap-3 cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              ref={menuRef}
            >
              <figure className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <img src={data.avatar} />
              </figure>
              <div className="hidden sm:block">
                <p className="text-sm leading-tight tracking-tight font-semibold">
                  {data.name.firstName}
                </p>
                <p className="text-xs text-zinc-400 leading-tight tracking-tight">
                  {data.email}
                </p>
              </div>
              <div className="absolute w-screen sm:w-60 top-16 -right-4">
                {isOpen && (
                  <ul className="menu bg-base-100 text-sm border-base-200 border shadow">
                    <li>
                      <Link to="/profile">Account settings</Link>
                    </li>
                    <li>
                      <span onClick={handleLogout}>Log out</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-none items-center gap-6 relative sm:hidden">
              <DarkModeToggle className="flex items-center" />
              <div ref={menuRef}>
                <IoMenuOutline
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  className="w-8 h-8 cursor-pointer"
                />
                {isOpen && (
                  <ul className="menu bg-base-100 w-screen absolute top-12 -right-4 border border-base-200 rounded-b-lg shadow">
                    <li>
                      <Link
                        to="/login"
                        onClick={(e) => {
                          setIsOpen(false);
                        }}
                      >
                        Log in
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="flex-none hidden sm:flex gap-8">
              <Link
                to="/login"
                className="font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer transition-all ease-in-out duration-100"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="font-semibold border-b border-transparent hover:border-base-content py-1 cursor-pointer transition-all ease-in-out duration-100"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
      <DarkModeToggle className="hidden sm:flex" />
    </div>
  );
};

export default Navbar;
