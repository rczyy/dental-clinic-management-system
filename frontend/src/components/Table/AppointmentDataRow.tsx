import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";
import { useRemoveAppointment } from "../../hooks/appointment";
import { toast } from "react-toastify";
import { AiOutlineCheck, AiOutlineLoading3Quarters } from "react-icons/ai";
import FormInput from "../Form/FormInput";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddBill } from "../../hooks/bill";
import { useAddPatientFile } from "../../hooks/patientFile";

interface Props {
  appointment: AppointmentResponse;
  showAllDetails?: boolean;
}

interface CancelAppointmentModalProps extends Props {
  setIsCancelModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BillAppointmentModalProps extends Props {
  setIsBillModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppointmentDataRow = ({ appointment, showAllDetails }: Props): JSX.Element => {
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);

  const { data: me } = useGetMe();

  return (
    <tr
      className={`${
        appointment.isFinished
          ? "[&>*]:bg-green-300/50 [&>*]:border-green-200/50"
          : dayjs(appointment.dateTimeFinished).isBefore(dayjs())
          ? "[&>*]:bg-yellow-300/50"
          : "[&>*]:bg-transparent"
      }`}
    >
      <td className="w-10 p-1.5">
        <div className="flex dropdown dropdown-right">
          <label
            tabIndex={0}
            className="w-full h-full mx-auto rounded-full cursor-pointer transition hover:bg-base-100"
          >
            <FiMoreVertical className="w-full h-full p-1" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu flex-row flex-nowrap p-1 bg-base-100 text-sm border border-neutral rounded-lg shadow-lg translate-x-2 -translate-y-1/4"
          >
            <li onClick={() => setIsBillModalVisible(true)}>
              <a>
                <AiOutlineCheck />
              </a>
            </li>

            {!dayjs(appointment.dateTimeFinished).isBefore(dayjs()) && (
              <li onClick={() => setIsCancelModalVisible(true)}>
                <a>
                  <FiTrash />
                </a>
              </li>
            )}
          </ul>
        </div>
      </td>

      <td className="font-semibold text-sm text-center">
        {dayjs(appointment.dateTimeScheduled).format("YYYY-MM-DD")}
      </td>

      <td>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium">
            {dayjs(appointment.dateTimeScheduled).format("h:mm A")}
          </span>
          <span className="text-xs text-zinc-400">
            {dayjs(appointment.dateTimeFinished).format("h:mm A")}
          </span>
        </div>
      </td>

      {me && (me.role === "Patient" || showAllDetails) && (
        <>
          <td className="pr-0">
            <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
              <img className="h-full object-cover" src={appointment.dentist.staff.user.avatar} />
            </figure>
          </td>

          <td className="font-semibold text-sm text-center">
            <span>
              {appointment.dentist.staff.user.name.firstName}{" "}
              {appointment.dentist.staff.user.name.lastName}
            </span>
          </td>
        </>
      )}

      {me && (me.role === "Dentist" || showAllDetails) && (
        <>
          <td className="pr-0">
            <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
              <img className="h-full object-cover" src={appointment.patient.user.avatar} />
            </figure>
          </td>

          <td className="font-semibold text-sm text-center">
            <span>
              {appointment.patient.user.name.firstName} {appointment.patient.user.name.lastName}
            </span>
          </td>
        </>
      )}

      <td className="font-medium text-sm text-center">{appointment.service.name}</td>

      {isCancelModalVisible && (
        <CancelAppointmentModal
          appointment={appointment}
          setIsCancelModalVisible={setIsCancelModalVisible}
        />
      )}

      {isBillModalVisible && (
        <BillAppointmentModal
          appointment={appointment}
          setIsBillModalVisible={setIsBillModalVisible}
        />
      )}
    </tr>
  );
};

const CancelAppointmentModal = ({
  appointment,
  setIsCancelModalVisible,
}: CancelAppointmentModalProps) => {
  const { mutate: removeAppointment, isLoading: removeAppointmentLoading } = useRemoveAppointment();

  const handleDelete = () => {
    removeAppointment(appointment._id, {
      onSuccess: () => {
        toast.success("Successfully canceled the appointment!");
        setIsCancelModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  };

  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsCancelModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Cancel Appointment</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsCancelModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to cancel this appointment.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button className="btn px-8" onClick={() => setIsCancelModalVisible(false)}>
            No
          </button>
          <button className="btn btn-error px-8 text-white hover:bg-red-700" onClick={handleDelete}>
            Yes{" "}
            {removeAppointmentLoading && (
              <AiOutlineLoading3Quarters className="w-4 h-4 ml-2 animate-spin" />
            )}
          </button>
        </div>
      </section>
    </td>
  );
};

const BillAppointmentModal = ({
  appointment,
  setIsBillModalVisible,
}: BillAppointmentModalProps) => {
  const schema = z.object({
    appointment: z.string({ required_error: "Appointment is required" }),
    notes: z.string({ required_error: "Notes is required" }),
    price: z.coerce
      .number({ required_error: "Price is required" })
      .positive("Price must be a positive number")
      .finite("Infinite price are not allowed"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BillFormValues>({
    defaultValues: {
      appointment: appointment._id,
      notes: "",
      price: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutateAsync: addBill, isLoading: addBillLoading } = useAddBill();
  const { mutateAsync: addPatientFile, isLoading: addPatientFileLoading } = useAddPatientFile();

  const [textAreaVisible, setTextAreaVisible] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [files, setFiles] = useState<FileList>();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit: SubmitHandler<BillFormValues> = async (data) => {
    const bill = await addBill(
      { ...data, price: (+data.price * 0.8).toString() },
      {
        onError: (err) => {
          toast.error(
            "message" in err.response.data
              ? err.response.data.message
              : err.response.data.fieldErrors[0]
          );
        },
      }
    );

    const formData = new FormData();

    formData.append("bill", bill._id);

    if (files) {
      for (const file of files) {
        formData.append("file", file);
      }
    }

    await addPatientFile(
      { userId: appointment.patient.user._id, formData },
      {
        onError: (err) => {
          toast.error(
            "message" in err.response.data
              ? err.response.data.message
              : err.response.data.fieldErrors[0]
          );
        },
      }
    );

    toast.success("Successfully billed the appointment");
    setIsBillModalVisible(false);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";

      if (textAreaRef.current.scrollHeight >= 128) {
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      } else {
        textAreaRef.current.style.height = `128px`;
      }
    }
  }, [textAreaVisible, textAreaRef.current, textAreaRef.current?.value]);

  return (
    <td
      className="fixed flex items-center justify-center inset-0 z-50 !bg-black !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsBillModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-xl max-h-[40rem] w-full rounded-2xl shadow-md px-8 py-10 overflow-y-auto">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-xl sm:text-2xl font-bold">Bill Appointment</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsBillModalVisible(false)}
            />
          </div>
        </header>
        <form className="flex flex-col mx-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <textarea
              {...register("notes")}
              className={`bg-base-300 p-4 outline outline-1 outline-neutral rounded-md resize-none placeholder:text-sm ${
                watch("notes") && "outline-primary"
              }`}
              placeholder="Notes (Optional)"
              ref={(el) => {
                textAreaRef.current = el;
                register("notes").ref(el);
                setTextAreaVisible(!!el);
              }}
            />

            <FormInput
              type="number"
              label="price"
              placeholder="Price"
              value={watch("price")}
              register={register}
              error={errors.price && errors.price.message}
            />
            <p className={isDiscounted ? "" : "invisible"}>
              Discounted Price: ₱{+watch("price") * 0.8}
            </p>
          </div>

          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs outline-none"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setFiles(e.target.files);
              }
            }}
          />

          <div className="flex justify-between mr-2 py-3">
            <label className="label gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm checked:bg-base-300"
                onChange={(e) => setIsDiscounted(e.target.checked)}
              />
              <span className="label-text">PWD/Senior Discount</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn px-8"
                onClick={() => setIsBillModalVisible(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-8 text-white">
                Bill{" "}
                {(addBillLoading || addPatientFileLoading) && (
                  <AiOutlineLoading3Quarters className="w-4 h-4 ml-2 animate-spin" />
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </td>
  );
};
