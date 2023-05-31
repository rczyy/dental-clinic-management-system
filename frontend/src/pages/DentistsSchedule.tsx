import { useState, useEffect } from "react";
import { useGetDentistSchedule } from "../hooks/dentistSchedule";
import { useGetMe } from "../hooks/user";
import { Navigate } from "react-router-dom";
import { DentistCalendar } from "../components/Dentist Schedule/DentistCalendar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = {};

export const DentistsSchedule = (props: Props) => {
  const [dentistSchedules, setDentistSchedules] = useState<
    DentistScheduleResponse[][]
  >([]);

  const { data: me } = useGetMe();
  const { data: dentistSchedule, isLoading } = useGetDentistSchedule();

  useEffect(() => {
    if (dentistSchedule) {
      setDentistSchedules(
        Object.values(
          dentistSchedule.reduce((acc, v) => {
            acc[v.dentist.staff.user._id] = acc[v.dentist.staff.user._id] || [];

            acc[v.dentist.staff.user._id]?.push(v);

            return acc;
          }, {} as { [key: string]: DentistScheduleResponse[] })
        )
      );
    }
  }, [dentistSchedule]);

  if (me?.role === "Patient") return <Navigate to={"/"} />;

  return (
    <main className="flex flex-col gap-8 max-w-screen-xl mx-auto">
      <header className="text-2xl md:text-3xl font-bold">
        <h1>Dentists' Schedule</h1>
      </header>

      {!isLoading ? (
        <div className="flex flex-col bg-base-300 px-8 rounded-box divide-y">
          {dentistSchedules.map((dentistSchedule) => (
            <DentistCalendar
              key={dentistSchedule[0]?._id}
              dentistSchedule={dentistSchedule}
            />
          ))}
        </div>
      ) : (
        <div className="py-20">
          <AiOutlineLoading3Quarters className="w-12 h-12 mx-auto text-primary animate-spin" />
        </div>
      )}
    </main>
  );
};
