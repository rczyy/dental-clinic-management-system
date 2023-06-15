import dayjs from "dayjs";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useAdminStore } from "../store/admin";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useGetAppointments } from "../hooks/appointment";
import { AppointmentDataRow } from "../components/Table/AppointmentDataRow";
import { useGetMe } from "../hooks/user";
import { Link, Navigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {}

export const AppointmentList = (_: Props): JSX.Element => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const [searchDentistFilter, setSearchDentistFilter] = useState<string>("");
  const [searchPatientFilter, setSearchPatientFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [billedFilter, setBilledFilter] = useState<boolean>(false);
  const [isPastAppointments, setIsPastAppointments] = useState<boolean>(false);

  const { data: me } = useGetMe();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    refetch: refetchGetAppointments,
  } = useGetAppointments({
    date: dateFilter ? dayjs(dateFilter).format("MM/DD/YYYY") : "",
    includeBilled: billedFilter,
  });

  const filteredAppointments =
    appointments &&
    appointments
      .sort((a, b) =>
        dayjs(a.dateTimeScheduled).isBefore(dayjs(b.dateTimeScheduled)) ? -1 : 1
      )
      .filter((appointment) =>
        `${appointment.dentist.staff.user.name.firstName} ${appointment.dentist.staff.user.name.lastName}`
          .toLowerCase()
          .includes(searchDentistFilter.toLowerCase()) &&
        `${appointment.patient.user.name.firstName} ${appointment.patient.user.name.lastName}`
          .toLowerCase()
          .includes(searchPatientFilter.toLowerCase()) &&
        isPastAppointments
          ? dayjs(appointment.dateTimeScheduled) < dayjs()
          : dayjs(appointment.dateTimeScheduled) >= dayjs()
      );

  useEffect(() => {
    refetchGetAppointments();
  }, [dateFilter, billedFilter]);

  if (!me || me.role === "Patient") return <Navigate to={"/"} />;

  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="flex flex-wrap justify-between items-end mb-4 gap-8">
        <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
        <Link
          to={"/set-appointment/staff"}
          role="button"
          className="btn btn-primary w-full max-w-[12rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add an Appointment
        </Link>
      </header>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-6">
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
          <div className="form-control">
            <label className="label gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm checked:bg-base-300"
                onChange={(e) => setBilledFilter(e.target.checked)}
              />
              <span className="label-text">Include Billed Appointments</span>
            </label>
          </div>
        </div>

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
      <div>
        <div className="tabs">
        <span
          className={`${
            !isPastAppointments ? "font-extrabold" : "tab-active"
          } tab tab-lg tab-lifted text-primary bg-base-300`}
          onClick={() => setIsPastAppointments(false)}
        >
          Appointments
        </span>
        <span
          className={`${
            isPastAppointments ? "font-extrabold" : "tab-active"
          } tab tab-lg tab-lifted text-primary bg-base-300`}
          onClick={() => setIsPastAppointments(true)}
        >
          Past Appointments
        </span>
        </div>
        <div className="bg-base-300 rounded-box rounded-tl-none overflow-x-auto">
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
                  Dentist
                </th>

                <th></th>

                <th className="text-primary text-center normal-case">
                  Patient
                </th>

                <th className="text-primary text-center normal-case">
                  Service
                </th>
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
                      colSpan={7}
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
      </div>
    </main>
  );
};
