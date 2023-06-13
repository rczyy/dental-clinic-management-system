import { CgPill } from "react-icons/cg";
import { FiPlus, FiEdit2, FiTrash } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";

interface Props {}

export const Prescriptions = (_: Props): JSX.Element => {
  const { data: me } = useGetMe();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CgPill className="text-primary" />
          <span className="font-semibold text-primary">Prescriptions</span>
        </div>
        {me?.role !== "Patient" && (
          <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
            <FiPlus className="w-7 h-7 p-1 text-primary" />
          </div>
        )}
      </div>

      <div className="border border-neutral rounded-md overflow-auto">
        <table className="table [&_td]:bg-base-300 w-full">
          <thead className="[&_td]:border-b [&_td]:border-neutral [&_td]:text-zinc-400 [&_td]:text-sm [&_td]:font-medium [&_td]:normal-case">
            <tr>
              <td>Name</td>
              <td>Dose</td>
              <td>Frequency</td>
              <td>Prescriber</td>
              <td>Prescribed On</td>
              {me?.role !== "Patient" && <td className="p-0"></td>}
            </tr>
          </thead>

          <tbody className="[&_td]:border-neutral [&_td]:text-sm [&_td:first-child]:font-bold [&_td]:font-medium">
            <tr>
              <td>Amoxicillin</td>
              <td>20 mg</td>
              <td>1 po qd</td>
              <td>
                <div className="flex items-center gap-4">
                  <figure className="w-9 h-w-9 rounded-full overflow-hidden">
                    <img
                      src="https://picsum.photos/300/300"
                      alt="Avatar"
                      className="object-cover"
                    />
                  </figure>
                  <span>Dr. Brown</span>
                </div>
              </td>
              <td>09 Aug 2019</td>
              {me?.role !== "Patient" && (
                <td className="p-0">
                  <div className="flex gap-2">
                    <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
                      <FiEdit2 className="w-6 h-6 mx-auto p-1 text-primary" />
                    </div>
                    <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
                      <FiTrash className="w-6 h-6 mx-auto p-1 text-red-600" />
                    </div>
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
