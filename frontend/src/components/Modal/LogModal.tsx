import dayjs from "dayjs";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillInfoCircle,
  AiOutlineMedicineBox,
  AiTwotoneCalendar
} from "react-icons/ai";
import { BiCalendarCheck, BiReceipt, BiUserCheck } from "react-icons/bi";
import { CgUserList } from "react-icons/cg";
import { useLogStore } from "../../store/logModal";

export const LogModal = () => {
  const logData = useLogStore((state) => state.logData);
  const modalState = useLogStore((state) => state.logModal);
  const closeModal = useLogStore((state) => state.closeLogModal);

  const green = ["CREATE", "UNBAN"];
  const yellow = ["UPDATE", "RECOVER", "VERIFY"];
  const red = ["DELETE", "BAN"];

  document.onkeydown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  return (
    <div
      className={`${
        modalState ? "flex" : "hidden"
      } flex-col items-center justify-center w-full h-full bg-black/30 fixed z-50 inset-0`}
      onClick={closeModal}
    >
      <div
        className="flex flex-col gap-2 bg-base-100 rounded-md p-4 m-2 max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-semibold text-xl">Log data</h1>
            <span className="text-sm tracking-tight text-slate-400">
              {dayjs(logData.date).format("MMM DD YYYY h:mm A")}
            </span>
          </div>
          <AiFillCloseCircle
            className="cursor-pointer self-start text-2xl text-primary"
            onClick={closeModal}
          />
        </div>
        <table className="text-left text-sm">
          <tbody className="[&>*]:border-b [&>*]:border-base-200 [&>*>*]:pr-2 [&>*>*]:py-2">
            <tr>
              <th>Module</th>

              <td className="flex items-center gap-1 border-none">
                {logData.module.toUpperCase() === "USER" ? (
                  <CgUserList />
                ) : logData.module.toUpperCase() === "APPOINTMENT" ? (
                  <AiTwotoneCalendar />
                ) : logData.module.toUpperCase() === "DENTIST'S SCHEDULE" ? (
                  <BiCalendarCheck />
                ) : logData.module.toUpperCase() === "ATTENDANCE" ? (
                  <BiUserCheck />
                ) : logData.module.toUpperCase() === "SERVICE" ? (
                  <AiOutlineMedicineBox />
                ) : (
                  logData.module.toUpperCase() === "BILLING" && <BiReceipt />
                )}
                {logData.module}
              </td>
            </tr>
            <tr>
              <th>User</th>
              <td className="flex flex-col">
                <span className="text-slate-400 italic">
                  {logData.user.email}
                </span>
                <span>
                  {logData.user.name.firstName} {logData.user.name.middleName}
                  {logData.user.name.lastName}
                </span>
              </td>
            </tr>
            <tr>
              <th>Type</th>
              <td
                className={`flex items-center gap-1 border-none ${
                  yellow.includes(logData.type.toUpperCase())
                    ? "text-yellow-500"
                    : green.includes(logData.type.toUpperCase())
                    ? "text-green-500"
                    : red.includes(logData.type.toUpperCase()) && "text-red-500"
                }`}
              >
                {yellow.includes(logData.type.toUpperCase()) ? (
                  <AiFillInfoCircle className="self-center" />
                ) : green.includes(logData.type.toUpperCase()) ? (
                  <AiFillCheckCircle className="self-center" />
                ) : (
                  red.includes(logData.type.toUpperCase()) && (
                    <AiFillCloseCircle className="self-center" />
                  )
                )}
                {logData.type}
              </td>
            </tr>
            <tr>
              <th>Action</th>
              <td>{logData.action}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
