import { useLayoutEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import DatePickerHeader from "react-multi-date-picker/plugins/date_picker_header";
import { useGetDentistSchedule } from "../hooks/dentistSchedule";
import { useGetMe } from "../hooks/user";
type Props = {};

export const MySchedule = (props: Props) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [value, setValue] = useState<DateObject | DateObject[] | null>(
    new DateObject()
  );

  const { data: me } = useGetMe();

  const { data: dentistSchedule } = useGetDentistSchedule(me?._id || "", !!me);

  useLayoutEffect(() => {
    function updateWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", updateWidth);

    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  console.log(dentistSchedule);

  return (
    <main className="flex flex-col gap-8 max-w-screen-xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">My Schedule</h1>
      </header>
      <div className="flex justify-center z-0">
        <Calendar
          value={value}
          onChange={setValue}
          weekDays={["S", "M", "T", "W", "T", "F", "S"]}
          numberOfMonths={
            windowWidth < 640
              ? 1
              : windowWidth < 1024
              ? 2
              : windowWidth < 1280
              ? 3
              : 4
          }
          minDate={new Date()}
          plugins={[<DatePickerHeader position="top" size="big" />]}
          multiple
        />
      </div>
    </main>
  );
};
