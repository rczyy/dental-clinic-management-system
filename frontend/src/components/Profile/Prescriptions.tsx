import { CgPill } from "react-icons/cg";
import { FiPlus, FiEdit2, FiTrash, FiX } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import FormInput from "../Form/FormInput";

interface Props {}

interface AddPrescriptionModalProps {
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EditPrescriptionModalProps {
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeletePrescriptionModalProps {
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Prescriptions = (_: Props): JSX.Element => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { data: me } = useGetMe();

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CgPill className="text-primary" />
            <span className="font-semibold text-primary">Prescriptions</span>
          </div>
          {me?.role !== "Patient" && (
            <div className="rounded-full cursor-pointer transition duration-200 hover:bg-neutral">
              <FiPlus
                className="w-7 h-7 p-1 text-primary"
                onClick={() => setIsAddModalVisible(true)}
              />
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
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalVisible && <AddPrescriptionModal setIsAddModalVisible={setIsAddModalVisible} />}

      {isEditModalVisible && (
        <EditPrescriptionModal setIsEditModalVisible={setIsEditModalVisible} />
      )}

      {isDeleteModalVisible && (
        <DeletePrescriptionModal setIsDeleteModalVisible={setIsDeleteModalVisible} />
      )}
    </>
  );
};

const AddPrescriptionModal = ({ setIsAddModalVisible }: AddPrescriptionModalProps): JSX.Element => {
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
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
      dose: "",
      frequency: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    console.log(data);
    reset();
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
          <h1 className="text-2xl font-bold">Add Prescription</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsAddModalVisible(false)}
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
            <button type="button" className="btn px-8" onClick={() => setIsAddModalVisible(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-4 px-8">
              Add
              {/* {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />} */}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const EditPrescriptionModal = ({
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
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "Amoxicillin",
      dose: "20 mg",
      frequency: "1 po qd",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    console.log(data);
    reset();
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
              {/* {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />} */}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const DeletePrescriptionModal = ({
  setIsDeleteModalVisible,
}: DeletePrescriptionModalProps): JSX.Element => {
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
          <button type="submit" className="btn bg-red-600 gap-4 px-8 text-white hover:bg-red-700">
            Delete
            {/* {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />} */}
          </button>
        </div>
      </section>
    </div>
  );
};
