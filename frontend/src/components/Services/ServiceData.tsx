import { convertToTotalHoursAndMinutes } from "../../utilites/convertToTotalHoursAndMinutes";

interface Props {
  service: ServiceResponse;
}

export const ServiceData = ({ service }: Props): JSX.Element => {
  return (
    <div className="px-2 py-4">
      <h3 className="text-sm">{service.name}</h3>
      <p className="text-xs font-light text-zinc-400">
        {convertToTotalHoursAndMinutes(Number(service.estimatedTime))}
      </p>
    </div>
  );
};
