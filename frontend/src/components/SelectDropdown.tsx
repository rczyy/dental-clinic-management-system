import { Noop, RefCallBack } from "react-hook-form/dist/types";
import Select, { ActionMeta, SingleValue } from "react-select";

type Props = {
  field?: { onBlur: Noop; name: "role"; ref: RefCallBack };
  value?: string;
  placeholder: string;
  options?: SelectOption[];
  isClearable?: boolean;
  onChange:
    | ((
        newValue: SingleValue<SelectOption>,
        actionMeta: ActionMeta<SelectOption>
      ) => void)
    | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
};

const SelectDropdown = ({
  field,
  value,
  placeholder,
  options,
  isClearable,
  onChange,
  isLoading,
  isDisabled,
}: Props) => {
  return (
    <Select
      {...field}
      value={
        value
          ? options &&
            options.find((item: SelectOption) => item.value === value)
          : null
      }
      classNames={{
        control: ({ hasValue }) =>
          "pl-1.5 py-2 !bg-base-300 " + (hasValue && "!border-primary"),
        placeholder: () => "!text-zinc-400 !text-sm sm:!text-base ",
        singleValue: () => "!text-base-content",
        input: () => "!text-base-content",
        option: ({ isSelected, isFocused }) =>
          isSelected || isFocused ? "!bg-primary !text-zinc-100" : "",
        menu: () => "!bg-base-300",
        dropdownIndicator: ({ hasValue }) => (hasValue ? "!text-primary" : ""),
        indicatorSeparator: ({ hasValue }) => (hasValue ? "!bg-primary" : ""),
      }}
      placeholder={placeholder}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      isClearable={isClearable}
      isDisabled={isDisabled}
    />
  );
};
export default SelectDropdown;
