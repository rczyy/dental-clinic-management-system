import { CgPill } from "react-icons/cg";
import { FiPlus, FiX } from "react-icons/fi";
import { useGetMe, useGetUser } from "../../hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import FormInput from "../Form/FormInput";
import { useAddPrescription, useGetPrescriptions } from "../../hooks/prescription";
import { useParams } from "react-router-dom";
import { PrescriptionDataRow } from "../Table/PrescriptionDataRow";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {}

interface AddPrescriptionModalProps {
  userId: string;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Prescriptions = (_: Props): JSX.Element => {
  const { userID } = useParams();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const { data: me } = useGetMe();
  const { data: userData } = useGetUser(userID || "");
  const { data: prescriptions, isLoading: prescriptionsLoading } = useGetPrescriptions(
    (userData && userData._id) || "",
    !!userData && userData.role === "Patient"
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CgPill className="text-primary" />
            <span className="font-semibold text-primary">Prescriptions</span>
          </div>
          {(me?.role === "Admin" || me?.role === "Dentist") && (
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
                {prescriptions &&
                  prescriptions.length > 0 &&
                  (me?.role === "Admin" || me?.role === "Dentist") && <td className="p-0"></td>}
              </tr>
            </thead>

            <tbody className="[&_td]:border-neutral [&_td]:text-sm [&_td:first-child]:font-bold [&_td]:font-medium">
              {prescriptions ? (
                prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <PrescriptionDataRow key={prescription._id} prescription={prescription} />
                  ))
                ) : (
                  <tr>
                    <td className="text-zinc-400 text-center !font-medium" colSpan={5}>
                      No patient prescriptions
                    </td>
                  </tr>
                )
              ) : (
                prescriptionsLoading && (
                  <tr>
                    <td className="p-2" colSpan={5}>
                      <AiOutlineLoading3Quarters className="w-6 h-6 mx-auto text-primary animate-spin" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalVisible && (
        <AddPrescriptionModal userId={userID || ""} setIsAddModalVisible={setIsAddModalVisible} />
      )}
    </>
  );
};

const AddPrescriptionModal = ({
  userId,
  setIsAddModalVisible,
}: AddPrescriptionModalProps): JSX.Element => {
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

  const { mutate: addPrescription, isLoading } = useAddPrescription();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    addPrescription(
      { userId, form: data },
      {
        onSuccess: () => {
          reset();
          setIsAddModalVisible(false);
        },
      }
    );
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
              {isLoading && <AiOutlineLoading3Quarters className="text-lg animate-spin" />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
