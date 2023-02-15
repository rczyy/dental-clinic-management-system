import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import Footer from "./components/Footer";

type Props = {};

const App = (props: Props) => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
