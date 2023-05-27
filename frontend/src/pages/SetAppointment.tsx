import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useGetServices } from "../hooks/service";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useGetDentistNames } from "../hooks/dentist";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsFillClockFill } from "react-icons/bs";
import { RiServiceFill } from "react-icons/ri";
import { FaTooth } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { useGetMe } from "../hooks/user";
import { getMe } from "../axios/user";
import { QueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAddAppointment } from "../hooks/appointment";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";
import DentistComponent from "../components/Appointment/DentistComponent";
import dayjs, { Dayjs } from "dayjs";
import {
  useLazyGetDentistAppointmentsQuery,
  useLazyGetPatientAppointmentsQuery,
} from "../redux/api/appointment";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({
    queryKey: ["me"],
    queryFn: getMe,
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
  date: z.instanceof(dayjs as unknown as typeof Dayjs, {
    message: "Date is required",
  }),
  time: z
    .string({ required_error: "Time is required" })
    .min(1, { message: "Time is required" }),
});

const SetAppointment = (props: Props) => {
  const navigate = useNavigate();
  const { data: userData } = useGetMe();
  const { data: servicesData } = useGetServices();
  const { data: dentistData } = useGetDentistNames();
  const [getDentistAppointments, { data: dentistAppointments }] =
    useLazyGetDentistAppointmentsQuery();
  const [getPatientAppointments, { data: patientAppointments }] =
    useLazyGetPatientAppointmentsQuery();

  const { mutate, isLoading: addAppointmentLoading } = useAddAppointment();
  const [timeOptions, setTimeOptions] = useState([
    { value: "8:00 AM", label: "8:00 AM", isDisabled: false },
    { value: "8:30 AM", label: "8:30 AM", isDisabled: false },
    { value: "9:00 AM", label: "9:00 AM", isDisabled: false },
    { value: "9:30 AM", label: "9:30 AM", isDisabled: false },
    { value: "10:00 AM", label: "10:00 AM", isDisabled: false },
    { value: "10:30 AM", label: "10:30 AM", isDisabled: false },
    { value: "11:00 AM", label: "11:00 AM", isDisabled: false },
    { value: "11:30 AM", label: "11:30 AM", isDisabled: false },
    { value: "12:00 PM", label: "12:00 PM", isDisabled: false },
    { value: "12:30 PM", label: "12:30 PM", isDisabled: false },
    { value: "1:00 PM", label: "1:00 PM", isDisabled: false },
    { value: "1:30 PM", label: "1:30 PM", isDisabled: false },
    { value: "2:00 PM", label: "2:00 PM", isDisabled: false },
    { value: "2:30 PM", label: "2:30 PM", isDisabled: false },
    { value: "3:00 PM", label: "3:00 PM", isDisabled: false },
    { value: "3:30 PM", label: "3:30 PM", isDisabled: false },
    { value: "4:00 PM", label: "4:00 PM", isDisabled: false },
    { value: "4:30 PM", label: "4:30 PM", isDisabled: false },
    { value: "5:00 PM", label: "5:00 PM", isDisabled: false },
  ]);
  const [services, setServices] = useState<SelectOption[]>();
  const [selectedDentist, setSelectedDentist] = useState("");
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
      date: "",
      time: "",
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

  const handleDisableSchedule = () => {
    if (!watch("date")) return;

    if (watch("dentist")) {
      getDentistAppointments({
        id: selectedDentist,
        date: dayjs(watch("date")).format("YYYY-MM-DD"),
      });
    }

    if (userData) {
      getPatientAppointments({
        id: userData._id!,
        date: dayjs(watch("date")).format("YYYY-MM-DD"),
      });
    }
  };

  useEffect(() => {
    const unavailableSchedules: string[] = [];
    const service =
      servicesData &&
      servicesData.find((service) => service.name === watch("service"));
    if (service) {
      if (dentistAppointments) {
        dentistAppointments.forEach((appointment: AppointmentResponse) => {
          let serviceToAddTime = parseInt(service?.estimatedTime);
          let serviceTime = parseInt(appointment.service.estimatedTime);
          let startTime = dayjs(appointment.dateTimeScheduled);
          let startTime2 = dayjs(appointment.dateTimeScheduled);

          while (serviceToAddTime > 30) {
            unavailableSchedules.push(
              startTime.subtract(30, "minute").format("h:mm A")
            );

            serviceToAddTime -= 30;
            startTime = startTime.subtract(30, "minute");
          }

          while (serviceTime >= 30) {
            unavailableSchedules.push(startTime2.format("h:mm A"));

            serviceTime -= 30;
            startTime2 = startTime2.add(30, "minute");
          }
        });
      }

      if (patientAppointments) {
        patientAppointments.forEach((appointment: AppointmentResponse) => {
          let serviceToAddTime = parseInt(service?.estimatedTime);
          let serviceTime = parseInt(appointment.service.estimatedTime);
          let startTime = dayjs(appointment.dateTimeScheduled);
          let startTime2 = dayjs(appointment.dateTimeScheduled);

          while (serviceToAddTime > 30) {
            unavailableSchedules.push(
              startTime.subtract(30, "minute").format("h:mm A")
            );

            serviceToAddTime -= 30;
            startTime = startTime.subtract(30, "minute");
          }

          while (serviceTime >= 30) {
            unavailableSchedules.push(startTime2.format("h:mm A"));

            serviceTime -= 30;
            startTime2 = startTime2.add(30, "minute");
          }
        });
      }

      let uniqueUnavailableSchedules = unavailableSchedules.filter(
        (c, index) => unavailableSchedules.indexOf(c) === index
      );

      setTimeOptions(
        timeOptions.map((option) => {
          return uniqueUnavailableSchedules.includes(option.value)
            ? { ...option, isDisabled: true }
            : { ...option, isDisabled: false };
        })
      );
    }
  }, [dentistAppointments, patientAppointments, watch("service")]);

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

    return;
  };

  const getService = () => {
    if (servicesData) {
      const service = servicesData.find(
        (service) => service.name === watch("service")
      );
      return `${service?.category} - ${service?.name}`;
    }

    return;
  };

  const onSubmit: SubmitHandler<AppointmentZodFormValues> = (data) => {
    const { date, time, dentist, service } = data;
    const dateTimeCombined = dayjs(`${dayjs(date).format("MM/DD/YY")} ${time}`);
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
      dentist: dentist,
      service: serviceId || "",
      dateTimeScheduled,
      dateTimeFinished,
    };

    mutate(appointmentData, {
      onSuccess: () => {
        navigate("success");
      },
    });
  };

  if (!userData || (userData && !userData.contactNo))
    return <Navigate to="/" />;

  return (
    <main className="flex items-center justify-center">
      <div className="flex flex-col gap-8 bg-base-300 max-w-screen-lg w-full min-h-[40rem] rounded-box border border-base-200 shadow">
        <header className="flex justify-center border-b border-neutral shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold mx-2 py-6">
            Book an appointment
          </h1>
        </header>
        <section className="flex flex-col md:flex-row md:gap-8 md:justify-around md:px-24 md:pb-12">
          <div className="flex justify-center mb-6">
            <ul className="steps steps-horizontal md:flex md:flex-col md:steps-vertical text-xs md:text-sm p-2 ">
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
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-2 md:w-2/3">
            {step === 1 && (
              <section className="flex flex-col gap-8">
                <h1 className="font-bold tracking-wide text-center md:text-lg">
                  Service
                </h1>
                <div className="flex flex-col gap-2 p-2">
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
                        placeholder="Category"
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
                              services.find(
                                (service) => service.value === value
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
                        placeholder="Service"
                        onChange={(val) => {
                          onChange(val?.value);
                        }}
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
                </div>
              </section>
            )}
            {step === 2 && (
              <section className="flex flex-col gap-8">
                <h1 className="font-bold tracking-wide text-center md:text-lg">
                  Dentist
                </h1>
                <div className="flex flex-col gap-2 p-2">
                  {dentistData &&
                    dentistData.map((dentist) => {
                      return (
                        <DentistComponent
                          dentist={dentist}
                          register={register}
                          selectedId={selectedDentist}
                          key={dentist._id}
                          setSelectedDentist={setSelectedDentist}
                          schedule="(Mon, Tue, Wed)"
                          handleDisableSchedule={handleDisableSchedule}
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
              <section className="flex flex-col gap-8">
                <h1 className="font-bold tracking-wide text-center md:text-lg">
                  Available Schedule
                </h1>
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex flex-col gap-2">
                    <Controller
                      control={control}
                      name="date"
                      render={({ field: { onChange, value, ...field } }) => (
                        <DatePicker
                          {...field}
                          label="Date"
                          className="bg-white rounded-md"
                          onChange={(date) => {
                            if (date) onChange(dayjs(date.toString()));
                            handleDisableSchedule();
                            reset(
                              (formValues) => ({
                                ...formValues,
                                time: "",
                              }),
                              { keepErrors: true }
                            );
                          }}
                          value={value}
                        />
                      )}
                    />
                    <span className="text-xs text-error pl-1">
                      {errors.date?.message}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <Controller
                      name="time"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Select
                          {...field}
                          value={
                            value
                              ? timeOptions &&
                                timeOptions.find((time) => time.value === value)
                              : null
                          }
                          classNames={{
                            control: () => "pl-1.5 py-[1px] !bg-base-300",
                            placeholder: () => "!text-zinc-400 !text-sm",
                            singleValue: () => "!text-base-content !text-sm",
                            input: () => "!text-base-content",
                            option: ({ isSelected, isFocused }) =>
                              "!text-sm " +
                              (isSelected
                                ? "!bg-primary !text-zinc-100 "
                                : "") +
                              (isFocused && !isSelected ? "!bg-neutral" : ""),
                            menu: () => "!bg-base-300",
                            dropdownIndicator: ({ hasValue }) =>
                              hasValue ? "!text-primary" : "",
                            indicatorSeparator: ({ hasValue }) =>
                              hasValue ? "!bg-primary" : "",
                          }}
                          placeholder="Time"
                          onChange={(val) => onChange(val?.value)}
                          options={timeOptions}
                          isLoading={!serviceCategories}
                          isOptionDisabled={(option) =>
                            option ? option.isDisabled : false
                          }
                          isDisabled={!watch("date")}
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
              <section className="flex flex-col gap-8">
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
                              <span>{watch("time")}</span>
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
                    disabled={addAppointmentLoading}
                  >
                    {addAppointmentLoading ? (
                      <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                    ) : (
                      "Book"
                    )}
                  </button>
                </div>
              </section>
            )}
          </form>
        </section>
      </div>
    </main>
  );
};
export default SetAppointment;
