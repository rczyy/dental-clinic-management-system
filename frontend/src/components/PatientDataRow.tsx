type Props = {
  patient: PatientResponse;
};

const PatientDataRow = ({ patient }: Props) => {
  return (
    <tr>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span className="truncate">{`${patient.user.name.firstName} ${patient.user.name.lastName}`}</span>
          <span className="truncate font-medium text-xs text-zinc-400">
            {patient.user.email}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm hidden md:table-cell">
        <div className="flex flex-col">
          <span className="truncate">
            {`${patient.user.address.street} ${patient.user.address.barangay}`}
          </span>
          <span className="truncate font-medium text-xs text-zinc-400">
            {`${patient.user.address.city}, ${patient.user.address.province}`}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm hidden lg:table-cell">
        {patient.user.email}
      </td>
      <td className="font-medium text-sm">{patient.user.contactNo}</td>
    </tr>
  );
};
export default PatientDataRow;
