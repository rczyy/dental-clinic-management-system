import { AiOutlineFileText, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiPlus, FiX } from "react-icons/fi";
import { useGetMe, useGetUser } from "../../hooks/user";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAddPatientFile, useGetPatientFiles } from "../../hooks/patientFile";
import { PatientFileTable } from "../Table/PatientFileTable";

interface Props {}

interface AddPrescriptionModalProps {
  userId: string;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PatientFiles = (_: Props): JSX.Element => {
  const { userID } = useParams();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const { data: me } = useGetMe();
  const { data: userData } = useGetUser(userID || "");
  const { data: files, isLoading: filesLoading } = useGetPatientFiles(
    (userData && userData._id) || "",
    undefined,
    !!userData && userData.role === "Patient"
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AiOutlineFileText className="text-primary" />
            <span className="font-semibold text-primary">Patient Files</span>
          </div>
          {me?.role !== "Assistant" && me?.role !== "Patient" && (
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiPlus
                className="w-7 h-7 p-1 text-primary"
                onClick={() => setIsAddModalVisible(true)}
              />
            </div>
          )}
        </div>

        <PatientFileTable files={files} filesLoading={filesLoading} />
      </div>

      {isAddModalVisible && (
        <AddFileModal userId={userID || ""} setIsAddModalVisible={setIsAddModalVisible} />
      )}
    </>
  );
};

const AddFileModal = ({ userId, setIsAddModalVisible }: AddPrescriptionModalProps): JSX.Element => {
  const [files, setFiles] = useState<FileList>();

  const { mutate: addPatientFile, isLoading } = useAddPatientFile();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (files) {
      for (const file of files) {
        formData.append("file", file);
      }
    }

    addPatientFile({ userId, formData }, { onSuccess: () => setIsAddModalVisible(false) });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsAddModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-start py-3">
          <h1 className="text-2xl font-bold">Upload Patient Files</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsAddModalVisible(false)}
            />
          </div>
        </header>

        <form className="flex flex-col py-3 gap-2" onSubmit={onSubmit}>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs mx-auto my-8 outline-none"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setFiles(e.target.files);
              }
            }}
          />

          <div className="flex gap-3 justify-end py-3">
            <button type="button" className="btn px-8" onClick={() => setIsAddModalVisible(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-4 px-8">
              Upload
              {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
