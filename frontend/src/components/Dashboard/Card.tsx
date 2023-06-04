import dayjs from "dayjs";
import { useGetAttendanceToday } from "../../hooks/attendance";
import { useGetDentistSchedule } from "../../hooks/dentistSchedule";

type Props = {
  title: string;
};
const Card = ({ title }: Props) => {
  const { data: attendanceToday } = useGetAttendanceToday();
  const { data: dentistSchedules } = useGetDentistSchedule();
  const dateToday = dayjs().format("YYYY-MM-DD");
  const availableDentists =
    dentistSchedules &&
    dentistSchedules
      .filter(
        (schedule) => dayjs(schedule.date).format("YYYY-MM-DD") === dateToday
      )
      .map((schedule) => {
        return {
          dentist: schedule.dentist,
          timeIn:
            attendanceToday &&
            attendanceToday.find(
              (attendance) =>
                schedule.dentist.staff._id === attendance.staff._id
            ),
        };
      });
  return (
    <div className="h-80 md:h-96 bg-base-300">
      <div className="bg-primary py-2 px-4 text-center rounded-t text-xl font-medium">
        {title}
      </div>
      {title === "Available Dentists" && (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex text-center">
            <span className="flex-1">Name</span>
            <span className="flex-1">Time In</span>
          </div>
          {availableDentists &&
            availableDentists.map((dentist) => (
              <div
                key={dentist.dentist._id}
                className="flex break-words items-center"
              >
                <span className="flex-1 w-[50%] font-medium">
                  {dentist.dentist.staff.user.name.firstName}
                  {"asdasdasdasdasd "}
                  {dentist.dentist.staff.user.name.lastName}
                </span>
                <span className="flex-1 text-sm text-center">
                  {dentist.timeIn &&
                    dayjs(dentist.timeIn.timeIn).format("h:mm:ss A")}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default Card;
