import { useState } from "react";
import { useGetAttendance } from "../hooks/attendance";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import AttendanceDataRow from "../components/Table/AttendanceDataRow";

type Props = {};
const StaffAttendance = (props: Props) => {
  const { data } = useGetAttendance();
  const [attendanceSort, setAttendanceSort] = useState<"asc" | "desc">();
  const [nameSort, setNameSort] = useState<"asc" | "desc">();
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
  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl md:text-3xl">Staff Attendance</h1>
      </header>
      <div className="flex justify-end items-center"></div>
      <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
                <td></td>
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setAttendanceSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  {attendanceSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : attendanceSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
              <th className="text-primary normal-case">Time In</th>
              <th className="text-primary normal-case">Time Out</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance &&
              filteredAttendance.map((attendance) => (
                <AttendanceDataRow
                  key={attendance._id}
                  attendance={attendance}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StaffAttendance;
