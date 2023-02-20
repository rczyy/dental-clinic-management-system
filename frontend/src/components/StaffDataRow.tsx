type Props = {
  staff: StaffResponse;
};

const StaffDataRow = ({ staff }: Props) => {
  return (
    <tr>
      <td className="truncate">{staff.user.role}</td>
      <td className="truncate">{`${staff.user.name.firstName} ${staff.user.name.lastName}`}</td>
      <td className="hidden lg:table-cell">{staff.user.email}</td>
      <td className="hidden md:table-cell">{staff.user.contactNo}</td>
    </tr>
  );
};
export default StaffDataRow;
