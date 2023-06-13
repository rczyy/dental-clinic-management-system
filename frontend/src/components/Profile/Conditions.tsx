import { AiFillHeart } from "react-icons/ai";
import { FiPlus, FiEdit2, FiTrash } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";

interface Props {}

export const Conditions = (_: Props): JSX.Element => {
  const { data: me } = useGetMe();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AiFillHeart className="text-primary" />
          <span className="font-semibold text-primary">Active Conditions</span>
        </div>
        {me?.role !== "Patient" && (
          <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
            <FiPlus className="w-7 h-7 p-1 text-primary" />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-fit">
          <tbody className="[&>tr>td]:pb-4 [&>tr>td]:pr-12 [&>tr>td:last-child]:pr-0">
            <tr>
              <td className="text-sm sm:text-base font-semibold">Diabetes</td>
              <td className="text-sm sm:text-base font-normal">Type 1 Diabetes</td>
              {me?.role !== "Patient" && (
                <td>
                  <div className="flex gap-4">
                    <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
                      <FiEdit2 className="w-6 h-6 p-1 text-primary" />
                    </div>
                    <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
                      <FiTrash className="w-6 h-6 p-1 text-red-600" />
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
