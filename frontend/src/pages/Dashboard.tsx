import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Card from "../components/Dashboard/Card";
import Stat from "../components/Dashboard/Stat";
import { LogModal } from "../components/Modal/LogModal";
import AuditTrailDataRow from "../components/Table/AuditTrailDataRow";
import { useAdminStore } from "../store/admin";
import { useLazyGetLogsQuery } from "../redux/api/logs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

type Props = {};
const Dashboard = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  return (
    <>
      <main
        className={`flex flex-col gap-4 ${
          sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
        } mx-auto`}
      >
        <header className="flex flex-col w-full justify-between mb-4 gap-8">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <div>
            <div className="flex flex-col gap-4 md:flex-row">
              <Stat title="Patients Registered" />
              <Stat title="Staffs Registered" />
              <Stat title="Total Services Offered" />
              <Stat title="Appointments for the Week" />
            </div>
          </div>
        </header>
        <div className="flex flex-col text-md gap-4">
          <RecentActivity />
          <div className="flex flex-col gap-4 md:flex-row">
            <Card title="Available Dentists" />
            <Card title="Appointments Set Today" />
          </div>
        </div>
      </main>
    </>
  );
};

const RecentActivity = () => {
  const dateToday = dayjs().format("YYYY-MM-DD");
  const [getLogs, { data: logData, isFetching }] = useLazyGetLogsQuery();
  const [bodyDisplay, setBodyDisplay] = useState(true);
  useEffect(() => {
    getLogs(dateToday);
  }, [logData]);
  return (
    <>
      <div className="shadow-sm">
        <div className="flex items-center justify-between bg-primary py-2 px-4 text-center rounded-t text-l font-medium">
          Recent Activity
          <div
            className="hover:cursor-pointer"
            onClick={() => setBodyDisplay(!bodyDisplay)}
          >
            {bodyDisplay ? <BiMinus /> : <BiPlus />}
          </div>
        </div>
        {bodyDisplay && (
          <div className="max-h-80 overflow-auto">
            <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
              <thead>
                <tr className="[&>*]:bg-base-300 border-b border-base-200">
                  <th className="hidden" />
                  <th className="text-primary normal-case">Date</th>
                  <th className="text-primary normal-case">Module</th>
                  <th className="text-primary normal-case">User</th>
                  <th className="text-primary normal-case">Type</th>
                  <th className="text-primary normal-case">Action</th>
                </tr>
              </thead>
              <tbody>
                {logData && logData.length > 0 ? (
                  logData.map((log) => (
                    <AuditTrailDataRow logData={log} key={log._id} />
                  ))
                ) : (
                  <tr className="[&>*]:bg-transparent">
                    {isFetching ? (
                      <td colSpan={5} className="py-8">
                        <AiOutlineLoading3Quarters className="animate-spin w-full" />
                      </td>
                    ) : (
                      <td
                        colSpan={5}
                        className="py-8 text-2xl text-center font-bold"
                      >
                        No logs to show
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <LogModal />
    </>
  );
};
export default Dashboard;
