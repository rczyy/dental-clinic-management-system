import { IoPhonePortraitOutline } from "react-icons/io5";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiPhone } from "react-icons/fi";
import { useEditUser, useGetMe } from "../../hooks/user";
import FormInput from "../Form/FormInput";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {}

const schema = z.object({
  contactNo: z
    .string({ required_error: "Contact number is required" })
    .min(1, "Contact number cannot be empty")
    .regex(/(^9)\d{9}$/, "Invalid contact number"),
});

export const AddMobileNumber = ({}: Props): JSX.Element => {
  const { data: me } = useGetMe();
  const { mutate: editUser, isLoading: editUserLoading } = useEditUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ contactNo: string }>({
    defaultValues: {
      contactNo: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<{ contactNo: string }> = (data) => {
    const formData = new FormData();

    if (me) {
      formData.append("firstName", me.name.firstName);
      formData.append("lastName", me.name.lastName);
      formData.append("contactNo", "+63" + data.contactNo);

      if (me.name.middleName) formData.append("middleName", me.name.middleName);

      editUser({ data: formData, id: me._id });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-base-300 max-w-md w-full px-8 py-16 rounded-md shadow-lg">
      <IoPhonePortraitOutline className="text-primary w-20 h-20" />
      <div>
        <h3 className="text-xl text-center font-bold">
          Add your mobile number
        </h3>
        <p className="text-zinc-400 text-sm text-center">
          Enter your mobile number so we can contact you.
        </p>
      </div>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          type="text"
          label="contactNo"
          placeholder="Contact Number"
          register={register}
          value={watch("contactNo")}
          error={errors.contactNo?.message}
          Logo={FiPhone}
          required
        />
        <button type="submit" className="btn btn-primary flex gap-2 text-white">
          Save{" "}
          {editUserLoading && (
            <AiOutlineLoading3Quarters className="text-lg animate-spin" />
          )}
        </button>
      </form>
    </div>
  );
};
