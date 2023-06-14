import { FiEdit2, FiTrash, FiX } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import FormInput from "../Form/FormInput";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEditPrescription, useRemovePrescription } from "../../hooks/prescription";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  prescription: PrescriptionResponse;
}

interface EditPrescriptionModalProps {
  userId: string;
  prescription: PrescriptionResponse;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeletePrescriptionModalProps {
  userId: string;
  prescription: PrescriptionResponse;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PrescriptionDataRow = ({ prescription }: Props): JSX.Element => {
  const { userID } = useParams();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { data: me } = useGetMe();

  return (
    <tr>
      <td>{prescription.name}</td>
      <td>{prescription.dose}</td>
      <td>{prescription.frequency}</td>
      <td>
        <div className="flex items-center gap-4">
          <figure className="w-9 h-w-9 rounded-full overflow-hidden">
            <img src={prescription.prescriber.avatar} alt="Avatar" className="object-cover" />
          </figure>
          <span>
            Dr. {prescription.prescriber.name.firstName} {prescription.prescriber.name.lastName}
          </span>
        </div>
      </td>
      <td>{dayjs(prescription.createdAt).format("DD MMM YYYY")}</td>
      {(me?.role === "Admin" || me?.role === "Dentist") && (
        <td className="p-0">
          <div className="flex gap-2">
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiEdit2
                className="w-6 h-6 mx-auto p-1 text-primary"
                onClick={() => setIsEditModalVisible(true)}
              />
            </div>
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiTrash
                className="w-6 h-6 mx-auto p-1 text-red-600"
                onClick={() => setIsDeleteModalVisible(true)}
              />
            </div>
          </div>

          {isEditModalVisible && (
            <EditPrescriptionModal
              userId={userID || ""}
              prescription={prescription}
              setIsEditModalVisible={setIsEditModalVisible}
            />
          )}

          {isDeleteModalVisible && (
            <DeletePrescriptionModal
              userId={userID || ""}
              prescription={prescription}
              setIsDeleteModalVisible={setIsDeleteModalVisible}
            />
          )}
        </td>
      )}
    </tr>
  );
};

const EditPrescriptionModal = ({
  userId,
  prescription: { _id, name, dose, frequency },
  setIsEditModalVisible,
}: EditPrescriptionModalProps): JSX.Element => {
  const schema = z.object({
    name: z
      .string({ required_error: "Prescription name is required" })
      .min(1, "Prescription name is required"),
    dose: z.string({ required_error: "Dose is required" }).min(1, "Dose is required"),
    frequency: z
      .string({ required_error: "Frequency is required" })
      .min(1, "Frequency is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name,
      dose,
      frequency,
    },
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const { mutate: editPrescription, isLoading } = useEditPrescription();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    editPrescription(
      { id: _id, form: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["prescription", userId]);
          setIsEditModalVisible(false);
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsEditModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-start py-3">
          <h1 className="text-2xl font-bold">Edit Prescription</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsEditModalVisible(false)}
            />
          </div>
        </header>

        <form className="flex flex-col py-3 gap-2" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="text"
            label="name"
            placeholder="Prescription name"
            value={watch("name")}
            register={register}
            error={errors.name && errors.name.message}
          />

          <FormInput
            type="text"
            label="dose"
            placeholder="Dose"
            value={watch("dose")}
            register={register}
            error={errors.dose && errors.dose.message}
          />

          <FormInput
            type="text"
            label="frequency"
            placeholder="Frequency"
            value={watch("frequency")}
            register={register}
            error={errors.frequency && errors.frequency.message}
          />

          <div className="flex gap-3 justify-end py-3">
            <button type="button" className="btn px-8" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-4 px-8">
              Edit
              {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const DeletePrescriptionModal = ({
  userId,
  prescription: { _id },
  setIsDeleteModalVisible,
}: DeletePrescriptionModalProps): JSX.Element => {
  const queryClient = useQueryClient();

  const { mutate: removePrescription, isLoading } = useRemovePrescription();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-start py-3">
          <h1 className="text-2xl font-bold">Delete Prescription</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>

        <div className="flex flex-col mx-2 py-3">
          <p>You are about to delete this prescription.</p>
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
              removePrescription(_id, {
                onSuccess: () => {
                  queryClient.invalidateQueries(["prescription", userId]);
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
