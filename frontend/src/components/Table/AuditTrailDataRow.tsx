import dayjs from "dayjs";
import {
  AiOutlineMedicineBox,
  AiTwotoneCalendar,
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillInfoCircle
} from "react-icons/ai";
import { BiCalendarCheck, BiUserCheck } from "react-icons/bi";
import { CgUserList } from "react-icons/cg";
import { useLogStore } from "../../store/logModal";

type Props = {
  logData: LogResponse;
};

const AuditTrailDataRow = ({ logData }: Props) => {
  const showModal = useLogStore((state) => state.showLogModal);

  return (
    <tr
      className="[&>*]:bg-base-300 [&>*]:hover:bg-base-100 hover:bg-base-100 [&>*]:py-2 [&>*]:px-4 tracking-tight border-b border-base-200 text-xs md:text-sm cursor-pointer"
      onClick={() => {
        showModal(logData);
      }}
    >
      <td className="hidden" />
      <td>
        <span className="font-semibold">
          {dayjs(logData.date).format("DD MMM")}{" "}
        </span>
        <span className="text-slate-400">
          {dayjs(logData.date).format("hh:mm a")}
        </span>
      </td>
      <td className="flex items-center gap-2 font-semibold border-none">
        {logData.module.toUpperCase() === "USER" ? (
          <CgUserList />
        ) : logData.module.toUpperCase() === "APPOINTMENT" ? (
          <AiTwotoneCalendar />
        ) : logData.module.toUpperCase() === "DENTIST'S SCHEDULE" ? (
          <BiCalendarCheck />
        ) : logData.module.toUpperCase() === "ATTENDANCE" ? (
          <BiUserCheck />
        ) : (
          logData.module.toUpperCase() === "SERVICE" && <AiOutlineMedicineBox />
        )}
        <span>{logData.module}</span>
      </td>
      <td className="text-slate-400 italic">{logData.user.email}</td>
      <td
        className={`flex items-center gap-2 border-none ${
          logData.type.toUpperCase() === "UPDATE" ||
          logData.type.toUpperCase() === "RECOVER" ||
          logData.type.toUpperCase() === "VERIFY"
            ? "text-yellow-500"
            : logData.type.toUpperCase() === "CREATE"
            ? "text-green-500"
            : logData.type.toUpperCase() === "DELETE" && "text-red-500"
        }`}
      >
        {logData.type.toUpperCase() === "UPDATE" ||
        logData.type.toUpperCase() === "RECOVER" ||
        logData.type.toUpperCase() === "VERIFY" ? (
          <>
            <AiFillInfoCircle className="text-xl self-center" />
            <span>Update</span>
          </>
        ) : logData.type.toUpperCase() === "CREATE" ? (
          <>
            <AiFillCheckCircle className="text-xl self-center" />
            <span>Create</span>
          </>
        ) : (
          logData.type.toUpperCase() === "DELETE" && (
            <>
              <AiFillCloseCircle className="text-xl self-center" />
              <span>Delete</span>
            </>
          )
        )}
      </td>
      <td className="max-w-3xl text-xs truncate">{logData.action}</td>
    </tr>
  );
};

export default AuditTrailDataRow;
