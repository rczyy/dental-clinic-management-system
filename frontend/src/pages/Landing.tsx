import CategoryBox from "../components/Services/ServiceBox";
import { RiHealthBookLine } from "react-icons/ri";
import { FaTooth, FaTeethOpen, FaTeeth } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { GiTooth } from "react-icons/gi";
import { useGetUser } from "../hooks/user";
import { Link, Navigate } from "react-router-dom";

type Props = {};

const Landing = (props: Props) => {
  const { data } = useGetUser();

  if (data?.role !== "Patient") return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen flex flex-col gap-2 pt-16 pb-4 bg-base-300">
      <section
        className={`flex flex-col items-center justify-center gap-2 min-h-[85vh] bg-[url(assets/at.png)] bg-center bg-cover relative`}
      >
        <div className="text-center z-10">
          <h1 className="font-light text-white text-3xl">AT Dental Home's</h1>
          <h1 className="font-bold text-primary text-2xl">
            Online Appointment System
          </h1>
        </div>
        <div className="z-10">
          <Link to="/set-appointment" className="btn btn-primary text-base-100">
            Book an appointment
          </Link>
        </div>
        <div className="absolute w-full h-full bg-black bg-opacity-70"></div>
      </section>
      <section className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl">Services</h2>
        <p className="text-center">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
          labore. Repellat, voluptatem?
        </p>
      </section>
      <section className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full xl:px-64 gap-4 mb-12">
        <Link to="/services/first-appointment" role="button">
          <CategoryBox title="First Appointment" Icon={RiHealthBookLine} />
        </Link>
        <Link to="/services/restoration" role="button">
          <CategoryBox title="Restoration" Icon={FaTooth} />
        </Link>
        <Link to="/services/cosmetic" role="button">
          <CategoryBox title="Cosmetic" Icon={HiSparkles} />
        </Link>
        <Link to="/services/root-canal-treatment" role="button">
          <CategoryBox title="Root canal treatment" Icon={FaTooth} />
        </Link>
        <Link to="/services/crowns-bridges" role="button">
          <CategoryBox title="Crowns and Bridges" Icon={FaTeethOpen} />
        </Link>
        <Link to="/services/oral-surgery-extraction" role="button">
          <CategoryBox title="Oral surgery or Extraction" Icon={GiTooth} />
        </Link>
        <Link to="/services/dentures" role="button">
          <CategoryBox title="Dentures" Icon={FaTeethOpen} />
        </Link>
        <Link to="/services/orthodontics" role="button">
          <CategoryBox title="Orthodontics (Braces)" Icon={FaTeeth} />
        </Link>
      </section>
    </div>
  );
};

export default Landing;
