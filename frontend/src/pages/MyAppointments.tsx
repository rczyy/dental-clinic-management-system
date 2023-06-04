import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useGetMe } from "../hooks/user";
import { AppointmentDataRow } from "../components/Table/AppointmentDataRow";
import { Link, Navigate } from "react-router-dom";
import { useAdminStore } from "../store/admin";
import {
  useGetDentistAppointments,
  useGetPatientAppointments,
} from "../hooks/appointment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {}

export const MyAppointments = (_: Props): JSX.Element => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);

  const { data: me } = useGetMe();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    refetch,
  } = me
    ? me.role === "Patient"
      ? useGetPatientAppointments({
          patient: me._id,
          date: dateFilter ? dateFilter.format("MM/DD/YYYY") : "",
        })
      : useGetDentistAppointments({
          dentist: me._id,
          date: dateFilter ? dateFilter.format("MM/DD/YYYY") : "",
        })
    : { data: [], isLoading: false, refetch: () => [] };

  const filteredAppointments =
    appointments &&
    appointments
      .sort((a, b) =>
        dayjs(a.dateTimeScheduled).isBefore(dayjs(b.dateTimeScheduled)) ? -1 : 1
      )
      .filter((appointment) =>
        me && me.role === "Patient"
          ? `${appointment.dentist.staff.user.name.firstName} ${appointment.dentist.staff.user.name.lastName}`
              .toLowerCase()
              .includes(searchFilter.toLowerCase())
          : `${appointment.patient.user.name.firstName} ${appointment.patient.user.name.lastName}`
              .toLowerCase()
              .includes(searchFilter.toLowerCase())
      );

  useEffect(() => {
    refetch();
  }, [dateFilter]);

  if (!me || (me.role !== "Dentist" && me.role !== "Patient"))
    return <Navigate to="/" />;

  return (
    <main
      className={`flex flex-col gap-8 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto`}
    >
      <header className="flex flex-wrap justify-between items-end mb-4 gap-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Appointments</h1>
        <Link
          to={
            me
              ? me.role === "Patient"
                ? me.contactNo
                  ? "/set-appointment"
                  : ""
                : "/set-appointment/staff"
              : "/login"
          }
          role="button"
          className="btn btn-primary w-full max-w-[12rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add an Appointment
        </Link>
      </header>
      <div className="flex justify-between items-center gap-2">
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
          disablePast
        />
        <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
          <FiSearch className="w-10 h-10 px-2.5" />
          <input
            type="text"
            placeholder={`${
              me.role === "Patient"
                ? "Search by dentist's name..."
                : "Search by patient's name..."
            }`}
            className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-base-300 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              {filteredAppointments && filteredAppointments.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

              <th className="text-primary text-center normal-case">Date</th>

              <th className="text-primary text-center normal-case">Time</th>

              <th></th>

              <th className="text-primary text-center normal-case">
                {me && me.role === "Patient" ? "Dentist" : "Patient"}
              </th>

              <th className="text-primary text-center normal-case">Service</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments &&
              (filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointmentDataRow
                    key={appointment._id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={4}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No appointments to show
                  </td>
                </tr>
              ))}

            {appointmentsLoading && (
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
