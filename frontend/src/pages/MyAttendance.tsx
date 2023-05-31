import dayjs from "dayjs";
import {
  useGetMyAttendance,
  useLogTimeIn,
  useLogTimeOut,
} from "../hooks/attendance";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import AttendanceDataRow from "../components/Table/AttendanceDataRow";
import { toast } from "react-toastify";

type Props = {};
const MyAttendance = (props: Props) => {
  const { mutate: logTimeIn } = useLogTimeIn();
  const { mutate: logTimeOut } = useLogTimeOut();
  const { data } = useGetMyAttendance();
  const [attendanceSort, setAttendanceSort] = useState<"asc" | "desc">();
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
      .filter((attendance) => attendance.date);

  const dateToday = new Date().setHours(0, 0, 0, 0);
  const isAlreadyTimedIn =
    filteredAttendance &&
    filteredAttendance.find(
      (attendance) =>
        dayjs(attendance.date).format() === dayjs(dateToday).format() &&
        attendance.timeIn
    );
  const isAlreadyTimedOut =
    filteredAttendance &&
    filteredAttendance.find(
      (attendance) =>
        dayjs(attendance.date).format() === dayjs(dateToday).format() &&
        attendance.timeOut
    );
  const timeInClick = () => {
    logTimeIn(dayjs().format(), {
      onError: (error) => toast.error(`${error.response.data.formErrors}`),
    });
  };
  const timeOutClick = () => {
    logTimeOut(dayjs().format(), {
      onError: (error) => toast.error(`${error.response.data.formErrors}`),
    });
  };
  return (
    <main className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl md:text-3xl">My Attendance</h1>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <button
              onClick={timeInClick}
              role="button"
              className="btn btn-primary max-w-[10rem] min-h-[2.5rem] h-10 w-[6rem] px-2 text-white normal-case gap-2"
              disabled={isAlreadyTimedIn ? true : false}
            >
              Time In
            </button>
            <button
              onClick={timeOutClick}
              role="button"
              className="btn btn-primary max-w-[10rem] min-h-[2.5rem] h-10 w-[6rem] px-2 text-white normal-case gap-2"
              disabled={isAlreadyTimedOut ? true : false}
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
              <th
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
              </th>
              <th className="text-primary normal-case text-center">Time In</th>
              <th className="text-primary normal-case text-center">Time Out</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance &&
              filteredAttendance.map((attendance) => (
                <AttendanceDataRow
                  key={attendance._id}
                  attendance={attendance}
                  showAllDetails={false}
                />
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default MyAttendance;
