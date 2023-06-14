import { AiFillHeart, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiPlus, FiX } from "react-icons/fi";
import { useGetMe, useGetUser } from "../../hooks/user";
import FormInput from "../Form/FormInput";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAddPatientCondition, useGetPatientConditions } from "../../hooks/patientCondition";
import { useParams } from "react-router-dom";
import { ConditionDataRow } from "../Table/ConditionDataRow";

interface Props {}

interface AddConditionModalProps {
  userId: string;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Conditions = (_: Props): JSX.Element => {
  const { userID } = useParams();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const { data: me } = useGetMe();
  const { data: userData } = useGetUser(userID || "");
  const { data: conditions, isLoading: conditionsLoading } = useGetPatientConditions(
    (userData && userData._id) || "",
    !!userData && userData.role === "Patient"
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AiFillHeart className="text-primary" />
            <span className="font-semibold text-primary">Active Conditions</span>
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

        <div className="overflow-x-auto">
          <table className="w-fit">
            <tbody className="[&>tr>td]:pb-4 [&>tr>td]:pr-12 [&>tr>td:last-child]:pr-0">
              {conditions ? (
                conditions.length > 0 ? (
                  conditions.map((condition) => (
                    <ConditionDataRow key={condition._id} condition={condition} />
                  ))
                ) : (
                  <tr>
                    <td className="text-zinc-400">No patient conditions</td>
                  </tr>
                )
              ) : (
                conditionsLoading && (
                  <tr>
                    <td className="p-2">
                      <AiOutlineLoading3Quarters className="w-6 h-6 text-primary animate-spin" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalVisible && (
        <AddConditionModal userId={userID || ""} setIsAddModalVisible={setIsAddModalVisible} />
      )}
    </>
  );
};

const AddConditionModal = ({
  userId,
  setIsAddModalVisible,
}: AddConditionModalProps): JSX.Element => {
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
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      condition: "",
      conditionType: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutate: addCondition, isLoading } = useAddPatientCondition();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    addCondition(
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
          <h1 className="text-2xl font-bold">Add Patient Condition</h1>
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
