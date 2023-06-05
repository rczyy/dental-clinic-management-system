import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2, FiEye, FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";
import { useEditBill, useRemoveBill } from "../../hooks/bill";
import FormInput from "../Form/FormInput";
import { useGetMe } from "../../hooks/user";

type Props = {
  bill: BillResponse;
};

type ViewBillProps = Props & {
  setIsViewModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

type EditBillProps = Props & {
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

type RemoveBillProps = Props & {
  setIsRemoveModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BillDataRow = ({ bill }: Props): JSX.Element => {
  const { data: me } = useGetMe();

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

  return (
    <tr
      className={`${
        bill.isDeleted ? "[&>*]:bg-red-300/75" : "[&>*]:bg-transparent"
      } transition tracking-tight`}
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
            <li onClick={() => setIsViewModalVisible(true)}>
              <a>
                <FiEye />
              </a>
            </li>

            {!bill.isDeleted && (
              <>
                <li onClick={() => setIsEditModalVisible(true)}>
                  <a>
                    <FiEdit2 />
                  </a>
                </li>

                {me && (me.role === "Admin" || me.role === "Manager") && (
                  <li onClick={() => setIsRemoveModalVisible(true)}>
                    <a>
                      <FiTrash />
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </td>

      <td className="text-sm text-center">
        <div>
          <p className="font-semibold">
            {dayjs(bill.createdAt).format("YYYY-MM-DD")}
          </p>
          <p className="text-zinc-400">
            {dayjs(bill.createdAt).format("h:mm A")}
          </p>
        </div>
      </td>

      <td className="font-bold text-lg text-center text-green-600">
        ₱ {Intl.NumberFormat("en-US").format(bill.price)}
      </td>

      <td className="font-semibold text-sm text-center">
        {bill.appointment.service.name}
      </td>

      <td className="pr-0">
        <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
          <img
            className="h-full object-cover"
            src={bill.appointment.dentist.staff.user.avatar}
          />
        </figure>
      </td>

      <td className="font-semibold text-sm text-center">
        <span>
          {bill.appointment.dentist.staff.user.name.firstName}{" "}
          {bill.appointment.dentist.staff.user.name.lastName}
        </span>
      </td>

      <td className="pr-0">
        <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
          <img
            className="h-full object-cover"
            src={bill.appointment.patient.user.avatar}
          />
        </figure>
      </td>

      <td className="font-semibold text-sm text-center">
        <span>
          {bill.appointment.patient.user.name.firstName}{" "}
          {bill.appointment.patient.user.name.lastName}
        </span>
      </td>

      {isViewModalVisible && (
        <ViewBillModal
          bill={bill}
          setIsViewModalVisible={setIsViewModalVisible}
        />
      )}

      {isEditModalVisible && (
        <EditBillModal
          bill={bill}
          setIsEditModalVisible={setIsEditModalVisible}
        />
      )}

      {isRemoveModalVisible && (
        <RemoveBillModal
          bill={bill}
          setIsRemoveModalVisible={setIsRemoveModalVisible}
        />
      )}
    </tr>
  );
};

const ViewBillModal = ({
  bill,
  setIsViewModalVisible,
}: ViewBillProps): JSX.Element => {
  const [textAreaVisible, setTextAreaVisible] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";

      if (textAreaRef.current.scrollHeight >= 128) {
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      } else {
        textAreaRef.current.style.height = `128px`;
      }
    }
  }, [textAreaVisible, textAreaRef]);

  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsViewModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-xl max-h-[40rem] w-full rounded-2xl shadow-md px-8 py-10 overflow-y-auto">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Bill details</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsViewModalVisible(false)}
            />
          </div>
        </header>

        <table className="table mx-2">
          <tbody>
            <tr>
              <th className="font-bold">Dentist</th>

              <td className="flex items-center gap-4">
                <figure className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={bill.appointment.dentist.staff.user.avatar}
                    alt="Dentist Avatar"
                  />
                </figure>
                <p className="font-semibold">
                  {bill.appointment.dentist.staff.user.name.firstName}{" "}
                  {bill.appointment.dentist.staff.user.name.lastName}
                </p>
              </td>
            </tr>

            <tr>
              <th className="font-bold">Patient</th>

              <td className="flex items-center gap-4">
                <figure className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={bill.appointment.patient.user.avatar}
                    alt="Dentist Avatar"
                  />
                </figure>
                <p className="font-semibold">
                  {bill.appointment.patient.user.name.firstName}{" "}
                  {bill.appointment.patient.user.name.lastName}
                </p>
              </td>
            </tr>

            <tr>
              <th className="font-bold">Service</th>

              <td>
                <p className="font-semibold">
                  {bill.appointment.service.category}
                </p>
                <p className="text-sm">{bill.appointment.service.name}</p>
              </td>
            </tr>

            <tr>
              <th className="font-bold">Date/Time</th>

              <td>
                <p className="font-semibold">
                  {dayjs(bill.createdAt).format("MMM DD, YYYY")}
                </p>
                <p className="text-sm text-zinc-400">
                  {dayjs(bill.createdAt).format("h:mm A")}
                </p>
              </td>
            </tr>

            <tr>
              <th className="font-bold">Price</th>

              <td className="text-green-600 font-semibold">
                ₱ {Intl.NumberFormat("en-US").format(bill.price)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="p-4">
          <h3 className="font-bold mb-2">Notes</h3>
          <textarea
            ref={(el) => {
              textAreaRef.current = el;
              setTextAreaVisible(!!el);
            }}
            className="w-full px-3 py-2 rounded-md outline outline-1 outline-neutral text-sm resize-none"
            value={bill.notes}
            rows={1}
            readOnly
          />
        </div>
      </section>
    </td>
  );
};

const EditBillModal = ({ bill, setIsEditModalVisible }: EditBillProps) => {
  const schema = z.object({
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
    reset,
    formState: { errors },
  } = useForm<BillFormValues>({
    defaultValues: {
      notes: bill.notes || "",
      price: bill.price.toString(),
    },
    resolver: zodResolver(schema),
  });

  const { mutate: editBill, isLoading: editBillLoading } = useEditBill();
  const [textAreaVisible, setTextAreaVisible] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit: SubmitHandler<BillFormValues> = (data) => {
    editBill(
      { billId: bill._id, bill: data },
      {
        onSuccess: () => {
          reset();
          setIsEditModalVisible(false);
          toast.success("Successfully updated the bill");
        },
        onError: (err) => {
          toast.error(
            "message" in err.response.data
              ? err.response.data.message
              : err.response.data.fieldErrors[0]
          );
        },
      }
    );
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
        if (e.target === e.currentTarget) setIsEditModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-xl max-h-[40rem] w-full rounded-2xl shadow-md px-8 py-10 overflow-y-auto">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-xl sm:text-2xl font-bold">Edit Bill</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsEditModalVisible(false)}
            />
          </div>
        </header>
        <form
          className="flex flex-col mx-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            {...register("notes")}
            className={`p-4 outline outline-1 outline-neutral rounded-md resize-none placeholder:text-sm ${
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

          <div className="flex gap-3 justify-end mx-2 py-3">
            <button
              type="button"
              className="btn px-8"
              onClick={() => setIsEditModalVisible(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-8 text-white">
              Bill{" "}
              {editBillLoading && (
                <AiOutlineLoading3Quarters className="w-4 h-4 ml-2 animate-spin" />
              )}
            </button>
          </div>
        </form>
      </section>
    </td>
  );
};

const RemoveBillModal = ({
  bill,
  setIsRemoveModalVisible,
}: RemoveBillProps) => {
  const { mutate: removeBill } = useRemoveBill();

  const handleDelete = () => {
    removeBill(bill._id, {
      onSuccess: () => setIsRemoveModalVisible(false),
      onError: (err) =>
        toast.error(
          "message" in err.response.data
            ? err.response.data.message
            : err.response.data.fieldErrors[0]
        ),
    });
  };

  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-30 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsRemoveModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Remove Bill</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsRemoveModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to remove this bill.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsRemoveModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn btn-error px-8 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            Yes
          </button>
        </div>
      </section>
    </td>
  );
};
