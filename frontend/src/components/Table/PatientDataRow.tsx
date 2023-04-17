type Props = {
  i: number;
  patient: PatientResponse;
};

const PatientDataRow = ({ i, patient }: Props) => {
  return (
    <tr className="cursor-pointer [&>*]:bg-transparent transition hover:bg-base-100">
      <th className="!bg-base-300">{i + 1}</th>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span>{`${patient.user.name.firstName} ${patient.user.name.lastName}`}</span>
          <span className="font-medium text-xs text-zinc-400">
            {patient.user.email}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span>
            {`${patient.user.address.street} ${patient.user.address.barangay}`}
          </span>
          <span className="font-medium text-xs text-zinc-400">
            {`${patient.user.address.city}, ${patient.user.address.province}`}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm">{patient.user.email}</td>
      <td className="font-medium text-sm">{patient.user.contactNo}</td>
    </tr>
  );
};
export default PatientDataRow;
