import dayjs from "dayjs";
import { useState } from "react";
import { FiEdit2, FiEye, FiMoreVertical, FiX } from "react-icons/fi";

type Props = {
  bill: BillResponse;
};

type ViewBillProps = Props & {
  setIsViewModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BillDataRow = ({ bill }: Props): JSX.Element => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  return (
    <tr className="[&>*]:bg-transparent">
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
            <li onClick={() => setIsEditModalVisible(true)}>
              <a>
                <FiEdit2 />
              </a>
            </li>
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

      <td className="font-semibold text-xl text-center text-green-600">
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
    </tr>
  );
};

const ViewBillModal = ({
  bill,
  setIsViewModalVisible,
}: ViewBillProps): JSX.Element => {
  return (
    <td
      className="fixed flex items-center justify-center inset-0 !bg-black z-50 !bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsViewModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-2 bg-base-300 max-w-xl w-full rounded-2xl shadow-md px-8 py-10">
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

            <tr>
              <th className="font-bold">Notes</th>

              <td>{bill.notes || "-"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </td>
  );
};
