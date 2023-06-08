import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useGetBills } from "../../hooks/bill";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [graphData, setGraphData] = useState<GraphData>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    const faCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "First Appointment"
        ).length
      : 0;

    const restoCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "Restoration"
        ).length
      : 0;

    const cosmeticCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "Cosmetic"
        ).length
      : 0;

    const rctCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "Root Canal Treatment"
        ).length
      : 0;

    const cabCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "Crowns and Bridges"
        ).length
      : 0;

    const oseCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Oral Surgery or Extractions"
        ).length
      : 0;

    const denturesCount = billsData
      ? billsData.filter(
          (bill) => bill.appointment.service.category === "Dentures"
        ).length
      : 0;

    const orthodonticsCount = billsData
      ? billsData.filter(
          (bill) =>
            bill.appointment.service.category === "Orthodontics (Braces)"
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
        "Orthodontics (Braces)"
      ],
      datasets: [
        {
          label: "Billed Appointments",
          data: [
            faCount,
            restoCount,
            cosmeticCount,
            rctCount,
            cabCount,
            oseCount,
            denturesCount,
            orthodonticsCount
          ],
          backgroundColor: [
            "rgba(200,255,150, .60)",
            "rgba(200,180,200, .60)",
            "rgba(255,0,0, .60)",
            "rgba(0,255,0, .60)",
            "rgba(0,0,255, .60)",
            "rgba(255,255,0, .60)",
            "rgba(255,0,255, .60)",
            "rgba(0,255,255, .60)"
          ],
          borderColor: [
            "rgba(200,255,150)",
            "rgba(200,180,200)",
            "rgba(255,0,0)",
            "rgba(0,255,0)",
            "rgba(0,0,255)",
            "rgba(255,255,0)",
            "rgba(255,0,255)",
            "rgba(0,255,255)"
          ],
          borderWidth: 1
        }
      ]
    });
  }, [billsData]);

  return (
    <section className="max-w-sm mx-auto">
      <Pie data={graphData} />
    </section>
  );
};

export default Analytics;
