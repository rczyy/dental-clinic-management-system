import { IoMailOpenOutline } from "react-icons/io5";

interface Props {
  setIsVerifyUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VerifyEmail = ({ setIsVerifyUserOpen }: Props): JSX.Element => {
  return (
    <div className="flex flex-col items-center bg-base-300 max-w-lg p-12 mx-auto my-4 gap-4 rounded-lg text-center">
      <IoMailOpenOutline className="w-20 h-20 text-primary" />
      <h2 className="text-2xl md:text-3xl font-semibold">Verify your email</h2>
      <p className="text-sm text-zinc-400">
        You need to verify your email address to start booking to AT Dental
        Home.
      </p>

      <button
        className="btn btn-primary min-h-[2.5rem] h-10 px-16 mt-8 text-white capitalize"
        onClick={() => setIsVerifyUserOpen(false)}
      >
        OK
      </button>
    </div>
  );
};
