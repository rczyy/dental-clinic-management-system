import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useGetServices } from "../../hooks/service";
import { ServiceData } from "./ServiceData";
import { useState } from "react";

interface Props {
  category: ServiceCategory;
}

export const ServiceCategory = ({ category }: Props): JSX.Element => {
  const [showServices, toggleShowServices] = useState(true);
  const { data: services } = useGetServices();

  const servicesInCategory = services?.filter(
    (service) => service.category === category
  );

  return (
    <div className="divide-y border-b divide-neutral border-neutral">
      <div className="flex justify-between items-center px-2 py-4">
        <h2 className="font-medium">{category}</h2>
        <i
          className="p-1 rounded transition cursor-pointer hover:bg-neutral"
          onClick={() => toggleShowServices(!showServices)}
        >
          {showServices ? <FiChevronDown /> : <FiChevronRight />}
        </i>
      </div>
      {showServices && servicesInCategory && servicesInCategory.length > 0 && (
        <div className="flex flex-col divide-y divide-neutral">
          {servicesInCategory.map((service) => (
            <ServiceData key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
