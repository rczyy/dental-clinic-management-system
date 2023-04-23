import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

type Props = {};

const SetAppointment = (props: Props) => {

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const serviceCategories = [
    { value: "First Appointment", label: "First Appointment" },
    { value: "Restoration", label: "Restoration" },
    { value: "Cosmetic", label: "Cosmetic" },
    { value: "Crowns and Bridges", label: "Crowns and Bridges" },
    {
      value: "Oral Surgery or Extractions",
      label: "Oral Surgery or Extractions",
    },
    { value: "Dentures", label: "Dentures" },
    { value: "Orthodontics (Braces)", label: "Orthodontics (Braces)" },
  ];


  return (
    <main className="flex items-center justify-center">
      <div className="flex flex-col bg-base-300 max-w-screen-lg w-full min-h-[40rem] rounded-box border border-base-200 shadow">
        <header className="flex justify-center mb-2">
          <h1 className="text-xl font-bold mx-2 py-3">Book an appointment</h1>
        </header>
        <section className="flex justify-between">
          <ul className="steps steps-horizontal text-xs p-2">
            <li className="step step-primary">Service</li>
            <li className="step step-primary">Dentist</li>
            <li className="step">Date</li>
            <li className="step">Information</li>
          </ul>
        </section>
        <section className="p-2">
          <Controller
            name="serviceCategory"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Select
                {...field}
                value={
                  value
                    ? serviceCategories &&
                      serviceCategories.find(
                        (category) => category.value === value
                      )
                    : null
                }
                classNames={{
                  control: ({ hasValue }) =>
                    "pl-1.5 py-[1px] !bg-base-300 " +
                    (hasValue && "!border-primary"),
                  placeholder: () => "!text-zinc-400 !text-sm",
                  singleValue: () => "!text-base-content !text-sm",
                  input: () => "!text-base-content",
                  option: ({ isSelected, isFocused }) =>
                    "!text-sm " +
                    (isSelected ? "!bg-primary !text-zinc-100 " : "") +
                    (isFocused && !isSelected ? "!bg-neutral" : ""),
                  menu: () => "!bg-base-300",
                  dropdownIndicator: ({ hasValue }) =>
                    hasValue ? "!text-primary" : "",
                  indicatorSeparator: ({ hasValue }) =>
                    hasValue ? "!bg-primary" : "",
                }}
                placeholder="Service Category"
                onChange={(val) => onChange(val?.value)}
                options={serviceCategories}
                isLoading={!serviceCategories}
              />
            )}
          />   
          <Controller
            name="serviceCategory"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Select
                {...field}
                value={
                  value
                    ? serviceCategories &&
                      serviceCategories.find(
                        (category) => category.value === value
                      )
                    : null
                }
                classNames={{
                  control: ({ hasValue }) =>
                    "pl-1.5 py-[1px] !bg-base-300 " +
                    (hasValue && "!border-primary"),
                  placeholder: () => "!text-zinc-400 !text-sm",
                  singleValue: () => "!text-base-content !text-sm",
                  input: () => "!text-base-content",
                  option: ({ isSelected, isFocused }) =>
                    "!text-sm " +
                    (isSelected ? "!bg-primary !text-zinc-100 " : "") +
                    (isFocused && !isSelected ? "!bg-neutral" : ""),
                  menu: () => "!bg-base-300",
                  dropdownIndicator: ({ hasValue }) =>
                    hasValue ? "!text-primary" : "",
                  indicatorSeparator: ({ hasValue }) =>
                    hasValue ? "!bg-primary" : "",
                }}
                placeholder="Service Category"
                onChange={(val) => onChange(val?.value)}
                options={serviceCategories}
                isLoading={!serviceCategories}
              />
            )}
          />                         
        </section>
      </div>
    </main>
  );
};
export default SetAppointment;
