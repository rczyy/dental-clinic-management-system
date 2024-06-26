import { FiEye, FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRecoverStaff, useRemoveStaff } from "../../hooks/staff";
import { SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGetMe } from "../../hooks/user";
import { IoArrowUndoOutline } from "react-icons/io5";

type Props = {
  staff: StaffResponse;
};

type RemoveStaffProps = {
  staff: StaffResponse;
  setIsDeleteModalVisible: React.Dispatch<SetStateAction<boolean>>;
};

type RecoverStaffProps = {
  staff: StaffResponse;
  setIsRecoverModalVisible: React.Dispatch<SetStateAction<boolean>>;
};

const StaffDataRow = ({ staff }: Props) => {
  const navigate = useNavigate();

  const { data: me } = useGetMe();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRecoverModalVisible, setIsRecoverModalVisible] = useState(false);

  return (
    <tr
      className={`${
        staff.isDeleted ? "[&>*]:bg-red-300/75" : "[&>*]:bg-transparent"
      } transition tracking-tight`}
    >
      <th className="w-10 p-1.5">
        <div className="flex dropdown dropdown-right">
          <label
            tabIndex={0}
            className="w-full h-full mx-auto rounded-full cursor-pointer transition hover:bg-base-100"
          >
            <FiMoreVertical className="w-full h-full p-1" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu flex-row flex-nowrap p-1 bg-base-100 text-sm border border-neutral rounded-lg shadow-lg translate-x-2 -translate-y-1/4"
          >
            <li onClick={() => navigate(`/profile/${staff.user._id}`)}>
              <a>
                <FiEye />
              </a>
            </li>

            {me &&
              (me.role === "Admin" || me.role === "Manager") &&
              (staff.isDeleted ? (
                <li onClick={() => setIsRecoverModalVisible(true)}>
                  <a>
                    <IoArrowUndoOutline />
                  </a>
                </li>
              ) : (
                <li onClick={() => setIsDeleteModalVisible(true)}>
                  <a>
                    <FiTrash />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </th>

      <td className="font-medium text-sm text-center">{staff.user.role}</td>

      <td className="pr-0">
        <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
          <img className="h-full object-cover" src={staff.user.avatar} />
        </figure>
      </td>

      <td className="font-medium text-sm">
        <div className="flex flex-col items-center">
          <span>{`${staff.user.name.firstName} ${staff.user.name.lastName}`}</span>
          <span
            className={`font-medium text-xs ${
              staff.isDeleted ? "text-base-content/75" : "text-zinc-400"
            }`}
          >
            {staff.user.email}
          </span>
        </div>
      </td>

      <td className="font-medium text-sm">
        <div className="flex flex-col items-center">
          {staff.user.address ? (
            <>
              <span>
                {`${staff.user.address.street || ""} ${
                  staff.user.address.barangay || ""
                }`}
              </span>
              <span
                className={`font-medium text-xs ${
                  staff.isDeleted ? "text-base-content/75" : "text-zinc-400"
                }`}
              >
                {`${staff.user.address.city || ""} ${
                  staff.user.address.province || ""
                }`}
              </span>
            </>
          ) : (
            <span
              className={`font-medium text-xs ${
                staff.isDeleted ? "text-base-content/75" : "text-zinc-400"
              }`}
            >
              —
            </span>
          )}
        </div>
      </td>

      <td className="font-medium text-sm text-center">
        {staff.user.contactNo}
      </td>

      {isDeleteModalVisible && (
        <RemoveUserModal
          staff={staff}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      )}

      {isRecoverModalVisible && (
        <RecoverUserModal
          staff={staff}
          setIsRecoverModalVisible={setIsRecoverModalVisible}
        />
      )}
    </tr>
  );
};

const RemoveUserModal = ({
  staff,
  setIsDeleteModalVisible,
}: RemoveStaffProps) => {
  const { mutate: removeStaff, isLoading } = useRemoveStaff();
  const handleDelete = () => {
    removeStaff(staff.user._id, {
      onSuccess: () => {
        toast.success("Successfully deleted the staff");
        setIsDeleteModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Remove Staff</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to permanently remove a staff.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn btn-error gap-4 px-8 text-white hover:bg-red-700"
            onClick={() => {
              handleDelete();
            }}
          >
            Yes{" "}
            {isLoading && (
              <AiOutlineLoading3Quarters className="text-lg animate-spin" />
            )}
          </button>
        </div>
      </section>
    </td>
  );
};

const RecoverUserModal = ({
  staff,
  setIsRecoverModalVisible,
}: RecoverStaffProps) => {
  const { mutate: recoverStaff, isLoading } = useRecoverStaff();
  const handleRecover = () => {
    recoverStaff(staff.user._id, {
      onSuccess: () => {
        toast.success("Successfully recovered the staff");
        setIsRecoverModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsRecoverModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Recover Staff</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsRecoverModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to recover a staff.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsRecoverModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn bg-green-600 gap-4 px-8 text-white hover:bg-green-700"
            onClick={() => {
              handleRecover();
            }}
          >
            Yes{" "}
            {isLoading && (
              <AiOutlineLoading3Quarters className="text-lg animate-spin" />
            )}
          </button>
        </div>
      </section>
    </td>
  );
};

export default StaffDataRow;
