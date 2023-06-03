import dayjs from "dayjs";
import {
  useGetMyAttendance,
  useLogTimeIn,
  useLogTimeOut,
} from "../hooks/attendance";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import AttendanceDataRow from "../components/Table/AttendanceDataRow";
import { toast } from "react-toastify";
import { useAdminStore } from "../store/admin";
import { DesktopDatePicker } from "@mui/x-date-pickers";

type Props = {};
const MyAttendance = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [attendanceSort, setAttendanceSort] = useState<"asc" | "desc">();
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const { mutate: logTimeIn } = useLogTimeIn();
  const { mutate: logTimeOut } = useLogTimeOut();
  const { data } = useGetMyAttendance();

  const filteredAttendance =
    data &&
    data
      .sort((a, b) => {
        const nameA = a.date.toString();
        const nameB = b.date.toString();

        return attendanceSort === "asc"
          ? nameA < nameB
            ? -1
            : 1
          : attendanceSort === "desc"
          ? nameA < nameB
            ? 1
            : -1
          : 0;
      })
      .filter((attendance) => {
        if (dateFilter) {
          return (
            dayjs(attendance.date).format("DD/MM/YYYY") ===
            dayjs(dateFilter).format("DD/MM/YYYY")
          );
        }
        return true;
      });
  const dateToday = dayjs().startOf("D");

  useEffect(() => {
    if (data) {
      setIsTimedIn(
        data.some(
          (attendance) =>
            dayjs(attendance.timeIn).format("DD/MM/YYYY") ===
            dayjs(dateToday).format("DD/MM/YYYY")
        )
      );
      setIsTimedOut(
        data.some(
          (attendance) =>
            dayjs(attendance.timeOut).format("DD/MM/YYYY") ===
            dayjs(dateToday).format("DD/MM/YYYY")
        )
      );
    }
  }, [data]);
  const timeInClick = () => {
    logTimeIn(dayjs().format(), {
      onError: (error) => toast.error(`${error.response.data.message}`),
    });
  };
  const timeOutClick = () => {
    logTimeOut(dayjs().format(), {
      onError: (error) => toast.error(`${error.response.data.message}`),
    });
  };
  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="flex justify-between">
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-2xl md:text-3xl">My Attendance</h1>
          <DesktopDatePicker
            label="Select date"
            className="w-36 sm:w-44"
            defaultValue={dateFilter}
            onChange={(date) => setDateFilter(date)}
            slotProps={{
              actionBar: {
                actions: ["clear"],
              },
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <button
              onClick={timeInClick}
              role="button"
              className="btn btn-primary max-w-[10rem] min-h-[2.5rem] h-10 w-[6rem] px-2 text-white normal-case gap-2"
              disabled={isTimedIn}
            >
              Time In
            </button>
            <button
              onClick={timeOutClick}
              role="button"
              className="btn btn-primary max-w-[10rem] min-h-[2.5rem] h-10 w-[6rem] px-2 text-white normal-case gap-2"
              disabled={isTimedOut || !isTimedIn}
            >
              Time Out
            </button>
          </div>
        </div>
      </header>
      <div className="bg-base-300 py-4 px-4 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              <td
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setAttendanceSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Date</span>
                  {attendanceSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : attendanceSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </td>
              <th className="text-primary normal-case text-center">Time In</th>
              <th className="text-primary normal-case text-center">Time Out</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance && filteredAttendance.length > 0 ? (
              filteredAttendance.map((attendance) => (
                <AttendanceDataRow
                  key={attendance._id}
                  attendance={attendance}
                  showAllDetails={false}
                />
              ))
            ) : (
              <tr className="[&>*]:bg-transparent">
                <td colSpan={5} className="py-8 text-2xl text-center font-bold">
                  No attendance records to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default MyAttendance;
