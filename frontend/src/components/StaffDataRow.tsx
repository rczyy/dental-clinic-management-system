type Props = {
  staff: StaffResponse;
};

const StaffDataRow = ({ staff }: Props) => {
  return (
    <tr className="cursor-pointer [&>*]:bg-transparent transition hover:bg-base-100">
      <td className="truncate font-medium text-sm">{staff.user.role}</td>
      <td className="font-medium text-sm">
        <div className="flex flex-col">
          <span className="truncate">{`${staff.user.name.firstName} ${staff.user.name.lastName}`}</span>
          <span className="truncate font-medium text-xs text-zinc-400">
            {staff.user.email}
          </span>
        </div>
      </td>
      <td className="font-medium text-sm hidden lg:table-cell">
        {staff.user.email}
      </td>
      <td className="font-medium text-sm hidden md:table-cell">
        {staff.user.contactNo}
      </td>
    </tr>
  );
};
export default StaffDataRow;
