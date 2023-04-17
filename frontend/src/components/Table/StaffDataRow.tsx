import { FiEdit2, FiEye, FiMoreHorizontal, FiTrash } from "react-icons/fi";

type Props = {
  staff: StaffResponse;
};

const StaffDataRow = ({ staff }: Props) => {
  return (
    <tr className="[&>*]:bg-transparent">
      <th className="!bg-base-300">
        <div className="flex dropdown dropdown-right">
          <label
            tabIndex={0}
            className="w-8 h-8 p-2 mx-auto rounded-full cursor-pointer transition hover:bg-base-100"
          >
            <FiMoreHorizontal />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu flex-row flex-nowrap p-1 bg-base-100 text-sm border border-neutral rounded-lg shadow-lg translate-x-2 -translate-y-1/4"
          >
            <li>
              <a>
                <FiEye />
              </a>
            </li>
            <li>
              <a>
                <FiEdit2 />
              </a>
            </li>
            <li>
              <a>
                <FiTrash />
              </a>
            </li>
          </ul>
        </div>
      </th>
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
