import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2, FiTrash, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useEditPatientCondition, useRemovePatientCondition } from "../../hooks/patientCondition";
import { useGetMe } from "../../hooks/user";
import FormInput from "../Form/FormInput";

interface Props {
  condition: PatientConditionResponse;
}

interface EditConditionModalProps {
  userId: string;
  condition: PatientConditionResponse;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeleteConditionModalProps {
  userId: string;
  condition: PatientConditionResponse;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConditionDataRow = ({ condition }: Props): JSX.Element => {
  const { userID } = useParams();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { data: me } = useGetMe();

  return (
    <tr key={condition._id}>
      <td className="text-sm sm:text-base font-semibold">{condition.condition}</td>
      <td className="text-sm sm:text-base font-normal">{condition.conditionType}</td>
      {me?.role !== "Patient" && (
        <td>
          <div className="flex gap-4">
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiEdit2
                className="w-6 h-6 p-1 text-primary"
                onClick={() => setIsEditModalVisible(true)}
              />
            </div>
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiTrash
                className="w-6 h-6 p-1 text-red-600"
                onClick={() => setIsDeleteModalVisible(true)}
              />
            </div>
          </div>

          {isEditModalVisible && (
            <EditConditionModal
              userId={userID || ""}
              condition={condition}
              setIsEditModalVisible={setIsEditModalVisible}
            />
          )}

          {isDeleteModalVisible && (
            <DeleteConditionModal
              userId={userID || ""}
              condition={condition}
              setIsDeleteModalVisible={setIsDeleteModalVisible}
            />
          )}
        </td>
      )}
    </tr>
  );
};

const EditConditionModal = ({
  userId,
  condition: { _id, condition, conditionType },
  setIsEditModalVisible,
}: EditConditionModalProps): JSX.Element => {
  const schema = z.object({
    condition: z
      .string({ required_error: "Condition is required" })
      .min(1, "Condition name is required"),
    conditionType: z
      .string({ required_error: "Condition Type is required" })
      .min(1, "Type is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      condition,
      conditionType,
    },
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();

  const { mutate: editPatientCondition, isLoading } = useEditPatientCondition();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    editPatientCondition(
      { id: _id, form: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["patient-conditions", userId]);
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
          <h1 className="text-2xl font-bold">Edit Patient Condition</h1>
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
            label="condition"
            placeholder="Condition name"
            value={watch("condition")}
            register={register}
            error={errors.condition && errors.condition.message}
          />
          <FormInput
            type="text"
            label="conditionType"
            placeholder="Type"
            value={watch("conditionType")}
            register={register}
            error={errors.conditionType && errors.conditionType.message}
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

const DeleteConditionModal = ({
  userId,
  condition: { _id },
  setIsDeleteModalVisible,
}: DeleteConditionModalProps): JSX.Element => {
  const queryClient = useQueryClient();

  const { mutate: removePatientCondition, isLoading } = useRemovePatientCondition();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-start py-3">
          <h1 className="text-2xl font-bold">Delete Patient Condition</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsDeleteModalVisible(false)}
            />
          </div>
        </header>

        <div className="flex flex-col mx-2 py-3">
          <p>You are about to delete this patient condition.</p>
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
              removePatientCondition(_id, {
                onSuccess: () => {
                  queryClient.invalidateQueries(["patient-conditions", userId]);
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
