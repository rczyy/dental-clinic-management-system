import { useEffect, useState } from "react";
import { useLazyGetLogsQuery } from "../redux/api/logs";
import { useAdminStore } from "../store/admin";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AuditTrailDataRow from "../components/Table/AuditTrailDataRow";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SelectDropdown from "../components/Form/SelectDropdown";

type Props = {};

const AuditTrail = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const [getLogs, { data, isFetching, isLoading }] = useLazyGetLogsQuery();
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(dayjs());
  const [logData, setLogData] = useState<LogResponse[]>();
  const [moduleFilter, setModuleFilter] = useState<string>("Module");
  const [typeFilter, setTypeFilter] = useState<string>("Type");

  const module = [
    { value: "USER", label: "USER" },
    { value: "APPOINTMENT", label: "APPOINTMENT" },
    { value: "DENTIST'S SCHEDULE", label: "DENTIST'S SCHEDULE" },
    { value: "ATTENDANCE", label: "ATTENDANCE" },
    { value: "SERVICE", label: "SERVICE" }
  ];

  const type = [
    { value: "CREATE", label: "CREATE" },
    { value: "UPDATE", label: "UPDATE" },
    { value: "DELETE", label: "DELETE" }
  ];

  useEffect(() => {
    setLogData(data);

    if (typeFilter !== "Type" && moduleFilter !== "Module") {
      setLogData(
        data?.filter(
          (log) =>
            log.type.toUpperCase() === typeFilter.toUpperCase() &&
            log.module.toUpperCase() === moduleFilter.toUpperCase()
        )
      );
    } else if (typeFilter !== "Type") {
      setLogData(
        data?.filter(
          (log) => log.type.toUpperCase() === typeFilter.toUpperCase()
        )
      );
    } else if (moduleFilter !== "Module") {
      setLogData(
        data?.filter(
          (log) => log.module.toUpperCase() === moduleFilter.toUpperCase()
        )
      );
    }
  }, [typeFilter, moduleFilter, datePickerValue, data]);

  useEffect(() => {
    datePickerValue
      ? getLogs(datePickerValue.format("YYYY-MM-DD"))
      : getLogs("");
  }, [datePickerValue]);

  return (
    <main
      className={`flex flex-col gap-8 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto transition-[max-width]`}
    >
      <header className="text-2xl md:text-3xl font-bold">
        <h1>Logs</h1>
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-6">
          <DesktopDatePicker
            label="Select date"
            className="w-36 sm:w-44"
            slotProps={{
              actionBar: {
                actions: ["clear"]
              }
            }}
            defaultValue={dayjs()}
            onChange={(date: Dayjs | null) => setDatePickerValue(date)}
          />
        </div>
        <div className="w-48">
          <SelectDropdown
            placeholder={moduleFilter != "" ? moduleFilter : "Module"}
            options={module}
            isClearable={true}
            onChange={(newValue) =>
              setModuleFilter(newValue ? newValue.value : "")
            }
          />
        </div>
        <div className="w-48">
          <SelectDropdown
            placeholder={typeFilter != "" ? typeFilter : "Type"}
            options={type}
            isClearable={true}
            onChange={(newValue) =>
              setTypeFilter(newValue ? newValue.value : "")
            }
          />
        </div>
      </div>
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
    </main>
  );
};

export default AuditTrail;
