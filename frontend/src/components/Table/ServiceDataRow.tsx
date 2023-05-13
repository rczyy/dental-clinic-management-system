import { FiClock, FiEdit2, FiMoreHorizontal, FiTrash } from "react-icons/fi";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { convertToTotalHoursAndMinutes } from "../../utilites/convertToTotalHoursAndMinutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDeleteService, useEditService } from "../../hooks/service";
import FormInput from "../Form/FormInput";
import SelectDropdown from "../Form/SelectDropdown";
import { Dispatch, SetStateAction, useState } from "react";

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
const ServiceDataRow = ({ service }: Props) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  return (
    <>
      <tr className="[&>*]:bg-transparent">
        <th className="!bg-base-300">
          <div className="flex dropdown dropdown-right">
            <label
              tabIndex={0}
              className="w-8 h-8 p-2 mx-auto rounded-full cursor-pointer transition hover:bg-base-100"
            >
              <FiMoreHorizontal />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu flex-row flex-nowrap p-1 bg-base-100 text-sm border border-neutral rounded-lg shadow-lg translate-x-2 -translate-y-1/4"
            >
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
            </ul>
          </div>
        </th>
        <td className="font-medium text-sm">
          <div className="flex flex-col">
            <span>{`${service.name}`}</span>
          </div>
        </td>
        <td className="font-medium text-sm">{service.category}</td>
        <td className="font-medium text-sm">
          {convertToTotalHoursAndMinutes(Number(service.estimatedTime))}
        </td>
      </tr>
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
    </>
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
      name: service.name,
      category: service.category,
      estimatedTime: service.estimatedTime,
    },
    resolver: zodResolver(schema),
  });
  const { mutate: editService, error: editServiceError } = useEditService();

  const onSubmit: SubmitHandler<ServiceFormValues> = (data) => {
    editService(
      { data: data, id: service._id },
      {
        onSuccess: () => {
          setIsEditModalVisible(false);
          reset();
        },
      }
    );
  };
  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25">
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
            <p className="px-2 text-xs text-error text-center">
              {editServiceError && editServiceError.response.data.message}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

const DeleteServiceModal = ({
  service,
  setIsDeleteModalVisible,
}: DeleteServiceProps) => {
  const { mutate: deleteService, error: deleteServiceError } = useDeleteService(
    service._id
  );
  const handleDelete = () => {
    deleteService(service._id, {
      onSuccess: () => setIsDeleteModalVisible(false),
    });
  };
  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25">
      <section className="flex flex-col gap-2 bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Delete service</h1>
          <GrFormClose
            className="hover: cursor-pointer w-5 h-5"
            onClick={() => setIsDeleteModalVisible(false)}
          />
        </header>
        <div className="flex flex-col items-center mx-2 py-3">
          <p>This will delete the service from the Service List</p>
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
        <p className="px-2 text-xs text-error text-center">
          {deleteServiceError && deleteServiceError.response.data.message}
        </p>
      </section>
    </div>
  );
};
export default ServiceDataRow;
