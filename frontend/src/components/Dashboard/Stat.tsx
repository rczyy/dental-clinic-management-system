import { useGetPatients } from "../../hooks/patient";
import { useGetStaffs } from "../../hooks/staff";

type Props = {
  title: string;
};
const Stat = ({ title }: Props) => {
  const { data: patientData } = useGetPatients();
  const { data: staffData } = useGetStaffs();
  return (
    <div className="stat place-items-center md:place-items-end bg-primary rounded">
      <div className="stat-title">{title}</div>
      <div className="stat-value">
        {title === "Staffs Registered"
          ? staffData && `${staffData.length}`
          : patientData && `${patientData.length}`}
      </div>
    </div>
  );
};
export default Stat;
