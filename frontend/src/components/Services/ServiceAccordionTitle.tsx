import { FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons/lib";

interface Props {
  title: string;
  Icon: IconType;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ServiceAccordionTitle = ({
  title,
  Icon,
  isOpen,
  setIsOpen,
}: Props): JSX.Element => {
  return (
    <div
      className="flex items-center gap-4 bg-primary px-6 py-4 cursor-pointer transition hover:bg-primary/80"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div>
        <Icon className="w-8 h-8 text-zinc-100" />
      </div>
      <h3 className="text-zinc-100 font-semibold">{title}</h3>
      <div className="ml-auto">
        <FiChevronDown
          className={`w-6 h-6 p-0.5 text-zinc-100 transition-transform ${
            isOpen ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
    </div>
  );
};
