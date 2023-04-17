type Props = {
  i: number;
  staff: StaffResponse;
};

const StaffDataRow = ({ i, staff }: Props) => {
  return (
    <tr className="cursor-pointer [&>*]:bg-transparent transition hover:bg-base-100">
      <th className="!bg-base-300">{i + 1}</th>
      <td className="font-medium text-sm">{staff.user.role}</td>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span>{`${staff.user.name.firstName} ${staff.user.name.lastName}`}</span>
          <span className="font-medium text-xs text-zinc-400">
            {staff.user.email}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm">{staff.user.email}</td>
      <td className="font-medium text-sm">{staff.user.contactNo}</td>
    </tr>
  );
};
export default StaffDataRow;
