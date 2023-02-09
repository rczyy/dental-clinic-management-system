import { FiAtSign } from "react-icons/fi";

type Props = {};

const FormInput = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center border bg-zinc-50 rounded-md relative">
        <label
          htmlFor="email"
          // className="absolute px-4 text-zinc-400"
          className="bg-white text-black text-sm leading-none rounded absolute top-0 left-3.5 px-0.5 -translate-y-1/2"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          className="bg-zinc-50 w-full pl-4 py-2 outline-none rounded-md"
        />
        <FiAtSign className="w-10 h-10 p-2.5 text-zinc-400" />
      </div>
      <span className="text-xs text-red-600 pl-2">Error message</span>
    </div>
  );
};

export default FormInput;
