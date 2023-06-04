import { FiClock, FiEdit2, FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import {
  AiOutlineLoading3Quarters,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { convertToTotalHoursAndMinutes } from "../../utilites/convertToTotalHoursAndMinutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  useDeleteService,
  useEditService,
  useRecoverService,
} from "../../hooks/service";
import FormInput from "../Form/FormInput";
import SelectDropdown from "../Form/SelectDropdown";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useGetMe } from "../../hooks/user";
import { IoArrowUndoOutline } from "react-icons/io5";

type Props = {
  service: ServiceResponse;
};
type EditServiceProps = {
  service: ServiceResponse;
  setIsEditModalVisible: Dispatch<SetStateAction<boolean>>;
};
type DeleteServiceProps = {
  service: ServiceResponse;
  setIsDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
};
type RecoverServiceProps = {
  service: ServiceResponse;
  setIsRecoverModalVisible: React.Dispatch<SetStateAction<boolean>>;
};

const ServiceDataRow = ({ service }: Props) => {
  const { data: me } = useGetMe();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRecoverModalVisible, setIsRecoverModalVisible] = useState(false);

  return (
    <tr
      className={`${
        service.isDeleted ? "[&>*]:bg-red-300/75" : "[&>*]:bg-transparent"
      } transition tracking-tight`}
    >
      <th className="w-10 p-1.5">
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
            {!service.isDeleted ? (
              <>
                <li onClick={() => setIsEditModalVisible(true)}>
                  <a>
                    <FiEdit2 />
                  </a>
                </li>
                <li onClick={() => setIsDeleteModalVisible(true)}>
                  <a>
                    <FiTrash />
                  </a>
                </li>
              </>
            ) : (
              me &&
              (me.role === "Admin" || me.role === "Manager") && (
                <li onClick={() => setIsRecoverModalVisible(true)}>
                  <a>
                    <IoArrowUndoOutline />
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </th>

      <td className="font-medium text-sm">
        <div className="flex flex-col items-center">
          <span>{`${service.name}`}</span>
        </div>
      </td>

      <td className="font-medium text-sm text-center">{service.category}</td>

      <td className="font-medium text-sm text-center">
        {convertToTotalHoursAndMinutes(Number(service.estimatedTime))}
      </td>

      {isEditModalVisible && (
        <EditServiceModal
          service={service}
          setIsEditModalVisible={setIsEditModalVisible}
        />
      )}

      {isDeleteModalVisible && (
        <DeleteServiceModal
          service={service}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      )}

      {isRecoverModalVisible && (
        <RecoverServiceModal
          service={service}
          setIsRecoverModalVisible={setIsRecoverModalVisible}
        />
      )}
    </tr>
  );
};

const EditServiceModal = ({
  service,
  setIsEditModalVisible,
}: EditServiceProps) => {
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
      .min(1, "Estimated time is required")
      .regex(/^[0-9]*$/, "Estimated time may only contain numbers"),
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
      name: service.name,
      category: service.category,
      estimatedTime: service.estimatedTime,
    },
    resolver: zodResolver(schema),
  });
  const { mutate: editService } = useEditService();

  const onSubmit: SubmitHandler<ServiceFormValues> = (data) => {
    editService(
      { data: data, id: service._id },
      {
        onSuccess: () => {
          toast.success("Successfully updated the service");
          setIsEditModalVisible(false);
          reset();
        },
        onError: (err) =>
          toast.error(
            "message" in err.response.data
              ? err.response.data.message
              : err.response.data.formErrors
          ),
      }
    );
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-30 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsEditModalVisible(false);
      }}
    >
      <section className="bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mx-2 py-3">Edit service</h1>
          <GrFormClose
            className="hover: cursor-pointer w-10 h-5"
            onClick={() => setIsEditModalVisible(false)}
          />
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
              Edit Service
            </button>
          </div>
        </form>
      </section>
    </td>
  );
};

const DeleteServiceModal = ({
  service,
  setIsDeleteModalVisible,
}: DeleteServiceProps) => {
  const { mutate: deleteService } = useDeleteService(service._id);
  const handleDelete = () => {
    deleteService(service._id, {
      onSuccess: () => {
        toast.success("Successfully deleted the service");
        setIsDeleteModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-30 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Delete service</h1>
          <GrFormClose
            className="hover: cursor-pointer w-5 h-5"
            onClick={() => setIsDeleteModalVisible(false)}
          />
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to permanently delete a service.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              handleDelete();
            }}
          >
            Yes
          </button>
        </div>
      </section>
    </td>
  );
};

const RecoverServiceModal = ({
  service,
  setIsRecoverModalVisible,
}: RecoverServiceProps) => {
  const { mutate: recoverService, isLoading } = useRecoverService();
  const handleRecover = () => {
    recoverService(service._id, {
      onSuccess: () => {
        toast.success("Successfully recovered the service");
        setIsRecoverModalVisible(false);
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  };
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-30 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsRecoverModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-md w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Recover Service</h1>
          <div>
            <FiX
              className="w-6 h-6 p-1 text-base-content rounded-full cursor-pointer transition hover:bg-base-200"
              onClick={() => setIsRecoverModalVisible(false)}
            />
          </div>
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to recover a service.</p>
          <p>Are you sure?</p>
        </div>
        <div className="flex gap-3 justify-end mx-2 py-3">
          <button
            className="btn px-8"
            onClick={() => setIsRecoverModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn bg-green-600 gap-4 px-8 text-white hover:bg-green-700"
            onClick={() => {
              handleRecover();
            }}
          >
            Yes{" "}
            {isLoading && (
              <AiOutlineLoading3Quarters className="text-lg animate-spin" />
            )}
          </button>
        </div>
      </section>
    </td>
  );
};

export default ServiceDataRow;
