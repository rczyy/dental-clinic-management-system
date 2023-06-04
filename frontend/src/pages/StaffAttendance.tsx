import { useState } from "react";
import { useGetAttendance } from "../hooks/attendance";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import AttendanceDataRow from "../components/Table/AttendanceDataRow";
import { useAdminStore } from "../store/admin";
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";

type Props = {};
const StaffAttendance = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const { data, isLoading: attendanceLoading } = useGetAttendance();
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [attendanceSort, setAttendanceSort] = useState<"asc" | "desc">();
  const [nameSort, setNameSort] = useState<"asc" | "desc">();
  const filteredAttendance =
    data &&
    data
      .sort((a, b) => {
        const attendanceA = a.date.toString();
        const attendanceB = b.date.toString();

        return attendanceSort === "asc"
          ? attendanceA < attendanceB
            ? -1
            : 1
          : attendanceSort === "desc"
          ? attendanceA < attendanceB
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
  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="flex justify-between">
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-2xl md:text-3xl">Staff Attendance</h1>
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
      </header>
      <div className="flex justify-end items-center"></div>
      <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              {filteredAttendance && filteredAttendance.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

              <th></th>
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
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
              (filteredAttendance.length > 0 ? (
                filteredAttendance.map((attendance) => (
                  <AttendanceDataRow
                    key={attendance._id}
                    attendance={attendance}
                    showAllDetails={true}
                  />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={5}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No attendance records to show
                  </td>
                </tr>
              ))}

            {attendanceLoading && (
              <tr className="[&>*]:bg-transparent">
                <td colSpan={8}>
                  <AiOutlineLoading3Quarters className="w-16 h-16 mx-auto py-4 text-primary animate-spin" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default StaffAttendance;
