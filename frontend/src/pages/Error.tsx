import { Link } from "react-router-dom";

type Props = {};

const Error = (_: Props) => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="border-base-100 flex flex-col items-center gap-6 p-8 m-4 rounded-md">
        <section className="flex flex-col items-center max-w-xs gap-4">
          <span className="text-8xl sm:text-9xl font-extrabold">404</span>
          <span className="text-lg sm:text-xl text-center">
            Oops! The page you're looking for can't be found.
          </span>
          <span className="text-base sm:text-lg text-center">
            Let's get you back on track.
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

export default Error;
