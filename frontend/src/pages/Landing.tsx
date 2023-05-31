import { RiHealthBookLine } from "react-icons/ri";
import { FaTooth, FaTeethOpen, FaTeeth } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { GiTooth } from "react-icons/gi";
import { useGetMe } from "../hooks/user";
import { Link } from "react-router-dom";
import { AddMobileNumber } from "../components/Modal/AddMobileNumber";
import { useState } from "react";
import { ServiceAccordion } from "../components/Services/ServiceAccordion";

type Props = {};

const Landing = (_: Props) => {
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
              to={
                data
                  ? data.role === "Patient"
                    ? data.contactNo
                      ? "/set-appointment"
                      : ""
                    : "/set-appointment/staff"
                  : "/login"
              }
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

        <section className="flex flex-col justify-center gap-12 px-4 py-20">
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-5xl text-center font-semibold">Our Services</h2>
            <p className="text-zinc-400 text-sm text-center">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
              labore. Repellat, voluptatem?
            </p>
          </div>

          <div className="flex flex-col max-w-6xl w-full m-auto border border-primary rounded-box overflow-hidden">
            <ServiceAccordion
              category="First Appointment"
              Icon={RiHealthBookLine}
            />
            <ServiceAccordion category="Restoration" Icon={FaTooth} />
            <ServiceAccordion category="Cosmetic" Icon={HiSparkles} />
            <ServiceAccordion category="Root Canal Treatment" Icon={FaTooth} />
            <ServiceAccordion
              category="Crowns and Bridges"
              Icon={FaTeethOpen}
            />
            <ServiceAccordion
              category="Oral Surgery or Extractions"
              Icon={GiTooth}
            />
            <ServiceAccordion category="Dentures" Icon={FaTeethOpen} />
            <ServiceAccordion category="Orthodontics (Braces)" Icon={FaTeeth} />
          </div>
        </section>
      </div>
      {data && !data?.contactNo && isAddMobileOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 z-50"
          onMouseDown={(e) => {
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
