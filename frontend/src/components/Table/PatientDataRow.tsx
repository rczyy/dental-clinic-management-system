import { Dispatch, SetStateAction, useState } from "react";
import { FiEye, FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  useRemovePatient,
  useRecoverPatient,
  useBanPatient,
  useUnbanPatient
} from "../../hooks/patient";
import { toast } from "react-toastify";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters
} from "react-icons/ai";
import { IoArrowUndoOutline } from "react-icons/io5";
import { useGetMe } from "../../hooks/user";

type Props = {
  patient: PatientResponse;
};

type RemovePatientProps = {
  patient: PatientResponse;
  setIsDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
};

type RecoverPatientProps = {
  patient: PatientResponse;
  setIsRecoverModalVisible: Dispatch<SetStateAction<boolean>>;
};

type BanPatientProps = {
  patient: PatientResponse;
  setIsBanModalVisible: Dispatch<SetStateAction<boolean>>;
};

type UnbanPatientProps = {
  patient: PatientResponse;
  setIsUnbanModalVisible: Dispatch<SetStateAction<boolean>>;
};

const PatientDataRow = ({ patient }: Props) => {
  const navigate = useNavigate();

  const { data: me } = useGetMe();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRecoverModalVisible, setIsRecoverModalVisible] = useState(false);
  const [isBanModalVisible, setIsBanModalVisible] = useState(false);
  const [isUnbanModalVisible, setIsUnbanModalVisible] = useState(false);

  return (
    <tr
      className={`${
        patient.isDeleted ? "[&>*]:bg-red-300/75" : "[&>*]:bg-transparent"
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
            <li onClick={() => navigate(`/profile/${patient.user._id}`)}>
              <a>
                <FiEye />
              </a>
            </li>
            {me &&
              (me.role === "Admin" || me.role === "Manager") &&
              (patient.isDeleted ? (
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
            {me &&
              (me.role === "Admin" || me.role === "Manager") &&
              (patient.isBanned ? (
                <li onClick={() => setIsUnbanModalVisible(true)}>
                  <a>
                    <AiOutlineCheckCircle />
                  </a>
                </li>
              ) : (
                <li onClick={() => setIsBanModalVisible(true)}>
                  <a>
                    <AiOutlineCloseCircle />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </th>

      <td className="pr-0">
        <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
          <img className="h-full object-cover" src={patient.user.avatar} />
        </figure>
      </td>

      <td className="font-medium text-sm">
        <div className="flex flex-col items-center">
          <span>{`${patient.user.name.firstName} ${patient.user.name.lastName}`}</span>
          <span
            className={`font-medium text-xs ${
              patient.isDeleted ? "text-base-content/75" : "text-zinc-400"
            }`}
          >
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
              <span
                className={`font-medium text-xs ${
                  patient.isDeleted ? "text-base-content/75" : "text-zinc-400"
                }`}
              >
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

      {isDeleteModalVisible && (
        <RemoveUserModal
          patient={patient}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      )}

      {isRecoverModalVisible && (
        <RecoverUserModal
          patient={patient}
          setIsRecoverModalVisible={setIsRecoverModalVisible}
        />
      )}

      {isUnbanModalVisible && (
        <UnbanUserModal
          patient={patient}
          setIsUnbanModalVisible={setIsUnbanModalVisible}
        />
      )}

      {isBanModalVisible && (
        <BanUserModal
          patient={patient}
          setIsBanModalVisible={setIsBanModalVisible}
        />
      )}
    </tr>
  );
};

const RemoveUserModal = ({
  patient,
  setIsDeleteModalVisible
}: RemovePatientProps) => {
  const { mutate: removePatient, isLoading } = useRemovePatient();
  const handleDelete = () => {
    removePatient(patient.user._id, {
      onSuccess: () => {
        toast.success("Successfully deleted the patient");
        setIsDeleteModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message)
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
          <h1 className="text-2xl font-bold">Remove Patient</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to remove a patient.</p>
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
  patient,
  setIsRecoverModalVisible
}: RecoverPatientProps) => {
  const { mutate: recoverPatient, isLoading } = useRecoverPatient();
  const handleRecover = () => {
    recoverPatient(patient.user._id, {
      onSuccess: () => {
        toast.success("Successfully recovered the patient");
        setIsRecoverModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message)
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
          <h1 className="text-2xl font-bold">Recover Patient</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsRecoverModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to recover a patient.</p>
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

const UnbanUserModal = ({
  patient,
  setIsUnbanModalVisible
}: UnbanPatientProps) => {
  const { mutate: unbanPatient, isLoading } = useUnbanPatient();
  const handleUnban = () => {
    unbanPatient(patient._id, {
      onSuccess: () => {
        toast.success("Successfully unbanned the patient");
        setIsUnbanModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message)
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsUnbanModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Unban Patient</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsUnbanModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to unban a patient.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsUnbanModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn bg-green-600 gap-4 px-8 text-white hover:bg-green-700"
            onClick={() => {
              handleUnban();
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

const BanUserModal = ({
  patient,
  setIsBanModalVisible
}: BanPatientProps) => {
  const { mutate: banPatient, isLoading } = useBanPatient();
  const handleBan = () => {
    banPatient(patient._id, {
      onSuccess: () => {
        toast.success("Successfully banned the patient");
        setIsBanModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message)
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsBanModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Ban Patient</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsBanModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to ban a patient.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsBanModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn btn-error gap-4 px-8 text-white hover:bg-red-700"
            onClick={() => {
              handleBan();
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

export default PatientDataRow;
