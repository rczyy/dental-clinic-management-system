import dayjs from "dayjs";
import { useState } from "react";
import { FiMoreVertical, FiTrash, FiX } from "react-icons/fi";
import { useGetMe } from "../../hooks/user";

interface Props {
  appointment: AppointmentResponse;
  showAllDetails?: boolean;
}

interface CancelAppointmentModalProps extends Props {
  setIsCancelModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppointmentDataRow = ({
  appointment,
  showAllDetails,
}: Props): JSX.Element => {
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  const { data: me } = useGetMe();

  return (
    <>
      <tr className="[&>*]:bg-transparent">
        <th className="!bg-base-300 w-10 p-1.5">
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
              <li onClick={() => setIsCancelModalVisible(true)}>
                <a>
                  <FiTrash />
                </a>
              </li>
            </ul>
          </div>
        </th>

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
                <img
                  className="h-full object-cover"
                  src={appointment.dentist.staff.user.avatar}
                />
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
                <img
                  className="h-full object-cover"
                  src={appointment.dentist.staff.user.avatar}
                />
              </figure>
            </td>

            <td className="font-semibold text-sm text-center">
              <span>
                {appointment.patient.user.name.firstName}{" "}
                {appointment.patient.user.name.lastName}
              </span>
            </td>
          </>
        )}

        <td className="font-medium text-sm text-center">
          {appointment.service.name}
        </td>
      </tr>

      {isCancelModalVisible && (
        <CancelAppointmentModal
          appointment={appointment}
          setIsCancelModalVisible={setIsCancelModalVisible}
        />
      )}
    </>
  );
};

const CancelAppointmentModal = ({
  appointment,
  setIsCancelModalVisible,
}: CancelAppointmentModalProps) => {
  return (
    <div
      className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25"
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
          <button
            className="btn px-8"
            onClick={() => setIsCancelModalVisible(false)}
          >
            No
          </button>
          <button
            className="btn btn-error px-8 text-white hover:bg-red-700"
            onClick={() => {
              // handleDelete();
            }}
          >
            Yes
          </button>
        </div>
        {/* <p className="px-2 text-xs text-error text-center">
          {removePatientError && removePatientError.response.data.message}
        </p> */}
      </section>
    </div>
  );
};