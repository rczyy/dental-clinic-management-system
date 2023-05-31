import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useGetMe, useLogout } from "../../hooks/user";
import DarkModeToggle from "../Utilities/DarkModeToggle";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAdminStore } from "../../store/admin";
import ATLogo from "../Utilities/ATLogo";

type Props = {};

const Navbar = (props: Props) => {
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetMe();
  const { mutate } = useLogout();
  const roles = ["Admin", "Manager", "Assistant", "Dentist", "Front Desk"];

  const handleLogout: React.MouseEventHandler<HTMLSpanElement> = () => {
    mutate();
    setIsOpen(!isOpen);
  };

  const menuRef = useDetectClickOutside({
    onTriggered: (e) => setIsOpen(false),
  });

  return (
    <div className="navbar bg-base-100 min-h-16 border-b border-b-neutral shadow gap-8 2xl:gap-0 px-4 py-0 z-30 md:px-8 fixed">
      {data && roles.includes(data.role) && (
        <IoMenuOutline
          className="w-8 h-8 cursor-pointer"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex justify-between gap-6 max-w-screen-xl w-full min-h-[inherit] m-auto relative">
        <div>
          <Link
            to="/"
            className="flex items-center font-bold -tracking-widest text-2xl cursor-pointer text-primary"
          >
            <ATLogo className="fill-primary" />
            <span className="hidden sm:block">Dental Home</span>
          </Link>
        </div>

        {data ? (
          <div className="flex gap-4">
            <DarkModeToggle className="flex items-center sm:hidden" />
            <div
              className="flex items-center sm:gap-3 cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              ref={menuRef}
            >
              <figure className="rounded-full overflow-hidden">
                <img
                  src={data.avatar}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-cover"
                />
              </figure>
              <div className="hidden sm:block">
                <p className="text-sm leading-tight tracking-tight font-semibold">
                  {data.name.firstName}
                </p>
                <p className="text-xs text-zinc-400 leading-tight tracking-tight">
                  {data.email}
                </p>
              </div>
              <div
                className={`absolute top-16 -right-4 grid ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                } w-screen sm:w-60 transition-[grid-template-rows]`}
              >
                <ul
                  className={`menu flex-nowrap bg-base-100 ${
                    isOpen && "border border-base-200"
                  } rounded-b-box text-sm shadow overflow-hidden`}
                >
                  <li>
                    <Link to={`/profile/${data._id}`}>Account settings</Link>
                  </li>

                  {(data.role === "Patient" || data.role === "Dentist") && (
                    <li>
                      <Link to={`/my-appointments`}>My Appointments</Link>
                    </li>
                  )}

                  <li>
                    <span onClick={handleLogout}>Log out</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
