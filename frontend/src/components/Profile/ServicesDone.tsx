import dayjs from "dayjs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useGetMe } from "../../hooks/user";

interface Props {
  bills: BillResponse[] | undefined;
  billsLoading: boolean;
  isViewBillModalVisible: boolean;
  setIsViewBillModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBill: React.Dispatch<React.SetStateAction<BillResponse | undefined>>;
}

export const ServicesDone = ({
  bills,
  billsLoading,
  isViewBillModalVisible,
  setIsViewBillModalVisible,
  setSelectedBill,
}: Props): JSX.Element => {
  const { data: me } = useGetMe();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <MdOutlineMedicalServices className="text-primary" />
        <span className="font-semibold text-primary">Services Done</span>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {bills ? (
          bills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-1">
              {bills
                .sort((a, b) => (dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1))
                .map((bill) => (
                  <article
                    key={bill._id}
                    className="flex flex-col gap-8 p-4 border border-neutral rounded-lg cursor-pointer transition duration-200 hover:bg-base-100"
                    onClick={() => {
                      setIsViewBillModalVisible(!isViewBillModalVisible);
                      setSelectedBill(bill);
                    }}
                  >
                    <header className="flex justify-between items-center gap-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold break-all">
                          {bill.appointment.service.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          {dayjs(bill.appointment.dateTimeFinished).format("MMM DD, YYYY h:mm A")}
                        </p>
                      </div>

                      <div className="grid h-full">
                        {me && (me.role === "Admin" || me.role === "Manager") && (
                          <p className="text-green-600 text-sm sm:text-base font-bold whitespace-nowrap">
                            ₱ {Intl.NumberFormat("en-US").format(bill.price)}
                          </p>
                        )}
                      </div>
                    </header>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold">Performed by:</h3>
                      <div className="flex items-center gap-3">
                        <figure className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={bill.appointment.dentist.staff.user.avatar}
                            alt="Dentist Avatar"
                          />
                        </figure>
                        <p className="font-semibold">
                          Dr. {bill.appointment.dentist.staff.user.name.firstName}{" "}
                          {bill.appointment.dentist.staff.user.name.lastName}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <div>
              <h3 className="text-zinc-400">No services done yet</h3>
            </div>
          )
        ) : (
          billsLoading && (
            <div>
              <AiOutlineLoading3Quarters className="text-primary w-8 h-8 mx-auto animate-spin" />
            </div>
          )
        )}
      </div>
    </div>
  );
};
