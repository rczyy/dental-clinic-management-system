import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

type Props = {};

const App = (props: Props) => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
