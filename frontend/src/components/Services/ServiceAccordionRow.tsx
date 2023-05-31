import { convertToTotalHoursAndMinutes } from "../../utilites/convertToTotalHoursAndMinutes";

interface Props {
  service: ServiceResponse;
}

export const ServiceAccordionRow = ({ service }: Props): JSX.Element => {
  return (
    <div className="flex justify-between items-center gap-4 px-8">
      <p className="py-4 text-base-content/90 text-sm md:text-base font-medium">
        {service.name}
      </p>
      <p className="py-4 text-xs text-zinc-400">
        {convertToTotalHoursAndMinutes(Number(service.estimatedTime))}
      </p>
    </div>
  );
};
