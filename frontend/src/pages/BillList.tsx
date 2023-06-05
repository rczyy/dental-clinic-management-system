import dayjs from "dayjs";
import { FiSearch } from "react-icons/fi";
import { useAdminStore } from "../store/admin";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useGetMe } from "../hooks/user";
import { Navigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGetBills, useGetDeletedBills } from "../hooks/bill";
import { BillDataRow } from "../components/Table/BillDataRow";

interface Props {}

export const BillList = (_: Props): JSX.Element => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const [seeDeletedBills, setSeeDeletedBills] = useState(false);

  const [searchDentistFilter, setSearchDentistFilter] = useState<string>("");
  const [searchPatientFilter, setSearchPatientFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);

  const [deletedSearchDentistFilter, setDeletedSearchDentistFilter] =
    useState<string>("");
  const [deletedSearchPatientFilter, setDeletedSearchPatientFilter] =
    useState<string>("");
  const [deletedDateFilter, setDeletedDateFilter] =
    useState<dayjs.Dayjs | null>(null);

  const { data: me } = useGetMe();

  const {
    data: bills,
    isLoading: billsLoading,
    refetch: refetchGetBills,
  } = useGetBills(dateFilter ? dayjs(dateFilter).format("MM/DD/YYYY") : "");

  const {
    data: deletedBills,
    isLoading: deletedBillsLoading,
    refetch: refetchGetDeletedBills,
  } = useGetDeletedBills(
    deletedDateFilter ? dayjs(deletedDateFilter).format("MM/DD/YYYY") : ""
  );

  const filteredBills =
    bills &&
    bills
      .sort((a, b) =>
        dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? -1 : 1
      )
      .filter(
        (bill) =>
          `${bill.appointment.dentist.staff.user.name.firstName} ${bill.appointment.dentist.staff.user.name.lastName}`
            .toLowerCase()
            .includes(searchDentistFilter.toLowerCase()) &&
          `${bill.appointment.patient.user.name.firstName} ${bill.appointment.patient.user.name.lastName}`
            .toLowerCase()
            .includes(searchPatientFilter.toLowerCase())
      );

  const filteredDeletedBills =
    deletedBills &&
    deletedBills
      .sort((a, b) =>
        dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? -1 : 1
      )
      .filter(
        (bill) =>
          `${bill.appointment.dentist.staff.user.name.firstName} ${bill.appointment.dentist.staff.user.name.lastName}`
            .toLowerCase()
            .includes(deletedSearchDentistFilter.toLowerCase()) &&
          `${bill.appointment.patient.user.name.firstName} ${bill.appointment.patient.user.name.lastName}`
            .toLowerCase()
            .includes(deletedSearchPatientFilter.toLowerCase())
      );

  useEffect(() => {
    refetchGetBills();
  }, [dateFilter]);

  useEffect(() => {
    refetchGetDeletedBills();
  }, [deletedDateFilter]);

  if (!me || me.role === "Patient") return <Navigate to={"/"} />;

  return (
    <main
      className={`flex flex-col gap-8 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="flex flex-wrap justify-between items-center mb-4 gap-8">
        <div className="flex gap-8">
          <h1 className="font-bold text-2xl md:text-3xl">Bills</h1>

          {(me.role === "Admin" || me.role === "Manager") && (
            <div className="form-control">
              <label className="label gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={() => setSeeDeletedBills(!seeDeletedBills)}
                  checked={seeDeletedBills}
                />
                <span className="label-text">See deleted bills</span>
              </label>
            </div>
          )}
        </div>
        <div className="text-end">
          <p className="text-zinc-400 text-sm">Total Sales</p>
          <p className="text-3xl font-semibold">
            ₱ {bills?.reduce((prev, curr) => prev + curr.price, 0)}
          </p>
        </div>
      </header>

      {seeDeletedBills && (
        <>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex gap-6">
              <DesktopDatePicker
                label="Select date"
                className="w-36 sm:w-44"
                defaultValue={deletedDateFilter}
                onChange={(date) => setDeletedDateFilter(date)}
                slotProps={{
                  actionBar: {
                    actions: ["clear"],
                  },
                }}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
                <FiSearch className="w-10 h-10 px-2.5" />
                <input
                  type="text"
                  placeholder="Search by dentist's name..."
                  className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
                  onChange={(e) =>
                    setDeletedSearchDentistFilter(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-1 items-center bg-base-300 max-w-sm border rounded-md">
                <FiSearch className="w-10 h-10 px-2.5" />
                <input
                  type="text"
                  placeholder="Search by patient's name..."
                  className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
                  onChange={(e) =>
                    setDeletedSearchPatientFilter(e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="bg-base-300 rounded-box overflow-x-auto">
            <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
              <thead>
                <tr className="[&>*]:bg-base-300 border-b border-base-200">
                  {filteredDeletedBills && filteredDeletedBills.length > 0 && (
                    <th className="min-w-[2.5rem] w-10"></th>
                  )}

                  <th className="text-primary text-center normal-case">
                    Date/Time
                  </th>

                  <th className="text-primary text-center normal-case">
                    Price
                  </th>

                  <th className="text-primary text-center normal-case">
                    Service
                  </th>

                  <th></th>

                  <th className="text-primary text-center normal-case">
                    Dentist
                  </th>

                  <th></th>

                  <th className="text-primary text-center normal-case">
                    Patient
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedBills &&
                  (filteredDeletedBills.length > 0 ? (
                    filteredDeletedBills.map((bill) => (
                      <BillDataRow key={bill._id} bill={bill} />
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      <td
                        colSpan={7}
                        className="py-8 text-2xl text-center font-bold"
                      >
                        No bills to show
                      </td>
                    </tr>
                  ))}

                {deletedBillsLoading && (
                  <tr className="[&>*]:bg-transparent">
                    <td colSpan={8}>
                      <AiOutlineLoading3Quarters className="w-16 h-16 mx-auto py-4 text-primary animate-spin" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

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
      <div className="bg-base-300 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              {filteredBills && filteredBills.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

              <th className="text-primary text-center normal-case">
                Date/Time
              </th>

              <th className="text-primary text-center normal-case">Price</th>

              <th className="text-primary text-center normal-case">Service</th>

              <th></th>

              <th className="text-primary text-center normal-case">Dentist</th>

              <th></th>

              <th className="text-primary text-center normal-case">Patient</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills &&
              (filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <BillDataRow key={bill._id} bill={bill} />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={7}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No bills to show
                  </td>
                </tr>
              ))}

            {billsLoading && (
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
