import { Dispatch, SetStateAction, useState } from "react";
import { FiEye, FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRemovePatient } from "../../hooks/patient";

type Props = {
  patient: PatientResponse;
};
type RemovePatientProps = {
  patient: PatientResponse;
  setIsDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
};

const PatientDataRow = ({ patient }: Props) => {
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  return (
    <>
      <tr className="[&>*]:bg-transparent transition tracking-tight">
        <th className="!bg-base-300 w-10 p-1.5">
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
              <li onClick={() => navigate(`/profile/${patient.user._id}`)}>
                <a>
                  <FiEye />
                </a>
              </li>
              <li onClick={() => setIsDeleteModalVisible(true)}>
                <a>
                  <FiTrash />
                </a>
              </li>
            </ul>
          </div>
        </th>

        <td className="font-medium text-sm">
          <div className="flex flex-col items-center">
            <span>{`${patient.user.name.firstName} ${patient.user.name.lastName}`}</span>
            <span className="font-medium text-xs text-zinc-400">
              {patient.user.email}
            </span>
          </div>
        </td>

        <td className="font-medium text-sm">
          <div className="flex flex-col items-center">
            {patient.user.address ? (
              <>
                <span>
                  {`${patient.user.address.street || ""} ${
                    patient.user.address.barangay || ""
                  }`}
                </span>
                <span className="font-medium text-xs text-zinc-400">
                  {`${patient.user.address.city || ""} ${
                    patient.user.address.province || ""
                  }`}
                </span>
              </>
            ) : (
              <span className="font-medium text-xs text-zinc-400">—</span>
            )}
          </div>
        </td>

        <td className="font-medium text-sm text-center">
          {patient.user.contactNo}
        </td>
      </tr>

      {isDeleteModalVisible && (
        <RemoveUserModal
          patient={patient}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      )}
    </>
  );
};

const RemoveUserModal = ({
  patient,
  setIsDeleteModalVisible,
}: RemovePatientProps) => {
  const { mutate: removePatient, error: removePatientError } =
    useRemovePatient();
  const handleDelete = () => {
    removePatient(patient.user._id, {
      onSuccess: () => setIsDeleteModalVisible(false),
    });
  };
  return (
    <div
      className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Remove Patient</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to permanently remove a patient.</p>
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
            className="btn btn-error px-8 text-white hover:bg-red-700"
            onClick={() => {
              handleDelete();
            }}
          >
            Yes
          </button>
        </div>
        <p className="px-2 text-xs text-error text-center">
          {removePatientError && removePatientError.response.data.message}
        </p>
      </section>
    </div>
  );
};

export default PatientDataRow;
