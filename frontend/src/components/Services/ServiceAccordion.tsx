import { useState } from "react";
import { IconType } from "react-icons/lib";
import { ServiceAccordionTitle } from "./ServiceAccordionTitle";
import { useGetServices } from "../../hooks/service";
import { ServiceAccordionRow } from "./ServiceAccordionRow";

interface Props {
  category: ServiceCategory;
  Icon: IconType;
}

export const ServiceAccordion = ({ category, Icon }: Props): JSX.Element => {
  const { data: services } = useGetServices();

  const servicesByCategory = services?.filter(
    (service) => service.category === category
  );

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <ServiceAccordionTitle
        title={category}
        Icon={Icon}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div
        className={`grid transition-[grid-template-rows] ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="flex flex-col border-l-4 border-primary/75 divide-y divide-primary/50 overflow-hidden">
          {servicesByCategory &&
            (servicesByCategory.length > 0 ? (
              servicesByCategory.map((service) => (
                <ServiceAccordionRow key={service._id} service={service} />
              ))
            ) : (
              <p className="px-8 py-4 text-base-content/90 text-sm md:text-base font-medium">
                No {category} services yet
              </p>
            ))}
        </div>
      </div>
    </>
  );
};
