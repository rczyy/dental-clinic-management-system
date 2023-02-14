import { useState } from "react";
import { Path, UseFormRegister } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconType } from "react-icons/lib";

type Props = {
  label: Path<LoginFormValues | SignupFormValues>;
  register: UseFormRegister<LoginFormValues | SignupFormValues>;
  error: string | undefined;
  type: string;
  inputMode?: "email" | "search" | "text" | "numeric" | "none" | "tel" | "url" | "decimal" | undefined;
  placeholder: string;
  value: string;
  Logo?: IconType;
};

const FormInput = ({
  register,
  type,
  inputMode,
  label,
  placeholder,
  value,
  error,
  Logo,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1 flex-1">
      <div
        className={
          "flex items-center border rounded-md bg-base-300 " +
          (value && "border-primary")
        }
      >
        {label === "contactNo" && (
          <>
            <span className="px-2">+63</span>
            <div
              className={
                "w-[1px] h-[20px] " + (value ? "bg-primary" : "bg-zinc-300")
              }
            ></div>
          </>
        )}
        <div className="flex items-center relative w-full">
          <label
            htmlFor={label}
            className={
              "absolute transition-all cursor-text select-none " +
              (!value
                ? "top-1/2 -translate-y-1/2 text-zinc-400 " +
                  (label !== "contactNo" ? "left-4" : "left-2")
                : "bg-base-300 text-primary text-sm leading-none rounded top-0 -translate-y-1/2 " +
                  (label !== "contactNo" ? "left-3.5" : "-left-8"))
            }
          >
            {placeholder}
          </label>
          <input
            className={
              "bg-base-300 w-full py-3 outline-none rounded-md " +
              (label !== "contactNo" ? "pl-4" : "pl-2")
            }
            autoComplete="off"
            id={label}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            inputMode={inputMode}
            {...register(label)}
          />
          {Logo && (
            <Logo
              className={
                "w-10 h-10 p-2.5 cursor-pointer bg-base-300 z-20 " +
                (value ? "text-primary" : "text-zinc-400")
              }
            />
          )}
        </div>
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
