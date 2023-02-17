import CategoryBox from "../components/ServiceBox";
import { RiHealthBookLine } from "react-icons/ri";
import { FaTooth, FaTeethOpen, FaTeeth } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { GiTooth } from "react-icons/gi";
import { useGetUser } from "../hooks/user";
import { Navigate } from "react-router-dom";

type Props = {};

const Landing = (props: Props) => {
  const { data } = useGetUser();

  if (data && data.role === "Admin") return <Navigate to="/admin" />;

  return (
    <div className="font-work min-h-screen flex flex-col gap-2 pt-16 pb-4 bg-base-300">
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
          <button className="btn btn-primary text-base-100">
            Book an appointment
          </button>
        </div>
        <div className="absolute w-full h-full bg-black bg-opacity-60 backdrop-blur-[2px]"></div>
        <Blob className="text-base-300 fill-current" />
      </section>
      <section className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl">Services</h2>
        <p className="text-center">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
          labore. Repellat, voluptatem?
        </p>
      </section>
      <section className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full xl:px-64 gap-4 mb-12">
        <CategoryBox title="First Appointment" Icon={RiHealthBookLine} />
        <CategoryBox title="Restoration" Icon={FaTooth} />
        <CategoryBox title="Cosmetic" Icon={HiSparkles} />
        <CategoryBox title="Root canal treatment" Icon={FaTooth} />
        <CategoryBox title="Crowns and Bridges" Icon={FaTeethOpen} />
        <CategoryBox title="Oral surgery or Extraction" Icon={GiTooth} />
        <CategoryBox title="Dentures" Icon={FaTeethOpen} />
        <CategoryBox title="Orthodontics (Braces)" Icon={FaTeeth} />
      </section>
    </div>
  );
};

type BlobProps = {
  className: string;
};

const Blob = ({ className }: BlobProps) => {
  return (
    <svg
      id="visual"
      className="absolute bottom-0  z-0"
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <path
        d="M0 546L37.5 541C75 536 150 526 225 521.3C300 516.7 375 517.3 450 523.7C525 530 600 542 675 548.8C750 555.7 825 557.3 862.5 558.2L900 559L900 601L862.5 601C825 601 750 601 675 601C600 601 525 601 450 601C375 601 300 601 225 601C150 601 75 601 37.5 601L0 601Z"
        className={className}
        strokeLinecap="round"
        strokeLinejoin="miter"
      ></path>
    </svg>
  );
};

export default Landing;
