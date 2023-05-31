import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2, FiCheck } from "react-icons/fi";
import { DateObject, Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import DatePickerHeader from "react-multi-date-picker/plugins/date_picker_header";
import { toast } from "react-toastify";
import { useLayoutEffect, useState } from "react";
import { useEditDentistSchedule } from "../../hooks/dentistSchedule";

type Props = {
  dentistSchedule: DentistScheduleResponse[];
  editable?: boolean;
  hideName?: boolean;
};

export const DentistCalendar = ({
  dentistSchedule,
  editable,
  hideName,
}: Props) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [value, setValue] = useState<DateObject | DateObject[] | null>(
    dentistSchedule.map((schedule) => new DateObject(schedule.date))
  );
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const { mutate: editDentistSchedule, isLoading: isEditDentistSchedule } =
    useEditDentistSchedule();

  useLayoutEffect(() => {
    function updateWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", updateWidth);

    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="flex flex-col gap-8 py-12">
      <header className="flex justify-between items-center">
        {!hideName && (
          <h3 className="text-xl md:text-2xl font-semibold">
            {dentistSchedule[0]?.dentist.staff.user.name.firstName}{" "}
            {dentistSchedule[0]?.dentist.staff.user.name.lastName}
          </h3>
        )}

        {editable &&
          (!isEditEnabled ? (
            <div
              className="ml-auto rounded-full cursor-pointer transition hover:bg-primary/25"
              onClick={() => setIsEditEnabled(true)}
            >
              <FiEdit2 className="w-8 h-8 p-1.5 text-primary" />
            </div>
          ) : (
            <div
              className={`ml-auto rounded-full ${
                isEditDentistSchedule ? "cursor-not-allowed" : "cursor-pointer"
              } transition hover:bg-primary/25`}
              onClick={() => {
                if (Array.isArray(value)) {
                  const valueStringArray = JSON.stringify(
                    value.map((v) => v.format("MM/DD/YYYY"))
                  );

                  const dentistScheduleStringArray = JSON.stringify(
                    dentistSchedule?.map((schedule) =>
                      new DateObject(schedule.date).format("MM/DD/YYYY")
                    )
                  );

                  if (valueStringArray === dentistScheduleStringArray) {
                    setIsEditEnabled(false);
                    return;
                  }

                  editDentistSchedule(
                    value.map((v) => v.format("MM/DD/YYYY")),
                    {
                      onSuccess: () => {
                        toast.success("Schedule saved!");
                        setIsEditEnabled(false);
                      },
                      onError: (err) => {
                        toast.error(
                          err.response.data.message || "Failed to save schedule"
                        );
                        setIsEditEnabled(false);
                      },
                    }
                  );
                }
              }}
            >
              {isEditDentistSchedule ? (
                <AiOutlineLoading3Quarters className="w-8 h-8 p-1.5 text-primary animate-spin" />
              ) : (
                <FiCheck className="w-8 h-8 p-1.5 text-primary" />
              )}
            </div>
          ))}
      </header>

      <div className="flex flex-1 justify-center items-center bg-base-300 w-fit mx-auto rounded-box z-0">
        <Calendar
          value={value}
          onChange={setValue}
          weekDays={["S", "M", "T", "W", "T", "F", "S"]}
          numberOfMonths={
            windowWidth < 640
              ? 1
              : windowWidth < 1280
              ? 2
              : windowWidth < 1536
              ? 3
              : 4
          }
          minDate={new Date()}
          plugins={[
            <DatePickerHeader position="top" size="big" />,
            ...(isEditEnabled
              ? [
                  <DatePanel
                    sort="date"
                    header="Schedules"
                    removeButton={false}
                  />,
                ]
              : []),
          ]}
          multiple
          readOnly={!isEditEnabled}
        />
      </div>
    </div>
  );
};
