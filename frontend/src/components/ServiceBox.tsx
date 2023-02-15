import React from "react";
import { IconType } from "react-icons/lib";

type Props = {
  title: string;
  Icon: IconType;
};

const CategoryBox = ({ title, Icon }: Props) => {
  return (
    <div className="flex flex-col border border-zinc-200 items-center gap-2 shadow-md p-6 rounded-md">
      <Icon className="h-24 w-24 text-primary"/>
      <span className="font-semibold text-lg text-center">{title}</span>
      <span className="text-sm">Learn more</span>
    </div>
  );
};

export default CategoryBox;
