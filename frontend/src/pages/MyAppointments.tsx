import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useLazyGetPatientAppointmentsQuery } from "../redux/api/appointment";
import { useGetMe } from "../hooks/user";

interface Props {}

export const MyAppointments = (_: Props): JSX.Element => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(dayjs());

  const { data: me } = useGetMe();
  const [getAppointments, { data: appointments }] =
    useLazyGetPatientAppointmentsQuery();

  useEffect(() => {
    if (me && dateFilter) {
      getAppointments({ id: me._id, date: dateFilter.format("YYYY-MM-DD") });
    }
  }, [me, dateFilter]);

  return (
    <main className="flex flex-col gap-8 max-w-screen-2xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">My Appointments</h1>
      </header>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
          <FiSearch className="w-10 h-10 px-2.5" />
          <input
            type="text"
            placeholder="Search by dentist's name..."
            className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <DesktopDatePicker
          label="Select date"
          className="w-36 sm:w-44"
          defaultValue={dateFilter}
          onChange={(date) => setDateFilter(date)}
          disablePast
        />
      </div>
      <div className="bg-base-300 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              <th></th>

              <th className="text-primary normal-case cursor-pointer">
                <div className="flex items-center gap-1">
                  <span>Time</span>
                </div>
              </th>

              <th className="text-primary normal-case cursor-pointer">
                <div className="flex items-center gap-1">
                  <span>Dentist</span>
                </div>
              </th>

              <th className="text-primary normal-case">Service</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredServices &&
              filteredServices.map((service) => (
                <ServiceDataRow key={service._id} service={service} />
              ))} */}
          </tbody>
        </table>
      </div>
    </main>
  );
};
