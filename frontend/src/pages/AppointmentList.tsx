import dayjs from "dayjs";
import { FiSearch } from "react-icons/fi";
import { useAdminStore } from "../store/admin";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useGetAppointments } from "../hooks/appointment";
import { AppointmentDataRow } from "../components/Table/AppointmentDataRow";
import { useGetMe } from "../hooks/user";
import { Navigate } from "react-router-dom";

interface Props {}

export const AppointmentList = (_: Props): JSX.Element => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const [searchDentistFilter, setSearchDentistFilter] = useState<string>("");
  const [searchPatientFilter, setSearchPatientFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);

  const { data: me } = useGetMe();
  const { data: appointments, refetch: refetchGetAppointments } =
    useGetAppointments(
      dateFilter ? dayjs(dateFilter).format("MM/DD/YYYY") : ""
    );

  const filteredAppointments =
    appointments &&
    appointments
      .sort((a, b) =>
        dayjs(a.dateTimeScheduled).isBefore(dayjs(b.dateTimeScheduled)) ? -1 : 1
      )
      .filter(
        (appointment) =>
          `${appointment.dentist.staff.user.name.firstName} ${appointment.dentist.staff.user.name.lastName}`
            .toLowerCase()
            .includes(searchDentistFilter.toLowerCase()) &&
          `${appointment.patient.user.name.firstName} ${appointment.patient.user.name.lastName}`
            .toLowerCase()
            .includes(searchPatientFilter.toLowerCase())
      );

  useEffect(() => {
    refetchGetAppointments();
  }, [dateFilter]);

  if (!me || me.role === "Patient") return <Navigate to={"/"} />;

  return (
    <main
      className={`flex flex-col gap-8 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
      </header>
      <div className="flex flex-wrap justify-between items-center gap-2">
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

        <div className="flex gap-2">
          <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
            <FiSearch className="w-10 h-10 px-2.5" />
            <input
              type="text"
              placeholder="Search by dentist's name..."
              className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
              onChange={(e) => setSearchDentistFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
            <FiSearch className="w-10 h-10 px-2.5" />
            <input
              type="text"
              placeholder="Search by patient's name..."
              className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
              onChange={(e) => setSearchPatientFilter(e.target.value)}
            />
          </div>
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

              <th className="text-primary text-center normal-case">Dentist</th>

              <th className="text-primary text-center normal-case">Patient</th>

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
                    showAllDetails
                  />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={5}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No appointments to show
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
