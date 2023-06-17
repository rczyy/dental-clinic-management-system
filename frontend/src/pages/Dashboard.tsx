import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Card from "../components/Dashboard/Card";
import Stat from "../components/Dashboard/Stat";
import { LogModal } from "../components/Modal/LogModal";
import AuditTrailDataRow from "../components/Table/AuditTrailDataRow";
import { useAdminStore } from "../store/admin";
import { useLazyGetLogsQuery } from "../redux/api/logs";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useGetMe } from "../hooks/user";
import Analytics from "../components/Dashboard/Analytics";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { FiPhone, FiX } from "react-icons/fi";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SelectDropdown from "../components/Form/SelectDropdown";
import { useGetPatients } from "../hooks/patient";
import FormInput from "../components/Form/FormInput";
import { useGetBills } from "../hooks/bill";
import { useGetDentists } from "../hooks/dentist";
import { toast } from "react-toastify";

type Props = {};
type GenerateProps = {
  setIsGenerateModalVisible: Dispatch<SetStateAction<boolean>>;
};
const Dashboard = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const [bodyDisplay, setBodyDisplay] = useState(true);
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const { data: me } = useGetMe();
  return (
    <>
      <main
        className={`flex flex-col gap-4 ${
          sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
        } mx-auto`}
      >
        <header className="flex flex-col w-full justify-between mb-4 gap-8">
          <div className="flex justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <div
              className="flex gap-2 items-center pr-2 text-primary hover:text-primary-focus hover:cursor-pointer"
              onClick={() => setIsGenerateModalVisible(true)}
            >
              {me && (me.role === "Admin" || me.role === "Manager") && (
                <>
                  <span className="hidden md:block text-sm md:text-md font-medium">
                    Generate Reports
                  </span>
                  <RiFileExcel2Line className="text-lg" />
                </>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4 md:flex-row">
              <Stat title="Patients Registered" />
              {me && (me.role === "Admin" || me.role === "Manager") && (
                <Stat title="Staffs Registered" />
              )}
              <Stat title="Total Services Offered" />
              <Stat title="Appointments for the Week" />
            </div>
          </div>
        </header>
        <div className="flex flex-col text-md gap-4">
          {me && (me.role === "Admin" || me.role === "Manager") && (
            <RecentActivity />
          )}
          <div className="flex flex-col gap-4 md:flex-row">
            <Card title="Available Dentists" />
            <Card title="Appointments Set Today" />
          </div>
        </div>
        <div className="bg-base-300 overflow-auto">
          <div>
            <div className="text-zinc-100 flex bg-primary items-center justify-between py-2 px-4 text-center rounded-t text-l font-medium">
              <span>Availed Services</span>
              <div
                className="hover:cursor-pointer"
                onClick={() => setBodyDisplay(!bodyDisplay)}
              >
                {bodyDisplay ? <BiMinus /> : <BiPlus />}
              </div>
            </div>
            {bodyDisplay && <Analytics />}
          </div>
        </div>
      </main>
      {me &&
        (me.role === "Admin" || me.role === "Manager") &&
        isGenerateModalVisible && (
          <GenerateModal
            setIsGenerateModalVisible={setIsGenerateModalVisible}
          />
        )}
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
        <div className="text-zinc-100 flex items-center justify-between bg-primary py-2 px-4 text-center rounded-t text-l font-medium">
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
                  logData.map((log: LogResponse) => (
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

const GenerateModal = ({ setIsGenerateModalVisible }: GenerateProps) => {
  const schema = z
    .object({
      dentist: z.string().min(1, "Dentist cannot be empty").or(z.literal("")),
      patient: z.string().min(1, "Patient cannot be empty").or(z.literal("")),
      dateStart: z
        .string({ required_error: "Start Date is required" })
        .min(1, "Start Date cannot be empty")
        .regex(
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
          "Invalid Date"
        ),
      dateEnd: z
        .string({ required_error: "End Date is required" })
        .min(1, "End Date cannot be empty")
        .regex(
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
          "Invalid Date"
        ),
    })
    .superRefine((values, ctx) => {
      if (!values.dentist && !values.patient) {
        ctx.addIssue({
          message: "Either Dentist or Patient Name is required.",
          code: z.ZodIssueCode.custom,
          path: ["dentist"],
        });
        ctx.addIssue({
          message: "Either Dentist or Patient Name is required.",
          code: z.ZodIssueCode.custom,
          path: ["patient"],
        });
      }
    });
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
    defaultValues: {
      dentist: "",
      patient: "",
      dateStart: dayjs().subtract(7, "day").format("MM/DD/YYYY"),
      dateEnd: dayjs().format("MM/DD/YYYY"),
    },
    resolver: zodResolver(schema),
  });
  const { data: billData } = useGetBills();
  const { data: dentistData, isLoading: isDentistLoading } = useGetDentists();
  const { data: patientData, isLoading: isPatientLoading } = useGetPatients();
  const [dentistOptions, setDentistOptions] = useState<SelectOption[]>([
    { value: "All", label: "All" },
  ]);
  const [patientOptions, setPatientOptions] = useState<SelectOption[]>([
    { value: "All", label: "All" },
  ]);
  useEffect(() => {
    if (dentistData) {
      setDentistOptions((prev) => [
        ...prev,
        ...dentistData.map((dentist) => {
          return {
            value: dentist._id,
            label:
              dentist.staff.user.name.firstName +
              " " +
              dentist.staff.user.name.lastName,
          };
        }),
      ]);
    }
    if (patientData) {
      setPatientOptions((prev) => [
        ...prev,
        ...patientData.map((patient) => {
          return {
            value: patient._id,
            label:
              patient.user.name.firstName + " " + patient.user.name.lastName,
          };
        }),
      ]);
    }
  }, [dentistData, patientData]);
  const generateReports: SubmitHandler<ReportFormValues> = (formData) => {
    const filteredBills =
      billData &&
      billData
        .filter(
          (bill) =>
            (formData.dentist !== "All" && formData.patient !== "All"
              ? bill.appointment.dentist._id === formData.dentist &&
                bill.appointment.patient._id === formData.patient
              : formData.dentist !== "All"
              ? bill.appointment.dentist._id === formData.dentist
              : formData.patient !== "All"
              ? bill.appointment.patient._id === formData.patient
              : formData.dentist && formData.patient) &&
            dayjs(formData.dateStart).startOf("D") <=
              dayjs(bill.appointment.dateTimeScheduled) &&
            dayjs(formData.dateEnd).startOf("D") >=
              dayjs(bill.appointment.dateTimeScheduled)
        )
        .sort(
          (a, b) =>
            +dayjs(a.appointment.dateTimeScheduled) -
            +dayjs(b.appointment.dateTimeScheduled)
        );
    console.log(filteredBills);
    if (filteredBills && filteredBills.length > 0) {
      const rows = filteredBills.map((row) => {
        return {
          dentistName:
            row.appointment.dentist.staff.user.name.firstName +
            (row.appointment.dentist.staff.user.name.middleName === undefined
              ? ""
              : " " + row.appointment.dentist.staff.user.name.middleName) +
            " " +
            row.appointment.dentist.staff.user.name.lastName,
          patientName:
            row.appointment.patient.user.name.firstName +
            (row.appointment.patient.user.name.middleName === undefined
              ? ""
              : " " + row.appointment.patient.user.name.middleName) +
            " " +
            row.appointment.patient.user.name.lastName,
          service: row.appointment.service.name,
          serviceCategory: row.appointment.service.category,
          dateTimeScheduled: dayjs(row.appointment.dateTimeScheduled).format(
            "MM-DD-YYYY"
          ),
          dateTimeFinished: dayjs(row.appointment.dateTimeFinished).format(
            "MM-DD-YYYY"
          ),
          price: row.price,
          billingDate: dayjs(row.createdAt).format("MM-DD-YYYY"),
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            "Dentist",
            "Patient",
            "Service",
            "Service Category",
            "Date Scheduled",
            "Date Finished",
            "Price",
            "Billing Date",
          ],
        ],
        {
          origin: "A1",
        }
      );

      const max_width = rows.reduce(
        (w, r) => Math.max(w, r.dentistName.length),
        10
      );
      worksheet["!cols"] = [{ wch: max_width }];

      XLSX.writeFile(
        workbook,
        `Reports - ${formData.dateStart} - ${formData.dateEnd}).xlsx`,
        { compression: true }
      );
      reset();
      setIsGenerateModalVisible(false);
    } else {
      toast.error("No reports for the data provided");
    }
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsGenerateModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Generate Reports</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsGenerateModalVisible(false)}
            />
          </div>
        </header>
        <form
          className="flex flex-col px-2 md:py-8 gap-3"
          onSubmit={handleSubmit(generateReports)}
        >
          <div className="flex flex-col md:flex-row mx-2 gap-2">
            <div className="flex-1">
              <Controller
                name="dentist"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <SelectDropdown
                    {...field}
                    value={value}
                    placeholder="Dentist"
                    onChange={(newValue) => onChange(newValue?.value)}
                    options={dentistOptions || []}
                    isLoading={isDentistLoading}
                  />
                )}
              />
              <span className="text-xs text-error">
                {errors.dentist?.message}
              </span>
            </div>
            <div className="flex-1">
              <Controller
                name="patient"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <SelectDropdown
                    {...field}
                    value={value}
                    placeholder="Patient"
                    onChange={(newValue) => onChange(newValue?.value)}
                    options={patientOptions || []}
                    isLoading={isPatientLoading}
                  />
                )}
              />
              <span className="text-xs text-error">
                {errors.patient?.message}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mx-2 gap-2">
            <div className="flex-1">
              <FormInput
                type="text"
                label="dateStart"
                placeholder="Start Date"
                register={register}
                value={watch("dateStart")}
                error={errors.dateStart?.message}
                Logo={FiPhone}
              />
            </div>
            <div className="flex-1">
              <FormInput
                type="text"
                label="dateEnd"
                placeholder="End Date"
                register={register}
                value={watch("dateEnd")}
                error={errors.dateEnd?.message}
                Logo={FiPhone}
              />
            </div>
          </div>
          <button className="m-auto btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 w-full md:w-48 mt-4">
            Generate
          </button>
          {/* <p className="px-2 text-xs text-error text-center">
              {!filteredBills && editUserError.response.data.message}
            </p> */}
        </form>
      </section>
    </td>
  );
};
export default Dashboard;
