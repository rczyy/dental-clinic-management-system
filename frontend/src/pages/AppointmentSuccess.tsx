import { AiFillCheckCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

type Props = {};
const AppointmentSuccess = (props: Props) => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col items-center gap-6 p-8 rounded-md">
        <section className="flex flex-col items-center max-w-xs gap-4">
          <AiFillCheckCircle className="text-8xl text-success" />
          <span className="text-2xl text-center font-semibold">
            Appointment Confirmed!
          </span>
          <span className="text-base sm:text-lg text-center">
            Your dental appointment is successfully scheduled.
          </span>
        </section>
        <section>
          <Link to="/" className="btn btn-primary text-base-100">
            Go back
          </Link>
        </section>
      </div>
    </div>
  );
};
export default AppointmentSuccess;
