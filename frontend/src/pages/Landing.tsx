import CategoryBox from "../components/Services/ServiceBox";
import { RiHealthBookLine } from "react-icons/ri";
import { FaTooth, FaTeethOpen, FaTeeth } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { GiTooth } from "react-icons/gi";
import { useGetMe } from "../hooks/user";
import { Link } from "react-router-dom";
import { AddMobileNumber } from "../components/Modal/AddMobileNumber";
import { useState } from "react";
import { useAdminStore } from "../store/admin";

type Props = {};

const Landing = (_: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const [isAddMobileOpen, setIsAddMobileOpen] = useState(true);

  const { data } = useGetMe();

  return (
    <>
      <div className="min-h-screen flex flex-col gap-2 pt-16 pb-4 bg-base-300">
        <section
          className={`flex flex-col items-center justify-center gap-2 min-h-screen bg-[url(assets/at.png)] bg-center bg-cover relative`}
        >
          <div className="text-center z-10">
            <h1 className="font-light text-white text-3xl">AT Dental Home's</h1>
            <h1 className="font-bold text-primary text-2xl">
              Online Appointment System
            </h1>
          </div>
          <div className="z-10">
            <Link
              to={data ? (data.contactNo ? "/set-appointment" : "") : "/login"}
              className="btn btn-primary text-base-100"
              onClick={() => {
                if (data && !data.contactNo) setIsAddMobileOpen(true);
              }}
            >
              Book an appointment
            </Link>
          </div>
          <div className="absolute w-full h-full bg-black bg-opacity-70"></div>
        </section>

        <section className="flex flex-col justify-center gap-8 px-4 py-20">
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl font-semibold">Services</h2>
            <p className="text-center">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
              labore. Repellat, voluptatem?
            </p>
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-4 ${
              sidebar ? "xl:px-16" : "xl:px-64"
            } w-full gap-4`}
          >
            <CategoryBox title="First Appointment" Icon={RiHealthBookLine} />
            <CategoryBox title="Restoration" Icon={FaTooth} />
            <CategoryBox title="Cosmetic" Icon={HiSparkles} />
            <CategoryBox title="Root canal treatment" Icon={FaTooth} />
            <CategoryBox title="Crowns and Bridges" Icon={FaTeethOpen} />
            <CategoryBox title="Oral surgery or Extraction" Icon={GiTooth} />
            <CategoryBox title="Dentures" Icon={FaTeethOpen} />
            <CategoryBox title="Orthodontics (Braces)" Icon={FaTeeth} />
          </div>
          <div className="flex justify-center">
            <Link to="/services">
              <button className="btn btn-primary text-white">
                Go to services
              </button>
            </Link>
          </div>
        </section>
      </div>
      {data && !data?.contactNo && isAddMobileOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddMobileOpen(false);
          }}
        >
          <AddMobileNumber />
        </div>
      )}
    </>
  );
};

export default Landing;
