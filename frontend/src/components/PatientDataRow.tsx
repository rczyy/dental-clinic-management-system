type Props = {
  patient: PatientResponse;
};

const PatientDataRow = ({ patient }: Props) => {
  return (
    <tr>
      <td className="truncate">{`${patient.user.name.firstName} ${patient.user.name.lastName}`}</td>
      <td className="truncate hidden md:table-cell">{`${patient.user.address.street} ${patient.user.address.barangay}, ${patient.user.address.city}, ${patient.user.address.province}`}</td>
      <td className="hidden lg:table-cell">{patient.user.email}</td>
      <td>{patient.user.contactNo}</td>
    </tr>
  );
};
export default PatientDataRow;
