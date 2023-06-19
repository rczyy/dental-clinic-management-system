import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetBills } from "../../hooks/bill";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {};

type GraphData = {
  labels: string[];
  datasets: DataSet[];
};

type DataSet = {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
};

const Analytics = (props: Props) => {
  const { data: billsData } = useGetBills();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [dateError, setDateError] = useState("");
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [graphData, setGraphData] = useState<GraphData>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const faCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "First Appointment" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const restoCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Restoration" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const cosmeticCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Cosmetic" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const rctCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Root Canal Treatment" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const cabCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Crowns and Bridges" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const oseCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Oral Surgery or Extractions" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const denturesCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Dentures" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    const orthodonticsCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Orthodontics (Braces)" &&
            dayjs(bill.createdAt).isSameOrAfter(
              dayjs(startDateString || dayjs("1970-00-00").format())
            ) &&
            dayjs(bill.createdAt).isSameOrBefore(dayjs(endDateString || dayjs().format()))
        ).length
      : 0;

    setGraphData({
      labels: [
        "First Appointment",
        "Restoration",
        "Cosmetic",
        "Root Canal Treatment",
        "Crowns and Bridges",
        "Oral Surgery or Extractions",
        "Dentures",
        "Orthodontics (Braces)",
      ],
      datasets: [
        {
          label: "Availed Services",
          data: [
            faCount,
            restoCount,
            cosmeticCount,
            rctCount,
            cabCount,
            oseCount,
            denturesCount,
            orthodonticsCount,
          ],
          backgroundColor: [
            "rgba(200,255,150, .80)",
            "rgba(200,180,200, .80)",
            "rgba(255,0,0, .80)",
            "rgba(0,255,0, .80)",
            "rgba(0,0,255, .80)",
            "rgba(255,255,0, .80)",
            "rgba(255,0,255, .80)",
            "rgba(0,255,255, .80)",
          ],
          borderColor: [
            "rgba(200,255,150)",
            "rgba(200,180,200)",
            "rgba(255,0,0)",
            "rgba(0,255,0)",
            "rgba(0,0,255)",
            "rgba(255,255,0)",
            "rgba(255,0,255)",
            "rgba(0,255,255)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [billsData, startDateString, endDateString]);

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4">
        <DatePicker
          label={"Start Date"}
          value={startDate}
          onChange={(value: dayjs.Dayjs | null) => setStartDate(value)}
          slotProps={{
            actionBar: {
              actions: ["clear"],
            },
          }}
        />
        <span>-</span>
        <DatePicker
          label={"End Date"}
          value={endDate}
          onChange={(value: dayjs.Dayjs | null) => setEndDate(value)}
          slotProps={{
            actionBar: {
              actions: ["clear"],
            },
          }}
        />
        <button
          className="btn btn-primary ml-4"
          onClick={() => {
            if (!startDate && endDate) {
              setDateError("Please input a start date");
              return;
            }

            if (startDate && !endDate) {
              setDateError("Please input a end date");
              return;
            }

            if (dayjs(endDate).isSameOrBefore(startDate)) {
              setDateError("Start date cannot be same or higher than end date");
              return;
            }

            if (!startDate && !endDate) {
              setDateError("");
              setStartDateString("");
              setEndDateString("");
              return;
            }

            if (startDate && endDate) {
              setDateError("");
              setStartDateString(startDate.format());
              setEndDateString(endDate.hour(23).minute(59).second(59).format());
            }
          }}
        >
          Apply
        </button>
      </div>
      {dateError && <span className="text-red-700 text-xs">{dateError}</span>}
      <Bar
        className="mt-12"
        data={graphData}
        options={{
          responsive: true,
        }}
      />
    </section>
  );
};

export default Analytics;
