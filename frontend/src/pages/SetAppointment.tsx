import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useGetServices } from "../hooks/service";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetDentistNames } from "../hooks/dentist";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsFillClockFill } from "react-icons/bs";
import { RiServiceFill } from "react-icons/ri";
import { FaTooth } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { useGetUser } from "../hooks/user";
import { getUser } from "../axios/user";
import { QueryClient } from "@tanstack/react-query";
import Select from "react-select";
import DentistComponent from "../components/Appointment/DentistComponent";
import dayjs from "dayjs";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({
    queryKey: ["user"],
    queryFn: getUser,
  });

const schema = z.object({
  dentist: z
    .string({ required_error: "Dentist is required" })
    .min(1, { message: "Please choose a Dentist" }),
  serviceCategory: z
    .string({ required_error: "Service Category is required" })
    .min(1, { message: "Category is required" }),
  service: z
    .string({ required_error: "Service is required" })
    .min(1, { message: "Service is required" }),
  date: z
    .any({ required_error: "Date is required" })
    .refine((val) => val != undefined, {
      message: "Date is required",
    }),
  time: z
    .any({ required_error: "Time is required" })
    .refine((val) => val != undefined, {
      message: "Time is required",
    }),
});

const SetAppointment = (props: Props) => {
  const { data: userData } = useGetUser();
  const { data: servicesData } = useGetServices();
  const { data: dentistData } = useGetDentistNames();
  const [services, setServices] = useState<SelectOption[]>();
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [step, setStep] = useState<number>(1);
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AppointmentZodFormValues>({
    defaultValues: {
      dentist: "",
      service: "",
      date: undefined,
      time: undefined,
    },
    resolver: zodResolver(schema),
  });
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

  useEffect(() => {
    setServices(undefined);
    reset((formValues) => ({ ...formValues, service: "" }));
    if (servicesData) {
      const selectedServices = servicesData.filter(
        (service) => service.category === watch("serviceCategory")
      );
      setServices(
        selectedServices.map((service) => ({
          _id: service._id,
          value: service.name,
          label: service.name,
        }))
      );
    }
  }, [watch("serviceCategory")]);

  const getDentistName = () => {
    if (dentistData) {
      const dentistName = dentistData.find(
        (dentist) => dentist._id === watch("dentist")
      );
      return `${dentistName?.name.firstName} ${dentistName?.name.lastName}`;
    }
  };

  const getService = () => {
    if (servicesData) {
      const service = servicesData.find(
        (service) => service.name === watch("service")
      );
      return `${service?.category} - ${service?.name}`;
    }
  };

  const onSubmit: SubmitHandler<AppointmentZodFormValues> = (data) => {
    const { date, time, dentist, service } = data;
    const dateTimeCombined = dayjs(
      `${dayjs(date).format("MM/DD/YY")} ${dayjs(time).format("h:mm a")}`
    );
    const dateTimeScheduled = dateTimeCombined.format("MM/DD/YY h:mm a");
    const serviceSelected = servicesData?.find(
      (serviceList) => service === serviceList.name
    );
    const serviceEstimatedTime =
      serviceSelected && serviceSelected.estimatedTime;

    let dateTimeFinished = dateTimeScheduled;
    if (serviceEstimatedTime) {
      dateTimeFinished = dateTimeCombined
        .add(parseInt(serviceEstimatedTime), "minute")
        .format("MM/DD/YY h:mm a");
    }

    const serviceId = serviceSelected && serviceSelected._id;
    const appointmentData: AppointmentFormValues = {
      patient: userData?._id || "",
      dentist,
      service: serviceId || "",
      dateTimeScheduled,
      dateTimeFinished,
    };

    console.log(appointmentData);
  };

  return (
    <main className="flex items-center justify-center">
      <div className="flex flex-col gap-8 bg-base-300 max-w-screen-lg w-full min-h-[40rem] rounded-box border border-base-200 shadow">
        <header className="flex justify-center mb-2">
          <h1 className="text-xl md:text-2xl font-bold mx-2 pt-6">
            Book an appointment
          </h1>
        </header>
        <section className="flex justify-center">
          <ul className="steps steps-horizontal text-xs md:text-sm p-2 w-full sm:px-24 lg:px-40">
            <li
              className={
                "step after:!text-zinc-100 " +
                (step >= 1
                  ? "step-primary"
                  : "before:!bg-neutral after:!bg-neutral")
              }
            >
              Service
            </li>
            <li
              className={
                "step after:!text-zinc-100 " +
                (step >= 2
                  ? "step-primary"
                  : "before:!bg-neutral after:!bg-neutral")
              }
            >
              Dentist
            </li>
            <li
              className={
                "step after:!text-zinc-100 " +
                (step >= 3
                  ? "step-primary"
                  : "before:!bg-neutral after:!bg-neutral")
              }
            >
              Date
            </li>
            <li
              className={
                "step after:!text-zinc-100 " +
                (step >= 4
                  ? "step-primary"
                  : "before:!bg-neutral after:!bg-neutral")
              }
            >
              Confirm
            </li>
          </ul>
        </section>
        <form onSubmit={handleSubmit(onSubmit)} className="sm:px-24 lg:px-40">
          {step === 1 && (
            <section className="flex flex-col gap-2 p-2">
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
              <span className="text-xs text-error pl-1">
                {errors.serviceCategory?.message}
              </span>
              <Controller
                name="service"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={
                      value
                        ? services &&
                          services.find((service) => service.value === value)
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
                    placeholder="Service"
                    onChange={(val) => onChange(val?.value)}
                    options={services}
                    isLoading={!services && !!watch("serviceCategory")}
                    isDisabled={!watch("serviceCategory")}
                  />
                )}
              />
              <span className="text-xs text-error pl-1">
                {errors.service?.message}
              </span>
              <button
                type="button"
                className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 my-8"
                onClick={async () => {
                  if (
                    await trigger(["serviceCategory", "service"], {
                      shouldFocus: true,
                    })
                  ) {
                    setStep(2);
                  }
                }}
              >
                Next
              </button>
            </section>
          )}
          {step === 2 && (
            <section className="p-2">
              <div className="flex flex-col gap-3">
                {dentistData &&
                  dentistData.map((dentist) => {
                    return (
                      <DentistComponent
                        dentist={dentist}
                        register={register}
                        selectedId={selectedDentistId}
                        key={dentist._id}
                        setSelectedDentistId={setSelectedDentistId}
                        schedule="(Mon, Tue, Wed)"
                      />
                    );
                  })}
                <span className="text-xs text-error pl-1">
                  {errors.dentist?.message}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                  onClick={() => setStep(1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                  onClick={async () => {
                    if (await trigger("dentist")) {
                      setStep(3);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className="flex flex-col p-2">
              <div className="flex flex-col justify-center">
                <div className="flex flex-col gap-2 text-red-500">
                  <Controller
                    control={control}
                    name="date"
                    render={({ field: { onChange, value, ...field } }) => (
                      <DatePicker
                        {...field}
                        label="Date"
                        onChange={onChange}
                        className="bg-white rounded-md"
                        value={watch("date")}
                      />
                    )}
                  />
                  <span className="text-xs text-error pl-1">
                    {errors.date?.message}
                  </span>
                </div>
                <div className="flex flex-col">
                  <Controller
                    control={control}
                    name="time"
                    render={({ field: { onChange, value, ...field } }) => (
                      <TimePicker
                        {...field}
                        label="Time"
                        onChange={onChange}
                        className="bg-white rounded-md"
                        value={watch("time")}
                      />
                    )}
                  />
                  <span className="text-xs text-error pl-1">
                    {errors.time?.message}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                  onClick={() => setStep(2)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                  onClick={async () => {
                    if (await trigger(["date", "time"])) {
                      setStep(4);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </section>
          )}
          {step === 4 && (
            <section className="flex flex-col p-2">
              <div className="flex flex-col gap-8">
                <h1 className="font-bold tracking-wide text-center md:text-lg">
                  Appointment Summary
                </h1>
                <div className="overflow-x-auto">
                  <table className="table w-full text-xs md:text-base">
                    <tbody>
                      <tr>
                        <th>Dentist: </th>
                        <td className="flex flex-col">
                          <div className="flex items-center gap-4">
                            <FaTooth />
                            <span>Dr. {getDentistName()}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Service: </th>
                        <td className="flex flex-col">
                          <div className="flex items-center gap-4">
                            <RiServiceFill />
                            <span>{getService()}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Schedule: </th>
                        <td className="flex flex-col">
                          <div className="flex items-center gap-4">
                            <IoCalendar />
                            <span>
                              {dayjs(watch("date")).format("MMMM/DD/YY")}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <BsFillClockFill />
                            <span>{dayjs(watch("time")).format("h:mm A")}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                  onClick={() => setStep(3)}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 mt-8 mb-4"
                  // disabled={isLoading}
                >
                  {/* {isLoading ? (
                    <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                  ) : (
                    "Sign Up"
                  )} */}
                  Book
                </button>
              </div>
            </section>
          )}
        </form>
      </div>
    </main>
  );
};
export default SetAppointment;
