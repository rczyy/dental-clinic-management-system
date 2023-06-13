import { Conditions } from "./Conditions";
import { Prescriptions } from "./Prescriptions";
import { ServicesDone } from "./ServicesDone";

interface Props {
  bills: BillResponse[] | undefined;
  billsLoading: boolean;
  isViewBillModalVisible: boolean;
  setIsViewBillModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBill: React.Dispatch<React.SetStateAction<BillResponse | undefined>>;
}

export const PatientSummary = ({
  bills,
  billsLoading,
  isViewBillModalVisible,
  setIsViewBillModalVisible,
  setSelectedBill,
}: Props): JSX.Element => {
  return (
    <section className="flex flex-col gap-6 my-8">
      <header>
        <h3 className="text-xl font-bold">Patient Summary</h3>
      </header>

      <Conditions />

      <Prescriptions />

      <ServicesDone
        bills={bills}
        billsLoading={billsLoading}
        isViewBillModalVisible={isViewBillModalVisible}
        setIsViewBillModalVisible={setIsViewBillModalVisible}
        setSelectedBill={setSelectedBill}
      />
    </section>
  );
};
