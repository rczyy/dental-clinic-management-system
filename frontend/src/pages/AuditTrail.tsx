import AuditTrailDataRow from "../components/Table/AuditTrailDataRow";
import { useGetLogs } from "../hooks/logs";
import { useAdminStore } from "../store/admin";

type Props = {};

const AuditTrail = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const { data: logData } = useGetLogs();

  return (
    <main
      className={`flex flex-col gap-8 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="text-2xl md:text-3xl font-bold">
        <h1>Logs</h1>
      </header>
      <div className="overflow-x-auto my-4">
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
              logData.map((log) => <AuditTrailDataRow logData={log} key={log._id} />)
            ) : (
              <tr className="[&>*]:bg-transparent">
                <td colSpan={5} className="py-8 text-2xl text-center font-bold">
                  No logs to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AuditTrail;
