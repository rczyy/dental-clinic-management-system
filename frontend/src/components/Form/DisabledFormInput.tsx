import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconType } from "react-icons/lib";

type Props = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  Logo?: IconType;
  disabled?: boolean;
};

const DisabledFormInput = ({
  type,
  label,
  placeholder,
  value,
  Logo,
  disabled,
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
            <span className="px-1.5 text-sm sm:px-2">+63</span>
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
              "absolute transition-all cursor-text select-none text-sm " +
              (!value
                ? "top-1/2 -translate-y-1/2 text-zinc-400 " +
                  (label !== "contactNo" ? "left-4" : "left-2")
                : "bg-base-300 text-primary text-sm leading-none rounded top-0 -translate-y-1/2 " +
                  (label !== "contactNo" ? "left-3.5" : "-left-6 sm:-left-8"))
            }
          >
            {placeholder}{" "}
          </label>
          <div
            className={
              `${
                disabled ? "bg-base-100" : "bg-base-300"
              } w-full text-sm py-2 outline-none rounded-md ` +
              (label !== "contactNo" ? "pl-4" : "pl-2")
            }
            id={label}
          >
            {value}
          </div>
          {Logo && (
            <Logo
              className={
                `${
                  disabled ? "bg-base-100" : "bg-base-300"
                }  w-10 h-10 p-2.5 rounded-md ` +
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
    </div>
  );
};

export default DisabledFormInput;
