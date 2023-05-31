import { UseFormRegister } from "react-hook-form";

type Props = {
  patient: PatientNamesResponse;
  register: UseFormRegister<AppointmentZodFormValues>;
  selectedId: string;
  setSelectedPatient: React.Dispatch<React.SetStateAction<string>>;
};
export const PatientComponent = ({
  patient,
  register,
  selectedId,
  setSelectedPatient,
}: Props) => {
  const selectPatient: React.MouseEventHandler<HTMLLabelElement> = () => {
    setSelectedPatient(patient._id);
  };

  return (
    <label
      className={`flex items-center gap-2 outline outline-none border border-neutral rounded-md p-2 shadow cursor-pointer ${
        selectedId === patient._id &&
        "outline-primary outline-2 border-transparent"
      }`}
      htmlFor={patient._id}
      onClick={selectPatient}
    >
      <img
        src={patient.avatar}
        alt="Patient"
        className="rounded-full h-16 w-16 p-2 object-cover"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {patient.name.firstName} {patient.name.lastName}
        </span>
      </div>
      <input
        {...register("patient", { required: true })}
        type="radio"
        name="patient"
        id={patient._id}
        value={patient._id}
        className="hidden"
      />
    </label>
  );
};
