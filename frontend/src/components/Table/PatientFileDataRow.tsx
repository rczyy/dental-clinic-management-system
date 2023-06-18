import dayjs from "dayjs";
import { useState } from "react";
import { FiTrash, FiX } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useGetMe } from "../../hooks/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRemovePatientFile } from "../../hooks/patientFile";
import { useQueryClient } from "@tanstack/react-query";
import { ViewBillModal } from "./BillDataRow";

interface Props {
  file: PatientFileResponse;
  hideService: boolean;
}

interface DeletePatientFileModalProps {
  userId: string;
  patientFile: PatientFileResponse;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PatientFileDataRow = ({ file, hideService }: Props): JSX.Element => {
  const { userID } = useParams();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewBillModalVisible, setIsViewBillModalVisible] = useState(false);

  const { data: me } = useGetMe();

  const bytesConversionToKB = 1000;
  const bytesConversionToMB = 1000000;

  return (
    <tr>
      <td className="text-primary">
        <Link to={file.file}>{file.name}</Link>
      </td>
      <td>
        {file.size >= bytesConversionToMB
          ? `${Math.ceil(file.size / bytesConversionToMB)} MB`
          : `${Math.ceil(file.size / bytesConversionToKB)} KB`}
      </td>

      {!hideService && (
        <td>
          {file.bill ? (
            <span
              className="text-primary cursor-pointer"
              onClick={() => setIsViewBillModalVisible(!isViewBillModalVisible)}
            >
              {file.bill.appointment.service.name}
            </span>
          ) : (
            "-"
          )}
        </td>
      )}

      {isViewBillModalVisible && file.bill && (
        <ViewBillModal bill={file.bill} setIsViewModalVisible={setIsViewBillModalVisible} />
      )}
      <td>{dayjs(file.createdAt).format("DD MMM YYYY")}</td>

      {(me?.role === "Admin" || me?.role === "Dentist") && (
        <td className="p-0">
          <div className="flex gap-2">
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiTrash
                className="w-6 h-6 mx-auto p-1 text-red-600"
                onClick={() => setIsDeleteModalVisible(true)}
              />
            </div>
          </div>

          {isDeleteModalVisible && (
            <DeletePatientFileModal
              userId={userID || ""}
              patientFile={file}
              setIsDeleteModalVisible={setIsDeleteModalVisible}
            />
          )}
        </td>
      )}
    </tr>
  );
};

const DeletePatientFileModal = ({
  userId,
  patientFile: { _id },
  setIsDeleteModalVisible,
}: DeletePatientFileModalProps): JSX.Element => {
  const queryClient = useQueryClient();

  const { mutate: removePatientFile, isLoading } = useRemovePatientFile();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-start py-3">
          <h1 className="text-2xl font-bold">Delete Patient File</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>

        <div className="flex flex-col mx-2 py-3 text-base">
          <p>You are about to delete this patient file.</p>
          <p>Are you sure?</p>
        </div>

        <div className="flex gap-3 justify-end py-3">
          <button type="button" className="btn px-8" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-red-600 gap-4 px-8 text-white hover:bg-red-700"
            onClick={() =>
              removePatientFile(_id, {
                onSuccess: () => {
                  queryClient.invalidateQueries(["patient-files", userId]);
                  setIsDeleteModalVisible(false);
                },
              })
            }
          >
            Delete
            {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />}
          </button>
        </div>
      </section>
    </div>
  );
};
