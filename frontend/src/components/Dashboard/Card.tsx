import dayjs from "dayjs";
import { useGetAttendanceToday } from "../../hooks/attendance";
import { useGetDentistSchedule } from "../../hooks/dentistSchedule";
import { useGetAppointments } from "../../hooks/appointment";

type Props = {
  title: string;
};
const Card = ({ title }: Props) => {
  const dateToday = dayjs("2023-06-05", "YYYY-MM-DD").format("YYYY-MM-DD");
  const { data: appointmentData } = useGetAppointments({
    date: dateToday,
    includePast: false,
  });
  const { data: attendanceToday } = useGetAttendanceToday();
  const { data: dentistSchedules } = useGetDentistSchedule();
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
      {title === "Appointments Today" && (
        <div className="flex flex-col gap-4 p-4">
          {appointmentData && appointmentData.length > 0 ? (
            <>
              <div className="flex text-center font-medium">
                <span className="flex-1">Time</span>
                <span className="flex-1">Service</span>
                <span className="flex-1">Patient</span>
              </div>
              {appointmentData.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex break-words text-center items-center text-xs md:text-sm"
                >
                  <span className="flex-1">
                    {dayjs(appointment.dateTimeScheduled).format("h:mm:ss A")}
                  </span>
                  <span className="flex-1">{appointment.service.name}</span>
                  <span className="flex-1">
                    {appointment.patient.user.name.firstName}{" "}
                    {appointment.patient.user.name.lastName}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <span className="self-center">No Appointments today</span>
          )}
        </div>
      )}
      {title === "Available Dentists" && (
        <div className="flex flex-col gap-2 p-4">
          {availableDentists && availableDentists.length > 0 ? (
            <>
              <div className="flex text-center font-medium">
                <span className="flex-1">Name</span>
                <span className="flex-1">Time In</span>
              </div>
              {availableDentists.map((dentist) => (
                <div
                  key={dentist.dentist._id}
                  className="flex break-words items-center text-xs md:text-sm"
                >
                  <span className="flex-1 w-[50%] px-2">
                    {dentist.dentist.staff.user.name.firstName}
                    {"asdasdasdasdasd "}
                    {dentist.dentist.staff.user.name.lastName}
                  </span>
                  <span className="flex-1 text-center">
                    {dentist.timeIn !== undefined
                      ? dayjs(dentist.timeIn.timeIn).format("h:mm:ss A")
                      : "Not timed in yet"}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <span className="self-center">No dentists available today</span>
          )}
        </div>
      )}
    </div>
  );
};
export default Card;
