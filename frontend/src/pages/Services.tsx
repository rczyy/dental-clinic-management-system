import { useParams } from "react-router-dom";
import { useGetServices } from "../hooks/service";

type Props = {};
const Services = (props: Props) => {
  const { data } = useGetServices();
  let filteredData;
  const { serviceCategory } = useParams();
  
  if (serviceCategory === "restoration") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Restoration");
    });
  }
  if (serviceCategory === "cosmetic") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Cosmetic");
    });
  }
  if (serviceCategory === "root-canal-treatment") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Root");
    });
  }
  if (serviceCategory === "crowns-bridges") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Crowns");
    });
  }
  if (serviceCategory === "oral-surgery-extraction") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Oral");
    });
  }
  if (serviceCategory === "dentures") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Dentures");
    });
  }
  if (serviceCategory === "orthodontics") {
    filteredData = data?.filter((service) => {
      return service.category.startsWith("Orthodontics");
    });
  }
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {filteredData && filteredData.map((service) => <p>{service.name}</p>)}
    </div>
  );
};
export default Services;
