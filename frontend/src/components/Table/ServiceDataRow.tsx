type Props = {
  service: ServiceResponse;
};
const ServiceDataRow = ({ service }: Props) => {
  return (
    <tr className="cursor-pointer [&>*]:bg-transparent transition hover:bg-base-100">
      <td className="truncate font-medium text-sm">{service.category}</td>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span className="truncate">{`${service.name}`}</span>
        </div>
      </td>
      <td className="font-medium text-sm hidden lg:table-cell">
        {service.estimatedTime}
      </td>
    </tr>
  );
};
export default ServiceDataRow;
