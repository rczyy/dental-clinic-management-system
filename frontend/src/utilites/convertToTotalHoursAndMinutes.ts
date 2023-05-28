import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const convertToTotalHoursAndMinutes = (minutes: number) => {
  const totalHours = dayjs.duration(minutes, "minute").hours();
  const totalMinutes = totalHours
    ? dayjs.duration(minutes - totalHours * 60, "minute").minutes()
    : minutes;

  return totalHours && totalMinutes
    ? `${totalHours} ${totalHours > 1 ? "hrs" : "hr"} ${totalMinutes} ${
        totalMinutes > 1 ? "mins" : "min"
      }`
    : totalHours
    ? `${totalHours} ${totalHours > 1 ? "hrs" : "hr"}`
    : `${totalMinutes} ${totalMinutes > 1 ? "mins" : "min"}`;
};
