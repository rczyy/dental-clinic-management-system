import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { FiClock, FiEdit2, FiMoreVertical, FiTrash } from "react-icons/fi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEditAttendance, useRemoveAttendance } from "../../hooks/attendance";
import { Dispatch, SetStateAction, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import FormInput from "../Form/FormInput";

type Props = {
  attendance: AttendanceResponse;
  showAllDetails: Boolean;
};
type EditAttendanceProps = {
  attendance: AttendanceResponse;
  setIsEditModalVisible: Dispatch<SetStateAction<boolean>>;
};
type DeleteAttendanceProps = {
  attendance: AttendanceResponse;
  setIsDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
};
const AttendanceDataRow = ({ attendance, showAllDetails }: Props) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  return (
    <>
      <tr className="[&>*]:bg-transparent border-y transition tracking-tight">
        {showAllDetails && (
          <>
            <th className="!bg-base-300">
              <div className="flex dropdown dropdown-right">
                <label
                  tabIndex={0}
                  className="w-8 h-8 p-2 mx-auto rounded-full cursor-pointer transition hover:bg-base-100"
                >
                  <FiMoreVertical />
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
            <td className="!bg-base-300 pr-0">
              <figure className="w-12 h-12 ml-auto rounded-full overflow-hidden">
                <img
                  className="h-full object-cover"
                  src={attendance.staff.user.avatar}
                />
              </figure>
            </td>
            <td className="font-medium text-sm text-center">
              {attendance.staff.user.name.firstName}{" "}
              {attendance.staff.user.name.lastName}
            </td>
          </>
        )}
        <td className="font-medium text-sm text-center">
          {dayjs(attendance.date).format("MMMM D, YYYY")}
        </td>
        <td className="font-medium text-sm text-center">
          {dayjs(attendance.timeIn).format("h:mm:ss A")}
        </td>
        <td className="font-medium text-sm text-center">
          {attendance.timeOut &&
            `${dayjs(attendance.timeOut).format("h:mm:ss A")}`}
        </td>
      </tr>
      {isEditModalVisible && (
        <EditAttendanceModal
          attendance={attendance}
          setIsEditModalVisible={setIsEditModalVisible}
        />
      )}
      {isDeleteModalVisible && (
        <RemoveAttendanceModal
          attendance={attendance}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      )}
    </>
  );
};

const EditAttendanceModal = ({
  attendance,
  setIsEditModalVisible,
}: EditAttendanceProps) => {
  const schema = z.object({
    timeIn: z.string({ required_error: "Date and Time is required" }),
    timeOut: z.string({ required_error: "Date and Time is required" }),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormValues>({
    defaultValues: {
      timeIn: dayjs(attendance.timeIn).format("h:mm:ss A"),
      timeOut: dayjs(attendance.timeOut).format("h:mm:ss A"),
    },
    resolver: zodResolver(schema),
  });
  const { mutate: editAttendance, error: editAttendanceError } =
    useEditAttendance();

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    editAttendance(
      { data: data, id: attendance._id },
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
          <h1 className="text-2xl font-bold mx-2 py-3">
            Edit Attendance of {attendance.staff.user.name.firstName}{" "}
            {attendance.staff.user.name.lastName}
          </h1>
          <GrFormClose
            className="hover: cursor-pointer w-10 h-5"
            onClick={() => setIsEditModalVisible(false)}
          />
        </header>
        <form
          className="flex flex-col px-2 py-4 md:py-8 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <FormInput
              type="text"
              label="timeIn"
              placeholder="Time In"
              register={register}
              value={watch("timeIn")}
              error={errors.timeIn?.message}
              Logo={FiClock}
            />
            <FormInput
              type="text"
              label="timeOut"
              placeholder="Time Out"
              register={register}
              value={watch("timeOut")}
              error={errors.timeOut?.message}
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
              {editAttendanceError && editAttendanceError.response.data.message}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

const RemoveAttendanceModal = ({
  attendance,
  setIsDeleteModalVisible,
}: DeleteAttendanceProps) => {
  const { mutate: removeAttendance, error: removeAttendanceError } =
    useRemoveAttendance(attendance._id);
  const handleDelete = () => {
    removeAttendance(attendance._id, {
      onSuccess: () => setIsDeleteModalVisible(false),
    });
  };
  return (
    <div
      className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsDeleteModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center mx-2 py-3">
          <h1 className="text-2xl font-bold">Delete Attendance Record</h1>
          <GrFormClose
            className="hover: cursor-pointer w-5 h-5"
            onClick={() => setIsDeleteModalVisible(false)}
          />
        </header>
        <div className="flex flex-col mx-2 py-3">
          <p>You are about to permanently delete an attendance record.</p>
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
          {removeAttendanceError && removeAttendanceError.response.data.message}
        </p>
      </section>
    </div>
  );
};
export default AttendanceDataRow;
