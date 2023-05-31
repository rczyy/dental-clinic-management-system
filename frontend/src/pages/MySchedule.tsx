import { useGetDentistSchedule } from "../hooks/dentistSchedule";
import { useGetMe } from "../hooks/user";
import { Navigate } from "react-router-dom";
import { DentistCalendar } from "../components/Dentist Schedule/DentistCalendar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = {};

export const MySchedule = (props: Props) => {
  const { data: me } = useGetMe();
  const { data: dentistSchedule, isLoading } = useGetDentistSchedule(
    me?._id || "",
    !!me
  );

  if (me?.role !== "Dentist") return <Navigate to={"/"} />;

  return (
    <main className="flex flex-col max-w-screen-xl mx-auto">
      <header className="text-2xl md:text-3xl font-bold">
        <h1>My Schedule</h1>
      </header>

      {!isLoading ? (
        dentistSchedule && (
          <DentistCalendar
            dentistSchedule={dentistSchedule}
            editable
            hideName
          />
        )
      ) : (
        <div className="py-20">
          <AiOutlineLoading3Quarters className="w-12 h-12 mx-auto text-primary animate-spin" />
        </div>
      )}
    </main>
  );
};
