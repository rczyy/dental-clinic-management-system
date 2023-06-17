import dayjs from "dayjs";
import { useGetAttendanceToday } from "../../hooks/attendance";
import { useGetDentistSchedule } from "../../hooks/dentistSchedule";
import { useGetAppointments } from "../../hooks/appointment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useState } from "react";
type Props = {
  title: string;
};
const Card = ({ title }: Props) => {
  const dateToday = dayjs().format("YYYY-MM-DD");
  const { data: appointmentData, isFetching: appointmentIsFetching } =
    useGetAppointments({
      date: "",
      includeBilled: false,
    });
  const appointmentsToday =
    appointmentData &&
    appointmentData.filter((appointment) => {
      dayjs(appointment.dateTimeScheduled).format("YYYY-MM-DD") === dateToday &&
        appointment.isFinished === false;
    });
  const { data: attendanceToday, isFetching: attendanceTodayIsFetching } =
    useGetAttendanceToday();
  const { data: dentistSchedules, isFetching: dentistScheduleIsFetching } =
    useGetDentistSchedule();
  const availableDentists =
    dentistSchedules &&
    dentistSchedules
      .filter(
        (schedule) => dayjs(schedule.date).format("YYYY-MM-DD") === dateToday
      )
      .map((schedule) => {
        return {
          dentist: schedule.dentist,
          timeLog:
            attendanceToday &&
            attendanceToday.find(
              (attendance) =>
                schedule.dentist.staff._id === attendance.staff._id
            ),
        };
      });
  const [bodyDisplay, setBodyDisplay] = useState(true);
  return (
    <div
      className={
        "max-h-48 overflow-y-auto shadow-sm " && title === "Available Dentists"
          ? "md:flex-1"
          : "md:flex-[2.04]"
      }
    >
      <div className="text-zinc-100 flex bg-primary items-center justify-between py-2 px-4 text-center rounded-t text-l font-medium">
        <span>{title}</span>
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
            {title === "Available Dentists" && (
              <>
                <thead>
                  <tr className="[&>*]:bg-base-300 border-b border-base-200">
                    <th className="hidden" />
                    <th className="text-primary normal-case">Dentist</th>
                    <th className="text-primary normal-case">Time In</th>
                  </tr>
                </thead>
                <tbody>
                  {availableDentists && availableDentists.length > 0 ? (
                    availableDentists.map((dentist) => (
                      <tr
                        key={dentist.dentist._id}
                        className="[&>*]:bg-base-300 [&>*]:py-2 [&>*]:px-4 tracking-tight border-b border-base-200 text-xs md:text-sm"
                      >
                        <td>
                          {dentist.dentist.staff.user.name.firstName}{" "}
                          {dentist.dentist.staff.user.name.lastName}
                        </td>
                        <td>
                          {dentist.timeLog
                            ? `${dayjs(dentist.timeLog.timeIn).format(
                                "h:mm:ss A"
                              )}`
                            : "Not timed in yet"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      {attendanceTodayIsFetching &&
                      dentistScheduleIsFetching ? (
                        <td colSpan={5} className="py-8">
                          <AiOutlineLoading3Quarters className="animate-spin w-full" />
                        </td>
                      ) : (
                        <td
                          colSpan={5}
                          className="py-8 text-2xl text-center font-bold"
                        >
                          No dentists available today
                        </td>
                      )}
                    </tr>
                  )}
                </tbody>
              </>
            )}
            {title === "Appointments Set Today" && (
              <>
                <thead>
                  <tr className="[&>*]:bg-base-300 border-b border-base-200">
                    <th className="hidden" />
                    <th className="text-primary normal-case">Time Scheduled</th>
                    <th className="text-primary normal-case">Service</th>
                    <th className="text-primary normal-case">Patient</th>
                    <th className="text-primary normal-case">Dentist</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsToday && appointmentsToday.length > 0 ? (
                    appointmentsToday.map((appointment) => (
                      <tr
                        key={appointment._id}
                        className="[&>*]:bg-base-300 [&>*]:py-2 [&>*]:px-4 tracking-tight border-b border-base-200 text-xs md:text-sm"
                      >
                        <td>
                          {appointment.dateTimeScheduled &&
                            `${dayjs(appointment.dateTimeScheduled).format(
                              "h:mm:ss A"
                            )}`}
                        </td>
                        <td>{appointment.service.name}</td>
                        <td>
                          {appointment.patient.user.name.firstName}{" "}
                          {appointment.patient.user.name.lastName}
                        </td>
                        <td>
                          {appointment.dentist.staff.user.name.firstName}{" "}
                          {appointment.dentist.staff.user.name.lastName}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      {appointmentIsFetching ? (
                        <td colSpan={5} className="py-8">
                          <AiOutlineLoading3Quarters className="animate-spin w-full" />
                        </td>
                      ) : (
                        <td
                          colSpan={5}
                          className="py-8 text-2xl text-center font-bold"
                        >
                          No appointments set today
                        </td>
                      )}
                    </tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      )}
    </div>
  );
};
export default Card;
