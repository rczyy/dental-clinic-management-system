import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import Footer from "./components/Footer";

type Props = {};

const App = (props: Props) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
