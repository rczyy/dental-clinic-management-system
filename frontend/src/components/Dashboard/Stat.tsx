import { useNavigate } from "react-router-dom";
import { useGetAppointments } from "../../hooks/appointment";
import { useGetPatients } from "../../hooks/patient";
import { useGetServices } from "../../hooks/service";
import { useGetStaffs } from "../../hooks/staff";
import dayjs from "dayjs";

type Props = {
  title: string;
};
const Stat = ({ title }: Props) => {
  const navigate = useNavigate();
  const { data: patientData } = useGetPatients();
  const { data: staffData } = useGetStaffs();
  const { data: serviceData } = useGetServices();
  const { data: appointmentData } = useGetAppointments({
    date: "",
    includePast: false,
  });
  const weekFromToday = dayjs().add(7, "day").format();
  const appointmentsWeek =
    appointmentData &&
    appointmentData.filter(
      (appointment) => appointment.dateTimeScheduled <= weekFromToday
    );
  return (
    <div
      className="flex-1 stat place-items-center md:place-items-start bg-primary rounded shadow-md pt-3 pb-0 px-0 hover:cursor-pointer"
      onClick={
        title === "Patients Registered"
          ? () => navigate("/patients")
          : title === "Staffs Registered"
          ? () => navigate("/staff")
          : title === "Total Services Offered"
          ? () => navigate("/services")
          : () => navigate("/appointments")
      }
    >
      <div className="stat-value px-3">
        {title === "Patients Registered"
          ? patientData && `${patientData.length}`
          : title === "Staffs Registered"
          ? staffData && `${staffData.length}`
          : title === "Total Services Offered"
          ? serviceData && `${serviceData.length}`
          : appointmentsWeek && `${appointmentsWeek.length}`}
      </div>
      <div className="stat-title text-sm px-3 pb-2">{title}</div>
      <span className="stat-desc p-1 pl-3 w-full bg-primary-content font-semibold text-primary-focus hover:text-primary">
        More info
      </span>
    </div>
  );
};
export default Stat;
