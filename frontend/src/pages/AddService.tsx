import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddService } from "../hooks/service";
import { Navigate } from "react-router-dom";
import { useGetMe } from "../hooks/user";

type Props = {};

const AddService = (props: Props) => {
  const categories = [
    { value: "First Appointment", label: "First Appointment" },
    { value: "Restoration", label: "Restoration" },
    { value: "Cosmetic", label: "Cosmetic" },
    { value: "Root Canal Treatment", label: "Root Canal Treatment" },
    { value: "Crowns and Bridges", label: "Crowns and Bridges" },
    {
      value: "Oral Surgery or Extractions",
      label: "Oral Surgery or Extractions",
    },
    { value: "Dentures", label: "Dentures" },
    { value: "Orthodontics (Braces)", label: "Orthodontics (Braces)" },
  ];

  const schema = z.object({
    name: z
      .string({ required_error: "Service name is required" })
      .min(1, "Service name is required"),
    category: z
      .string({ required_error: "Select a category" })
      .min(1, "Select a category"),
    estimatedTime: z
      .string({ required_error: "Estimated time is required" })
      .min(1, "Estimated time is required"),
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    defaultValues: {
      name: "",
      category: "",
      estimatedTime: "",
    },
    resolver: zodResolver(schema),
  });

  const { data: me } = useGetMe();
  const { mutate: addService, error: addServiceError } = useAddService();

  const onSubmit: SubmitHandler<ServiceFormValues> = (data) =>
    addService(data, { onSuccess: () => reset() });

  if (!me || me.role === "Patient") return <Navigate to="/" />;

  return (
    <main className="flex flex-col items-center w-full h-full mt-4 transition-all">
      <section className="bg-base-300 max-w-4xl w-full rounded-2xl shadow-md px-8 py-10 md:px-10 lg:px-16">
        <header className="flex justify-start">
          <h1 className="text-2xl font-bold mx-2 py-3">Add a new service</h1>
        </header>
        <form
          className="flex flex-col px-2 py-4 md:py-8 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <SelectDropdown
                  {...field}
                  value={value}
                  placeholder="Category"
                  onChange={(val) => onChange(val?.value)}
                  options={categories}
                />
              )}
            />
            <span className="text-xs text-error pl-1">
              {errors.category?.message}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <FormInput
              type="text"
              label="name"
              placeholder="Service name"
              register={register}
              value={watch("name")}
              error={errors.name?.message}
              Logo={AiOutlineMedicineBox}
            />
            <FormInput
              type="text"
              label="estimatedTime"
              placeholder="Estimated Time (mins)"
              register={register}
              value={watch("estimatedTime")}
              error={errors.estimatedTime?.message}
              Logo={FiClock}
            />
          </div>
          <div className="flex flex-col items-start gap-2 px-2">
            <button
              type="submit"
              className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 w-full sm:w-48 px-8 mt-8"
            >
              Add Service
            </button>
            <p className="px-2 text-xs text-error text-center">
              {addServiceError && addServiceError.response.data.formErrors}
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddService;
