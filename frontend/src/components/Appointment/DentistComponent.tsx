import { UseFormRegister } from "react-hook-form";

type Props = {
  dentist: DentistNamesResponse;
  register: UseFormRegister<AppointmentZodFormValues>;
  selectedId: string;
  setSelectedDentist: React.Dispatch<React.SetStateAction<string>>;
};
const DentistComponent = ({
  dentist,
  register,
  selectedId,
  setSelectedDentist,
}: Props) => {
  const selectDentist: React.MouseEventHandler<HTMLLabelElement> = () => {
    setSelectedDentist(dentist._id);
  };

  return (
    <label
      className={`flex items-center gap-2 outline outline-none border border-neutral rounded-md p-2 shadow cursor-pointer ${
        selectedId === dentist._id &&
        "outline-primary outline-2 border-transparent"
      }`}
      htmlFor={dentist._id}
      onClick={selectDentist}
    >
      <img
        src={dentist.avatar}
        alt="Doctor"
        className="rounded-full h-16 w-16 p-2 object-cover"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {dentist.name.firstName} {dentist.name.lastName}
        </span>
      </div>
      <input
        {...register("dentist", { required: true })}
        type="radio"
        name="dentist"
        id={dentist._id}
        value={dentist._id}
        className="hidden"
      />
    </label>
  );
};
export default DentistComponent;
