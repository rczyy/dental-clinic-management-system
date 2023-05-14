import { UseFormRegister } from "react-hook-form";

type Props = {
  dentist: DentistNamesResponse;
  schedule: string;
  register: UseFormRegister<AppointmentZodFormValues>;
  selectedId: string;
  setSelectedDentistId: React.Dispatch<React.SetStateAction<string>>;
};
const DentistComponent = ({
  dentist,
  schedule,
  register,
  selectedId,
  setSelectedDentistId,
}: Props) => {
  
  const selectDentistId: React.MouseEventHandler<HTMLLabelElement> = () =>
    setSelectedDentistId(dentist._id);

  return (
    <label
      className={`flex items-center gap-4 outline outline-none border border-neutral rounded-md p-2 shadow cursor-pointer ${
        selectedId === dentist._id &&
        "outline-primary outline-2 border-transparent"
      }`}
      htmlFor={dentist._id}
      onClick={selectDentistId}
    >
      <img
        src="https://www.yourfreecareertest.com/wp-content/uploads/2018/01/how_to_become_a_doctor.jpg"
        alt="Doctor"
        className="rounded-full h-16 w-16 object-cover"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {dentist.name.firstName} {dentist.name.lastName}
        </span>
        <span className="text-sm">{schedule}</span>
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
