import Card from "../components/Dashboard/Card";
import Stat from "../components/Dashboard/Stat";
import { useAdminStore } from "../store/admin";

type Props = {};
const Dashboard = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } mx-auto`}
    >
      <header className="flex flex-col w-full md:flex-row justify-between mb-4 gap-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col gap-4 md:flex-row">
          <Stat title="Patients Registered" value="3000" />
          <Stat title="Staffs Registered" value="3000" />
        </div>
      </header>
      <div className="flex flex-col text-md gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        <Card title="Appointments Today" />
        <Card title="Available Dentists" />
        <Card title="Billings Today" />
      </div>
    </main>
  );
};
export default Dashboard;
