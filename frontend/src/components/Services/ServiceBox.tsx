import { IconType } from "react-icons/lib";

type Props = {
  title: string;
  Icon: IconType;
};

const CategoryBox = ({ title, Icon }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-[238px] p-6 border border-neutral rounded-md shadow">
      <Icon className="h-24 w-24 text-primary" />
      <span className="font-semibold text-lg text-center">{title}</span>
    </div>
  );
};

export default CategoryBox;
