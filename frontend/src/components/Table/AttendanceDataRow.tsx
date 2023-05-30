import dayjs from "dayjs";

type Props = {
  attendance: AttendanceResponse;
};
const AttendanceDataRow = ({ attendance }: Props) => {
  return (
    <tr className="[&>*]:bg-transparent transition tracking-tight">
      <th className="!bg-base-300"></th>
      <td className="font-medium text-sm">{dayjs(attendance.date).format('MMMM D, YYYY')}</td>
      <td className="font-medium text-sm">{attendance.staff.user.name.firstName} {attendance.staff.user.name.lastName}</td>
      <td className="font-medium text-sm">{dayjs(attendance.timeIn).format('h:mm:ss A')}</td>
      <td className="font-medium text-sm">{attendance.timeOut && `${dayjs(attendance.timeOut).format('h:mm:ss A')}`}</td>
    </tr>
  );
};
export default AttendanceDataRow;
