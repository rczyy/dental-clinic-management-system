import { useState } from "react";
import { Path, UseFormRegister } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconType } from "react-icons/lib";

type Props = {
  label: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  error: string | undefined;
  type: string;
  placeholder: string;
  value: string;
  Logo?: IconType;
};

const FormInput = ({
  register,
  type,
  label,
  placeholder,
  value,
  error,
  Logo,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={
          "flex items-center border rounded-md relative bg-base-300 " +
          (value && "border-primary")
        }
      >
        {label === "contactNo" ? (
          <>
            <label
              htmlFor={label}
              className={
                "absolute transition-all cursor-text select-none " +
                (!value
                  ? "top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                  : "bg-base-300 text-primary text-sm leading-none rounded top-0 -left-4 px-0.5 -translate-y-1/2")
              } 
            >
              {placeholder}
            </label>
            <div className="flex items-center w-full pl-2">
              <span className="pr-1.5 border-r">+63</span>
              <input
                className="bg-base-300 w-full py-3 pl-1 outline-none rounded-md"
                autoComplete="off"
                id={label}
                type={type}
                {...register(label)}
              />
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className={
                "absolute transition-all cursor-text select-none " +
                (!value
                  ? "top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                  : "bg-base-300 text-primary text-sm leading-none rounded top-0 left-3.5 px-0.5 -translate-y-1/2")
              }
            >
              {placeholder}
            </label>
            <input
              className="bg-base-300 w-full pl-4 py-3 outline-none rounded-md"
              autoComplete="off"
              id={label}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              {...register(label)}
            />
          </>
        )}

        {Logo && (
          <Logo
            className={
              "w-10 h-10 p-2.5 cursor-pointer " +
              (value ? "text-primary" : "text-zinc-400")
            }
          />
        )}
        {type === "password" &&
          (!showPassword ? (
            <FiEye
              className={
                "w-10 h-10 p-2.5 cursor-pointer " +
                (value ? "text-primary" : "text-zinc-400")
              }
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FiEyeOff
              className={
                "w-10 h-10 p-2.5 cursor-pointer " +
                (value ? "text-primary" : "text-zinc-400")
              }
              onClick={() => setShowPassword(false)}
            />
          ))}
      </div>
      <span className="text-xs text-error pl-1">{error}</span>
    </div>
  );
};

export default FormInput;
